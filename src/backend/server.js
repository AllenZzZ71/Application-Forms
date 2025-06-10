// backend/server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadPath = path.join(__dirname, 'uploads');
  try {
    await fsp.mkdir(uploadPath);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

app.post('/api/save-form', async (req, res) => {
  const data = req.body;

  try {
    await ensureUploadsDir();

    const timestamp = Date.now();
    const pdfPath = path.join(__dirname, `uploads/form-${timestamp}.pdf`);
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(pdfPath);
    doc.pipe(writeStream);

    const addSection = (title) => {
      doc.moveDown().fontSize(14).text(title, { underline: true });
      doc.moveDown(0.5);
    };

    const addField = (label, value) => {
      doc.fontSize(11).text(`${label}: `, { continued: true }).font('Helvetica-Bold').text(value || 'N/A');
      doc.font('Helvetica');
    };

    doc.fontSize(18).text('Employee Application - E Neighbor', { align: 'center' });
    doc.moveDown();

    addSection('Personal Information');
    addField('Name', `${data.firstName} ${data.lastName}`);
    addField('Date of Birth', data.dob);
    addField('SSN', data.ssn);
    addField('Phone', data.phone);
    addField('Email', data.email);
    addField('Address', `${data.address} ${data.address2 || ''}, ${data.city}, ${data.state} ${data.zip}`);
    addField('Date Available', data.dateAvailable);
    addField('Employment Type', data.employmentType);
    addField('Position', data.position);

    addSection('Employment Eligibility');
    addField('U.S. Citizen', data.usCitizen);
    addField('Authorized to Work', data.workAuth);
    addField('Worked Here Before', data.workedHere);
    addField('When', data.whenWorked);
    addField('Felony Conviction', data.felony);
    addField('Explanation', data.felonyExplain);

    addSection('Education');
    addField('School', data.collegeName);
    addField('Address', data.collegeAddress);
    addField('From - To', `${data.collegeFrom} to ${data.collegeTo}`);
    addField('Graduated', data.collegeGraduate);
    addField('Degree', data.collegeDegree);

    addSection('References');
    [1, 2].forEach(i => {
      addField('Name', data[`ref${i}Name`]);
      addField('Relation', data[`ref${i}Relation`]);
      addField('Address', data[`ref${i}Address`]);
      addField('Phone', data[`ref${i}Phone`]);
      doc.moveDown();
    });

    addSection('Previous Employment');
    addField('Employer', data.prevEmployer);
    addField('Phone', data.prevPhone);
    addField('Address', data.prevAddress);
    addField('Job Title', data.prevJobTitle);
    addField('From - To', `${data.prevFrom} to ${data.prevTo}`);
    addField('Responsibilities', data.prevResponsibilities);
    addField('Reason for Leaving', data.prevReason);
    addField('May Contact', data.prevContact);

    addSection('Emergency Contact');
    addField('Name', data.emergencyName);
    addField('Relation', data.emergencyRelationship);
    addField('Phone', data.emergencyPhone);

    addSection('Applicant Signature');
    addField('Date', data.sigDate);

    // Signature Image
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });
      doc.image(sigPath, { width: 200 });
    }

    doc.end();

    writeStream.on('finish', () => {
      res.status(200).json({ message: 'PDF created', file: `/uploads/form-${timestamp}.pdf` });
    });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to create PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
