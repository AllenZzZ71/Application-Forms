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

        // === References ===
    addSection('References');
    [1, 2].forEach(i => {
      addField(`Name ${i}`, data[`ref${i}Name`]);
      addField(`Relation ${i}`, data[`ref${i}Relation`]);
      addField(`Address ${i}`, data[`ref${i}Address`]);
      addField(`Phone ${i}`, data[`ref${i}Phone`]);
      doc.moveDown();
    });

    // === Previous Employment 1 ===
    addSection('Previous Employment 1');
    addField('Employer', data.prevEmployer1);
    addField('Phone', data.prevPhone1);
    addField('Address', data.prevAddress1);
    addField('Job Title', data.prevJobTitle1);
    addField('From - To', `${data.prevFrom1} to ${data.prevTo1}`);
    addField('Responsibilities', data.prevResponsibilities1);
    addField('Reason for Leaving', data.prevReason1);
    addField('May We Contact', data.prevContact1);

    // === Previous Employment 2 ===
    addSection('Previous Employment 2');
    addField('Employer', data.prevEmployer2);
    addField('Phone', data.prevPhone2);
    addField('Address', data.prevAddress2);
    addField('Job Title', data.prevJobTitle2);
    addField('From - To', `${data.prevFrom2} to ${data.prevTo2}`);
    addField('Responsibilities', data.prevResponsibilities2);
    addField('Reason for Leaving', data.prevReason2);
    addField('May We Contact', data.prevContact2);

    // === Emergency Contact ===
    addSection('Emergency Contact');
    addField('Name', data.emergencyName);
    addField('Relation', data.emergencyRelationship);
    addField('Phone', data.emergencyPhone);
    addField('Address', data.emergencyAddress);


    // === Background Check ===
    doc.addPage(); // Starts a new page
    addSection('Background Check Notice and Authorization');
    doc
    .fontSize(12)
    .font('Helvetica-Bold')
    .text('Notice', { underline: true })
    .moveDown(0.3)
    .font('Helvetica')
    .fontSize(10)
    .text('The E Neighbor Homecare LLC provides notice that background checks will be performed for employment with the E Neighbor Homecare LLC. The background checks include but are not limited to:')
    .moveDown(0.5)
    .list([
        'Criminal Background checks',
        'Sex Offenders',
        'Office of Inspector General (OIG)',
        'System for Award Management (SAM)'
    ])
    .moveDown(1);

    doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Authorization', { underline: true })
    .moveDown(0.3)
    .font('Helvetica')
    .text('I hereby authorize E Neighbor Homecare LLC to conduct the background checks described above. In connection with this, I also authorize the use of law enforcement agencies and/or private criminal background check organizations to assist E Neighbor Homecare LLC in collecting this information.')
    .moveDown()
    .text('I also am aware that records of arrests on pending charges and/or convictions are not an absolute bar to employment. Such information will be used to determine whether the results of the background check reasonably bear on my trustworthiness or my ability to perform the duties of my position in a manner that is safe for E Neighbor Homecare LLC.')
    .moveDown(1);

    doc
    .font('Helvetica-Bold')
    .fontSize(10)
    .text('Attestation', { underline: true })
    .moveDown(0.3)
    .font('Helvetica')
    .text('To the best of my knowledge, the information provided in this Notice and Authorization and any attachments is true and complete. I understand that any falsification or omission of information may disqualify me for this position and/or may serve as grounds for the severance of my employment with E Neighbor Homecare LLC. By signing below, I hereby provide my authorization to E Neighbor Homecare LLC to conduct a criminal background check, and I acknowledge that I have been informed of a summary of my rights under the Fair Credit Reporting Act.')
    .moveDown()
    .text('In addition to those rights, I understand that I have a right to appeal an adverse employment decision made based on my background check information within three business days of receipt of such notice and that a determination on my appeal will be made in seven working days from E Neighbor Homecare LLC receipt of such appeal.')
    .moveDown(2);

    // Signature Area
    doc
    .moveDown(3)
    .text('_______________________________             ______________', { continued: false })
    .text('Signature of Applicant                                          Date')
    .moveDown(4)
    .text('_______________________________             ______________', { continued: false })
    .text('E Neighbor Homecare LLC Representative         Date')
    .moveDown(1);

    // Insert applicant signature image if present
    if (data.signature?.startsWith('data:image')) {
    const base64 = data.signature.split(';base64,').pop();
    const sigPath = path.join(__dirname, `uploads/signature-${timestamp}.png`);
    fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

    // Draw signature above applicant line
    doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        valign: 'center',
        x: doc.x,
        y: doc.y - 150 // Adjust Y to appear above the line
    });
    }



    // === Signature (Main Disclaimer Signature) ===
    addSection('Applicant Signature');
    addField('Date', data.sigDateDisclaimer);

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
