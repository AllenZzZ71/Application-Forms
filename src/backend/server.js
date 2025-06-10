// backend/server.js
import express from 'express';
import cors from 'cors';
import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Serve static PDF files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Ensure uploads directory exists
const ensureUploadsDir = async () => {
  const uploadPath = path.join(__dirname, 'uploads');
  try {
    await fs.mkdir(uploadPath);
  } catch (err) {
    if (err.code !== 'EEXIST') throw err;
  }
};

// POST route to receive form data and generate PDF
app.post('/api/save-form', async (req, res) => {
  const data = req.body;

  try {
    await ensureUploadsDir();

    const html = `
  <html>
    <head>
      <style>
        body {
          font-family: 'Arial', sans-serif;
          font-size: 14px;
          line-height: 1.6;
          padding: 40px;
          background-color: #f9fafb;
          color: #374151;
        }
        h1 {
          font-size: 24px;
          color: #1f2937;
          margin-bottom: 24px;
        }
        h2 {
          font-size: 18px;
          color: #4b5563;
          border-bottom: 1px solid #e5e7eb;
          padding-bottom: 4px;
          margin-top: 32px;
          margin-bottom: 12px;
        }
        .section {
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 24px;
        }
        .field {
          margin-bottom: 8px;
        }
        .label {
          font-weight: 600;
          color: #111827;
          display: inline-block;
          min-width: 180px;
        }
        .signature {
          margin-top: 32px;
        }
      </style>
    </head>
    <body>
      <h1>Employee Application - E Neighbor</h1>

      <div class="section">
        <h2>Personal Information</h2>
        <div class="field"><span class="label">Full Name:</span> ${data.firstName} ${data.lastName}</div>
        <div class="field"><span class="label">Date of Birth:</span> ${data.dob}</div>
        <div class="field"><span class="label">SSN:</span> ${data.ssn}</div>
        <div class="field"><span class="label">Phone:</span> ${data.phone}</div>
        <div class="field"><span class="label">Email:</span> ${data.email}</div>
        <div class="field"><span class="label">Address:</span> ${data.address} ${data.address2 || ''}, ${data.city}, ${data.state} ${data.zip}</div>
        <div class="field"><span class="label">Date Available:</span> ${data.dateAvailable}</div>
        <div class="field"><span class="label">Employment Type:</span> ${data.employmentType}</div>
        <div class="field"><span class="label">Position:</span> ${data.position}</div>
      </div>

      <div class="section">
        <h2>Employment Eligibility</h2>
        <div class="field"><span class="label">U.S. Citizen:</span> ${data.usCitizen}</div>
        <div class="field"><span class="label">Authorized to Work:</span> ${data.workAuth}</div>
        <div class="field"><span class="label">Worked Here Before:</span> ${data.workedHere}</div>
        <div class="field"><span class="label">When:</span> ${data.whenWorked}</div>
        <div class="field"><span class="label">Felony Conviction:</span> ${data.felony}</div>
        <div class="field"><span class="label">Explanation:</span> ${data.felonyExplain}</div>
      </div>

      <div class="section">
        <h2>Education</h2>
        <div class="field"><span class="label">School:</span> ${data.collegeName}</div>
        <div class="field"><span class="label">Address:</span> ${data.collegeAddress}</div>
        <div class="field"><span class="label">From - To:</span> ${data.collegeFrom} to ${data.collegeTo}</div>
        <div class="field"><span class="label">Graduated:</span> ${data.collegeGraduate}</div>
        <div class="field"><span class="label">Degree:</span> ${data.collegeDegree}</div>
      </div>

      <div class="section">
        <h2>References</h2>
        ${[1, 2].map(i => `
          <div class="field"><span class="label">Name:</span> ${data[`ref${i}Name`] || ''}</div>
          <div class="field"><span class="label">Relation:</span> ${data[`ref${i}Relation`] || ''}</div>
          <div class="field"><span class="label">Address:</span> ${data[`ref${i}Address`] || ''}</div>
          <div class="field"><span class="label">Phone:</span> ${data[`ref${i}Phone`] || ''}</div>
          <br/>
        `).join('')}
      </div>

      <div class="section">
        <h2>Previous Employment</h2>
        <div class="field"><span class="label">Employer:</span> ${data.prevEmployer}</div>
        <div class="field"><span class="label">Phone:</span> ${data.prevPhone}</div>
        <div class="field"><span class="label">Address:</span> ${data.prevAddress}</div>
        <div class="field"><span class="label">Job Title:</span> ${data.prevJobTitle}</div>
        <div class="field"><span class="label">From - To:</span> ${data.prevFrom} to ${data.prevTo}</div>
        <div class="field"><span class="label">Responsibilities:</span> ${data.prevResponsibilities}</div>
        <div class="field"><span class="label">Reason for Leaving:</span> ${data.prevReason}</div>
        <div class="field"><span class="label">May Contact:</span> ${data.prevContact}</div>
      </div>

      <div class="section">
        <h2>Emergency Contact</h2>
        <div class="field"><span class="label">Name:</span> ${data.emergencyName}</div>
        <div class="field"><span class="label">Relation:</span> ${data.emergencyRelationship}</div>
        <div class="field"><span class="label">Phone:</span> ${data.emergencyPhone}</div>
      </div>

      <div class="section signature">
        <h2>Applicant Signature</h2>
        <div class="field"><span class="label">Date:</span> ${data.sigDate}</div>
        <img src="${data.signature}" style="width: 250px; border: 1px solid #000; margin-top: 12px;" />
        <div>(Digital Signature)</div>
      </div>
    </body>
  </html>
`;


    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    const timestamp = Date.now();
    const outputPath = path.join(__dirname, `uploads/form-${timestamp}.pdf`);
    await page.pdf({ path: outputPath, format: 'A4' });
    await browser.close();

    res.status(200).json({ message: 'PDF created', file: `/uploads/form-${timestamp}.pdf` });
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to create PDF' });
  }
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});