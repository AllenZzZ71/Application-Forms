// backend/server.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import fsp from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import PDFDocument from 'pdfkit';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail', // or another provider (e.g., 'hotmail', or use SMTP config)
  auth: {
    user: 'eneighbormailing@gmail.com',
    pass: 'drgw piop kcpo flbb' // Use App Password if 2FA is enabled
  }
});

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
    const sigY1 = doc.y;

    doc
    .moveDown(3)
    .text('_______________________________             ______________', { continued: false })
    .text('Signature of Applicant                                          Date')
    .moveDown(4)
    .text('_______________________________             ______________', { continued: false })
    .text('E Neighbor Homecare LLC Representative         Date')
    .moveDown(1);

    doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(data.backgroundCheckDate || 'N/A', doc.page.width - 325, sigY1 + 30); // overlay the date on the line


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
        x: doc.x - 225,
        y: doc.y - 50 // Adjust Y to appear above the line
    });
    }

    // === Confidentiality and Non-Disclosure Agreement ===
    doc.addPage();

    doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Confidentiality and Non-Disclosure Agreement', { align: 'center', underline: true })
    .moveDown(1);

    // Agreement Intro
    doc
    .fontSize(9)
    .font('Helvetica')
    .text(
        `This HIPAA (employee) non-disclosure agreement (the “Agreement”) is made between E Neighbor Homecare LLC and ${data.firstName} ${data.lastName} (employee). The Agreement is intended to prevent the unauthorized disclosure of Confidential Information (as defined below) by Employee. The parties agree as follows:`)
    .font('Helvetica-Bold').text('1.Personal Health Information').moveDown(0.3)
    .font('Helvetica')
    .text('During the course of employment, employees may have access to personal health information ("PHI") relating to clients or patients of E Neighbor Homecare LLC. PHI may consist of medical records, billing, financial records, or any individually identifiable health information. PHI is protected by the Health Insurance Portability and Accountability Act ("HIPAA"). HIPAA permits access to PHI on a "need to know" basis. Therefore, unless authorization has been granted, any intentional accessing of PHI, or circumvention of PHI security protocols, is prohibited.')
    .font('Helvetica-Bold').text('I agree to abide by the following HIPAA privacy & security rules:').moveDown(0.3)
    .moveDown(1);

    // Bullet List
    doc
    .font('Helvetica')
    .list([
    'Following the “minimum necessary disclosure standard” protocol when using or disclosing routine protected health information.',
    'Accessing only patient information for which you have been given authorization, including computer and hard copy files.',
    'Only logging on using the assigned user ID and only logging on to one computer at a time.  If assigned a laptop or other electronic device that contains confidential information, keep the equipment secure at all times.',
    'Practicing confidentiality and heightened sensitivity to the use of identifiable health information used in daily business practice.',
    'Not engaging in the disclosure of patient information except for treatment, payment, and/or operation purposes.',
    'Responding to patient requests for their personal records using the practice’s protocol.',
    'Referring violations of the HIPAA Rules by Business Associates directly to the practice’s designated Privacy Officer.',
    'Reporting any inadvertent access to PHI that should not have been accessed.',
    'Attending initial HIPAA training and any additional training offered by the practice for any revisions to the federal/state HIPAA regulations and/or significant changes made by the practice to the Privacy & Security Policy.',
    'Not downloading or installing games, data or software without prior approval from the Administrator/CEO.',
    'Creating a unique password that is difficult to guess and changing it regularly as requested.',
    'Shredding all confidential data prior to discarding (including phone messages from patients, etc.).',
    'Following the E Neighbor Homecare LLC Privacy and Confidentially Policies and Procedures.'

    ]).moveDown(1);

    // 2. Confidential Information
    doc.font('Helvetica-Bold').text('2. Confidential Information').moveDown(0.3);
    doc.font('Helvetica').text(
    'Confidential Information" consists of PHI as well as proprietary information relating to E Neighbor Homecare LLC business, including but not limited to: medical and financial records, revenues, identification and account numbers and names, PINs, and passwords, or other information conveyed in writing or in a discussion that is indicated to be confidential.'    ).moveDown(1);

    // 3. Non-Disclosure
    doc.font('Helvetica-Bold').text('3. Non-Disclosure').moveDown(0.3);
    doc.font('Helvetica').text(
    'Without E Neighbor Homecare LLC prior written consent, the employee will not: (a) disclose Confidential Information to any third party, whether electronically, orally, or in writing; (b) make or permit to be made copies or other reproductions of Confidential Information; (c) make any use of Confidential Information; or (d) use or disclose Confidential Information in violation of applicable law, including but not limited to HIPAA.'    ).moveDown(1);

    // 4. Return of Confidential Materials
    doc.font('Helvetica-Bold').text('4. Return of Confidential Materials').moveDown(0.3);
    doc.font('Helvetica').text(
    "Upon E Neighbor Homecare LLC's request, employee shall immediately return all original materials provided by E Neighbor Homecare LLC and any copies, notes, or other documents in employee's possession pertaining to Confidential Information."    ).moveDown(1);

    // 5. Term
    doc.font('Helvetica-Bold').text('5. Term').moveDown(0.3);
    doc.font('Helvetica').text(
    "The non-disclosure terms of this Agreement shall survive any termination, cancellation, expiration or other conclusions of employment (or this Agreement) unless the parties otherwise expressly agree in writing or E Neighbor Homecare LLC sends employee written notice releasing it from this Agreement."    ).moveDown(1);

    // 6. Notice of Immunity
    doc.font('Helvetica-Bold').text('6. Notice of Immunity From Liability').moveDown(0.3);
    doc.font('Helvetica').text(
    "An individual shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that is made (i) in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney; and (ii) solely for the purpose of reporting or investigating a suspected violation of law; or is made in a complaint or other document filed in a lawsuit or other proceeding, if such filing is made under seal. An individual who files a lawsuit for retaliation by an employer for reporting a suspected violation of law may disclose the trade secret to the attorney of the individual and use the trade secret information in the court proceeding if the individual (i) files any document containing the trade secret under seal; and (ii) does not disclose the trade secret, except pursuant to a court order."    ).moveDown(1);

    // 7. General Provisions
    doc.font('Helvetica-Bold').text('7. General Provisions').moveDown(0.3);
    doc.list([
    'Relationships. Nothing contained in this Agreement shall be deemed to constitute either party a partner, joint venturer, or employee of the other party for any purpose.',
    'Severability. If a court finds any provision of this Agreement invalid or unenforceable, the remainder of this Agreement shall be interpreted so as to best effect the intent of the parties.',
    'Integration. This Agreement expresses the complete understanding of the parties with respect to the subject matter and supersedes all prior proposals, agreements, representations, and understandings. This Agreement may not be amended except in writing and signed by both parties.',
    'Waiver. The failure to exercise any right provided in this Agreement shall not be a waiver of prior or subsequent rights.',
    'Injunctive Relief. Any misappropriation of Confidential Information in violation of this Agreement may cause E Neighbor Homecare LLC irreparable harm, the amount of which may be difficult to ascertain, and therefore employee agrees that E Neighbor Homecare LLC shall have the right to apply to a court of competent jurisdiction for an order enjoining any such further misappropriation and for such other relief as E Neighbor Homecare LLC deems appropriate. This right of E Neighbor Homecare LLC is to be in addition to the remedies otherwise available to E Neighbor Homecare LLC.',
    'Attorney Fees and Expenses. In a dispute arising out of or related to this Agreement, the prevailing party shall have the right to collect from the other party its reasonable attorney fees and costs and necessary expenditures.',
    'Governing Law. This Agreement shall be governed in accordance with the laws of the State in which the E Neighbor Homecare LLC business is located.',
    'Jurisdiction. The parties consent to the exclusive jurisdiction and venue of the federal and state courts in any action arising out of or relating to this Agreement. The parties waive any other venue to which either party might be entitled by domicile or otherwise.'
    ]).moveDown(2);

   // Signature Area

    const sigY2 = doc.y;

    doc
    .moveDown(3)
    .text('_______________________________             ______________', { continued: false })
    .text('Signature of Applicant                                          Date')
    .moveDown(4)
    .text('_______________________________             ______________', { continued: false })
    .text('E Neighbor Homecare LLC Representative         Date')
    .moveDown(1);

    doc
    .fontSize(10)
    .font('Helvetica-Bold')
    .text(data.confidentialityDate || 'N/A', doc.page.width - 345, sigY2 + 24); // overlay date at right end

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
        x: doc.x - 210,
        y: doc.y - 50 // Adjust Y to appear above the line
    });
    }

    // === Signature (Main Disclaimer Signature) ===
    doc.addPage();
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

    /*=======test=============*/

    writeStream.on('finish', () => {
      res.status(200).json({ message: 'PDF created', file:`/uploads/form-${timestamp}.pdf` });
    });

    /*======= Email ======== */

    /*writeStream.on('finish', async () => {
    const filePath = path.join(__dirname, `uploads/form-${timestamp}.pdf`);
    try {
        await transporter.sendMail({
        from: '"E Neighbor Homecare" <eneighbormailing@gmail.com>',
        to: 'annasun955@gmail.com',
        subject: 'New Employee Application Submitted',
        text: `A new application has been submitted by ${data.firstName} ${data.lastName}. PDF is attached.`,
        attachments: [
            {
            filename: `form-${timestamp}.pdf`,
            path: filePath
            }
        ]
        });

        console.log(`✅ Email sent with attachment for ${data.firstName} ${data.lastName}`);
        res.status(200).json({ message: 'PDF created and emailed', file: `/uploads/form-${timestamp}.pdf` });
    } catch (err) {
        console.error('❌ Failed to send email:', err);
        res.status(500).json({ message: 'PDF created, but email failed' });
    };
    }) */
  } catch (error) {
    console.error('Error generating PDF:', error);
    res.status(500).json({ message: 'Failed to create PDF' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
