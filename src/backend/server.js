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

app.get('/api/ping', (req, res) => {
  console.log(`[PING] Backend accessed at ${new Date().toISOString()}`);
  res.status(200).json({ message: 'pong' });
});

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
    .font('Helvetica-Oblique')
    .text('_______________________________             ______________', { continued: false })
    .text(`Signature of Applicant                                          Date`)
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
    .font('Helvetica-Oblique')
    .text('_______________________________             ______________', { continued: false })
    .text(`Signature of Applicant                                          Date`)
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

    // === Policies and Procedures Acknowledgment Page ===
    doc.addPage();

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('ADHERENCE TO POLICIES AND PROCEDURES, FEDERAL, STATE, AND ACCREDITATION REGULATIONS, STANDARDS, LAWS, AND GUIDELINES', {
        align: 'left',
      })
      .moveDown(1);

    doc
      .fontSize(12)
      .font('Helvetica-Bold')
      .text('AND STAFF TRAINING', { underline: false })
      .moveDown(0.8);

    doc
      .font('Helvetica')
      .fontSize(11)
      .text(
        'I understand that copies of the policy and procedures manuals are available, and I understand that it is my responsibility to read the policies. I also agree to comply with E Neighbor Homecare LLC policies and procedures, federal/state laws and regulations, accrediting agencies, and national practice standards. If I have any questions or need any clarification, I will ask the Administrator/CEO.',
        { align: 'justify', indent: 20 }
      )
      .moveDown(0.5)
      .text(
        'I understand I will be responsible for maintaining skills and knowledge to comply with E Neighbor Homecare LLC, the scope of services, and any provider\'s requirements.',
        { align: 'justify', indent: 20 }
      )
      .moveDown(0.5)
      .text(
        'I understand that nothing contained in any policy or procedure manual constitutes a contractual relationship between E Neighbor Homecare LLC and its employees, contractors, or volunteers.',
        { align: 'justify', indent: 20 }
      )
      .moveDown(0.5)
      .text(
        'I understand that I am required to attend and participate in services as scheduled and annual training by E Neighbor Homecare LLC to be in compliance with new or revised policies and procedures.',
        { align: 'justify', indent: 20 }
      )
      .moveDown(2);

    // Signature block
     doc
    .moveDown(3)
    .font('Helvetica-Oblique')
    .text('_______________________________             ______________', { continued: false })
    .text(`Signature of Applicant                                         Date`)
    .moveDown(1)

    doc
    .font('Helvetica-Bold')
    .text(data.policyTrainingDate || 'N/A', doc.page.width - 308, sigY1 - 80); // overlay the date on the line


    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 64,
        y: doc.y - 56,
      });
  }


    // === Conflict of Interest Disclosure Page ===
    doc.addPage();

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Conflict of Interest Disclosure', { align: 'center', underline: true })
      .moveDown(1);

    // Introductory statements
    doc
      .fontSize(11)
      .font('Helvetica')
      .text('I have been provided a copy/information and understand E Neighbor Homecare LLC. Disclosure/Conflict of Interest policy.')
      .moveDown(0.5)
      .text('The following questions are designed for you to determine the nature and extent of any outside interest that might possibly involve a conflict of interest with the affairs of the organization. Please read each question carefully and then answer briefly and concisely. If you have any doubts, answer to the best of your ability and explain.')
      .moveDown(1);

    // Glossary
    doc
      .font('Helvetica-Bold')
      .text('Glossary:')
      .moveDown(0.5)
      .fontSize(10)
      .font('Helvetica')
      .list([
        'Competitor: A person offering for sale or selling products and/or services in competition with this organization.',
        'Family: Spouse, parents, children, brothers, sisters, in-laws, and those in your household.',
        'Purchaser: Any person who buys, rents, or otherwise procures, has bought, rented, procured, or received goods or services from this organization.',
        'Person: An individual, firm, partnership, trust, corporation, or other business entity.',
        'Vendor: Any person who sells, rents, agrees to furnish, or has furnished goods or services to or on behalf of the organization.'
      ])
      .moveDown(1);

    // Conflict questions
    const questions = [
      "Do you or any member of your family directly or indirectly own, or during the past 24 months have owned, any interest in or shared profits with a vendor, purchaser, or competitor?",
      "During the 24 months preceding today, have you or a family member received compensation, entertainment, gifts, credits, loans, or anything of value from a vendor, purchaser, or competitor?",
      "Employment Status: Are you or any family member currently or within the past 24 months employed as officer, director, employee, or consultant of a vendor, purchaser, or competitor?",
      "Related Staff Members: Are you or a family member currently or within the past 24 months employed or retained in any role by a vendor, purchaser, or competitor?"
    ];

    questions.forEach((q, idx) => {
      doc
        .font('Helvetica-Bold')
        .fontSize(11)
        .text(`${idx + 1}. ${q}`)
        .moveDown(0.5)
        .font('Helvetica')
        .text(`Answer: ${data[`conflictQ${idx + 1}`] || 'N/A'}`)
        .moveDown(0.3)
        .text(`Explanation: ${data[`conflictQ${idx + 1}Explain`] || 'N/A'}`)
        .moveDown(1.5);
    });

    // Final Certification Paragraph
    doc
      .addPage();

    doc
      .font('Helvetica-Oblique')
      .fontSize(10)
      .text(
        'Furthermore, I understand that I have a duty to report any relationship that may arise that could be perceived as a conflict of interest or may be considered a conflict of interest between myself and the E Neighbor Homecare LLC.',
        { align: 'justify', indent: 20 }
      )
      .moveDown(2);

  doc
    .fontSize(9)
    .text(`I acknowledge that it is my responsibility to bring any such potential conflicts of interest to the attention of the corporate Compliance Officer: ${data.agreeConflict1 ? 'YES' : 'NO'}`)
    .moveDown()
    .text(`I acknowledge and certify the above responses are true and accurate to the best of my knowledge: ${data.agreeConflict2 ? 'YES' : 'NO'}`)
    .moveDown(3);


 // Signature block
  doc
    .moveDown(2.5)
    .fontSize(10)
    .text('_______________________________             ______________', { continued: false })
    .text(`Signature of Applicant                                        Date`)
    .moveDown(2)

    // === Conflict of Interest: Administrator and Board Review ===
    doc.moveDown(1);
    doc
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('If yes, to be completed by the Administrator')
      .moveDown(3);

    doc
      .font('Helvetica')
      .text('Comments: __________________________________________________________________________')
      .moveDown(1.5)
      .text('____________________________________________________________________________________')
      .moveDown(4)

    doc
      .text('Administrator: _______________________________________________________')
      .moveDown(2)
      .text('Date: ______________________')
      .moveDown(5);

    doc
      .font('Helvetica-Bold')
      .text('Governing Board Recommendation:', { continued: false })
      .moveDown(1.5)
      .font('Helvetica')
      .text('____________________________________________________________________________________')
      .moveDown(3)
      .text('The Board recommends:')
      .moveDown(1.5)
      .text('____________________________________________________________________________________')
      .moveDown(4);

    doc
      .text('Board Member Signature: _________________________________     Date: ______________')
      .moveDown(1.5);

    
    doc
    .fontSize(8)
    .font('Helvetica-Bold')
    .fontSize(10)
    .text(data.conflictDate || 'N/A', doc.page.width - 330, sigY1 - 273); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 65,
        y: doc.y - 55,
      });
    };

    // === Code of Business Conduct and Ethics ===
    doc.addPage();

    doc
      .fontSize(15)
      .font('Helvetica-Bold')
      .text('Code of Business Conduct and Ethics', { align: 'center', underline: true })
      .moveDown(0.8);

    doc
      .font('Helvetica')
      .fontSize(9)
      .text(`The success of our business is dependent on the trust and confidence we earn from our employees, customers, and shareholders. We gain credibility by adhering to our commitments, displaying honesty and integrity, and reaching company goals solely through honorable conduct. It is easy to say what we must do, but the proof is in our actions. Ultimately, we will be judged on what we do.`)
      .moveDown()
      .text(`E Neighbor Homecare LLC's commitment to integrity begins with complying with laws, rules, and regulations where we do business. Further, each of us must have an understanding of the company policies, laws, rules, and regulations that apply to our specific roles. If we are unsure of whether a contemplated action is permitted by law or E Neighbor Homecare LLC policy, we should seek advice from the Administrator/CEO. We are responsible for preventing violations of law and for speaking up if we see possible violations.`)
      .moveDown()
      .text(`The use of good judgment based on high ethical principles will guide you with respect to lines of acceptable conduct. If a situation arises for which it is difficult to determine the proper course of action, the matter should be discussed immediately with your immediate supervisor.`)
      .moveDown()
      .text(`In consideration of the employment of the undersigned by E Neighbor Homecare LLC, the employee agrees: (1) that during the employee's employment with E Neighbor Homecare LLC, the employee shall not solicit patients of E Neighbor Homecare LLC or attempt to influence such patients to change providers, (2) that upon the termination of employee's employment with E Neighbor Homecare LLC, the employee shall not, for a period of three months after such termination, service any patients of E Neighbor Homecare LLC serviced by the employee during the last six months of the employee's employment by E Neighbor Homecare LLC, (3) to keep confidential all patient records, patient information, pharmacy trade secrets, pharmacy computer passwords, pharmacy phone access codes or any other passwords or pharmacy secrets, (4) to maintain professional boundaries to include clients, vendors and providers and (5) to serve faithfully and act in a way that will merit the continued trust and confidence of the public.`)
      .moveDown()
      .text(`As a user of information at E Neighbor Homecare LLC, you may develop, use, or maintain (1) patient information (for health care, quality improvement, peer review, education, billing, reimbursement, administration, research, or for other purposes), (2) personnel information (for employment, payroll, or other business purposes), or (3) confidential business information of E Neighbor Homecare LLC and/or third parties, including third-party software and other licensed products or processes. This information from any source and in any form, including, but not limited to, paper record, oral communication, audio recording, and electronic display, is strictly confidential. Access to confidential information is permitted only on a need-to-know basis and limited to the minimum amount of confidential information necessary to accomplish the intended purpose of the use, disclosure, or request.`)
      .moveDown()
      .text(`To avoid conflicts of interest, we must ensure that our decisions for E Neighbor Homecare LLC are objective and fair. Sometimes our personal or family interests might conflict with business decisions. We must always prioritize E Neighbor Homecare LLC's legitimate interests. Using company property or information for personal gain or seizing business opportunities for personal benefit is prohibited.`)
      .moveDown()
      .text(`I agree to follow the E Neighbor Homecare LLC Policies and Procedures Manual. I understand that these policies and procedures may change, and it is my responsibility to stay informed and comply with any updates.`)
      .moveDown()
      .text(`All employees must follow this business ethics policy. Violating it may result in disciplinary action, including termination. Unauthorized use or release of confidential information may lead to personal, civil, or criminal penalties. I agree to comply with the Confidentiality statements and the E Neighbor Homecare LLC Privacy and Information Security Policies, which I'll read. If I breach these terms, E Neighbor Homecare LLC can seek damages.`)
      .moveDown()
      .font('Helvetica-Bold')
      .text(`I agree to read E Neighbor Homecare LLC Compliance and Business Ethics policies. If I have questions, I will direct my questions to my supervisor.`)
      .moveDown()
      .text(`The signatures, printed name and dates below signify acceptance of the terms of E Neighbor Homecare LLC Compliance and Business Ethical policies and procedures.`)
      .moveDown(2);

    // Signature area
    doc
      .moveDown(2)
      .font('Helvetica-Oblique')
      .text('_______________________________             ______________', { continued: false })
      .text(`Signature of Applicant                                         Date`)
      .moveDown(1)

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(9)
      .text(data.ethicsDate || 'N/A', doc.page.width - 350, sigY1 + 188); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 64,
        y: doc.y - 54,
      });
    };

    // === Driver Compliance Acknowledgement ===
    doc.addPage();

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Driver Compliance Acknowledgement', { align: 'center', underline: true })
      .moveDown(1);

    doc
      .fontSize(11)
      .font('Helvetica')
      .text('I understand that operating a vehicle on E Neighbor Homecare LLC business means driving either a personal vehicle or owned/leased vehicle by E Neighbor Homecare LLC in the course of employment (i.e., any driving other than commuting to and from the agency office and my home in my personal vehicle) or situations in which any car allowance or mileage reimbursement is paid to me by E Neighbor Homecare LLC.')
      .moveDown(0.5)
      .text('I understand that I must possess a valid and current driver\'s license for my state. I also understand that I must submit proof of automobile insurance (a copy of the declaration page or the policy) to my supervisor upon employment if a Commercial Driver\'s License is required for my job duties. I understand that state law requires certain minimum auto insurance coverage for all vehicle employees, contractors, or volunteers who use their personal car to perform business on behalf of E Neighbor Homecare LLC.')
      .moveDown(0.5)
      .text('I affirm that I have auto insurance coverage as required by the state, and I agree to maintain coverage as required by state law. E Neighbor Homecare LLC the right to request proof of insurance at any time during the term of employment.')
      .moveDown(0.5)
      .text('I agree to notify my supervisor if I incur any violation that materially changes my driving record. I understand that disciplinary action (which may include termination) will be taken if my driving record is classified as high risk and/or unacceptable.')
      .moveDown(0.5)
      .text('I understand that my driving record is subject to review at any time by pharmacy management.')
      .moveDown(2);

    // Signature area
    doc
      .moveDown(3)
      .text('_______________________________             ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                         Date`)
      .moveDown(1)

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.conflictDate || 'N/A', doc.page.width - 307, sigY1 - 76); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 62,
        y: doc.y - 55,
      });
    }

    // === Drug-Free Workplace Policy ===
    doc.addPage();

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Drug-Free Workplace Policy', { align: 'center', underline: 'true' })
      .moveDown(1);

    doc
      .fontSize(11)
      .font('Helvetica')
      .text('E Neighbor Homecare LLC maintains a drug-free workplace concerning the use, possession, and distribution of drugs.')
      .moveDown(0.5)
      .text('All employees are prohibited from unlawful possession or use of a controlled substance or any alcoholic beverages while in the workplace. Employees are also prohibited from the unlawful manufacture, distribution, or dispensing of a controlled substance while in the workplace.')
      .moveDown(0.5)
      .text('Prior to hire, all employees will have a drug test conducted. If the drug test results are positive, then E Neighbor Homecare LLC will send the sample to an independent laboratory for testing. If the test result is positive, E Neighbor Homecare LLC will not employ an individual.')
      .moveDown(0.5)
      .text('Employees may be subject to reasonable suspicion urine testing for unlawful drugs when the organization or its client had cause to believe that the drug or alcohol policy has been violated.')
      .moveDown(0.5)
      .text('Any violation of this policy will result in disciplinary action, including termination of employment.')
      .moveDown(0.5)
      .text('I acknowledge that I understand that E Neighbor Homecare LLC is a Drug-Free Workplace and understand that E Neighbor Homecare LLC has no tolerance for the use or being under the influence of drugs or alcohol in the workplace.')
      .moveDown(2);

    // Signature Block
    doc
      .moveDown(3)
      .text('_______________________________             ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                         Date`)
      .moveDown(1)

    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.drugFreeDate || 'N/A', doc.page.width - 307, sigY1 - 119); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 65,
        y: doc.y - 55,
      });
    }

    // === Employee Agreement and Consent to Drug and/or Alcohol Testing ===
    doc.addPage();

    doc
      .fontSize(16)
      .font('Helvetica-Bold')
      .text('Employee Agreement and Consent to Drug and/or Alcohol Testing', { align: 'center', underline: 'true' })
      .moveDown(1);

    doc
      .fontSize(10)
      .font('Helvetica')
      .text(`I, ${data.firstName} ${data.lastName}, hereby agree, upon a request made under the drug/alcohol testing policy of E Neighbor Homecare LLC to submit to a drug or alcohol test and to furnish a sample of my urine, breath, and/or blood for analysis. I understand and agree that if I at any time refuse to submit to a drug or alcohol test under E Neighbor Homecare LLC policy, or if I otherwise fail to cooperate with the testing procedures, I will be subject to immediate termination. I further authorize and give full permission to have the E Neighbor Homecare LLC and/or its E Neighbor Homecare LLC physician send the specimen or specimens so collected to a laboratory for a screening test. The testing is to check for the presence of any prohibited substances under the policy and for the laboratory or other testing facility to release any and all documentation relating to such test to the E Neighbor Homecare LLC and/or to any governmental entity involved in a legal proceeding or investigation connected with the test. Finally, I authorize the E Neighbor Homecare LLC to disclose any documentation relating to such test to any governmental entity involved in a legal proceeding or investigation connected with the test.`)
      .moveDown(1)
      .text('I understand that only duly authorized E Neighbor Homecare LLC officers, employees, and agents will have access to information furnished or obtained in connection with the test. The information will maintain and protect the confidentiality of such information to the greatest extent possible, and they will share such information only to the extent necessary to make employment decisions and to respond to inquiries or notices from government entities.')
      .moveDown(1)
      .text('I will hold harmless the E Neighbor Homecare LLC staff that performs the testing, E Neighbor Homecare LLC physician, and any testing laboratory of E Neighbor Homecare LLC. I will not sue or hold responsible such parties for any alleged harm to me that might result from such testing, including loss of employment or any other kind of adverse job action that might arise as a result of the drug or alcohol test, even if an E Neighbor Homecare LLC or laboratory representative makes an error in the administration or analysis of the test or the reporting of the results.')
      .moveDown(1)
      .text('This policy and authorization have been explained to me in a language I understand, and I have been told that if I have any questions about the test or the policy, they will be answered.')
      .moveDown(1)
      .text('I understand that E Neighbor Homecare LLC will require a drug screen and/or alcohol test under this policy whenever I am involved in a job-related incident/accident, job-related motor vehicle accident, on the job injury.')
      .moveDown(2);

      
    // === Answer Block ===
    doc
    .moveDown(1)
    .font('Helvetica-Bold')
    .text('Drugs/Herbals I may be taking:', { continued: true })
    .moveDown(0.2)
    .font('Helvetica')
    .text(data.drugsHerbals || 'None')
    .moveDown()
    .font('Helvetica-Bold')
    .text('Test Information:')
    .moveDown(0.2)
    .font('Helvetica-Bold')
    .text(`- Lot Number: `, { continued: true }) 
    .font('Helvetica')
    .text(data.lotNumber || 'None')
    .font('Helvetica-Bold')
    .text(`- Expiration Date: `, { continued: true }) 
    .font('Helvetica')
    .text(data.expirationDate || 'None')
    .font('Helvetica-Bold')
    .text(`- Results: `, { continued: true })
    .font('Helvetica')
    .text(data.results || 'None')
    .moveDown()
    .font('Helvetica-Bold')
    .text(`Initials: `, { continued: true })
    .font('Helvetica')
    .text(data.initials || 'None')
    .moveDown(3);

    // Signature block
    doc
      .moveDown()
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.drugConsentDate || 'N/A', doc.page.width - 314, sigY1 + 175); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
    };

    
    // === Job Summary ===

    doc.addPage();

    doc.font('Helvetica-Bold').fontSize(16).text('Certified Home Health Aide — Job Summary & Acknowledgment', { align: 'center', underline: 'true' });
    doc.moveDown(1);
    doc.font('Helvetica').fontSize(10);

    // Job Summary Section
    doc.font('Helvetica-Bold')
    .text('JOB SUMMARY:')
    .font('Helvetica')
    .text('A Certified Home Health Aide (CHHA) works in support of the patient’s/client’s safety, dignity, well-being and ability to remain living at home. The CHHA travels to the patient’s/client’s home to provide direct care, under professional nursing supervision, in accordance with a written Plan of Care that includes personal care, grooming, ambulation, special procedures, homemaking, meal preparation, housekeeping and assistance with other activities of daily living. The Certified Home Health Aide is supervised by a RN, and there are no supervision responsibilities with this position. The CHHA has HIPAA restricted access to certain patient/client information, and is an hourly, per-diem, non-exempt Direct Care staff member with no guaranteed minimum number of hours per week.');
    doc.moveDown();

    // Qualifications
    doc.font('Helvetica-Bold')
    doc.text('QUALIFICATIONS:');
    doc.font('Helvetica')
    doc.list([
      'Have a high school diploma or GED, or a satisfactory combination of education and life experience needed to perform the duties and essential functions of the job.',
      'Have a valid New Jersey Board of Nursing, Home Health Aide certification.',
      'Have the willingness to travel throughout the service area. This includes being able to drive and have a valid driver’s license and auto insurance or have the ability to independently travel on public transportation.',
      'Demonstrate good communication skills and mature attitude.',
      'Be honest, dependable and be able to perform the physical demands of the position.'
    ]);
    doc.moveDown();

    // Responsibilities
    doc.font('Helvetica-Bold')
    doc.text('RESPONSIBILITIES:');
    doc.font('Helvetica')
    doc.list([
      'Travel to patient’s/client’s home, read and interpret the patient’s/client’s care plan and provide direct care as specified by the written plan of care. The care includes personal care to patients/clients such as, bathing, mouth, nail, hair and skin care, shaving, exercises as directed, and activities related to dressing and toileting including bedpan. Assist patient/client with ambulating, transfer activities, and the use of assistive devices like mechanical lifts, walkers, wheelchair, commode chair, braces, and prosthesis. Perform special delegated procedures including taking vital signs and weight, feeding, measuring intake and output, and assisting patient/client with self-administered medications.',
      'Perform light housekeeping, meal preparation and other support services as part of the plan of care. This includes duties such as menu planning and shopping lists, running errands, preparing meals including special diets, presenting food, and cleaning dishes, appliances, and work area afterwards, going shopping, dusting, laundry, vacuuming, general cleaning of bathroom, kitchen, and living area when part of the written plan of care.',
      'Observe the patient’s/client’s condition, behavior, appearance, and hygiene needs, living arrangements, and home environment while in the home and report and document changes or problems to the appropriate staff member.',
      'Write visit reports (Daily Activity Report, etc.) to accurately record the care provided in the home, and complete other forms to document the work of this position, including incident reports and time and attendance reports. Ensure the patient/client signs the Daily Activity Report and Time Sheets as instructed. Submit these reports on time.',
      'Maintain dependable attendance, be regularly available for assignments, and be timely for scheduled visits. Call the office for assignments often or when late for an assignment.',
      'Attend at least twelve (12) hours of in-service training annually.',
      'Adhere to agency policies and procedures.',
      'Maintain a valid NJ Board of Nursing Home Health Aide certification.',
      'Always protect and maintain patient/client and agency confidentiality.',
      'Maintain a professional image, good appearance, and personal hygiene.',
      'Accept assignments and be punctual.',
      'Attend agency meetings and training as directed.',
      'Perform other duties as assigned.'
    ]);
    doc.moveDown();

    // Working Environment
    doc.font('Helvetica-Bold')
    doc.text('WORKING ENVIRONMENT:');
    doc.font('Helvetica')
    doc.text('Work is in a variety of home environments. Frequent travel by car or public transportation throughout the service area is necessary. Tasks may involve exposure to blood, body fluids, or tissue (OSHA Category I) and household chemicals, dust, and disinfectants. This position routinely requires driving a car or independently using public transportation, lifting, bending, reaching, kneeling, pushing and pulling, stretching, standing, stooping, walking, walking up and down stairs, seeing, hearing, speaking, writing, reading, carrying, weight bearing activities, and the use of a wide assortment of large and small home appliances.');
    doc.moveDown();

    // Job Relationships
    doc.font('Helvetica-Bold')
    doc.text('JOB RELATIONSHIPS:');
    doc.font('Helvetica')
    doc.text('Supervised by: Director of Nursing/ Nursing Supervisor');
    doc.moveDown();

    // Risk Exposure
    doc.font('Helvetica-Bold')
    doc.text('RISK EXPOSURE:');
    doc.font('Helvetica')
    doc.text('High risk: LIFTING REQUIREMENTS:');
    doc.text('Ability to perform the following tasks if necessary:');
    doc.list([
      'Ability to participate in physical activity.',
      'Ability to work for extended period of time while standing and being involved in physical activity.',
      'Heavy lifting.',
      'Ability to do extensive bending, lifting and standing on a regular basis.'
    ]);
    doc.moveDown();

    // Acknowledgment
    doc.text('I have read the above job description and fully understand the conditions set forth therein, and if employed as a Certified Home Health Aide, I will perform these duties to the best of my knowledge and ability.');
    doc.moveDown(2);

    // Signature block
    doc
      .moveDown()
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.chhaSignatureDate || 'N/A', doc.page.width - 314, sigY1 - 129); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
    };

    // =====  Service Agreement ===
// Title
    doc.addPage();
    doc.fontSize(16)
     .font('Helvetica-Bold')
     .text('Homemaker Home Health Aide Service Agreement', {
       align: 'center', underline: 'true'
     });

  doc.moveDown(1.5);

  // Introduction paragraph
  doc.fontSize(11)
     .font('Helvetica')
     .text('Parties to this agreement are E Neighbor Home Care and the individual ("Homemaker Home Health Aide" or "HHHA") whose signatures appear below and who for full consideration, given and received, each intending to be legally bound, agree with one another as follows:');

  doc.moveDown();

  // Section 1
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('1. ', { continued: true })
     .font('Helvetica')
     .text('The scope of home care services for E Neighbor Home Care the HHHA may perform when placed with patient/client has been explained to Homemaker Home Health Aide (See Job Description on Page 3 below). HHHA agrees s/he will follow all E Neighbor Home Care requirements, as well as all Federal and State rules and regulations (e.g. HIPPAA requirements and all other requirements noted in the Employee Handbook) in providing home care to E Neighbor Home Care patients/clients, including regular communication with the Office and participating in training exercises.');

  doc.moveDown(0.5);

  // Bullet point under section 1
  doc.text('• E Neighbor Home Care assigns Home Health Aides for personal care, companionship, and homemaking services. HHHAs must give 24-hour notice for schedule changes and cannot leave assignments without company instructions, except for approved appointments or errands. They cannot take patients off the premises without permission.', {
    indent: 20});

  doc.moveDown();

  // Section 2
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('2. ', { continued: true })
     .font('Helvetica')
     .text("HHHA agrees to call in and out using patient's/client's home phone at start/end of each shift and complete a weekly time sheet and activity log of the total hours worked and duties performed. The HHHA will have the timesheet/ activity log signed by the patient/client. Any changes in scheduling, patient/client needs, or necessary work arrangements should be reported E Neighbor Home Care. The time sheets/activity logs are to be e-mailed to E Neighbor Home Care at the close of each weekly assignment. Live-in workers agree to accept room and board offered at the work site as part of their compensation package.", {
     });

  doc.moveDown();

  // Section 3
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('3. ', { continued: true })
     .font('Helvetica')
     .text('For and in consideration of benefits received, HHHA agrees to release E Neighbor Home Care and their officers, directors, employees, all patients/clients and any third party(s) from any and all potential or actual claims, liability, loss and/or damages incurred or claimed to be associated with this Agreement including all services to patients/clients, excepting gross negligence only.', {
     });

  doc.moveDown();

  // Section 4
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('4. ', { continued: true })
     .font('Helvetica')
     .text("HHHA agrees to work with patients/clients only through E Neighbor Home Care with referral and placement, starting and stopping services at the direction of E Neighbor Home Care. If services are stopped for any reason Homemaker home health Aide agrees to leave the patient's/client's care and home and not work with that patient/client in any way other than with E Neighbor Home Care for a period of three (3) years. HHHA understands that it is illegal for me to transfer or attempt to transfer any case to another Agency or take ownership of any job that HHHA is employed in.", {
     });

  doc.moveDown();

  // Section 5
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('5. ', { continued: true })
     .font('Helvetica')
     .text('Employment with E Neighbor Home Care is temporary and at-will, and can be terminated at any time by either party. There is no guarantee of hours, type of work, conditions, or duration of employment. E Neighbor Home Care can change policies, compensation, and conditions without notice. Upon termination, the Home Health Aide must return all company property and confidential information.', {
     });

  doc.moveDown();

  // Section 6
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('6. ', { continued: true })
     .font('Helvetica')
     .text('Homemaker Home Health Aide also agrees (to):', {
     });

  doc.moveDown(0.5);

  // Subsections of 6
  const subsections = [
    'All services provided to patients shall be in accordance the Plan of Care. Further, the services may not be altered in type, scope or duration, except by specific orders (in writing) issued as a result of changes made by the RN.',
    "Unless otherwise stated, live in Home Health Aides' schedule will generally consist of a 16-hour day with three (3) scheduled hour-long breaks per day as outlined on the live in time and activity sheet provided.",
    "Follow E Neighbor Home Care's Fraud, Ethics, and Compliance policies, including zero fraud tolerance, respect for patients and their property, and Non-Conflict of Interest/Non-Compete Clauses. Fraud results in immediate dismissal and possible legal action.",
    "Not accept monetary or other gifts from patients or family members without the company's explicit approval.",
    'Restrict use of electronic devices (cell phone, laptop, tablets, etc) to emergency needs while on duty',
    "Not smoke in or too close to the patient's/client's home",
    'Not to dispose of ANY items or property belonging to the patients/clients without getting their explicit permission to do so.',
    "Guests and visitors are not permitted in the patient's home without the patient's and company's approval.",
    'Be responsible for his/her own transportation to and from assignments.',
    "Immediately notify E Neighbor Home Care and be prepared to leave the assignment if s/he is experiencing any contagious condition (flu, cold, fever, etc.) and not return until s/he has fully recovered and is symptom free. (A doctor's note may be required).",
    'Adhere to E Neighbor Home Care professional attire code (per attachment provided).'
  ];

  subsections.forEach((text, index) => {
    doc.fontSize(10)
       .font('Helvetica-Bold')
       .text(`${index + 1}. `, { indent: 20, continued: true })
       .font('Helvetica')
       .text(text);
    doc.moveDown(0.3);
  });

  doc.text("Uphold E Neighbor Home Care's standards of excellence, integrity, and respect, and maintain a professional image in behavior, appearance, attitude, and decorum at all times.", {
  });

  doc.moveDown();

  // Section 7
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('7. ', { continued: true })
     .font('Helvetica')
     .text("I acknowledge that I have been informed about the New Jersey Consumer's Guide to Homemaker-Home Health Aides published by the New Jersey Board of Nursing which I can read via the internet (njconsumeraffairs.gov) or request hardcopy from E Neighbor Home Care.",{ align: 'justify'});

  doc.moveDown();

  // Section 8
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('8. ', { continued: true })
     .font('Helvetica')
     .text('The parties aim to resolve disputes through mutual and voluntary settlement. If a dispute arises and cannot be settled through negotiation, it will first be submitted to non-binding arbitration by the American Arbitration Association before considering binding arbitration, litigation, or other dispute resolution methods.', {
     });

  doc.moveDown();

  // Section 9
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('9. ', { continued: true })
     .font('Helvetica')
     .text('It is agreed that this agreement shall be governed by, construed and enforced in accordance with the laws of the state of New Jersey.', {
     });

  doc.moveDown();

  // Section 10
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('10. ', { continued: true })
     .font('Helvetica')
     .text('This agreement shall constitute the entire agreement between the parties and any prior understanding of representation of any kind preceding the date of this agreement shall not be binding upon either party except to the extent incorporated in this agreement.', {
     });

  doc.moveDown();

  // Section 11
  doc.fontSize(11)
     .font('Helvetica-Bold')
     .text('11. ', { continued: true })
     .font('Helvetica')
     .text("Any changes to this agreement must be in writing and signed by both parties or agreed to by email. Failure to follow this agreement, engaging in unprofessional behavior, or actions conflicting with the company's interests (such as unauthorized monetary transactions, arguing with or disrespecting clients or their families, using clients' addresses for personal purposes, or getting involved in clients' personal affairs) can lead to disciplinary actions, including dismissal. E Neighbor Home Care will not tolerate such behavior and may also take disciplinary actions, including dismissal, for any violations", {align: 'justify'});

  doc.moveDown(0.5);

  // Violation bullets
  const violations = [
    'Abuse or exploitation, of any kind, of patient/client, property or family members. Furthermore, Home Health Aides are required to report any observation of abuse, neglect or exploitation of patients/clients.',
    'Failure to fulfill requirements of the assignment',
    'Failure to advise supervisor of reportable incidents',
    'Falsification of Documents (Personal information/Employment record per application or current work)',
    'Illegal drug use of any kind and consumption or being under the influence of alcohol while on duty',
    'Sexual harassment',
    'Excessive tardiness/absenteeism',
    "Failure to respect patient's/client's privacy per HIPPAA regulations or to comply with any other regulations",
    'Insubordination'
  ];

  violations.forEach(violation => {
    doc.fontSize(10)
       .font('Helvetica')
       .text(`• ${violation}`, {
         indent: 20,
         align: 'justify'
       });
    doc.moveDown(0.2);
  });

  doc.moveDown(2);

  // Signature line
  doc.fontSize(10)
     .font('Helvetica-Bold')
     .text('I have read and understand this Agreement; by signing and printing my name here I agree to be bound by it.', {
       align: 'justify'
     });

         // Signature block
    doc
      .moveDown(4)
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(5)
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Administrator                                         Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.hhhaEmployeeDate || 'N/A', doc.page.width - 314, sigY1 - 176); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
    };

  /* ========== Handbook ========= */
    // Title
  doc.addPage();
  doc.fontSize(18)
     .font('Helvetica-Bold')
     .text('Employee Handbook Signature Page', {
       align: 'center', underline: 'true'
     });

  doc.moveDown(1.5);

  // Paragraph 1
  doc.fontSize(11)
     .font('Helvetica')
     .text("The Employee Handbook contains important information about the Agency, and I understand that I should consult the Agency's CEO or my supervisor, regarding any questions not answered in the handbook. I have entered into my employment relationship with the Agency voluntarily as an at-will employee and understand that there is no specified length of employment. Accordingly, either the Agency or I can terminate the relationship at will, at any time, with or without cause, and with or without advance notice.", {
     });

  doc.moveDown();

  // Paragraph 2
  doc.fontSize(11)
     .font('Helvetica')
     .text('Since the information, policies, and benefits described herein are subject to change at any time, and I acknowledge that revisions to the handbook may occur. All such changes will generally be communicated through official notices, and I understand that revised information may supersede, modify, or eliminate existing policies. Only the CEO of the Agency has the ability to adopt any revisions to the policies in this handbook.', {
     });

  doc.moveDown();

  // Paragraph 3
  doc.fontSize(11)
     .font('Helvetica')
     .text('Furthermore, I understand that this handbook is neither a contract of employment nor a legally binding employment agreement. I have had an opportunity to read the handbook, and I understand that I may ask my supervisor any questions I might have concern the handbook. I accept the terms of the handbook. I also understand that it is my responsibility to comply with the policies contained in this handbook and any revisions made to it.', {

     });

  doc.moveDown();

  // Paragraph 4
  doc.fontSize(11)
     .font('Helvetica')
     .text('I further agree that if I remain with the Agency following any modifications to the handbook, I hereby accept and agree to such changes.', {
    
     });

  doc.moveDown();

  // Paragraph 5
  doc.fontSize(11)
     .font('Helvetica')
     .text('I understand that I am obligated to read the entire handbook and comply with E Neighbor Homecare LLC. Policies and Procedures as outlined in this handbook.', {
    
     });

  doc.moveDown(2);
         // Signature block
    doc
      .fontSize(10)
      .moveDown(4)
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.handbookDate || 'N/A', doc.page.width - 314, sigY1); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
    };


  // ============= TB Test =======
  doc.addPage();
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Annual TB Screening Questionnaire', { align: 'center', underline: 'true' })
    .moveDown(1.5);

  // Intro
  doc
    .fontSize(12)
    .font('Helvetica')
    .text(
      'This form is completed annually for those employees who have documentation of a negative chest x-ray following a positive Mantoux screening test, and whose medical evaluation and chest x-ray indicate that no further Mantoux screening is required.',
      { align: 'left' }
    )
    .moveDown();

  // TB Questions
  const tbQuestions = {
    1: 'bad cough that lasts longer than 2 weeks',
    2: 'coughing up sputum (phlegm)',
    3: 'coughing up blood',
    4: 'loss of appetite',
    5: 'weakness/fatigue/tiredness',
    6: 'night sweats',
    7: 'unexplained weight loss',
    8: 'fever',
    9: 'chills',
    10: 'chest pain',
  };

  for (let i = 1; i <= 10; i++) {
    const answer = data[`tbQ${i}`] === 'yes' ? 'Yes' : 'No';
    doc
      .font('Helvetica-Bold')
      .text(`${i}.`, { continued: true })
      .font('Helvetica')
      .text(` Do you experience ${tbQuestions[i]}?  Answer: ${answer}`);
  }

  doc.moveDown();

  // Tuberculosis contact
  doc
    .font('Helvetica-Bold')
    .text('Have you recently spent time with someone who has infectious tuberculosis?')
    .font('Helvetica')
    .text(`Answer: ${data.tbContact === 'yes' ? 'Yes' : 'No'}`)
    .moveDown();

  // Other complaints
  doc
    .font('Helvetica-Bold')
    .text('Do you have any other complaints?')
    .font('Helvetica')
    .text(`Answer: ${data.tbOtherComplaints === 'yes' ? 'Yes' : 'No'}`);
  if (data.tbOtherComplaints === 'yes' && data.tbOtherExplain) {
    doc.text(`Explanation: ${data.tbOtherExplain}`);
  }

  doc.moveDown();

  // Statement
  doc
    .font('Helvetica-Oblique')
    .text(
      'The above health statements are accurate to the best of my knowledge. I have been in-serviced on the signs and symptoms of tuberculosis and been advised to seek medical care if any of the symptoms develop at any time.',
      { align: 'left' }
    )
    .moveDown(2);

  // Signature
    doc
      .fontSize(10)
      .moveDown(4)
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.handbookDate || 'N/A', doc.page.width - 314, sigY1 + 26); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
    };

     // ==== Hep B Vaccine
  doc.addPage();
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('HEPATITIS B VIRUS VACCINE CONSENT/DECLINATION', { align: 'center' })
    .moveDown(1);

  // Subheaders
  doc
    .fontSize(12)
    .font('Helvetica')
    .text('(Make only one choice)', { align: 'left' })
    .text('(To be maintained in the Employee\'s Health File)')
    .moveDown(1);

  // Introduction
  doc
    .font('Helvetica-Bold')
    .text('BLOODBORNE PATHOGENS', { lineGap: 4 })
    .font('Helvetica')
    .text('I have been informed of the symptoms and modes of transmission of bloodborne pathogens, including Hepatitis B virus (HBV). I know about the facility\'s infection control program and understand the procedure to follow if an exposure incident occurs.\nI understand that the Hepatitis B vaccine is available, at no cost, to employees whose job involves the risk of directly contacting blood or other potentially infectious material. I understand that vaccinations shall be given according to recommendations for standard medical practice in the community.')

    .moveDown(1.5);

  // Consent or Declination
  doc.font('Helvetica-Bold').text('HEPATITIS B VACCINE CHOICE').moveDown(0.5);

  if (data.hepbConsentChoice === 'consent') {
    doc
      .font('Helvetica')
      .text('✓ I consent to the administration of the Hepatitis B vaccine. I have been informed of the method of administration, the risks, complications, and expected benefits of the vaccine. I understand that the facility is not responsible for any reactions caused by the vaccine.');
  } else if (data.hepbConsentChoice === 'decline') {
    doc
      .font('Helvetica')
      .text('✓ I decline the Hepatitis B vaccination at this time. I understand that, by declining this vaccine, I continue to be at risk of acquiring Hepatitis B, a serious disease. If in the future I continue to have occupational exposure to blood or other potentially infectious materials, I can request to be vaccinated at no charge.');
  } else {
    doc.font('Helvetica').text('No selection made.');
  }

  doc.moveDown(1.5);

  // Exclusion Section
  doc.font('Helvetica-Bold').text('DOCUMENTATION OF EXCLUSION FROM HEPATITIS B VACCINE').moveDown(0.5);

  const exclusions = [
    {
      key: 'hepbExclusionPrevSeries',
      label:
        'I have previously received the complete series of the three injections of the Hepatitis B Vaccine. I do not have documentation of Hepatitis-B immunity and choose not to receive the vaccine. I release E Neighbor Homecare LLC from all liability for any hazards that may result from possible exposure to this disease.',
    },
    {
      key: 'hepbExclusionImmune',
      label: 'I have had a positive result in Hepatitis B antibody testing, which shows immunity to the virus.',
    },
    {
      key: 'hepbExclusionMedical',
      label: 'I have medical contraindications to the vaccine.',
    },
    {
      key: 'hepbExclusionLowRisk',
      label:
        'I am at low risk and provide no direct patient care. I release E Neighbor Homecare LLC from all liability for any hazards that may result from possible exposure to this disease.',
    },
  ];

  exclusions.forEach((item) => {
    const checked = data[item.key] ? '✓' : ' ';
    doc.text(`${checked} ${item.label}`).moveDown(0.5);
  });

  doc.moveDown(2);

      // Signature
    doc
      .fontSize(10)
      .moveDown(4)
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.handbookDate || 'N/A', doc.page.width - 314, sigY1 + 134); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
    }


     // ============  OSHA Intro ===========
  doc.addPage();
  doc
    .fontSize(20)
    .font('Helvetica-Bold')
    .text('OSHA Introduction Acknowledgment', { align: 'center' })
    .moveDown(1.5);

  // OSHA Text Sections
  doc
    .fontSize(12)
    .font('Helvetica')
    .text(
      'The Occupational Safety and Health Administration (OSHA) is a federal organization within the Department of Labor created by the Occupational Safety and Health Act of 1970. The purpose of the Act is to assure, as far as possible, safe and healthy working conditions for American workers. OSHA is responsible for developing standards to help employers provide a safe workplace.'
    )
    .moveDown();

  doc.text(
    'Because occupational exposure to the Hepatitis B and AIDS viruses and other disease-causing agents carried by the blood is a threat to healthcare workers, OSHA has issued a regulation to help healthcare employers protect workers against the increased risk of occupational exposure.'
  ).moveDown();

  doc.text('The regulation requires that:');
  doc
    .list([
      'A written Exposure Control Plan be developed',
      'All at-risk employees are trained in the safety and prevention of occupational exposure',
      'Monitoring of employee compliance with Exposure Control Plan',
    ])
    .moveDown();

  doc.text(
    'The following information is presented to acquaint you with specific guidelines and protocols required by E Neighbor Homecare LLC to meet the OSHA mandate and information related to the transmission of bloodborne pathogens.'
  ).moveDown();

  doc.text('Compliance with the Exposure Control Plan guidelines is mandatory.').moveDown();

  doc.text('Employees violating the guidelines and/or protocols of E Neighbor Homecare LLC Exposure Control Plan will be cited for the following second level disciplinary actions:');
  doc
    .list([
      'First Violation - Written warning by supervisor',
      'Second Violation - Disciplinary probation',
      'Third Violation - Termination',
    ])
    .moveDown(2);

  // Statement
  doc
    .font('Helvetica-Oblique')
    .text(
      'I have read and understand my responsibility to be compliant with E Neighbor Homecare LLC OSHA and Safety policies and procedures and all applicable state/federal laws or regulations and also all Accrediting agencies.',
      { align: 'left' }
    )
    .moveDown(2);

          // Signature
    doc
      .fontSize(10)
      .moveDown(4)
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.handbookDate || 'N/A', doc.page.width - 314, sigY1 + 160 ); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
    }

   // EXPOSURE and OSHA II
  doc.addPage();
  doc
    .fontSize(18)
    .font('Helvetica-Bold')
    .text('Exposure Classification Record of Employee', { align: 'center' })
    .moveDown(1.5);

  // Instructional paragraph
  doc
    .fontSize(12)
    .font('Helvetica')
    .text(
      'The following employee was classified according to work task exposure to certain body fluids as required by the current OSHA infection control standard:',
      { align: 'left' }
    )
    .moveDown();

  // Category
  const categories = {
    CategoryI:
      'Category I - Involves tasks or procedures in which all or some staff have a reasonable likelihood of contact with blood or other potentially infectious materials. The use of job-appropriate personal protective equipment and other protective measures is required.',
    CategoryII:
      'Category II - Tasks and work assignments involve no routine exposure to blood or other potentially infectious material, but employment may require unplanned Category I tasks. (Example: In an emergency, receiving-transporting specimens) Appropriate personal protective device must be available, and these staff must be familiar with protective measures.',
    CategoryIII:
      'Category III - Tasks and work assignments involve no exposure to blood or other potentially infectious materials. Employment should NEVER require Category I or Category II tasks or duties.',
  };

  const selected = categories[data.exposureCategory] || 'Not selected';
  doc
    .font('Helvetica-Bold')
    .text('Selected OSHA Category:', { underline: true })
    .moveDown(0.5)
    .font('Helvetica')
    .text(selected)
    .moveDown(2);

  // Acknowledgment statement
  doc
    .font('Helvetica-Oblique')
    .text(
      'I understand my OSHA category and understand my responsibilities in abiding by the national standard of safety practices and E Neighbor Homecare LLC policies and procedures regarding safety in the workplace.',
      { align: 'left' }
    )
    .moveDown(2);

            // Signature
    doc
      .fontSize(10)
      .moveDown(4)
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.handbookDate || 'N/A', doc.page.width - 314, sigY1 - 158); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
    }

  // ====== Horizon Questions
  doc.addPage();
  doc
    .fontSize(16)
    .font('Helvetica-Bold')
    .text('Criminal History Background Check Questions for Employees', { align: 'center', underline: 'true' })
    .moveDown(1.5);

  // Intro
  doc
    .fontSize(10)
    .font('Helvetica-Oblique')
    .text(
      'The questions below should be asked of all employees/providers with direct physical access to MLTSS members and updated on an annual basis. The questions below are for illustrative purposes only and need not be submitted to Horizon NJ Health.',
      { align: 'left' }
    )
    .moveDown(1.5)
    .fontSize(9.2);

  // Questions
  const horizonQuestions = [
    {
      name: 'horizonQ1',
      label:
        'Have you ever been convicted of, pled guilty to or pled nolo contendere to any felony in the last ten years or been found liable or responsible for or named as a defendant in any civil offense that is reasonably related to your qualifications, competence, functions or duties as a medical professional?',
    },
    {
      name: 'horizonQ2',
      label:
        'Have you ever been convicted of, pled guilty to or pled nolo contendere to any felony in the last ten years or been found liable or responsible for or named as a defendant in any civil offense that is alleged fraud, an act of violence, child abuse or sexual offense or sexual misconduct?',
    },
    {
      name: 'horizonQ3',
      label: 'Have you ever been indicted in any criminal suit?',
    },
    {
      name: 'horizonQ4',
      label: 'Have you ever been court martialed for actions related to your duties as a medical professional?',
    },
    {
      name: 'horizonQ5',
      label:
        'Are you currently engaged in the illegal use of drugs? (“Currently” means sufficiently recent to justify a reasonable belief that the use of drugs may have an ongoing impact on one’s ability to practice medicine. It is not limited to the day of, or within a matter of days or weeks before the date of an application, rather that it has occurred recently enough to indicate the individual is actively engaged in such conduct. “Illegal use of drugs” refers to the drugs whose possession or distribution is unlawful under the Controlled Substances Act, 21 U.S.C. § 812.2. It does not include the use of a drug taken under supervision of a licensed health care professional, or other uses authorized by the Controlled Substances Act or other provision of federal law.” The term does include, however, the unlawful use of prescription controlled substances.)',
    },
    {
      name: 'horizonQ6',
      label:
        'Do you use any chemical substances that would in any way impair or limit your ability to perform the functions of your job with reasonable skill and safety?',
    },
    {
      name: 'horizonQ7',
      label: 'Do you have any reason to believe that you would pose a risk to the safety or well­being of your clients?',
    },
  ];

  horizonQuestions.forEach((q, i) => {
    const answer = data[q.name] === 'yes' ? 'Yes' : 'No';
    doc
      .font('Helvetica-Bold')
      .text(`${i + 1}.`, { continued: true })
      .font('Helvetica')
      .text(` ${q.label}`)
      .moveDown(0.4)
      .font('Helvetica-Bold').text(`Answer: `, { continued: true }).font('Helvetica').text(answer)
      .moveDown();
  });

  doc.moveDown();


    // Signature
    doc
      .fontSize(10)
      .moveDown(4)
      .text('_______________________________                  ______________', { continued: false })
      .font('Helvetica-Oblique')
      .text(`Signature of Applicant                                              Date`)
      .moveDown(2);
    
    doc
      .fontSize(8)
      .font('Helvetica-Bold')
      .fontSize(10)
      .text(data.handbookDate || 'N/A', doc.page.width - 314, sigY1 + 126); // overlay the date on the line

    // Insert ignature image if available
    if (data.signature?.startsWith('data:image')) {
      const base64 = data.signature.split(';base64,').pop();
      const sigPath = path.join(__dirname, `uploads/signature-policy-${timestamp}.png`);
      fs.writeFileSync(sigPath, base64, { encoding: 'base64' });

      doc.image(sigPath, {
        width: 180,
        height: 60,
        align: 'left',
        x: 60,
        y: doc.y - 55,
      });
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
