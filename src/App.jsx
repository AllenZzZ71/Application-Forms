import React, { useRef, useState, useEffect, useImperativeHandle, forwardRef } from "react";
import { Button, Typography, Checkbox, FormControl, FormControlLabel, FormHelperText, FormGroup, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";
import SignatureCanvas from "react-signature-canvas";
import trimCanvas from 'trim-canvas';

const translations = {
  en: {
    personalInfo: "Personal Information",
    firstName: "First Name",
    lastName: "Last Name",
    dateOfSubmission: "Date of Submission",
    dateOfBirth: "Date of Birth",
    ssn: "SSN",
    streetAddress: "Street Address",
    streetAddress2: "Street Address Line 2",
    city: "City",
    state: "State",
    zip: "Zip Code",
    phone: "Phone Number",
    email: "Email",
    dateAvailable: "Date Available",
    employmentType: "Employment Type",
    position: "Position Applied For",

    employmentEligibility: "Employment Eligibility",
    usCitizen: "Are you a U.S. Citizen?",
    workAuth: "If not, are you authorized to work in the U.S.?",
    felony: "Have you ever been convicted of a felony?",
    felonyExplain: "If yes, please explain:",
    sName: "School Name",
    sAddress: "School Address",
    sFrom: "From",
    sTo: "To",
    sGraduate: "Did you graduate?",
    sDegree: "Degree",
    signatureDate: "Date",
    signature: "Signature",
    clearSignature: "Clear Signature",
    signatureInstruction: "Click/tap and drag to sign",
    submit: "Submit",
    education: "Education",

    references: "Reference",
    fullName: "Full Name",
    relation: "Relation",
    referenceAddress: "Address",
    referencePhone: "Phone",

    previousEmployment: "Previous Employment",
    employerName: "Employer Name",
    employerPhone: "Phone",
    employerAddress: "Address",
    jobTitle: "Job Title",
    employmentFrom: "From",
    employmentTo: "To",
    responsibilities: "Responsibilities",
    reasonForLeaving: "Reason for Leaving",
    mayWeContact: "May we contact your previous supervisor?",

    emergencyContact: "Emergency Contact",
    emergencyFullName: "Full Name",
    emergencyRelation: "Relation",
    emergencyPhone: "Phone",
    emergencyAddress: "Address",

    disclaimer: "Disclaimer & Agreement",
    disclaimerText: "By signing below, I acknowledge that I have read, understood, and agreed to all the information, policies, attestations, and consents provided in this employment application. I affirm that all answers and information I have provided throughout this application are true and complete to the best of my knowledge. I understand that this signature applies to and affirms all prior acknowledgments, agreements, disclosures, and forms included in this document. I further acknowledge that my electronic signature has the same legal effect and enforceability as a handwritten signature, and I consent to signing this application electronically in accordance with the U.S. Electronic Signatures in Global and National Commerce (E-SIGN) Act.",
    agreeCheckbox: "I agree to the above terms.",

    employeeApplication: "Employee Application",
    workedHereBefore: "Have you ever worked for this Pharmacy?",
    ifSoWhen: "If so, when?",
    educationRefsEmployment: "Education and Previous Employment",
    emergencyContactInfo: "References, Emergency Contact Information",
    next: "Next",
    previous: "Previous",

    yes: "Yes",
    no: "No",
    enterFirstName: "Enter your first name",
    enterLastName: "Enter your last name",
    relationshipToYou: "Relationship to you",
    pleaseSelect: "Please select",
    fullTime: "Full-time",
    partTime: "Part-time",
    temporary: "Temporary",

    employeeName: "Employee Name",
    generalDate: "Date",

    backgroundCheckText: (<> <p><strong><u>Notice</u></strong></p>
            <p>The E Neighbor Homecare LLC provides notice that background checks will be performed for employment with the E Neighbor Homecare LLC. The background checks include but are not limited to:</p>
            <ol>
            <li>Criminal Background checks</li>
            <li>Sex Offenders</li>
            <li>Office of Inspector General (OIG)</li>
            <li>System for Award Management (SAM)</li>
            </ol>
            <p>&nbsp;</p>
            <p><strong><u>Authorization</u></strong></p>
            <p>I hereby authorize E Neighbor Homecare LLC to conduct the background checks described above. In connection with this, I also authorize the use of law enforcement agencies and/or private criminal background check organizations to assist E Neighbor Homecare LLC .in collecting this information.&nbsp;</p>
            <p>I also am aware that records of arrests on pending charges and/or convictions are not an absolute bar to employment. Such information will be used to determine whether the results of the background check reasonably bear on my trustworthiness or my ability to perform the duties of my position in a manner that is safe for E Neighbor Homecare LLC .</p>
            <p>&nbsp;</p>
            <p><strong><u>Attestation </u></strong></p>
            <p>To the best of my knowledge, the information provided in this Notice and Authorization and any attachments is true and complete. I understand that any falsification or omission of information may disqualify me for this position and/or may serve as grounds for the severance of my employment with E Neighbor Homecare LLC. By signing below, I hereby provide my authorization to E Neighbor Homecare LLC to conduct a criminal background checks, and I acknowledge that I have been informed of a summary of my rights under the Fair Credit Reporting Act. In addition to those rights, I understand that I have a right to appeal an adverse employment decision made based on my background check information within three business days of receipt of such notice and that a determination on my appeal will be made in seven working days from E Neighbor Homecare LLC receipt of such appeal.</p>
         </> ),
    backgroundCheckConfirm: "I have read and agree to the terms above regarding the background check.",
    backgroundCheckTitle: "Background Check Notice and Authorization",

    confidentialityTitle: "Confidentiality and Non-Disclosure Agreement",
    confidentialityText:(<>
            <p>This HIPAA (employee) non-disclosure agreement (the &ldquo;Agreement&rdquo;) is made between E Neighbor Homecare LLC and __ ____________ (employee). The Agreement is intended to prevent the unauthorized disclosure of Confidential Information (as defined below) by Employee. The parties agree as follows:</p>
            <strong>1. Personal Health Information</strong>
            <p>During the course of employment, employees may have access to personal health information ('"PHI") relating to clients or patients of E Neighbor Homecare LLC. PHI may consist of medical records, billing, financial records, or any individually identifiable health information. PHI is protected by the Health Insurance Portability and Accountability Act ("HIPAA"). HIPAA permits access to PHI on a "need to know" basis. Therefore, unless authorization has been granted, any intentional accessing of PHI, or circumvention of PHI security protocols, is prohibited.</p>
            <p>&nbsp;<strong>I agree to abide by the following HIPAA privacy &amp; security rules:</strong></p>
            <ul>
            <li>Following the &ldquo;minimum necessary disclosure standard&rdquo; protocol when using or disclosing routine protected health information.</li>
            <li>Accessing only patient information for which you have been given authorization, including computer and hard copy</li>
            <li>Only logging on using the assigned user ID and only logging on to one computer at a time. If assigned a laptop or other electronic device that contains confidential information, keep the equipment secure at all times.</li>
            <li>Practicing confidentiality and heightened sensitivity to the use of identifiable health information used in daily business practice.</li>
            <li>Not engaging in the disclosure of patient information except for treatment, payment, and/or operation purposes.</li>
            <li>Responding to patient requests for their personal records using the practice&rsquo;s protocol.</li>
            <li>Referring violations of the HIPAA Rules by Business Associates directly to the practice&rsquo;s designated Privacy Officer.</li>
            <li>Reporting any inadvertent access to PHI that should not have been accessed.</li>
            <li>Attending initial HIPAA training and any additional training offered by the practice for any revisions to the federal/state HIPAA regulations and/or significant changes made by the practice to the Privacy &amp; Security Policy.</li>
            <li>Not downloading or installing games, data or software without prior approval from the Administrator/CEO.</li>
            <li>Creating a unique password that is difficult to guess and changing it regularly as requested.</li>
            <li>Shredding all confidential data prior to discarding (including phone messages from patients, etc.).</li>
            <li>Following the E Neighbor Homecare LLC Privacy and Confidentially Policies and Procedures.</li>
            </ul>
            <strong>2. Confidential Information</strong>
            <p>Confidential Information" consists of PHI as well as proprietary information relating to E Neighbor Homecare LLC business, including but not limited to: medical and financial records, revenues, identification and account numbers and names, PINs, and passwords, or other information conveyed in writing or in a discussion that is indicated to be confidential.</p>
            <strong>3. Non-Disclosure</strong>
            <p>Without E Neighbor Homecare LLC prior written consent, the employee will not:&nbsp;(a) disclose Confidential Information to any third party, whether electronically, orally, or in writing;&nbsp;(b)&nbsp;make or permit to be made copies or other reproductions of Confidential Information;&nbsp;(c) make any use of Confidential Information; or (d) use or disclose Confidential Information in violation of applicable law, including but not limited to HIPAA.</p>
            <strong>4. Returu of Confidential Materials</strong>
            <p>Upon E Neighbor Homecare LLC's request, employee shall immediately return all original materials provided by E Neighbor Homecare LLC and any copies, notes, or other documents in employee's possession pertaining to Confidential Information.</p>
            <strong>5. Term</strong>
            <p>The non-disclosure terms of this Agreement shall survive any termination, cancellation, expiration or other conclusions of employment (or this Agreement) unless the parties otherwise expressly agree in writing or E Neighbor Homecare LLC sends employee written notice releasing it from this Agreement.</p>
            <strong>6. Notico of Immunity From Liability</strong>
            <p>An individual shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade secret that is made (i) in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney; and (ii) solely for the purpose of reporting or investigating a suspected violation of law; or is made in a complaint or other document filed in a lawsuit or other proceeding, if such filing is made under seal. An individual who files a lawsuit for retaliation by an employer for reporting a suspected violation of law may disclose the trade secret to the attorney of the individual and use the trade secret information in the court proceeding if the individual (i) files any document containing the trade secret under seal; and (ii) does not disclose the trade secret, except pursuant to a court order.</p>
            <strong>7.General Provisions</strong>
            <p><strong>(a)&nbsp;Relationships</strong>.&nbsp;Nothing contained in this Agreement shall be deemed to constitute either party a partner, joint venturer, or employee of the other party for any purpose.<br /> <strong>(b)&nbsp;Severability.</strong>&nbsp;If a court finds any provision of this Agreement invalid or unenforceable, the remainder of this Agreement shall be interpreted so as to best effect the intent of the parties.<br /> <strong>(c)&nbsp;Integration.</strong>&nbsp;This Agreement expresses the complete understanding of the parties with respect to the subject matter and supersedes all prior proposals, agreements, representations, and understandings. This Agreement may not be amended except in writing and signed by both parties.<br /> <strong>(d)&nbsp;Waiver.</strong>&nbsp;The failure to exercise any right provided in this Agreement shall not be a waiver of prior or subsequent rights.<br /> <strong>(e)&nbsp;Injunctive Relief.</strong>&nbsp;Any misappropriation of Confidential Information in violation of this Agreement may cause E Neighbor Homecare LLC irreparable harm, the amount of which may be difficult to ascertain, and therefore employee agrees that E Neighbor Homecare LLC shall have the right to apply to a court of competent jurisdiction for an order enjoining any such further misappropriation and for such other relief as E Neighbor Homecare LLC deems appropriate. This right of E Neighbor Homecare LLC is to be in addition to the remedies otherwise available to E Neighbor Homecare LLC.<br /> <strong>(f)&nbsp;Attorney Fees and Expenses</strong>. In a dispute arising out of or related to this Agreement, the prevailing party shall have the right to collect from the other party its reasonable attorney fees and costs and necessary expenditures.<br /> <strong>(g)&nbsp;Governing Law.</strong>&nbsp;This Agreement shall be governed in accordance with the laws of the State in which the E Neighbor Homecare LLC business is located.<br /> <strong>(h)&nbsp;Jurisdiction</strong>. The parties consent to the exclusive jurisdiction and venue of the federal and state courts in any action arising out of or relating to this Agreement. The parties waive any other venue to which either party might be entitled by domicile or otherwise.</p>    
    </>),
    confidentialityConfirm: "I have read and agree to the confidentiality and non-disclosure agreement above.",
    adherenceTitle: "ADHERENCE TO POLICIES AND PROCEDURES, FEDERAL, STATE, AND ACCREDITATION REGULATIONS, STANDARDS, LAWS, GUIDELINES AND STAFF TRAINING",
    adherenceText: (<>
              <p>I understand that copies of the policy and procedures manuals are available, and I understand that it is my responsibility to read the policies. I also agree to comply with E Neighbor Homecare LLC. Policies and procedures, federal/state laws and regulations, accrediting agencies, and national practice standards. If I have any questions or need any clarification, I will ask the Administrator/CEO .</p>
              <p>I understand I will be responsible for maintaining skills and knowledge to comply withE Neighbor Homecare LLC the scope of Services and any provider's requirements.</p>
              <p>I understand that nothing contained in any policy or procedure manual constitutes a contractual relationship between E Neighbor Homecare LLC and its employees, contractor, or volunteers.</p>
              <p>I understand that I am required to attend and participate in services as scheduled and annual training by E Neighbor Homecare LLC to be in compliance with new or revised policies and procedures.</p>
    </>),
    adherenceAgree:"I have read and agree to the confidentiality and non-disclosure agreement above.",
    conflictTitle:"Conflict of Interest Disclosure",
    conflictText:(<> <p>I have been provided a copy/information and understand E Neighbor Homecare LLC. Disclosure/Conflict of Interest policy.</p>
      <p>The following questions are designed for you to determine the nature and extent of any outside interest that might possibly involve a conflict of interest with the affairs of the organization. Please read each question carefully and then answer briefly and concisely in the space that follows. In the event that you have any doubts as to what the question means, answer it to the best of your ability and identify the reason for the doubt.</p>
      <p><strong>Glossary</strong></p>
      <p><em>Competitor:</em> A person offering for sale or selling products and/or services in competition with this organization.</p>
      <p><em>Family:</em> Spouse, parents, children, brothers, sisters, in-laws, and those in your household.</p>
      <p><em>Purchaser:</em>  Any person who buys, rents, or otherwise procures, has bought, rented, procured, or in any way has received from this organization any goods, materials, wares, merchandise, supplies, machinery, equipment, or professional and/or another service.</p>
      <p><em>Person:</em> An individual, firm, partnership, trust, corporation, or other business entity.</p>
      <p><em>Vendor:</em> Any person who sells, rents, agrees to furnish, has offered to sell, rent, or agree to furnish, or has sold supplies, machinery, equipment, real estate, credit, insurance, or service, profession or otherwise, to or on behalf of the organization.</p>
      <p></p>
      </>),
    conflictCertify: "I certify that I have: Ownership, Entertainment, Gifts, Loans:",
    conflictFurthermore: "Furthermore, I understand that I have a duty to report any relationship that may arise that could be perceived as a conflict of interest or may be considered a conflict of interest between myself and the E Neighbor Homecare LLC.",
    conflictAgree1:"I acknowledge that it is my responsibility to bring any such potential conflicts of interest to the attention of the corporate Compliance Officer.",
    conflictAgree2:"I acknowledge and certify the above responses are true and accurate to the best of my knowledge.",
    ethicsTitle: "Code of Business Conduct and Ethics",
    ethicsText: (<>
    <p>The success of our business is dependent on the trust and confidence we earn from our employees, customers, and shareholders. We gain credibility by adhering to our commitments, displaying honesty and integrity, and reaching company goals solely through honorable conduct. It is easy to&nbsp;<em>say</em>&nbsp;what we must do, but the proof is in our&nbsp;<em>actions</em>. Ultimately, we will be judged on what we do.</p>
            <p>&nbsp;</p>
            <p>E Neighbor Homecare LLC's commitment to integrity begins with complying with laws, rules, and regulations where we do business. Further, each of us must have an understanding of the company policies, laws, rules, and regulations that apply to our specific roles. If we are unsure of whether a contemplated action is permitted by law or E Neighbor Homecare LLC policy, we should seek advice from the Administrator/CEO. We are responsible for preventing violations of law and for speaking up if we see possible violations</p>
            <p>&nbsp;</p>
            <p>The use of good judgment based on high ethical principles will guide you with respect to lines of acceptable conduct. If a situation arises for which it is difficult to determine the proper course of action, the matter should be discussed immediately with your immediate supervisor.</p>
            <p>In consideration of the employment of the undersigned by E Neighbor Homecare LLC, the employee agrees: (I) that during the employee's employment with E Neighbor Homecare LLC, the employee shall not solicit patients of E Neighbor Homecare LLC or attempt to influence such patients to change providers, (2) that upon the termination of employee's employment with E Neighbor Homecare LLC, the employee shall not, for a period of three months after such termination, service any patients of E Neighbor Homecare LLC serviced by the employee during the last six months of the employee's employment by E Neighbor Homecare LLC, (3) to keep confidential all patient records, patient information, pharmacy trade secrets, pharmacy computer passwords, pharmacy phone access codes or any other passwords or pharmacy secrets, (4) to maintain professional boundaries to include clients, vendors and providers and (5) to serve faithfully and act in a way that will merit the continued trust and confidence of the public.</p>
            <p>&nbsp;</p>
            <p>As a user of information at E Neighbor Homecare LLC, you may develop, use, or maintain (1) patient information (for health care, quality improvement, peer review, education, billing, reimbursement, administration, research, or for other purposes), (2) personnel information (for employment, payroll, or other business purposes), or (3) confidential business information of E Neighbor Homecare LLC and/or third parties, including third-party software and other licensed products or processes. This information from any source and in any form, including, but not limited to, paper record, oral communication, audio recording, and electronic display, is strictly confidential. Access to confidential information is permitted only on a need-to-know basis and limited to the minimum amount of confidential information necessary to accomplish the intended purpose of the use, disclosure, or request.</p>
            <p>&nbsp;</p>
            <p>To avoid conflicts of interest, we must ensure that our decisions for E Neighbor Homecare LLC are objective and fair. Sometimes our personal or family interests might conflict with business decisions. We must always prioritize E Neighbor Homecare LLC's legitimate interests. Using company property or information for personal gain or seizing business opportunities for personal benefit is prohibited.</p>
            <p>I agree to follow the E Neighbor Homecare LLC Policies and Procedures Manual. I understand that these policies and procedures may change, and it is my responsibility to stay informed and comply with any updates.</p>
            <p>All employees must follow this business ethics policy. Violating it may result in disciplinary action, including termination. Unauthorized use or release of confidential information may lead to personal, civil, or criminal penalties. I agree to comply with the Confidentiality statements and the E Neighbor Homecare LLC Privacy and Information Security Policies, which I'll read. If I breach these terms, E Neighbor Homecare LLC can seek damages.</p>
            <p><strong>I agree to read E Neighbor Homecare LLC Compliance and Business Ethics policies. If I have questions, I will direct my questions to my supervisor.&nbsp; </strong></p>
            <p><strong>The signatures, printed name and dates below signify acceptance of the terms ofE Neighbor Homecare LLC Compliance and Business Ethical policies and procedures. </strong></p>
            <p>&nbsp;</p>
      </>),
    ethicsAgreeText: "I have read, acknowledge and agree to comply with all terms, policies, and conditions outlined above.",
    driverTitle: "Driver Compliance Acknowledgement",
    driverText: (<>
    <p>I understand that operating a vehicle on E Neighbor Homecare LLC business means driving either a personal vehicle or owned/leased vehicle by E Neighbor Homecare LLC in the course of employment (i.e., any driving other than commuting to and from the agency office and my home in my personal vehicle) or situations in which any car allowance or mileage reimbursement is paid to me by E Neighbor Homecare LLC.</p>
              <p>&nbsp;</p>
              <p>I understand that I must possess a valid and current driver's license for my state. I also understand that I must submit proof of automobile insurance (a copy of the declaration page or the policy) to my supervisor upon employment if a Commercial Driver's License is required for my job duties. I understand that state law requires certain minimum auto insurance coverage for all vehicle employees, contractors, or volunteers who use their personal car to perform business on behalf of E Neighbor Homecare LLC</p>
              <p>&nbsp;</p>
              <p>I affirm that I have auto insurance coverage as required by the state, and I agree to maintain coverage as required by state law. E Neighbor Homecare LLC the right to request proof of insurance at any time during the term of employment.</p>
              <p>&nbsp;</p>
              <p>I agree to notify my supervisor if I incur any violation that materially changes my driving record. I understand that disciplinary action (which may include termination) will be taken if my driving record is classified as high risk and/or unacceptable.</p>
              <p><em>&nbsp;</em></p>
              <p>I understand that my driving record is subject to review at any time by pharmacy management.</p>
    </>),
    drugfreeTitle: "Drug-Free Workplace Policy",
    drugfreeText: (<>
    <p>E Neighbor Homecare LLC maintains a drug-free workplace concerning the use, possession, and distribution of drugs.</p>
                <p>All employees are prohibited from unlawful possession or use of a controlled substance or any alcoholic beverages while in the workplace. Employees are also prohibited from the unlawful manufacture, distribution, or dispensing of a controlled substance while in the workplace.</p>
                <p>Prior to hire, all employees will have a drug test conducted. If the drug test results are positive, then E Neighbor Homecare LLC will send the sample to an independent laboratory for testing. If the test result is positive, E Neighbor Homecare LLC will not employ an individual.&nbsp;</p>
                <p>Employees may be subject to reasonable suspicion urine testing for unlawful drugs when the organization or its client had cause to believe that the drug or alcohol policy has been violated.</p>
                <p>Any violation of this policy will result in disciplinary action, <strong>including</strong> termination of employment.</p>
                <p>I acknowledge that I understand that E Neighbor Homecare LLC is a Drug-Free Workplace and understand that E Neighbor Homecare LLC has no tolerance for the use or being under the influence of drugs or alcohol in the workplace.&nbsp;</p>
                <p>&nbsp;</p>
    </>),
    alcTestTitle: "Employee Agreement and Consent to Drug and/or Alcohol Testing",
    alcTestText: (<><p>&nbsp;I, _________________________________, hereby agree, upon a request made under the drug/alcohol testing policy of E Neighbor Homecare LLC to submit to a drug or alcohol test and to furnish a sample of my urine, breath, and/or blood for analysis. I understand and agree that if I at any time refuse to submit to a drug or alcohol test under E Neighbor Homecare LLC policy, or if I otherwise fail to cooperate with the testing procedures, I will be subject to immediate termination. I further authorize and give full permission to have the E Neighbor Homecare LLC and/or its E Neighbor Homecare LLC physician send the specimen or specimens so collected to a laboratory for a screening test. The testing is to check for the presence of any prohibited substances under the policy and for the laboratory or other testing facility to release any and all documentation relating to such test to the E Neighbor Homecare LLC and/or to any governmental entity involved in a legal proceeding or investigation connected with the test. Finally, I authorize the E Neighbor Homecare LLC to disclose any documentation relating to such test to any governmental entity involved in a legal proceeding or investigation connected with the test.</p> <p>&nbsp;</p> <p>I understand that only duly authorized E Neighbor Homecare LLC officers, employees, and agents will have access to information furnished or obtained in connection with the test. The information will maintain and protect the confidentiality of such information to the greatest extent possible, and they will share such information only to the extent necessary to make employment decisions and to respond to inquiries or notices from government entities.</p> <p>&nbsp;</p> <p>I will hold harmless the E Neighbor Homecare LLC staff that performs the testing, E Neighbor Homecare LLC physician, and any testing laboratory of E Neighbor Homecare LLC.&nbsp;I will not sue or hold responsible such parties for any alleged harm to me that might result from such testing, including loss of employment or any other kind of adverse job action that might arise as a result of the drug or alcohol test, even if an E Neighbor Homecare LLC or laboratory representative makes an error in the administration or analysis of the test or the reporting of the results.</p> <p>&nbsp;</p> <p>This policy and authorization have been explained to me in a language I understand, and I have been told that if I have any questions about the test or the policy, they will be answered.</p> <p>&nbsp;</p> <p>I understand that E Neighbor Homecare LLC will require a drug screen and/or alcohol test under this policy whenever I am involved in a job-related incident/accident, job-related motor vehicle accident, on the job injury.</p></>),
    alcTestF1: "I may be taking the following Drugs/Herbals",
    alcTestF2: "Lot Number",
    alcTestF3: "Expiration Date",
    alcTestF4: "Results",
    alcTestF5: "Negative",
    alcTestF6: "Positive",
    alcTestF7: "Initials",

    chhaTitle: "Certified Home Health Aide — Job Summary & Acknowledgment",
    chhaText: (<><p><u>JOB SUMMARY</u>: A Certified Home Health Aide (CHHA) works in support of the patient&rsquo;s/client&rsquo;s safety, dignity, well-being and ability to remain living at home. The CHHA travels to the patient&rsquo;s/client&rsquo;s home to provide direct care, under professional nursing supervision, in accordance with a written Plan of Care that includes personal care, grooming, ambulation, special procedures, homemaking, meal preparation, housekeeping and assistance with other activities of daily living.&nbsp; The Certified Home Health Aide is supervised by a RN, and there are no supervision responsibilities with this position.&nbsp; The CHHA has HIPAA restricted access to certain patient/client information, and is an hourly, per-diem, non-exempt Direct Care staff member with no guaranteed minimum number of hours per week.</p> <p>&nbsp;</p> <p><u>QUALIFICATIONS</u>:</p> <ol> <li>Have a high school diploma or GED, or a satisfactory combination of education and life experience needed to perform the duties and essential functions of the job.</li> <li>Have a valid New Jersey Board of Nursing, Home Health Aide certification.</li> <li>Have the willingness to travel throughout the service area.&nbsp; This includes being able to drive and have a valid driver&rsquo;s license and auto insurance or have the ability to independently travel on public transportation.</li> <li>Demonstrate good communication skills and mature attitude.</li> <li>Be honest, dependable and be able to perform the physical demands of the position.</li> </ol> <p>&nbsp;</p> <p><u>RESPONSIBILITIES</u>:</p> <ol> <li>Travel to patient&rsquo;s/client&rsquo;s home, read and interpret the patient&rsquo;s/client&rsquo;s care plan and provide direct care as specified by the written plan of care.&nbsp; The care includes personal care to patients/clients such as, bathing, mouth, nail, hair and skin care, shaving, exercises as directed, and activities related to dressing and toileting including bedpan.&nbsp; Assist patient/client with ambulating, transfer activities, and the use of assistive devices like mechanical lifts, walkers, wheelchair, commode chair, braces, and prosthesis.&nbsp; Perform special delegated procedures including taking vital signs and weight, feeding, measuring intake and output, and assisting patient/client with self-administered medications.&nbsp; These activities require a variety of physical demands, including, but not limited to, those outlined in Working Conditions and Essential Functions below, and reliable attendance at scheduled assignment.&nbsp;</li> <li>Perform light housekeeping, meal preparation and other support services as part of the plan of care.&nbsp; This includes duties such as menu planning and shopping lists, running errands, preparing meals including special diets, presenting food, and cleaning dishes, appliances, and work area afterwards, going shopping, dusting, laundry, vacuuming, general cleaning of bathroom, kitchen, and living area when part of the written plan of care.&nbsp; Such activities include using a wide variety of household equipment and home appliances and the physical demands, including but not limited to those as outlined in Working Conditions and Essential Functions of this Job Description.</li> <li>Observe the patient&rsquo;s/client&rsquo;s condition, behavior, appearance, and hygiene needs, living arrangements, and home environment while in the home and report and document changes or problems to the appropriate staff member.&nbsp;</li> <li>Write visit reports (Daily Activity Report, etc.) to accurately record the care provided in the home, and complete other forms to document the work of this position, including incident reports and time and attendance reports.&nbsp; Ensure the patient/client signs the Daily Activity Report and Time Sheets as instructed.&nbsp; Submit these reports on time.&nbsp;</li> <li>Maintain dependable attendance, be regularly available for assignments, and be timely for scheduled visits.&nbsp; Call the office for assignments often or when late for an assignment.</li> <li>Attend at least twelve (12) hours of in-service training annually.</li> <li>Adhere to agency policies and procedures.</li> <li>Maintain a valid NJ Board of Nursing Home Health Aide certification.</li> <li>Always protect and maintain patient/client and agency confidentiality.</li> <li>Maintain a professional image, good appearance, and personal hygiene.</li> <li>Accept assignments and be punctual.</li> <li>Attend agency meetings and training as directed.</li> <li>Perform other duties as assigned.</li> </ol> <p>&nbsp;</p> <p><u>WORKING ENVIRONMENT</u>:</p> <p>Work is in a variety of home environments.&nbsp; Frequent travel by car or public transportation throughout the service area is necessary.&nbsp; Tasks may involve exposure to blood, body fluids, or tissue (OSHA Category I) and household chemicals, dust, and disinfectants.&nbsp; This position routinely requires driving a car or independently using public transportation, lifting, bending, reaching, kneeling, pushing and pulling, stretching, standing, stooping, walking, walking up and down stairs, seeing, hearing, speaking, writing, reading, carrying, weight bearing activities, and the use of a wide assortment of large and small home appliances.</p> <p>&nbsp;</p> <p><u>JOB RELATIONSHIPS</u>:</p> <p>Supervised by: Director of Nursing/ Nursing Supervisor</p> <p>&nbsp;</p> <p><u>RISK EXPOSURE</u>:</p> <p>High risk: <u>LIFTING REQUIREMENTS</u>:</p> <p>Ability to perform the following tasks if necessary:</p> <ul> <li>Ability to participate in physical activity.</li> <li>Ability to work for extended period of time while standing and being involved in physical activity.</li> <li>Heavy lifting.</li> <li>Ability to do extensive bending, lifting and standing on a regular basis.</li> </ul> <p>I have read the above job description and fully understand the conditions set forth therein, and if employed as a Certified Home Health Aide, I will perform these duties to the best of my knowledge and ability.</p> <p>&nbsp;</p> <p>&nbsp;</p></>),

    hhaTitle: "Homemaker Home Health Aide Service Agreement",
    hhaText: (<><p>Parties to this agreement are E Neighbor Home Care and the individual (&ldquo;Homemaker Home Health Aide&rdquo; or &ldquo;HHHA&rdquo;) whose signatures appear below and who for full consideration, given and received, each intending to be legally bound, agree with one another as follows:</p> <ol> <li>The scope of home care services for E Neighbor Home Care the HHHA may perform when placed with patient/client has been explained to Homemaker Home Health Aide (See Job Description on Page 3 below). HHHA agrees s/he will follow all E Neighbor Home Care requirements, as well as all Federal and State rules and regulations (e.g. HIPPAA requirements and all other requirements noted in the Employee Handbook) in providing home care to E Neighbor Home Care patients/clients, including regular communication with the Office and participating in training exercises.</li> <ul style={{marginTop: '14px', marginBottom: '14px'}}> <li>E Neighbor Home Care assigns Home Health Aides for personal care, companionship, and homemaking services. HHHAs must give 24-hour notice for schedule changes and cannot leave assignments without company instructions, except for approved appointments or errands. They cannot take patients off the premises without permission.</li> </ul> <li>HHHA agrees to call in and out using patient&rsquo;s/client&rsquo;s home phone at start/end of each shift and complete a weekly time sheet and activity log of the total hours worked and duties performed. The HHHA will have the timesheet/ activity log signed by the patient/client. Any changes in scheduling, patient/client needs, or necessary work arrangements should be reported E Neighbor Home Care .The time sheets/activity logs are to be e-mailed to E Neighbor Home Care at the close of each weekly assignment. Live-in workers agree to accept room and board offered at the work site as part of their compensation package.</li> <li>For and in consideration of benefits received, HHHA agrees to release E Neighbor Home Care and their officers, directors, employees, all patients/clients and any third party(s) from any and all potential or actual claims, liability, loss and/or damages incurred or claimed to be associated with this Agreement including all services to patients/clients, excepting gross negligence only.</li> <li>HHHA agrees to work with patients/clients only through E Neighbor Home Care with referral and placement, starting and stopping services at the direction of E Neighbor Home Care .If services are stopped for any reason Homemaker home health Aide agrees to leave the patient&rsquo;s/client&rsquo;s care and home and not work with that patient/client in any way other than with E Neighbor Home Care for a period of three (3) years. HHHA understands that it is illegal for me to transfer or attempt to transfer any case to another Agency or take ownership of any job that HHHA is employed in.</li> <li>Employment with E Neighbor Home Care is temporary and at-will, and can be terminated at any time by either party. There is no guarantee of hours, type of work, conditions, or duration of employment. E Neighbor Home Care can change policies, compensation, and conditions without notice. Upon termination, the Home Health Aide must return all company property and confidential information.</li> <li>Homemaker Home Health Aide also agrees (to): <ol style={{marginTop: '14px', marginBottom: '14px'}}> <li>All services provided to patients shall be in accordance the Plan of Care.Further, the services may not be altered in type, scope or duration, except by specific orders (in writing) issued as a result of changes made by the RN.</li> <li>Unless otherwise stated, live in Home Health Aides&rsquo; schedule will generally consist of a 16-hour day with three (3) scheduled hour-long breaks per day as outlined on the live in time and activity sheet provided.</li> <li>Follow E Neighbor Home Care's Fraud, Ethics, and Compliance policies, including zero fraud tolerance, respect for patients and their property, and Non-Conflict of Interest/Non-Compete Clauses. Fraud results in immediate dismissal and possible legal action.</li> <li>Not accept monetary or other gifts from patients or family members without the company&rsquo;s explicit approval.</li> <li>Restrict use of electronic devices (cell phone, laptop, tablets, etc) to emergency needs while on duty</li> <li>Not smoke in or too close to the patient&rsquo;s/client&rsquo;s home</li> <li>Not to dispose of ANY items or property belonging to the patients/clients without getting their explicit permission to do so.</li> <li>Guests and visitors are not permitted in the patient&rsquo;s home without the patient&rsquo;s and company&rsquo;s approval.</li> <li>Be responsible for his/her own transportation to and from assignments.</li> <li>Immediately notify E Neighbor Home Care and be prepared to leave the assignment if s/he is experiencing any contagious condition (flu, cold, fever, etc.) and not return until s/he has fully recovered and is symptom free. (A doctor&rsquo;s note may be required).</li> <li>Adhere to E Neighbor Home Care professional attire code (per attachment provided).</li> </ol> Uphold E Neighbor Home Care&rsquo;s standards of excellence, integrity, and respect, and maintain a professional image&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; in behavior, appearance, attitude, and decorum at all times.</li> <li>I acknowledge that I have been informed about the New Jersey <em>Consumer&rsquo;s Guide to Homemaker-Home Health Aides</em> published by the New Jersey Board of Nursing which I can read via the internet (<a href="http://www.njconsumeraffairs.gov">njconsumeraffairs.gov</a>) or request hardcopy from E Neighbor Home Care.</li> <li>The parties aim to resolve disputes through mutual and voluntary settlement. If a dispute arises and cannot be settled through negotiation, it will first be submitted to non-binding arbitration by the American Arbitration Association before considering binding arbitration, litigation, or other dispute resolution methods.</li> <li>It is agreed that this agreement shall be governed by, construed and enforced in accordance with the laws of the state of New Jersey.</li> <li>This agreement shall constitute the entire agreement between the parties and any prior understanding of representation of any kind preceding the date of this agreement shall not be binding upon either party except to the extent incorporated in this agreement.</li> <li>Any changes to this agreement must be in writing and signed by both parties or agreed to by email. Failure to follow this agreement, engaging in unprofessional behavior, or actions conflicting with the company's interests (such as unauthorized monetary transactions, arguing with or disrespecting clients or their families, using clients' addresses for personal purposes, or getting involved in clients' personal affairs) can lead to disciplinary actions, including dismissal. E Neighbor Home Care will not tolerate such behavior and may also take disciplinary actions, including dismissal, for any violations</li> <ul style={{marginTop: '14px', marginBottom: '14px'}}> <li>Abuse or exploitation, of any kind, of patient/client, property or family members. Furthermore, Home Health Aides are required to report any observation of abuse, neglect or exploitation of patients/clients.</li> <li>Failure to fulfill requirements of the assignment</li> <li>Failure to advise supervisor of reportable incidents</li> <li>Falsification of Documents (Personal information/Employment record per application or current work)</li> <li>Illegal drug use of any kind and consumption or being under the influence of alcohol while on duty</li> <li>Sexual harassment</li> <li>Excessive tardiness/absenteeism</li> <li>Failure to respect patient&rsquo;s/client&rsquo;s privacy per HIPPAA regulations or to comply with any other regulations</li> <li>Insubordination &nbsp;</li> </ul> </ol> <p>I have read and understand this Agreement; by signing and printing my name here I agree to be bound by it.&nbsp;&nbsp;&nbsp;&nbsp;</p></>),
    
    empHandbookTitle: "Employee Handbook Signature Page",
    empHandbookText: (<><p>The Employee Handbook contains important information about the Agency, and I understand that I should consult the Agency&rsquo;s CEO or my supervisor, regarding any questions not answered in the handbook. I have entered into my employment relationship with the Agency voluntarily as an at-will employee and understand that there is no specified length of employment. Accordingly, either the Agency or I can terminate the relationship at will, at any time, with or without cause, and with or without advance notice.</p> <p>&nbsp;</p> <p>Since the information, policies, and benefits described herein are subject to change at any time, and I acknowledge that revisions to the handbook may occur. All such changes will generally be communicated through official notices, and I understand that revised information may supersede, modify, or eliminate existing policies. Only the CEO of the Agency has the ability to adopt any revisions to the policies in this handbook.</p> <p>&nbsp;</p> <p>Furthermore, I understand that this handbook is neither a contract of employment nor a legally binding employment agreement. I have had an opportunity to read the handbook, and I understand that I may ask my supervisor any questions I might have concern the handbook. I accept the terms of the handbook. I also understand that it is my responsibility to comply with the policies contained in this handbook and any revisions made to it.</p> <p>&nbsp;</p> <p>I further agree that if I remain with the Agency following any modifications to the handbook, I hereby accept and agree to such changes.</p> <p></p> <p>I understand that I am obligated to read the entire handbook and comply with E Neighbor Homecare LLC. Policies and Procedures as outlined in this handbook.</p> <p>&nbsp;</p></>),
    empHandbookAgree: "I have received a hard copy of the Employee Handbook on the date listed below.",
    empHandbookAgree2: "I have received an electronic copy of the Employee Handbook on the date listed below.", 

    tbQuesTitle: "Annual TB Screening Questionnaire",
    tbQuesInfo: "This form is completed annually for those employees who have documentation of a negative chest x-ray following a positive Mantoux screening test, and whose medical evaluation and chest x-ray indicate that no further Mantoux screening is required.",
    tbQuesQ1: "bad cough that lasts longer than 2 weeks",
    tbQuesQ2: "coughing up sputum (phlegm)",
    tbQuesQ3: "coughing up blood",
    tbQuesQ4: "loss of appetite",
    tbQuesQ5: "weakness/fatigue/tiredness",
    tbQuesQ6: "night sweats",
    tbQuesQ7: "unexplained weight loss",
    tbQuesQ8: "fever",
    tbQuesQ9: "chills",
    tbQuesQ10: "chest pain",
    tbQuesTemp: "Do you experience",
    tbQuesTemp1: "Have you recently spent time with someone who has infectious tuberculosis?",
    tbQuesTemp2: "Do you have any other complaints?",
    tbQuesTemp3: "The above health statements are accurate to the best of my knowledge. I have been in-serviced on the signs and symptoms of tuberculosis and been advised to seek medical care if any of the symptoms develop at any time.",

    hepBTitle: "Hepatitis B Virus Vaccine Consent/Declination",
    hepBChoice: "(Make only one choice)",
    hepBConsent1: "I consent to the administration of the Hepatitis B vaccine. I have been informed of the method of administration, the risks, complications, and expected benefits of the vaccine. I understand that the facility is not responsible for any reactions caused by the vaccine.",
    hepBConsent2: "I decline the Hepatitis B vaccination at this time. I understand that, by declining this vaccine, I continue to be at risk of acquiring Hepatitis B, a serious disease. If in the future I continue to have occupational exposure to blood or other potentially infectious materials, I can request to be vaccinated at no charge.",
    hepBInfo: "I have been informed of the symptoms and modes of transmission of bloodborne pathogens, including Hepatitis B virus (HBV). I know about the facility's infection control program and understand the procedure to follow if an exposure incident occurs. I understand that the Hepatitis B vaccine is available, at no cost, to employees whose job involves the risk of directly contacting blood or other potentially infectious material. I understand that vaccinations shall be given according to recommendations for standard medical practice in the community.",
    hepBChoice1: "Please make one selection",
    hepBDoc: "Documentation of Exclusion from Hepatitis B Vaccine",
    hepBLabel1: "I have previously received the complete series of the three injections of the Hepatitis B Vaccine. I do not have documentation of Hepatitis-B immunity and choose not to receive the vaccine. I release E Neighbor Homecare LLC from all liability for any hazards that may result from possible exposure to this disease.",
    hepBLabel2: "I have had a positive result in Hepatitis B antibody testing, which shows immunity to the virus.",
    hepBLabel3: "I have medical contraindications to the vaccine.",
    hepBLabel4: "I am at low risk and provide no direct patient care. I release E Neighbor Homecare LLC from all liability for any hazards that may result from possible exposure to this disease.",
    
    oshaIntroTitle: "OSHA Introduction",
    oshaIntroText: (<><p> The Occupational Safety and Health Administration (OSHA) is a federal organization within the Department of Labor created by the Occupational Safety and Health Act of 1970. The purpose of the Act is to assure, as far as possible, safe and healthy working conditions for American workers. OSHA is responsible for developing standards to help employers provide a safe workplace. </p> <p> Because occupational exposure to the Hepatitis B and AIDS viruses and other disease-causing agents carried by the blood is a threat to healthcare workers, OSHA has issued a regulation to help healthcare employers protect workers against the increased risk of occupational exposure. </p> <p>The regulation requires that:</p> <ul style={{ paddingLeft: '20px', marginTop: '10px' }}> <li>A written Exposure Control Plan be developed</li> <li>All at-risk employees are trained in the safety and prevention of occupational exposure</li> <li>Monitoring of employee compliance with Exposure Control Plan</li> </ul> <p> The following information is presented to acquaint you with specific guidelines and protocols required by E Neighbor Homecare LLC to meet the OSHA mandate and information related to the transmission of bloodborne pathogens. </p> <p>Compliance with the Exposure Control Plan guidelines is mandatory.</p> <p> Employees violating the guidelines and/or protocols of E Neighbor Homecare LLC Exposure Control Plan will be cited for the following second level disciplinary actions: </p> <ul style={{ paddingLeft: '20px' }}> <li>First Violation - Written warning by supervisor</li> <li>Second Violation - Disciplinary probation</li> <li>Third Violation - Termination</li> </ul></>),
    oshaIntroAgree: "I have read and understand my responsibility to be compliant with E Neighbor Homecare LLC OSHA and Safety policies and procedures and all applicable state/federal laws or regulations and also all Accrediting agencies.",

    oshaInfoTitle: "OSHA Information",
    oshaInfoInfo: "The following employee was classified according to work task exposure to certain body fluids as required by the current OSHA infection control standard:",
    oshaInfoCat: "OSHA CATEGORY (MUST ONLY SELECT CATEGORY)",
    oshaInfoCat1T: "Category I",
    oshaInfoCat1: " – Involves tasks or procedures in which all or some staff have a reasonable likelihood of contact with blood or other potentially infectious materials. The use of job-appropriate personal protective equipment and other protective measures is required.",
    oshaInfoCat2T: "Category II",
    oshaInfoCat2: " – Tasks and work assignments involve no routine exposure to blood or other potentially infectious material, but employment may require unplanned Category I tasks. (Example: In an emergency, receiving-transporting specimens) appropriate personal protective device must be available, and these staff must be familiar with protective measures.",
    oshaInfoCat3T: "Category III",
    oshaInfoCat3: " – Tasks and work assignments involve no exposure to blood or other potentially infectious materials. Employment should NEVER require Category I or Category II tasks or duties.",
    oshaInfoAgree: "I understand my OSHA category and understand my responsibilities in abiding by the national standard of safety practices and E Neighbor Homecare LLC policies and procedures regarding safety in the workplace.",

    horizonTitle: "Horizon Criminal History Background Check Questions for Employees",
    horizonInfo: "The questions below should be asked of all employees/providers with direct physical access to MLTSS members and updated on an annual basis. The questions below are for illustrative purposes only and need not be submitted to Horizon NJ Health.",
    horizonQues1: "Have you ever been convicted of, pled guilty to or pled nolo contendere to any felony in the last ten years or been found liable or responsible for or named as a defendant in any civil offense that is reasonably related to your qualifications, competence, functions or duties as a medical professional?",
    horizonQues2: "Have you ever been convicted of, pled guilty to or pled nolo contendere to any felony in the last ten years or been found liable or responsible for or named as a defendant in any civil offense that is alleged fraud, an act of violence, child abuse or sexual offense or sexual misconduct?",
    horizonQues3: "Have you ever been indicted in any criminal suit?",
    horizonQues4: "Have you ever been court martialed for actions related to your duties as a medical professional?",
    horizonQues5: "Are you currently engaged in the illegal use of drugs? (“Currently” means sufficiently recent to justify a reasonable belief that the use of drugs may have an ongoing impact on one’s ability to practice medicine. It is not limited to the day of, or within a matter of days or weeks before the date of an application, rather that it has occurred recently enough to indicate the individual is actively engaged in such conduct. “Illegal use of drugs” refers to the drugs whose possession or distribution is unlawful under the Controlled Substances Act, 21 U.S.C. § 812.2. It does not include the use of a drug taken under supervision of a licensed health care professional, or other uses authorized by the Controlled Substances Act or other provision of federal law.” The term does include, however, the unlawful use of prescription controlled substances.)",
    horizonQues6: "Do you use any chemical substances that would in any way impair or limit your ability to perform the functions of your job with reasonable skill and safety?",
    horizonQues7: "Do you have any reason to believe that you would pose a risk to the safety or well­being of your clients?",
  },
  zh: {
    personalInfo: "个人信息",
    firstName: "名",
    lastName: "姓",
    dateOfSubmission: "提交日期",
    dateOfBirth: "出生日期",
    ssn: "社会安全号码",
    streetAddress: "街道地址",
    streetAddress2: "街道地址第二行",
    city: "城市",
    state: "州",
    zip: "邮政编码",
    phone: "电话号码",
    email: "电子邮箱",
    dateAvailable: "可开始工作日期",
    employmentType: "工作类型",
    position: "职位",

    employmentEligibility: "就业资格",
    usCitizen: "您是美国公民吗？",
    workAuth: "如果不是，您是否被授权在美国工作？",
    felony: "您是否曾被判重罪？",
    felonyExplain: "如果是，请解释：",
    sName: "学校名称",
    sFrom: "起始年份",
    sAddress: "学校地址",
    sTo: "结束年份",
    sGraduate: "是否毕业？",
    sDegree: "学历",
    signatureDate: "签名日期",
    signature: "签名",
    clearSignature: "清除签名",
    signatureInstruction: "点击/拖动以签名",
    submit: "提交",
    education: "受教育水平",

    references: "推荐人",
    fullName: "全名",
    relation: "关系",
    referenceAddress: "地址",
    referencePhone: "电话",

    previousEmployment: "工作经历",
    employerName: "雇主名称",
    employerPhone: "电话",
    employerAddress: "地址",
    jobTitle: "职位名称",
    employmentFrom: "起始日期",
    employmentTo: "结束日期",
    responsibilities: "职责",
    reasonForLeaving: "离职原因",
    mayWeContact: "我们可以联系您以前的主管吗？",

    emergencyContact: "紧急联系人",
    emergencyFullName: "全名",
    emergencyRelation: "关系",
    emergencyPhone: "电话",
    emergencyAddress: "地址",

    disclaimer: "免责声明与同意条款",
    disclaimerText: "在下方签名即表示我已阅读、理解并同意本就业申请中提供的所有信息、政策、声明及同意内容。我确认在整个申请过程中所提供的所有答案与信息，均在我所知范围内真实且完整。我理解，此签名适用于并确认本文件中包含的所有先前声明、协议、披露内容及表格。我进一步确认，我的电子签名具有与手写签名同等的法律效力和可执行性，并同意根据《美国全球与国家商业电子签名法案（E-SIGN 法案）》以电子方式签署本申请。",
    agreeCheckbox: "我同意上述条款。",

    employeeApplication: "员工申请表",
    workedHereBefore: "您以前在这家药房工作过吗？",
    ifSoWhen: "如果是，具体时间？",
    educationRefsEmployment: "教育背景、工作经历",
    emergencyContactInfo: "推荐人和紧急联系人信息",
    next: "下一步",
    previous: "上一步",

    yes: "是",
    no: "否",
    enterFirstName: "请输入您的名字",
    enterLastName: "请输入您的姓氏",
    relationshipToYou: "与您的关系",
    pleaseSelect: "请选择",
    fullTime: "全职",
    partTime: "兼职",
    temporary: "临时",

    employeeName: "申请人姓名",
    generalDate: "日期",

    backgroundCheckText: (
      <>
        <p><strong><u>通知</u></strong></p>
        <p>E Neighbor Homecare LLC 特此通知：在申请加入 E Neighbor Homecare LLC 期间，将进行背景调查。此类背景调查包括但不限于：</p>
        <ol>
          <li>犯罪背景调查</li>
          <li>性犯罪者记录查询</li>
          <li>联邦监察总署（OIG）记录查询</li>
          <li>联邦合同与资助系统（SAM）记录查询</li>
        </ol>

        <p><strong><u>授权</u></strong></p>
        <p>本人特此授权 E Neighbor Homecare LLC 进行上述背景调查。为此，我也授权执法机构和/或私人背景调查机构协助 E Neighbor Homecare LLC 收集相关信息。</p>
        <p>我明白，逮捕记录、待决指控和/或定罪记录并不自动构成就业障碍。此类信息将用于判断背景调查结果是否与我履行职责的可信度或安全性有合理关系。</p>

        <p><strong><u>声明</u></strong></p>
        <p>据我所知，此通知及授权书以及所附文件中提供的信息真实且完整。我理解，任何虚假陈述或遗漏信息都可能导致我失去该职位，或成为终止我与 E Neighbor Homecare LLC 雇佣关系的依据。</p>
        <p>通过下方签名，我授权 E Neighbor Homecare LLC 进行犯罪背景调查，并确认我已被告知《公平信用报告法案》（Fair Credit Reporting Act）所赋予的权利概要。</p>
        <p>此外，我理解：如因背景调查结果导致负面就业决定，我有权在收到通知后三个工作日内提出申诉，E Neighbor Homecare LLC 将在收到申诉后七个工作日内作出决定。</p>
      </>
    ),
    backgroundCheckConfirm: "我已阅读并同意上述有关背景调查的条款。",
    backgroundCheckTitle: "背景调查通知与授权",

    confidentialityTitle: "保密与不披露协议",
    confidentialityText: (
  <>
    <p>本 HIPAA（员工）保密协议（以下简称“协议”）由 E Neighbor Homecare LLC 与 __ ____________（员工）签署，旨在防止员工未经授权披露机密信息（定义见下文）。双方同意如下条款：</p>

    <strong>1. 个人健康信息</strong>
    <p>在雇佣期间，员工可能会接触到与 E Neighbor Homecare LLC 客户或病人相关的个人健康信息（“PHI”）。PHI 可能包括病历、账单、财务记录或任何可识别个人身份的健康信息。PHI 受《健康保险可携性与责任法案》（“HIPAA”）保护。HIPAA 仅允许在“有必要知情”情况下访问 PHI。因此，除非获得授权，任何故意访问 PHI 或绕过 PHI 安全协议的行为均被禁止。</p>

    <p><strong>我同意遵守以下 HIPAA 隐私与安全规则：</strong></p>
    <ul>
      <li>在使用或披露常规受保护健康信息时遵循“最低必要披露标准”。</li>
      <li>仅访问您被授权的患者信息，包括电子版和纸质版本。</li>
      <li>仅使用分配给您的用户 ID 登录，并且一次仅登录一台设备。若获得配发的笔记本或其他含机密信息的设备，须始终保持其安全。</li>
      <li>在日常工作中保持对身份可识别健康信息的保密性与敏感性。</li>
      <li>除用于治疗、支付或运营目的外，不得披露病人信息。</li>
      <li>按照机构流程响应患者对其个人记录的请求。</li>
      <li>将商业伙伴违反 HIPAA 的行为上报给指定隐私官。</li>
      <li>报告任何意外访问了不应访问的 PHI 情况。</li>
      <li>参加初始 HIPAA 培训，以及机构就联邦/州 HIPAA 法规修订或机构隐私与安全政策变更所提供的后续培训。</li>
      <li>未经管理员/首席执行官批准，不得下载或安装游戏、数据或软件。</li>
      <li>设置复杂的唯一密码，并按要求定期更改。</li>
      <li>销毁所有机密资料（包括电话留言等）前必须粉碎。</li>
      <li>遵守 E Neighbor Homecare LLC 的隐私与保密政策及流程。</li>
    </ul>

    <strong>2. 机密信息</strong>
    <p>“机密信息”包括 PHI 以及 E Neighbor Homecare LLC 的业务专有信息，包括但不限于：医疗和财务记录、收入、识别号、账户名、PIN 和密码，或以书面或口头形式明确表示为机密的信息。</p>

    <strong>3. 保密义务</strong>
    <p>未经 E Neighbor Homecare LLC 事先书面同意，员工不得：(a) 向任何第三方披露机密信息（无论以电子、口头或书面形式）；(b) 复制或允许复制机密信息；(c) 使用机密信息；或 (d) 以违反法律（包括 HIPAA）规定的方式使用或披露机密信息。</p>

    <strong>4. 返还机密资料</strong>
    <p>应 E Neighbor Homecare LLC 要求，员工须立即归还所有原始材料以及与机密信息相关的副本、笔记和文件。</p>

    <strong>5. 协议期限</strong>
    <p>本协议的保密条款在雇佣终止、取消、到期或其他结束情形后继续有效，除非双方另有书面协议或 E Neighbor Homecare LLC 书面通知解除义务。</p>

    <strong>6. 免责通知</strong>
    <p>若个人因举报涉嫌违法行为而向联邦、州或地方政府官员或律师披露商业秘密，不应因违反任何商业秘密法律而承担民事或刑事责任。此外，若因举报行为遭雇主报复提起诉讼，个人可将商业秘密提供给律师并用于法律程序，前提是：(i) 所含商业秘密的文件以密封形式提交；(ii) 除法院命令外不予披露。</p>

    <strong>7. 一般条款</strong>
    <p>
      <strong>(a) 合作关系：</strong>本协议任何条款均不得视为双方构成合作、合资或雇佣关系。<br />
      <strong>(b) 可分割性：</strong>若协议某条被判无效，其余部分仍有效并尽可能实现双方原意。<br />
      <strong>(c) 完整协议：</strong>本协议为双方对该主题完整的理解，替代先前所有协议与陈述。任何修改必须书面并由双方签署。<br />
      <strong>(d) 权利放弃：</strong>未行使权利不构成对该权利的放弃。<br />
      <strong>(e) 禁令救济：</strong>若员工违反本协议泄露机密信息，E Neighbor 有权申请法院禁令救济及其他补偿。<br />
      <strong>(f) 律师费用：</strong>与本协议有关的法律争议中，胜诉方可要求赔偿合理律师费用与支出。<br />
      <strong>(g) 适用法律：</strong>本协议适用 E Neighbor Homecare LLC 所在州法律。<br />
      <strong>(h) 管辖权：</strong>双方同意将因本协议产生的争议提交至有管辖权的联邦或州法院，并放弃其他可能 venue 的权利。
    </p>
  </>
),
  confidentialityConfirm: "我已阅读并同意上述保密与不披露协议。",
  adherenceTitle: "遵守政策与程序、联邦和州法规、认证标准、法律、指导方针与员工培训",
  adherenceText: (
    <>
      <p>我明白可以查阅政策和程序手册的副本，并且我理解阅读这些政策是我的责任。我也同意遵守 E Neighbor Homecare LLC 的政策和程序、联邦/州法律法规、认证机构要求以及国家实践标准。如有任何疑问或需要澄清的内容，我将向管理员/首席执行官咨询。</p>
      <p>我明白我有责任保持技能和知识，以符合 E Neighbor Homecare LLC 的服务范围和任何服务提供者的要求。</p>
      <p>我明白政策或程序手册中的任何内容均不构成 E Neighbor Homecare LLC 与其员工、承包商或志愿者之间的合同关系。</p>
      <p>我明白我有义务按计划参加服务，并按 E Neighbor Homecare LLC 要求参加年度培训，以确保遵守新的或修订的政策和程序。</p>
    </>
  ),
  adherenceAgree: "我已阅读并同意上述保密与不披露协议。",
  conflictTitle: "利益冲突披露",
  conflictText: (
  <>
    <p>我已获得一份 E Neighbor Homecare LLC 的利益冲突披露政策的副本/相关信息，并已阅读和理解其内容。</p>
    <p>以下问题旨在帮助您确定是否存在任何可能与本机构事务产生利益冲突的外部关系。请仔细阅读每个问题，并在后面的空格中简洁明了地作答。如对问题含义有疑问，请尽您所能作答，并注明疑问的原因。</p>
    
    <p><strong>术语表</strong></p>
    <p><em>竞争者：</em> 指以出售产品和/或服务与本机构构成竞争关系的个人。</p>
    <p><em>家庭成员：</em> 配偶、父母、子女、兄弟姐妹、姻亲以及与您同住的人。</p>
    <p><em>采购方：</em> 指任何购买、租赁、以其他方式获取、或曾经从本机构购买、租赁、获取任何商品、材料、货品、物资、设备或专业及其他服务的个人。</p>
    <p><em>个人：</em> 指自然人、公司、合伙企业、信托、法人实体或其他商业组织。</p>
    <p><em>供应商：</em> 指任何向本机构或代表本机构出售、租赁、提供或承诺提供物资、设备、不动产、信贷、保险或其他服务（包括专业服务）的人，或曾有此类行为的人。</p>
  </>
  ),
  conflictCertify: "我特此声明我拥有以下情况：所有权、招待、礼物、贷款：",
  conflictFurthermore: "此外，我明白我有责任报告任何可能被视为与 E Neighbor Homecare LLC 存在利益冲突或可能构成利益冲突的关系",
  conflictAgree1: "我承认，有责任将任何潜在的利益冲突告知公司的合规官。",
  conflictAgree2: "本人承认并证明上述回答据本人所知是真实且准确的。",

  ethicsTitle: "商业行为与道德规范准则",
  ethicsText: (
    <>
      <p>我们业务的成功取决于员工、客户和股东对我们的信任和信心。我们通过履行承诺、展现诚实与正直，并以光明正大的行为实现公司目标来赢得信誉。说我们应该做什么很容易，但真正的考验在于我们的行动。最终，人们会根据我们的行为来评判我们。</p>
      <p>&nbsp;</p>
      <p>E Neighbor Homecare LLC 对诚信的承诺始于遵守我们经营所在地的法律、法规和规定。此外，我们每个人都必须了解适用于自己岗位的公司政策、法律、规则和法规。如果我们不确定某项计划中的行为是否被法律或公司政策允许，应当向管理员或首席执行官咨询。我们有责任防止违法行为，并在发现潜在违规时及时提出。</p>
      <p>&nbsp;</p>
      <p>基于高道德原则的良好判断力将指导您在可接受行为的边界内做出决定。如果遇到难以判断正确行为的情形，应立即与直属主管讨论。</p>
      <p>在E Neighbor Homecare LLC雇佣本人作为员工的前提下，本人同意：（1）在E Neighbor Homecare LLC 工作期间，不向其患者推销或试图影响其更换服务提供商；（2）在雇佣关系终止后的三个月内，不为在过去六个月中本人所服务的患者提供服务；（3）对所有病人记录、病人信息、药房商业机密、电脑密码、电话访问码及其他任何密码或机密信息予以保密；（4）保持与客户、供应商和服务提供方的专业边界；（5）忠诚服务，并以值得公众持续信任和信赖的方式行事。</p>
      <p>&nbsp;</p>
      <p>作为E Neighbor Homecare LLC 的信息用户，您可能会开发、使用或维护（1）病人信息（用于医疗、质量改进、同行评审、教育、账单、报销、行政管理、研究等目的），（2）员工信息（用于雇佣、薪资或其他业务用途），或（3）E Neighbor Homecare LLC 及第三方的机密商业信息，包括第三方软件及其他许可产品或流程。无论来源或形式，包括纸质记录、口头沟通、音频录音或电子显示等，该信息均为严格保密。只有在“需知基础”上才能访问，并限于完成使用、披露或请求目的所需的最小信息量。</p>
      <p>&nbsp;</p>
      <p>为避免利益冲突，我们必须确保对E Neighbor Homecare LLC 的决策是客观和公正的。有时我们的个人或家庭利益可能与公司决策发生冲突。我们必须始终将E Neighbor Homecare LLC 的合法利益置于首位。禁止利用公司财产或信息谋取个人利益，或挪用商业机会为个人谋利。</p>
      <p>我同意遵守E Neighbor Homecare LLC 的政策和程序手册。我理解这些政策和程序可能会更改，且我有责任了解更新内容并予以遵守。</p>
      <p>所有员工必须遵守本商业道德政策。违反本政策可能导致纪律处分，包括解雇。未经授权使用或泄露机密信息可能导致个人承担民事或刑事责任。我同意遵守保密声明及E Neighbor Homecare LLC 的隐私和信息安全政策，我将认真阅读。如果我违反了这些条款，E Neighbor Homecare LLC 有权寻求赔偿。</p>
      <p><strong>我同意阅读E Neighbor Homecare LLC 的合规及商业道德政策。如有疑问，我会向我的主管提出。 </strong></p>
      <p><strong>以下签名、打印姓名和日期代表本人接受E Neighbor Homecare LLC 合规与商业道德政策和程序的条款。</strong></p>
      <p>&nbsp;</p>
    </>
  ),
  ethicsAgreeText: "我已阅读、确认并同意遵守上述所有条款、政策和规定。",
  driverTitle: "驾驶员合规确认",
  driverText: (<>  
    <p>我理解，在 E Neighbor Homecare LLC 的业务中驾驶车辆，意味着在工作过程中驾驶个人车辆或由 E Neighbor Homecare LLC 拥有/租赁的车辆（即除上下班通勤外的任何驾驶行为），或在我因业务驾驶而获得车辆津贴或里程报销的情况下。</p>
    <p>&nbsp;</p>
    <p>我了解我必须持有所在州有效且当前的驾驶执照。我还了解，如果我的工作职责需要商业驾驶执照（CDL），我必须在入职时向主管提交汽车保险证明（保险声明页或保单副本）。我了解州法律要求所有代表 E Neighbor Homecare LLC 执行业务的员工、合同工或志愿者在使用个人汽车时必须具备最低限度的汽车保险覆盖。</p>
    <p>&nbsp;</p>
    <p>我确认我已按所在州法律要求购买了汽车保险，并同意在整个雇佣期间维持有效保险覆盖。E Neighbor Homecare LLC 有权在任何时间要求我提供保险证明。</p>
    <p>&nbsp;</p>
    <p>如果我发生任何显著改变我驾驶记录的交通违规，我同意立即通知我的主管。我理解，如果我的驾驶记录被归类为高风险和/或不可接受，公司可能会对我进行纪律处分（包括解雇）。</p>
    <p>&nbsp;</p>
    <p>我了解我的驾驶记录可在任何时间被药房管理层审核。</p>
  </>),
  drugfreeTitle: "零毒品工作场所政策",
  drugfreeText: (<>
    <p>E Neighbor Homecare LLC 在禁止使用、持有和分发毒品方面维持一个零毒品的工作环境。</p>
    <p>所有员工在工作场所内禁止非法持有或使用受控物质或任何酒精饮品。员工也禁止在工作场所内非法制造、分发或配给受控物质。</p>
    <p>所有员工在入职前将接受药物测试。如果检测结果为阳性，E Neighbor Homecare LLC 将把样本送至独立实验室进行进一步检测。如果检测结果依然为阳性，E Neighbor Homecare LLC 将不会雇佣该员工。</p>
    <p>当组织或其客户有合理理由相信药物或酒精政策被违反时，员工可能会被要求进行合理怀疑的尿检。</p>
    <p>任何违反此政策的行为都将导致纪律处分，<strong>包括</strong>终止雇佣关系。</p>
    <p>我确认并理解 E Neighbor Homecare LLC 是一个零毒品的工作场所，并了解公司对在工作场所使用或受毒品或酒精影响的行为实行零容忍政策。</p>
    <p>&nbsp;</p>
  </>),
  alcTestTitle: "雇员协议与药物及/或酒精检测同意书",
  alcTestText: (<><p>本人，_______________________________，在 E Neighbor Homecare LLC（以下简称“公司”）的药物/酒精检测政策下提出要求时，同意接受药物或酒精检测，并提供本人尿液、呼气和/或血液样本以供分析。我理解并同意，如果我在任何时候拒绝根据公司政策接受药物或酒精检测，或以任何方式未能配合检测程序，我将面临立即解雇。我进一步授权并完全允许 E Neighbor Homecare LLC 和/或其指定医生将所收集的样本送至实验室进行筛查检测，以检查是否存在政策中禁止的任何物质，并授权实验室或其他检测机构将与该检测有关的任何及全部文件提供给 E Neighbor Homecare LLC 和/或参与与该检测相关的法律程序或调查的任何政府机构。最后，我授权 E Neighbor Homecare LLC 将与该检测相关的任何文件提供给参与与该检测相关的法律程序或调查的任何政府机构。</p> <p>&nbsp;</p> <p>我理解，只有公司正式授权的管理人员、雇员和代理人才能获取与该检测相关的信息。公司将最大程度地维护和保护该信息的机密性，并仅在作出雇佣决定以及回应来自政府机构的询问或通知时共享这些信息。</p> <p>&nbsp;</p> <p>我同意免除并使 E Neighbor Homecare LLC 执行检测的工作人员、公司指定医生及任何检测实验室免于承担任何责任。我不会起诉或追究这些方因检测对我可能造成的任何所谓损害的责任，包括因药物或酒精检测而导致的失业或任何其他形式的不利工作结果，即使 E Neighbor Homecare LLC 或实验室代表在检测的实施、分析或结果报告过程中发生错误。</p> <p>&nbsp;</p> <p>该政策和授权已用我理解的语言向我解释，并且我已被告知，如果我对检测或政策有任何疑问，将会得到解答。</p> <p>&nbsp;</p> <p>我理解，每当我涉及与工作相关的事故/意外、与工作相关的机动车事故或工作中受伤时，公司将根据该政策要求进行药物筛查和/或酒精检测。</p></>),
  alcTestF1: "我可能正在服用以下药物/草药",
  alcTestF2: "批号",
  alcTestF3: "有效期",
  alcTestF4: "检测结果",
  alcTestF5: "阴性",
  alcTestF6: "阳性",
  alcTestF7: "签名缩写",

  chhaTitle: "认证家庭护理助理——工作概要与确认书",
  chhaText: (<><p><u>工作概要</u>：认证家庭护理助理（CHHA）的工作旨在支持病人/客户的安全、尊严、健康，以及在家中生活的能力。CHHA 需前往病人/客户的住所，在专业护士的监督下，根据书面护理计划提供直接护理服务，内容包括个人护理、梳洗打理、协助行走、特殊护理程序、家务服务、准备膳食、清洁家务，以及协助完成其他日常生活活动。认证家庭护理助理由注册护士（RN）监督，本岗位不承担监督他人的职责。CHHA 在 HIPAA 限制下可访问部分病人/客户信息，是按小时计薪的临时直接护理人员，每周工作时长无最低保证。</p> <p>&nbsp;</p> <p><u>任职资格</u>：</p> <ol> <li>拥有高中毕业文凭或 GED，或具备能胜任本职位职责和核心工作功能的教育及生活经验的合理组合。</li> <li>持有新泽西州护理委员会颁发的家庭护理助理有效证书。</li> <li>愿意在服务区域内出行，包括能驾车并持有有效驾照及汽车保险，或能独立使用公共交通工具出行。</li> <li>具备良好的沟通能力与成熟的态度。</li> <li>诚实、可靠，并能胜任本职位的体力要求。</li> </ol> <p>&nbsp;</p> <p><u>岗位职责</u>：</p> <ol> <li>前往病人/客户住所，阅读并理解护理计划，按书面护理计划提供直接护理服务。护理内容包括：为病人/客户提供个人护理（如洗澡、口腔护理、修剪指甲、头发及皮肤护理、剃须）、按指示进行锻炼、协助穿衣与如厕（包括便盆使用）、协助行走及转移、使用辅助设备（如机械升降机、助行器、轮椅、便椅、支架和假肢）。执行特别授权程序，包括测量生命体征和体重、喂食、记录摄入与排出量、协助病人/客户自行服药。这些活动涉及多种体力要求，包括但不限于本职位描述中“工作环境”和“核心功能”部分列明的内容，并需按时出勤。</li> <li>按护理计划进行轻家务、备餐及其他支持性服务，包括菜单计划和购物清单、外出办事、准备膳食（包括特殊饮食）、呈上餐食并清洁餐具、电器及工作区域、购物、除尘、洗衣、吸尘、清洁浴室、厨房及居住区等。这些任务包括使用多种家用设备和电器，并涉及与本职位描述中“工作环境”和“核心功能”部分相符的体力要求。</li> <li>在家中观察病人/客户的健康状况、行为、外貌、卫生需求、居住安排和家庭环境，并将变化或问题报告并记录给相关工作人员。</li> <li>撰写探访记录（如《日常活动报告》），准确记录在家中提供的护理，并填写本职位相关的其他表格（包括事件报告、考勤报告等）。确保病人/客户按指示签署《日常活动报告》和工时单，并按时提交这些报告。</li> <li>保持可靠出勤，定期接受任务分配，并按时到达预约探访地点。如迟到需致电办公室报告，并经常致电办公室获取任务安排。</li> <li>每年参加至少 12 小时的在职培训。</li> <li>遵守机构的政策与程序。</li> <li>保持新泽西州护理委员会家庭护理助理证书的有效性。</li> <li>时刻保护并维护病人/客户及机构的机密信息。</li> <li>保持专业形象、良好的仪表及个人卫生。</li> <li>接受分配任务并准时到岗。</li> <li>按指示参加机构会议和培训。</li> <li>完成其他分配的任务。</li> </ol> <p>&nbsp;</p> <p><u>工作环境</u>：</p> <p>工作地点为多种家庭环境。需频繁驾车或乘坐公共交通工具在服务区域内出行。工作中可能接触血液、体液或组织（OSHA I 类）、家庭化学用品、灰尘及消毒剂。本职位常规要求：驾驶、独立乘坐公共交通、搬运、弯腰、伸手、跪下、推拉、伸展、站立、弯腰低头、行走、上下楼梯、视听交流、书写阅读、搬运物品、负重活动，以及使用各种大中小型家用电器。</p> <p>&nbsp;</p> <p><u>工作关系</u>：</p> <p>直接上级：护理主任/护理主管</p> <p>&nbsp;</p> <p><u>风险暴露</u>：</p> <p>高风险：<u>搬运要求</u>：</p> <p>如有需要，须具备以下能力：</p> <ul> <li>能够参与体力活动。</li> <li>能够长时间站立并进行体力劳动。</li> <li>能够搬运重物。</li> <li>能够经常进行大量弯腰、搬运和站立。</li> </ul> <p>本人已阅读并完全理解上述职位描述中的各项条件，如受聘为认证家庭护理助理，将尽本人所知所能履行这些职责。</p></>),

  hhaTitle: "家庭护理助理服务协议",
  hhaText: (<><p>本协议的双方为 <strong>E Neighbor Home Care</strong> 与下方签名的个人（“家庭护理助理”或“HHHA”），双方在充分考虑、互相给予并收到报酬的前提下，意图受法律约束，达成如下协议：</p> <ol> <li>已向家庭护理助理说明 HHHA 在分配至病人/客户时可执行的居家护理服务范围（见下文第3页工作描述）。HHHA 同意在为 E Neighbor Home Care 病人/客户提供居家护理时，将遵守 E Neighbor Home Care 的所有要求，以及所有联邦和州的规章制度（例如 HIPAA 要求及员工手册中列明的其他要求），包括与办公室的定期沟通及参与培训。</li> <ul style={{marginTop: '14px', marginBottom: '14px'}}> <li>E Neighbor Home Care 分配家庭护理助理提供个人护理、陪护及家务服务。HHHA 对于排班变动必须提前24小时通知，未经公司指示不得擅自离开任务，除非为经批准的约会或差事。未经许可不得带病人离开住所。</li> </ul> <li>HHHA 同意在每次班次开始和结束时，使用病人/客户的家庭电话进行报到，并完成每周的工时表及活动日志，记录总工作时间及所执行的任务。HHHA 需让病人/客户在工时表/活动日志上签名。如排班、病人/客户需求或工作安排有任何变动，应及时向 E Neighbor Home Care 报告。每周任务结束时，应将工时表/活动日志通过电子邮件提交给 E Neighbor Home Care。住家型工作人员同意接受工作地点提供的食宿作为薪酬的一部分。</li> <li>作为获得福利的对价，HHHA 同意解除 E Neighbor Home Care 及其高管、董事、员工、所有病人/客户及任何第三方在本协议相关服务中可能产生或声称产生的所有潜在或实际索赔、责任、损失及/或损害的责任，唯不包括重大过失。</li> <li>HHHA 同意仅通过 E Neighbor Home Care 的推荐和分配与病人/客户工作，并按 E Neighbor Home Care 指示开始或结束服务。如因任何原因停止服务，家庭护理助理同意离开病人/客户的住所，并在三（3）年内不得以任何方式单独为该病人/客户提供服务，除非通过 E Neighbor Home Care。HHHA 理解，将任何个案转给其他机构或试图转移，或接管其所受聘的工作，是违法行为。</li> <li>在 E Neighbor Home Care 的雇佣为临时且随意性雇佣，双方均可随时终止。工作时长、工作类型、条件或雇佣期限不保证。E Neighbor Home Care 可在无需通知的情况下更改政策、薪酬及条件。终止时，家庭护理助理必须归还所有公司财产及保密信息。</li> <li>家庭护理助理还同意： <ol style={{marginTop: '14px', marginBottom: '14px'}}> <li>所有提供给病人的服务应符合护理计划。服务类型、范围或时长不得更改，除非经注册护士书面指示。</li> <li>除非另行说明，住家型家庭护理助理的排班通常为16小时/天，每天有三个小时长的休息时间，详见提供的住家时间及活动表。</li> <li>遵守 E Neighbor Home Care 的欺诈、道德及合规政策，包括零容忍欺诈、尊重病人及其财产、遵守利益冲突/竞业禁止条款。欺诈行为将导致立即解雇及可能的法律行动。</li> <li>未经公司明确批准，不得接受病人或其家属的金钱或其他礼物。</li> <li>值班期间限制使用电子设备（手机、笔记本、平板等）仅用于紧急情况。</li> <li>不得在病人/客户住所内或过近处吸烟。</li> <li>未经病人明确许可，不得处置病人/客户的任何物品或财产。</li> <li>未经病人和公司批准，不得接待访客进入病人住所。</li> <li>负责自行前往及返回工作地点的交通。</li> <li>若出现传染性疾病（流感、感冒、发烧等），须立即通知 E Neighbor Home Care 并准备离开工作任务，直至完全康复并无症状方可返回。（可能需提供医生证明）</li> <li>遵守 E Neighbor Home Care 的职业着装规范（见附件）。</li> </ol> 维护 E Neighbor Home Care 的卓越、诚信及尊重标准，并始终在行为、仪表、态度及礼仪上保持专业形象。</li> <li>我确认已获知新泽西州护理委员会发布的《家庭护理助理消费者指南》，可通过互联网（<a href="http://www.njconsumeraffairs.gov">njconsumeraffairs.gov</a>）阅读或向 E Neighbor Home Care 索取纸质版。</li> <li>双方旨在通过相互自愿的方式解决争议。如争议无法协商解决，将首先提交美国仲裁协会进行非约束性仲裁，然后才考虑约束性仲裁、诉讼或其他争议解决方式。</li> <li>本协议适用并应按新泽西州法律解释及执行。</li> <li>本协议构成双方之间的完整协议，之前任何形式的口头或书面理解均不具约束力，除非已纳入本协议中。</li> <li>对本协议的任何修改必须以书面形式经双方签署或通过电子邮件同意。未遵守本协议、行为不专业或与公司利益冲突（如未经授权的金钱交易、与病人或家属争吵或不尊重、使用病人地址作私人用途、参与病人私人事务等）可能导致纪律处分，包括解雇。E Neighbor Home Care 不容忍此类行为，并可对任何违规行为采取纪律处分，包括解雇。 <ul style={{marginTop: '14px', marginBottom: '14px'}}> <li>对病人/客户、其财产或家庭成员的任何形式的虐待或剥削。此外，家庭护理助理须报告观察到的任何虐待、疏忽或剥削行为。</li> <li>未履行任务要求</li> <li>未向主管报告可报告事件</li> <li>文件造假（个人信息/就业记录等）</li> <li>值班期间使用非法药物或饮酒</li> <li>性骚扰</li> <li>频繁迟到/旷工</li> <li>未遵守 HIPAA 或其他法规保护病人隐私</li> <li>不服从指令</li> </ul> </li> </ol> <p>我已阅读并理解本协议；通过在此签名和打印姓名，我同意受其约束。</p></>),

  empHandbookTitle: "员工手册签名页",
  empHandbookText: (<><p>员工手册包含有关本机构的重要信息，我理解如手册中有任何未解答的问题，应咨询本机构的首席执行官（CEO）或我的主管。我自愿以随意雇佣（at-will）形式与本机构建立雇佣关系，并理解雇佣期限不固定。因此，本机构或我均可随时以任何理由或无理由终止雇佣关系，且无需提前通知。</p> <p>&nbsp;</p> <p>由于本手册中描述的信息、政策和福利可能随时发生变化，我承认手册可能会进行修订。所有此类更改通常会通过正式通知进行传达，我理解修订后的信息可能取代、修改或取消现有政策。本机构首席执行官（CEO）为唯一有权对本手册中的政策进行修订的人士。</p> <p>&nbsp;</p> <p>此外，我理解本手册既不是雇佣合同，也不是具有法律约束力的雇佣协议。我已获得阅读手册的机会，并理解如对手册有任何疑问，可向我的主管提出。我接受手册中的条款，并理解遵守手册及其任何修订内容为我的责任。</p> <p>&nbsp;</p> <p>我进一步同意，如果在手册修改后仍继续为本机构工作，即表示我接受并同意这些更改。</p> <p>&nbsp;</p> <p>我理解我有义务完整阅读手册，并遵守 E Neighbor Homecare LLC 在手册中规定的政策与程序。</p> <p>&nbsp;</p></>),
  empHandbookAgree: "我已于下方所列日期收到员工手册的纸质版本。",
  empHandbookAgree2: "我已于下方所列日期收到员工手册的电子版本。", 

  tbQuesTitle: "年度结核病筛查问卷",
  tbQuesInfo: "本表格每年填写一次，适用于那些在阳性曼图（Mantoux）筛查后，已提供阴性胸片证明的员工，且其医疗评估和胸片结果显示无需进一步进行曼图筛查。",
  tbQuesQ1: "持续超过两周的严重咳嗽",
  tbQuesQ2: "咳痰",
  tbQuesQ3: "咳血",
  tbQuesQ4: "食欲减退",
  tbQuesQ5: "虚弱/疲劳/困倦",
  tbQuesQ6: "夜间出汗",
  tbQuesQ7: "不明原因的体重减轻",
  tbQuesQ8: "发热",
  tbQuesQ9: "寒战",
  tbQuesQ10: "胸痛",
  tbQuesTemp: "您是否有以下症状",
  tbQuesTemp1: "您最近是否与感染性结核病患者有接触?",
  tbQuesTemp2: "您还有其他不适或症状吗?",
  tbQuesTemp3: "据我所知，上述健康声明内容准确。我已接受过有关结核病的体征和症状的培训，并已被告知，如果在任何时候出现相关症状，应及时就医。",
  
  hepBTitle: "乙型肝炎疫苗接种同意/拒绝书",
  hepBChoice: "(仅可选择一项)",
  hepBConsent1: "我同意接种乙型肝炎（Hepatitis B）疫苗。我已被告知疫苗的接种方法、可能的风险、并发症以及预期的益处。我理解机构对疫苗引起的任何反应不承担责任。",
  hepBConsent2: "我此时拒绝接种乙型肝炎疫苗。我理解，通过拒绝接种疫苗，我仍然有感染乙型肝炎的风险，这是一种严重的疾病。如果将来我仍然在职业中接触血液或其他潜在传染性物质，我可以申请免费接种疫苗。",
  hepBInfo: "我已被告知血源性病原体（包括乙型肝炎病毒 HBV）的症状及传播途径。我了解本机构的感染控制计划，并清楚在发生暴露事件时应遵循的程序。我明白，对于工作中可能直接接触血液或其他潜在感染性物质的员工，乙型肝炎疫苗可免费接种。我理解疫苗接种应按照社区标准医疗实践的建议进行。",
  hepBChoice1: "请仅选择一项",
  hepBDoc: "乙型肝炎疫苗接种豁免记录",
  hepBLabel1: "我之前已完成乙型肝炎疫苗三针系列的接种。我没有乙型肝炎免疫证明，并选择不接种疫苗。我免除 E Neighbor Homecare LLC 对因可能接触该疾病而产生的任何风险的所有责任。",
  hepBLabel2: "我的乙型肝炎抗体检测结果为阳性，显示我对该病毒具有免疫力。",
  hepBLabel3: "我有接种疫苗的医学禁忌症。",
  hepBLabel4: "我属于低风险人群，不直接提供病人护理。我免除 E Neighbor Homecare LLC 对因可能接触该疾病而产生的任何风险的所有责任。",
  
  oshaIntroTitle: "职业安全与健康管理局（OSHA）简介",
  oshaIntroText: (<><p>
  职业安全与健康管理局（OSHA）是美国劳工部下属的联邦机构，由1970年《职业安全与健康法案》设立。该法案的目的是尽可能确保美国工人的安全与健康工作环境。OSHA负责制定标准，帮助雇主提供安全的工作场所。
</p>
<p>
  由于职业暴露于乙型肝炎病毒、艾滋病病毒（AIDS）以及血液携带的其他致病因子，对医护人员构成威胁，OSHA发布了相关规定，帮助医疗机构保护员工，降低职业暴露风险。
</p>
<p>该规定要求：</p>
<ul style={{ paddingLeft: '20px', marginTop: '10px' }}>
  <li>制定书面的暴露控制计划（Exposure Control Plan）</li>
  <li>对所有高风险员工进行职业暴露安全与预防培训</li>
  <li>监控员工对暴露控制计划的遵守情况</li>
</ul>
<p>
  以下信息用于使您了解 E Neighbor Homecare LLC 为满足 OSHA 要求而制定的具体指导方针和操作流程，以及与血源性病原体传播相关的信息。
</p>
<p>遵守暴露控制计划的指导方针是强制性的。</p>
<p>
  违反 E Neighbor Homecare LLC 暴露控制计划的指导方针和/或操作流程的员工，将按以下二级纪律处分处理：
</p>
<ul style={{ paddingLeft: '20px' }}>
  <li>第一次违规 – 由主管发出书面警告</li>
  <li>第二次违规 – 纪律观察期</li>
  <li>第三次违规 – 解雇</li>
</ul>
</>),
  oshaIntroAgree: "我已阅读并理解我有责任遵守 E Neighbor Homecare LLC 的 OSHA 与安全政策及程序，以及所有适用的州/联邦法律法规和所有认证机构的相关要求。",

  oshaInfoTitle: "OSHA 信息",
  oshaInfoInfo: "以下员工已根据其工作任务接触特定体液的情况进行分类，以符合现行 OSHA 感染控制标准的要求：",
  oshaInfoCat: "OSHA 类别（只能选择一个类别）",
  oshaInfoCat1T: "类别 I",
  oshaInfoCat1: " – 涉及所有或部分员工有合理可能接触血液或其他潜在感染性物质的任务或操作。需使用与工作相关的个人防护装备及其他保护措施。",
  oshaInfoCat2T: "类别 II",
  oshaInfoCat2: " – 任务和工作分配通常不涉及接触血液或其他潜在感染性物质，但工作可能需要临时执行类别 I 的任务（例如：紧急情况下接收或运输样本）。应提供适当的个人防护设备，且员工必须熟悉防护措施。",
  oshaInfoCat3T: "类别 III",
  oshaInfoCat3: " – 任务和工作分配不涉及接触血液或其他潜在感染性物质。工作不应要求执行类别 I 或类别 II 的任务。",
  oshaInfoAgree: "我已了解我的 OSHA 类别，并理解我在遵守国家安全操作标准及 E Neighbor Homecare LLC 工作场所安全政策和程序方面的责任。",

  horizonTitle: "Horizon 员工刑事背景调查问题",
  horizonInfo: "以下问题应询问所有与 MLTSS 成员有直接身体接触的员工/提供者，并每年更新一次。以下问题仅供参考，无需提交给 Horizon NJ Health。",
  horizonQues1: "您在过去十年内是否曾因重罪被定罪、认罪或提出无争辩答辩，或是否因与您作为医疗专业人员的资质、能力、职能或职责相关的民事案件而被认定负有责任或列为被告？",
  horizonQues2: "您在过去十年内是否曾因重罪被定罪、认罪或提出无争辩答辩，或是否因涉嫌欺诈、暴力行为、虐待儿童或性犯罪/不当行为的民事案件而被认定负有责任或列为被告？",
  horizonQues3: "您是否曾因任何刑事案件被起诉？",
  horizonQues4: "您是否因与医疗专业职责相关的行为而受过军事法庭审判？",
  horizonQues5: "您目前是否从事非法用药行为？（“目前”指足够近期，可合理认为药物使用可能对行医能力产生持续影响。不限于申请当日或申请前几天或几周，而是近期发生到足以表明个人积极从事此类行为。 “非法用药”指根据《受控物质法》（21 U.S.C. § 812.2）禁止持有或分发的药物。不包括在持牌医疗专业人员监督下使用的药物或《受控物质法》或其他联邦法律授权的使用。该术语包括非法使用处方受控药物。）",
  horizonQues6: "您是否使用任何化学物质，这可能在任何程度上影响或限制您以合理技能和安全性执行工作职能的能力？",
  horizonQues7: "您是否有任何理由认为自己可能对客户的安全或福祉构成风险？",

  },
};

const radioStyle = (selected) => ({
    accentColor: '#4f46e5',
    WebkitAppearance: 'none',
    appearance: 'none',
    width: '16px',
    height: '16px',
    borderRadius: '50%',
    border: '2px solid #4f46e5',
    backgroundColor: selected ? '#4f46e5' : 'white',
    outline: 'none',
    marginRight: '8px',
    cursor: 'pointer',
  });

const canvasStyle = {
  width: '100%',
  height: '200px', // or responsive size
  border: '2px solid #e5e7eb',
  borderRadius: '8px',
  backgroundColor: '#fff',
};


const t = (key, language) => translations[language]?.[key] || key;



const ProgressBar = ({ currentPage, totalPages }) => {
  const progressStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e5e7eb',
    borderRadius: '4px',
    marginBottom: '24px',
    overflow: 'hidden'
  };

  const fillStyle = {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: '4px',
    width: `${(currentPage / totalPages) * 100}%`,
    transition: 'width 0.3s ease'
  };

  return (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '16px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <h1 style={{ 
          fontSize: 'clamp(20px, 5vw, 28px)', 
          fontWeight: 'bold', 
          color: '#1f2937', 
          margin: 0 
        }}>
          E Neighbor Employee Application
        </h1>
        <span style={{ 
          fontSize: '14px', 
          color: '#6b7280', 
          fontWeight: '500',
          whiteSpace: 'nowrap'
        }}>
          Step {currentPage} of {totalPages}
        </span>
      </div>
      <div style={progressStyle}>
        <div style={fillStyle}></div>
      </div>
    </div>
  );
};

const App = () => {
  const sigRef = useRef();
  const [currentPage, setCurrentPage] = useState(1);
  const today = new Date().toISOString().split('T')[0];
  const [language, setLanguage] = useState("en");
  const [isSignatureMissing, setIsSignatureMissing] = useState(true);
  const [formData, setFormData] = useState({
    // Page 1 - Personal Information
    firstName: "",
    lastName: "",
    date: new Date().toISOString().split("T")[0],
    dob: "",
    ssn: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    phone: "",
    email: "",
    dateAvailable: "",
    employmentType: "",
    position: "",

    // Page 2 - Employment Eligibility
    usCitizen: "",
    workAuth: "",
    felony: "",
    felonyExplain: "",

    // Page 3 - Education
    collegeName: "",
    collegeAddress: "",
    collegeFrom: "",
    collegeTo: "",
    collegeGraduate: "",
    collegeDegree: "",

    // Page 3 - Previous Employment 1
    prevEmployer1: "",
    prevPhone1: "",
    prevAddress1: "",
    prevJobTitle1: "",
    prevFrom1: "",
    prevTo1: "",
    prevResponsibilities1: "",
    prevReason1: "",
    prevContact1: "",

    // Page 3 - Previous Employment 2
    prevEmployer2: "",
    prevPhone2: "",
    prevAddress2: "",
    prevJobTitle2: "",
    prevFrom2: "",
    prevTo2: "",
    prevResponsibilities2: "",
    prevReason2: "",
    prevContact2: "",

    // Page 4 - References
    ref1Name: "",
    ref1Relation: "",
    ref1Address: "",
    ref1Phone: "",
    ref2Name: "",
    ref2Relation: "",
    ref2Address: "",
    ref2Phone: "",

    // Page 4 - Emergency Contact
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    emergencyAddress: "",

    // Page 5 - Disclaimer & Signature
    sigDateDisclaimer: "",
    signatureDisclaimer: "",

    // Page 6 - Background Check
    backgroundCheckName: "",
    backgroundCheckDate: new Date().toISOString().split("T")[0],
    agreeBackgroundCheck: false,
    signatureBackground: "",

    // Page 7 - Confidentiality NDA
    confidentialityEmployeeName: "",
    confidentialityDate: new Date().toISOString().split("T")[0],
    agreeConfidentiality: false,
    signatureConfidentiality: "",

    // Page 8 - Policy & Training
    policyTrainingName: "",
    policyTrainingDate: new Date().toISOString().split("T")[0],
    agreePolicyTraining: false,

    // Page 9 - Conflict of Interest
    conflictName: "",
    conflictDate: new Date().toISOString().split("T")[0],
    conflictQ1: "",
    conflictQ1Explain: "",
    conflictQ2: "",
    conflictQ2Explain: "",
    conflictQ3: "",
    conflictQ3Explain: "",
    conflictQ4: "",
    conflictQ4Explain: "",
    agreeConflict1: false,
    agreeConflict2: false,

    // Page 10 - Ethics
    ethicsName: "",
    ethicsAgreement: false,
    ethicsDate: new Date().toISOString().split("T")[0],
    signatureEthics: "",

    // Page 11 - Driver Compliance
    driverName: "",
    driverDate: new Date().toISOString().split("T")[0],
    signatureDriver: "",

    // Page 12 - Drug-Free Policy
    drugFreeName: "",
    drugFreeDate: new Date().toISOString().split("T")[0],
    signatureDrugFree: "",

    // Page 13 - Drug Testing Consent
    drugConsentName: "",
    drugConsentDate: new Date().toISOString().split("T")[0],
    drugsHerbals: "",
    lotNumber: "",
    expirationDate: new Date().toISOString().split("T")[0],
    results: "",
    isNegative: false,
    isPositive: false,
    initials: "",

    // Page 14 - CHHA Summary
    chhaEmployeeName: "",
    chhaSignatureDate: new Date().toISOString().split("T")[0],
    signatureCHHA: "",

    // Page 15 - HHHA Agreement
    hhhaEmployeeName: "",
    hhhaEmployeeDate: new Date().toISOString().split("T")[0],
    signatureHHHA: "",

    // Page 16 - Handbook
    handbookAgreement1: "",
    handbookAgreement2: "",
    handbookDate: new Date().toISOString().split("T")[0],
    handbookPrintedName: "",
    receivedHandbookHardcopy: false,
    receivedHandbookElectronic: false,
    signatureHandbook: "",

     // Page 17 - TB Annual Screening Questionnaire
  tbQ1: "",
  tbQ2: "",
  tbQ3: "",
  tbQ4: "",
  tbQ5: "",
  tbQ6: "",
  tbQ7: "",
  tbQ8: "",
  tbQ9: "",
  tbQ10: "",
  tbContact: "",
  tbOtherComplaints: "",
  tbOtherExplain: "",
  tbName: "",
  tbDate: new Date().toISOString().split("T")[0],

  // Page 18 - Hepatitis B Vaccine Form
  hepbDecision: "",
  hepbEmpName: "",
  hepbEmpDate: new Date().toISOString().split("T")[0],

  // Page 19 - OSHA Introduction
  oshaSignature: "",
  oshaDate: new Date().toISOString().split("T")[0],

  // Page 20 - Exposure Classification
  exposureCategory: "",
  exposureSignature: "",
  exposureDate: new Date().toISOString().split("T")[0],

  // Page 21 - Horizon Criminal History Background Check
  horizonQ1: "",
  horizonQ2: "",
  horizonQ3: "",
  horizonQ4: "",
  horizonQ5: "",
  horizonQ6: "",
  horizonQ7: "",
  horizonName: "",
  horizonDate: new Date().toISOString().split("T")[0],

  // Page 22 - Hepatitis B Consent/Declination
  hepbConsentChoice: "",
  hepbExclusionPrevSeries: false,
  hepbExclusionImmune: false,
  hepbExclusionMedical: false,
  hepbExclusionLowRisk: false,
  hepbConsentSignature: "",
  hepbConsentName: "",
  hepbConsentDate: new Date().toISOString().split("T")[0],
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [focusedInput, setFocusedInput] = useState(null);

  const totalPages = 21; // previously 4

  const formatSSN = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 9); // only digits, max 9
    const match = cleaned.match(/^(\d{0,3})(\d{0,2})(\d{0,4})$/);
    if (!match) return '';
    return [match[1], match[2], match[3]]
      .filter(Boolean)
      .join('-');
  };

  const formatPhone = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 10); // only digits, max 10
    const match = cleaned.match(/^(\d{0,3})(\d{0,3})(\d{0,4})$/);
    if (!match) return '';
    if (match[2]) {
      return `(${match[1]}) ${match[2]}${match[3] ? `-${match[3]}` : ''}`;
    } else if (match[1]) {
      return `(${match[1]}`;
    }
    return '';
  };

  // Adjust canvas resolution after it mounts
  useEffect(() => {
    if (currentPage === 21 && sigRef.current) {
      const canvas = sigRef.current.getCanvas();
      const ratio = window.devicePixelRatio || 1;

      // Scale canvas to match physical pixels
      canvas.width = canvas.offsetWidth * ratio;
      canvas.height = canvas.offsetHeight * ratio;
      canvas.getContext('2d').scale(ratio, ratio);
    }
  }, [currentPage]);


  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    let newValue = type === 'checkbox' ? checked : value;

      if (name === 'ssn') {
        newValue = formatSSN(value);
      } else if (name === 'phone' || name === 'emergencyPhone' || name.startsWith('prevPhone') || name === 'ref1Phone' || name === 'ref2Phone') {
        newValue = formatPhone(value);
      }

    setFormData((prev) => ({
      ...prev,
      [name]: newValue,
    }));

    // Clear validation error for this field if it exists
    setValidationErrors((prevErrors) => {
      if (!prevErrors[name]) return prevErrors;
      const updatedErrors = { ...prevErrors };
      delete updatedErrors[name];
      return updatedErrors;
    });
  };


  const handleClear = () => {
    sigRef.current.clear();
  };

  const validateCurrentPage = () => {
  const requiredFieldsByPage = {
    /*3: [
      'collegeName', 'collegeAddress', 'collegeFrom', 'collegeTo', 'collegeGraduate', 'collegeDegree',
      'prevEmployer1', 'prevPhone1', 'prevAddress1', 'prevJobTitle1',
      'prevContact1',
      'prevEmployer2', 'prevPhone2', 'prevAddress2', 'prevJobTitle2',
      'prevContact2',
    ],
    4: [
      // References (2 required)
      'ref1Name', 'ref1Relation', 'ref1Address', 'ref1Phone',
      'ref2Name', 'ref2Relation', 'ref2Address', 'ref2Phone',

      // Emergency Contact (1 required)
      'emergencyName', 'emergencyRelationship', 'emergencyPhone',
    ],
    5: ['backgroundCheckName', 'agreeBackgroundCheck'],
    6: ['confidentialityEmployeeName', 'confidentialityDate', 'agreeConfidentiality'],
    7: ['policyTrainingName', 'policyTrainingDate', 'agreePolicyTraining'],
    8: [
      'conflictName', 'conflictDate',
      'conflictQ1', 'conflictQ2', 'conflictQ3', 'conflictQ4',
      'agreeConflict1', 'agreeConflict2'
    ],
    9: ['ethicsName', 'ethicsDate', 'ethicsAgreement'],
    10: ['driverName', 'driverDate'],
    11: ['drugFreeName', 'drugFreeDate'],
    12: ['drugConsentName', 'drugConsentDate'],
    13: ['chhaEmployeeName', 'chhaSignatureDate'],
    14: ['hhhaEmployeeName', 'hhhaEmployeeDate'],
    15: ['handbookPrintedName', 'handbookDate', 'handbookAgreement1', 'handbookAgreement2'],
    16: [
      'tbQ1', 'tbQ2', 'tbQ3', 'tbQ4', 'tbQ5',
      'tbQ6', 'tbQ7', 'tbQ8', 'tbQ9', 'tbQ10',
      'tbContact', 'tbOtherComplaints',
      'tbName', 'tbDate'
    ],
    17: [
      'hepbConsentChoice',
      'hepbConsentName', 'hepbConsentDate'
      // exclusion checkboxes are optional
    ],
    18: ['oshaSignature', 'oshaDate'],
    19: ['exposureCategory', 'exposureSignature', 'exposureDate'],
    20: [
      'horizonQ1', 'horizonQ2', 'horizonQ3', 'horizonQ4',
      'horizonQ5', 'horizonQ6', 'horizonQ7',
      'horizonName', 'horizonDate'
    ],*/
  };


  const requiredFields = requiredFieldsByPage[currentPage] || [];
  const errors = {};

  requiredFields.forEach((field) => {
    if (
      formData[field] === undefined ||
      formData[field] === "" ||
      formData[field] === false
    ) {
      errors[field] = "This field is required";
    }
  });

  setValidationErrors(errors);
  return Object.keys(errors).length === 0;
};


  const handleNext = () => {
    if (!validateCurrentPage()) return;

    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }

    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }

    if (currentPage === 15) {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      fetch('https://application-forms-backend.onrender.com/api/ping', {
      //fetch('http://localhost:3001/api/ping', {
        method: 'GET',
        signal: controller.signal,
      })
        .then((res) => {
          if (res.ok) {
            console.log('✅ Backend pinged on page 15');
          } else {
            console.warn('⚠️ Ping error status:', res.status);
          }
        })
        .catch((err) => {
          console.error('❌ Ping failed:', err);
        })
        .finally(() => clearTimeout(timeoutId));
    }
  };


  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
    if (window.innerWidth <= 768) {
      window.scrollTo({ top: 0, behavior: 'auto' });
    }
  };

const handleSubmit = async () => {
  const signature = sigRef.current.getCanvas().toDataURL("image/png");
  const fullData = { ...formData,  hepbExclusionPrevSeries: formData.hepbExclusion === 'hepbExclusionPrevSeries',
    hepbExclusionImmune: formData.hepbExclusion === 'hepbExclusionImmune', 
    hepbExclusionMedical: formData.hepbExclusion === 'hepbExclusionMedical',
    hepbExclusionLowRisk: formData.hepbExclusion === 'hepbExclusionLowRisk', signature };
  if(!isSignatureMissing){
    try {
      const response = await fetch("https://application-forms-backend.onrender.com/api/save-form", {
      //const response = await fetch("http://localhost:3001/api/save-form", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(fullData)
      });

      const result = await response.json();
      console.log(result);
      alert("Application submitted successfully!");

    } catch (err) {
      console.error("Submission failed", err);
      alert("Failed to submit the form.");
    }
  }else{
    alert("Please write your signature on this page for confirmation!");
  }
};

// Helper function to check if field has error
const hasError = (fieldName) => {
  return validationErrors && validationErrors[fieldName];
};

// Helper function to get error message
const getErrorMessage = (fieldName) => {
  if (hasError(fieldName)) {
    return validationErrors[fieldName] || `${t("thisFieldRequired", language) || "This field is required"}`;
  }
  return null;
};


const containerStyle = {
  minHeight: '100vh',
  width: '100vw',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',
};


const isMobile = window.innerWidth <= 768;

const formContainerStyle = {
  width: isMobile ? '100vw' : '70vw',
  minHeight: '100vh',
  backgroundColor: 'white',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  borderRadius: isMobile ? '0px' : '20px',
  boxShadow: isMobile ? 'none' : '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
  margin: isMobile ? '0' : 'auto',
};

  const pageStyle = {
    opacity: 1,
    transform: 'translateX(0)',
    transition: 'all 0.3s ease',
    flex: 1,
    display: 'flex',
    flexDirection: 'column'
  };

  const inputGroupStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    fontSize: '14px',
    fontWeight: '600',
    color: 'black',
    marginBottom: '8px'
  };

  const inputStyle = {
    width: '100%',
    padding: '16px',
    borderRadius: '10px',
    border: '2px solid #e5e7eb',
    fontSize: '16px',
    color: '#374151',
    backgroundColor: 'white',
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    minHeight: '48px'
  };

  // Add this error style at the top with your other styles
  const errorStyle = {
    color: '#dc2626',
    fontSize: '14px',
    marginTop: '4px',
    display: 'block'
  };

  const inputErrorStyle = {
    ...inputStyle,
    borderColor: '#dc2626',
    borderWidth: '2px'
  };

  const inputFocusStyle = {
    ...inputStyle,
    borderColor: '#6366f1',
    outline: 'none',
    boxShadow: '0 0 0 3px rgba(99, 102, 241, 0.1)'
  };

  const buttonStyle = {
    padding: '16px 24px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    minWidth: '120px',
    minHeight: '48px',
    touchAction: 'manipulation'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#6366f1',
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#f3f4f6',
    color: '#374151',
    border: '2px solid #e5e7eb'
  };

  const buttonContainerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
    paddingTop: '24px',
    borderTop: '1px solid #e5e7eb',
    gap: '12px',
    flexWrap: 'wrap'
  };

  const signatureContainerStyle = {
    backgroundColor: '#f9fafb',
    padding: '20px',
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    marginBottom: '24px'
  };

  const clearButtonStyle = {
    fontSize: '14px',
    color: '#dc2626',
    fontWeight: '500',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    textDecoration: 'underline',
    marginTop: '12px',
    padding: '8px',
    touchAction: 'manipulation'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr',
    gap: '16px'
  };

  // Media query simulation for larger screens
  const isLargeScreen = window.innerWidth >= 640;
  const finalGridStyle = isLargeScreen ? {
    ...gridStyle,
    gridTemplateColumns: '1fr 1fr'
  } : gridStyle;

  const renderPage = () => {
    switch (currentPage) {
    case 1:
      return (
        <div style={pageStyle}>
          <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("personalInfo", language)} 
          </h2>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("firstName", language)} *</label>
              <input autoFocus={false} 
                type="text"
                name="firstName"
                placeholder={t("enterFirstName", language)} 
                value={formData.firstName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("lastName", language)} *</label>
              <input autoFocus={false} 
                type="text"
                name="lastName"
                placeholder={t("enterLastName", language)} 
                value={formData.lastName}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("dateOfSubmission", language)} *</label>
              <input autoFocus={false} 
                type="date"
                name="date"
                defaultValue={new Date().toISOString().split('T')[0]}
                value={formData.date}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("dateOfBirth", language)} *</label>
              <input autoFocus={false} 
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("ssn", language)} *</label>
            <input autoFocus={false} 
              type="text"
              name="ssn"
              placeholder="###-##-####"
              value={formData.ssn}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("streetAddress", language)} *</label>
            <input autoFocus={false} 
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("streetAddress2", language)} </label>
            <input autoFocus={false} 
              type="text"
              name="address2"
              value={formData.address2}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("city", language)}</label>
              <input autoFocus={false} 
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("state", language)}</label>
              <input autoFocus={false} 
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("zip", language)} </label>
            <input autoFocus={false} 
              type="text"
              name="zip"
              value={formData.zip}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("phone", language)}  *</label>
              <input autoFocus={false} 
                type="tel"
                name="phone"
                placeholder="(000) 000-0000"
                value={formData.phone}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("email", language)}  *</label>
              <input autoFocus={false} 
                type="email"
                name="email"
                placeholder="example@example.com"
                value={formData.email}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("dateAvailable", language)} </label>
              <input autoFocus={false} 
                type="date"
                name="dateAvailable"
                value={formData.dateAvailable}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentType", language)} </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                style={inputStyle}
              >
                <option value="">{t("pleaseSelect", language)} </option>
                <option value="full-time">{t("fullTime", language)}</option>
                <option value="part-time">{t("partTime", language)}</option>
                <option value="temporary">{t("temporary", language)}</option>
              </select>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("position", language)} </label>
            <input autoFocus={false} 
              type="text"
              name="position"
              value={formData.position}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
      );

    case 2:
      return (
        <div style={pageStyle}>
          <h2
            style={{
              color: "black",
              fontSize: '22px',
              fontWeight: '700',
              marginBottom: '24px'
            }}
          >
            {t("employmentEligibility", language)} 
          </h2>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("usCitizen", language)} </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{color: 'black'}}>
                <input autoFocus={false} 
                  type="radio"
                  name="usCitizen"
                  value="yes"
                  checked={formData.usCitizen === 'yes'}
                  onChange={handleChange}
                  style={{
                  accentColor: '#4f46e5', // ✅ Purple tint (change to your brand color)
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #4f46e5',
                  backgroundColor: formData.usCitizen === 'yes' ? '#4f46e5' : 'white',
                  outline: 'none',
                  marginRight: '8px',
                  cursor: 'pointer',
                  }}
                />
                &nbsp;{t("yes", language)} 
              </label>
              <label style={{color: 'black'}}>
                <input autoFocus={false} 
                  type="radio"
                  name="usCitizen"
                  value="no"
                  checked={formData.usCitizen === 'no'}
                  onChange={handleChange}
                  style={{
                  accentColor: '#4f46e5', // ✅ Purple tint (change to your brand color)
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #4f46e5',
                  backgroundColor: formData.usCitizen === 'no' ? '#4f46e5' : 'white',
                  outline: 'none',
                  marginRight: '8px',
                  cursor: 'pointer',
                  }}
                />
                &nbsp;{t("no", language)} 
              </label>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              {t("workAuth", language)} 
            </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{color: 'black'}}>
                <input autoFocus={false} 
                  type="radio"
                  name="workAuth"
                  value="yes"
                  checked={formData.workAuth === 'yes'}
                  onChange={handleChange}
                  style={{
                  accentColor: '#4f46e5', // ✅ Purple tint (change to your brand color)
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #4f46e5',
                  backgroundColor: formData.workAuth === 'yes' ? '#4f46e5' : 'white',
                  outline: 'none',
                  marginRight: '8px',
                  cursor: 'pointer',
                  }}
                />
                &nbsp;{t("yes", language)} 
              </label>
              <label style={{color: 'black'}}>
                <input autoFocus={false} 
                  type="radio"
                  name="workAuth"
                  value="no"
                  checked={formData.workAuth === 'no'}
                  onChange={handleChange}
                  style={{
                  accentColor: '#4f46e5', // ✅ Purple tint (change to your brand color)
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #4f46e5',
                  backgroundColor: formData.workAuth === 'no' ? '#4f46e5' : 'white',
                  outline: 'none',
                  marginRight: '8px',
                  cursor: 'pointer',
                  }}
                />
                &nbsp;{t("no", language)} 
              </label>
            </div>
          </div>

          {/*<div style={inputGroupStyle}>
            <label style={labelStyle}>
              {t("workedHereBefore", language)} 
            </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label>
                <input
                  type="radio"
                  name="workedHere"
                  value="yes"
                  checked={formData.workedHere === 'yes'}
                  onChange={handleChange}
                />
                &nbsp;{t("yes", language)} 
              </label>
              <label>
                <input
                  type="radio"
                  name="workedHere"
                  value="no"
                  checked={formData.workedHere === 'no'}
                  onChange={handleChange}
                />
                &nbsp;{t("no", language)} 
              </label>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("ifSoWhen", language)} </label>
            <input
              type="text"
              name="whenWorked"
              value={formData.whenWorked}
              onChange={handleChange}
              placeholder="MM/YYYY to MM/YYYY"
              style={inputStyle}
            />
          </div> */}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>
              {t("felony", language)} 
            </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{color: 'black'}}>
                <input autoFocus={false} 
                  type="radio"
                  name="felony"
                  value="yes"
                  checked={formData.felony === 'yes'}
                  onChange={handleChange}
                  style={{
                  accentColor: '#4f46e5', // ✅ Purple tint (change to your brand color)
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #4f46e5',
                  backgroundColor: formData.felony === 'yes' ? '#4f46e5' : 'white',
                  outline: 'none',
                  marginRight: '8px',
                  cursor: 'pointer',
                  }}
                />
                &nbsp;{t("yes", language)} 
              </label>
              <label style={{color: 'black'}}>
                <input autoFocus={false} 
                  type="radio"
                  name="felony"
                  value="no"
                  checked={formData.felony === 'no'}
                  onChange={handleChange}
                  style={{
                  accentColor: '#4f46e5', // ✅ Purple tint (change to your brand color)
                  WebkitAppearance: 'none',
                  appearance: 'none',
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  border: '2px solid #4f46e5',
                  backgroundColor: formData.felony === 'no' ? '#4f46e5' : 'white',
                  outline: 'none',
                  marginRight: '8px',
                  cursor: 'pointer',
                  }}
                />
                &nbsp;{t("no", language)} 
              </label>
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("felonyExplain", language)} </label>
            <textarea
              name="felonyExplain"
              value={formData.felonyExplain}
              onChange={handleChange}
              rows={3}
              style={inputStyle}
            />
          </div>
        </div>
      );

    // Case 3 with validation
    case 3:
      return (
        <div style={pageStyle}>
          <h2 style={{ fontSize: window.innerWidth <= 768 ? '28px' : '22px', fontWeight: '700', marginBottom: '24px', color: 'black'}}>
            {t("educationRefsEmployment", language)} 
          </h2>

          {/* --- EDUCATION --- */}
          <h3 style={{ color: 'black', fontSize: '18px', fontWeight: '600', marginTop: '8px', marginBottom: '12px' }}>{t("education", language)} </h3>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("sName", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              style={hasError('collegeName') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('collegeName') && <span style={errorStyle}>{getErrorMessage('collegeName')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("sAddress", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="collegeAddress"
              value={formData.collegeAddress}
              onChange={handleChange}
              style={hasError('collegeAddress') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('collegeAddress') && <span style={errorStyle}>{getErrorMessage('collegeAddress')}</span>}
          </div>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("sFrom", language)} <span style={{color: '#dc2626'}}>*</span></label>
              <input autoFocus={false} 
                type="date"
                name="collegeFrom"
                value={formData.collegeFrom}
                onChange={handleChange}
                style={hasError('collegeFrom') ? inputErrorStyle : inputStyle}
              />
              {getErrorMessage('collegeFrom') && <span style={errorStyle}>{getErrorMessage('collegeFrom')}</span>}
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("sTo", language)} <span style={{color: '#dc2626'}}>*</span></label>
              <input autoFocus={false} 
                type="date"
                name="collegeTo"
                value={formData.collegeTo}
                onChange={handleChange}
                style={hasError('collegeTo') ? inputErrorStyle : inputStyle}
              />
              {getErrorMessage('collegeTo') && <span style={errorStyle}>{getErrorMessage('collegeTo')}</span>}
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("sGraduate", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{color: 'black'}}>
                <input autoFocus={false} type="radio" name="collegeGraduate" value="yes" checked={formData.collegeGraduate === 'yes'} onChange={handleChange}
                  style={{
                    accentColor: '#4f46e5',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #4f46e5',
                    backgroundColor: formData.collegeGraduate === 'yes' ? '#4f46e5' : 'white',
                    outline: 'none',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}/>{t("yes", language)} 
              </label>
              <label style={{color: 'black'}}>
                <input autoFocus={false} type="radio" name="collegeGraduate" value="no" checked={formData.collegeGraduate === 'no'} onChange={handleChange}
                  style={{
                    accentColor: '#4f46e5',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #4f46e5',
                    backgroundColor: formData.collegeGraduate === 'no' ? '#4f46e5' : 'white',
                    outline: 'none',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}/>{t("no", language)} 
              </label>
            </div>
            {getErrorMessage('collegeGraduate') && <span style={errorStyle}>{getErrorMessage('collegeGraduate')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("sDegree", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="collegeDegree"
              value={formData.collegeDegree}
              onChange={handleChange}
              style={hasError('collegeDegree') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('collegeDegree') && <span style={errorStyle}>{getErrorMessage('collegeDegree')}</span>}
          </div>

          {/* --- PREVIOUS EMPLOYMENT 1 --- */}
          <h3 style={{ color: 'black', fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '12px' }}>{t("previousEmployment", language)} 1</h3>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerName", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="prevEmployer1"
              value={formData.prevEmployer1}
              onChange={handleChange}
              style={hasError('prevEmployer1') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevEmployer1') && <span style={errorStyle}>{getErrorMessage('prevEmployer1')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerPhone", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="tel"
              name="prevPhone1"
              value={formData.prevPhone1}
              onChange={handleChange}
              placeholder="(000) 000-0000"
              style={hasError('prevPhone1') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevPhone1') && <span style={errorStyle}>{getErrorMessage('prevPhone1')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerAddress", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="prevAddress1"
              value={formData.prevAddress1}
              onChange={handleChange}
              style={hasError('prevAddress1') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevAddress1') && <span style={errorStyle}>{getErrorMessage('prevAddress1')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("jobTitle", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="prevJobTitle1"
              value={formData.prevJobTitle1}
              onChange={handleChange}
              style={hasError('prevJobTitle1') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevJobTitle1') && <span style={errorStyle}>{getErrorMessage('prevJobTitle1')}</span>}
          </div>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentFrom", language)}</label>
              <input autoFocus={false} 
                type="date"
                name="prevFrom1"
                value={formData.prevFrom1}
                onChange={handleChange}
                style={hasError('prevFrom1') ? inputErrorStyle : inputStyle}
              />
              {getErrorMessage('prevFrom1') && <span style={errorStyle}>{getErrorMessage('prevFrom1')}</span>}
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentTo", language)}</label>
              <input autoFocus={false} 
                type="date"
                name="prevTo1"
                value={formData.prevTo1}
                onChange={handleChange}
                style={hasError('prevTo1') ? inputErrorStyle : inputStyle}
              />
              {getErrorMessage('prevTo1') && <span style={errorStyle}>{getErrorMessage('prevTo1')}</span>}
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("responsibilities", language)}</label>
            <textarea
              name="prevResponsibilities1"
              value={formData.prevResponsibilities1}
              onChange={handleChange}
              rows={3}
              style={hasError('prevResponsibilities1') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevResponsibilities1') && <span style={errorStyle}>{getErrorMessage('prevResponsibilities1')}</span>}
          </div>

        { /* <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("reasonForLeaving", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <textarea
              name="prevReason1"
              value={formData.prevReason1}
              onChange={handleChange}
              rows={3}
              style={hasError('prevReason1') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevReason1') && <span style={errorStyle}>{getErrorMessage('prevReason1')}</span>}
          </div> */}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("mayWeContact", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{color: 'black'}}>
                <input autoFocus={false} type="radio" name="prevContact1" value="yes" checked={formData.prevContact1 === 'yes'} onChange={handleChange}
                  style={{
                    accentColor: '#4f46e5',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #4f46e5',
                    backgroundColor: formData.prevContact1 === 'yes' ? '#4f46e5' : 'white',
                    outline: 'none',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}/>{t("yes", language)} 
              </label>
              <label style={{color: 'black'}}>
                <input autoFocus={false} type="radio" name="prevContact1" value="no" checked={formData.prevContact1 === 'no'} onChange={handleChange}
                  style={{
                    accentColor: '#4f46e5',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #4f46e5',
                    backgroundColor: formData.prevContact1 === 'no' ? '#4f46e5' : 'white',
                    outline: 'none',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}/>{t("no", language)} 
              </label>
            </div>
            {getErrorMessage('prevContact1') && <span style={errorStyle}>{getErrorMessage('prevContact1')}</span>}
          </div>

          {/* --- PREVIOUS EMPLOYMENT 2 --- */}
          <h3 style={{ color: 'black', fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '12px' }}>{t("previousEmployment", language)} 2</h3>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerName", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="prevEmployer2"
              value={formData.prevEmployer2}
              onChange={handleChange}
              style={hasError('prevEmployer2') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevEmployer2') && <span style={errorStyle}>{getErrorMessage('prevEmployer2')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerPhone", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="tel"
              name="prevPhone2"
              value={formData.prevPhone2}
              onChange={handleChange}
              placeholder="(000) 000-0000"
              style={hasError('prevPhone2') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevPhone2') && <span style={errorStyle}>{getErrorMessage('prevPhone2')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerAddress", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="prevAddress2"
              value={formData.prevAddress2}
              onChange={handleChange}
              style={hasError('prevAddress2') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevAddress2') && <span style={errorStyle}>{getErrorMessage('prevAddress2')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("jobTitle", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="prevJobTitle2"
              value={formData.prevJobTitle2}
              onChange={handleChange}
              style={hasError('prevJobTitle2') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevJobTitle2') && <span style={errorStyle}>{getErrorMessage('prevJobTitle2')}</span>}
          </div>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentFrom", language)}</label>
              <input autoFocus={false} 
                type="date"
                name="prevFrom2"
                value={formData.prevFrom2}
                onChange={handleChange}
                style={hasError('prevFrom2') ? inputErrorStyle : inputStyle}
              />
              {getErrorMessage('prevFrom2') && <span style={errorStyle}>{getErrorMessage('prevFrom2')}</span>}
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentTo", language)}</label>
              <input autoFocus={false} 
                type="date"
                name="prevTo2"
                value={formData.prevTo2}
                onChange={handleChange}
                style={hasError('prevTo2') ? inputErrorStyle : inputStyle}
              />
              {getErrorMessage('prevTo2') && <span style={errorStyle}>{getErrorMessage('prevTo2')}</span>}
            </div>
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("responsibilities", language)}</label>
            <textarea
              name="prevResponsibilities2"
              value={formData.prevResponsibilities2}
              onChange={handleChange}
              rows={3}
              style={hasError('prevResponsibilities2') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevResponsibilities2') && <span style={errorStyle}>{getErrorMessage('prevResponsibilities2')}</span>}
          </div>

          {/*<div style={inputGroupStyle}>
            <label style={labelStyle}>{t("reasonForLeaving", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <textarea
              name="prevReason2"
              value={formData.prevReason2}
              onChange={handleChange}
              rows={3}
              style={hasError('prevReason2') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('prevReason2') && <span style={errorStyle}>{getErrorMessage('prevReason2')}</span>}
          </div>*/}

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("mayWeContact", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label style={{color: 'black'}}>
                <input autoFocus={false} type="radio" name="prevContact2" value="yes" checked={formData.prevContact2 === 'yes'} onChange={handleChange} 
                  style={{
                    accentColor: '#4f46e5',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #4f46e5',
                    backgroundColor: formData.prevContact2 === 'yes' ? '#4f46e5' : 'white',
                    outline: 'none',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}
                  />{t("yes", language)} 
              </label>
              <label style={{color: 'black'}}>
                <input autoFocus={false} type="radio" name="prevContact2" value="no" checked={formData.prevContact2 === 'no'} onChange={handleChange} 
                  style={{
                    accentColor: '#4f46e5',
                    WebkitAppearance: 'none',
                    appearance: 'none',
                    width: '16px',
                    height: '16px',
                    borderRadius: '50%',
                    border: '2px solid #4f46e5',
                    backgroundColor: formData.prevContact2 === 'no' ? '#4f46e5' : 'white',
                    outline: 'none',
                    marginRight: '8px',
                    cursor: 'pointer',
                  }}
                  />{t("no", language)} 
              </label>
            </div>
            {getErrorMessage('prevContact2') && <span style={errorStyle}>{getErrorMessage('prevContact2')}</span>}
          </div>
        </div>
      );

    // Case 4 with validation
    case 4:
      return (
        <div style={pageStyle}>
          <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '5px' }}>
            {t("emergencyContactInfo", language)} 
          </h2>

          {/* --- REFERENCES --- */}
          {[1, 2].map((i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <h3 style={{ color: 'black', fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '12px' }}>{t("references", language)} {i}</h3>
              
              <div style={finalGridStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t("firstName", language)} <span style={{color: '#dc2626'}}>*</span></label>
                  <input autoFocus={false} 
                    type="text"
                    name={`ref${i}Name`}
                    value={formData[`ref${i}Name`]}
                    onChange={handleChange}
                    style={hasError(`ref${i}Name`) ? inputErrorStyle : inputStyle}
                  />
                  {getErrorMessage(`ref${i}Name`) && <span style={errorStyle}>{getErrorMessage(`ref${i}Name`)}</span>}
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t("relation", language)} <span style={{color: '#dc2626'}}>*</span></label>
                  <input autoFocus={false} 
                    type="text"
                    name={`ref${i}Relation`}
                    value={formData[`ref${i}Relation`]}
                    onChange={handleChange}
                    style={hasError(`ref${i}Relation`) ? inputErrorStyle : inputStyle}
                  />
                  {getErrorMessage(`ref${i}Relation`) && <span style={errorStyle}>{getErrorMessage(`ref${i}Relation`)}</span>}
                </div>
              </div>
              
              <div style={finalGridStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t("referenceAddress", language)} <span style={{color: '#dc2626'}}>*</span></label>
                  <input autoFocus={false} 
                    type="text"
                    name={`ref${i}Address`}
                    value={formData[`ref${i}Address`]}
                    onChange={handleChange}
                    style={hasError(`ref${i}Address`) ? inputErrorStyle : inputStyle}
                  />
                  {getErrorMessage(`ref${i}Address`) && <span style={errorStyle}>{getErrorMessage(`ref${i}Address`)}</span>}
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t("referencePhone", language)} <span style={{color: '#dc2626'}}>*</span></label>
                  <input autoFocus={false} 
                    type="tel"
                    name={`ref${i}Phone`}
                    placeholder="(000) 000-0000"
                    value={formData[`ref${i}Phone`]}
                    onChange={handleChange}
                    style={hasError(`ref${i}Phone`) ? inputErrorStyle : inputStyle}
                  />
                  {getErrorMessage(`ref${i}Phone`) && <span style={errorStyle}>{getErrorMessage(`ref${i}Phone`)}</span>}
                </div>
              </div>
            </div>
          ))}

          <h3 style={{ color: 'black', fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '12px' }}>{t("emergencyContact", language)} </h3>
          
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("emergencyFullName", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="emergencyName"
              placeholder={t("fullName", language)} 
              value={formData.emergencyName}
              onChange={handleChange}
              style={hasError('emergencyName') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('emergencyName') && <span style={errorStyle}>{getErrorMessage('emergencyName')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("emergencyRelation", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="text"
              name="emergencyRelationship"
              placeholder={t("relationshipToYou", language)} 
              value={formData.emergencyRelationship}
              onChange={handleChange}
              style={hasError('emergencyRelationship') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('emergencyRelationship') && <span style={errorStyle}>{getErrorMessage('emergencyRelationship')}</span>}
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("emergencyPhone", language)} <span style={{color: '#dc2626'}}>*</span></label>
            <input autoFocus={false} 
              type="tel"
              name="emergencyPhone"
              placeholder="(000) 000-0000"
              value={formData.emergencyPhone}
              onChange={handleChange}
              style={hasError('emergencyPhone') ? inputErrorStyle : inputStyle}
            />
            {getErrorMessage('emergencyPhone') && <span style={errorStyle}>{getErrorMessage('emergencyPhone')}</span>}
          </div>
        </div>
      );

    case 5:
      return (
        <div style={pageStyle}>
          <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("backgroundCheckTitle", language)}
          </h2>

          <div
            style={{
              backgroundColor: '#f3f4f6',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.6',
            }}
          >
            {t("backgroundCheckText", language)}
          </div>
          <FormControl
            required
            error={!!validationErrors.agreeBackgroundCheck}
            component="fieldset"
            sx={{ mb: 3 }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeBackgroundCheck"
                    checked={formData.agreeBackgroundCheck}
                    onChange={handleChange}
                    sx={{
                      mb: '0px',
                      ml: '8px',
                      mr: '4px',
                      padding: '0',
                      color: validationErrors.agreeBackgroundCheck ? '#dc2626' : '#d1d5db',
                      '&.Mui-checked': {
                        color: validationErrors.agreeBackgroundCheck ? '#dc2626' : '#4f46e5',
                      },
                    }}
                  />
                }
                label={
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: validationErrors.agreeBackgroundCheck ? '#dc2626' : '#374151',
                      marginBottom: '0px',
                      padding: '0'
                    }}
                  >
                    {t("backgroundCheckConfirm", language)}
                    <span style={{ color: '#dc2626' }}> *</span>
                  </span>
                }
              />
            </FormGroup>
          </FormControl>

          <div style={{ marginBottom: '6px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
              </label>

              <input autoFocus={false} 
                type="text"
                name="backgroundCheckName"
                value={formData.backgroundCheckName}
                onChange={handleChange}
                style={{
                  width: window.innerWidth < 480 ? '75%': '30%',
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '14px',
                  border: '2px solid',
                  borderColor: validationErrors.backgroundCheckName ? '#dc2626' : '#d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />

              {validationErrors.backgroundCheckName && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                  This field is required.
                </p>
              )}
            </div>
          </div>


          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>{t("generalDate", language)}</label>
            <input autoFocus={false} 
              type="date"
              name="backgroundCheckDate"
              defaultValue={new Date().toISOString().split('T')[0]}
              required
              style={{
                width: window.innerWidth < 480 ? '75%': '30%',
                backgroundColor: 'white',
                color: 'black',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginTop: '24px' }}>
          </div>
        </div>
      );


    case 6:
      return (
        <div style={pageStyle}>
          <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("confidentialityTitle", language)}
          </h2>

          <div
            style={{
              backgroundColor: '#f3f4f6',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '20px',
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.6',
            }}
          >{t("confidentialityText", language)}</div>

          <FormControl
            required
            error={!!validationErrors.agreeBackgroundCheck}
            component="fieldset"
            sx={{ mb: 3 }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreeConfidentiality"
                    checked={formData.agreeConfidentiality}
                    onChange={handleChange}
                    sx={{
                      mb: '0px',
                      ml: '8px',
                      mr: '4px',
                      padding: '0',
                      color: validationErrors.agreeConfidentiality ? '#dc2626' : '#d1d5db',
                      '&.Mui-checked': {
                        color: validationErrors.agreeConfidentiality ? '#dc2626' : '#4f46e5',
                      },
                    }}
                  />
                }
                label={
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: validationErrors.agreeConfidentiality ? '#dc2626' : '#374151',
                      marginBottom: '0px',
                      padding: '0'
                    }}
                  >
                    {t("confidentialityConfirm", language)}
                    <span style={{ color: '#dc2626' }}> *</span>
                  </span>
                }
              />
            </FormGroup>
          </FormControl>

          <div style={{ marginBottom: '6px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
              </label>

              <input autoFocus={false} 
                type="text"
                name="confidentialityEmployeeName"
                value={formData.confidentialityEmployeeName}
                onChange={handleChange}
                style={{
                  width: window.innerWidth < 480 ? '75%': '30%',
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '14px',
                  border: '2px solid',
                  borderColor: validationErrors.confidentialityEmployeeName ? '#dc2626' : '#d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />

              {validationErrors.confidentialityEmployeeName && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                  This field is required.
                </p>
              )}
            </div>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>{t("generalDate", language)}</label>
            <input autoFocus={false} 
              type="date"
              name="confidentialityDate"
              defaultValue={new Date().toISOString().split('T')[0]}
              required
              style={{
                width: window.innerWidth < 480 ? '75%': '30%',
                backgroundColor: 'white',
                color: 'black',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginTop: '24px' }}>
          </div>
        </div>
      );
      
      case 7:
        return (
          <div style={pageStyle}>
            <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("adherenceTitle", language)}            
            </h2>

            <div
              style={{
                backgroundColor: '#f3f4f6',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '20px',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
              }}
            >
            {t("adherenceText", language)}
            </div>

          <FormControl
            required
            error={!!validationErrors.agreePolicyTraining}
            component="fieldset"
            sx={{ mb: 3 }}
          >
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    name="agreePolicyTraining"
                    checked={formData.agreePolicyTraining}
                    onChange={handleChange}
                    sx={{
                      mb: '0px',
                      ml: '8px',
                      mr: '4px',
                      padding: '0',
                      color: validationErrors.agreePolicyTraining ? '#dc2626' : '#d1d5db',
                      '&.Mui-checked': {
                        color: validationErrors.agreePolicyTraining ? '#dc2626' : '#4f46e5',
                      },
                    }}
                  />
                }
                label={
                  <span
                    style={{
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      color: validationErrors.agreePolicyTraining ? '#dc2626' : '#374151',
                      marginBottom: '0px',
                      padding: '0'
                    }}
                  >
                    {t("adherenceAgree", language)}
                    <span style={{ color: '#dc2626' }}> *</span>
                  </span>
                }
              />
            </FormGroup>
          </FormControl>

          <div style={{ marginBottom: '6px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
              </label>

              <input autoFocus={false} 
                type="text"
                name="policyTrainingName"
                value={formData.policyTrainingName}
                onChange={handleChange}
                style={{
                  width: window.innerWidth < 480 ? '75%': '30%',
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '14px',
                  border: '2px solid',
                  borderColor: validationErrors.policyTrainingName ? '#dc2626' : '#d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />

              {validationErrors.policyTrainingName && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                  This field is required.
                </p>
              )}
            </div>
          </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>{t("generalDate", language)}</label>
              <input autoFocus={false} 
                type="date"
                name="policyTrainingDate"
                defaultValue={new Date().toISOString().split('T')[0]}
                required
                style={{
                  width: window.innerWidth < 480 ? '75%': '30%',
                  backgroundColor: 'white',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginTop: '24px' }}>
            </div>
          </div>
        );

case 8:
  return (
    <div style={pageStyle}>
      <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
        {t("conflictTitle", language)}
      </h2>

      {/* Info Box */}
      <div style={{
        backgroundColor: '#f3f4f6',
        padding: '20px',
        borderRadius: '12px',
        border: '1px solid #d1d5db',
        maxHeight: '300px',
        overflowY: 'auto',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#374151',
        lineHeight: '1.6'
      }}>
      {t("conflictText", language)}
      </div>

      <strong style={{ color: 'black', marginTop: '22px', marginBottom: '28px', fontSize: '17px', fontStyle: 'italic'}}>{t("conflictCertify", language)}</strong>

      {/* Conflict Questions */}
      {[1, 2, 3, 4].map(i => {
        const name = `conflictQ${i}`;
        const explainName = `${name}Explain`;
        const questionText = {
          1: {
            en: "Do you or any member of your family directly or indirectly own, or during the past 24 months preceding the date hereof, have you or any member of your family-owned, directly or indirectly, any interest whatsoever in, or shared in the profits or income of a vendor, purchaser, or competitor?",
            zh: "您或您的家庭成员是否直接或间接拥有（或在过去 24 个月内曾拥有）供应商、采购方或竞争者的任何利益，或从其利润或收入中获益？"
          },
          2: {
            en: "During the 24 months preceding the date hereof, have you or any member of your family received, directly or indirectly, any compensation, entertainment, gifts, credits, loans, or anything of value from a vendor, purchaser, or competitor?",
            zh: "在截至目前的过去 24 个月中，您或您的家庭成员是否直接或间接从供应商、采购方或竞争者处获得任何形式的补偿、招待、礼物、信用、贷款或其他有价值的物品？"
          },
          3: {
            en: "Employment Status: Are you or any member of your family presently or in the last 24 months an officer, director, employee, or consultant of, or otherwise employed or retained by a vendor, purchaser, or competitor?",
            zh: "就业状态：您或您的家庭成员是否目前或在过去 24 个月中曾在供应商、采购方或竞争者处担任过高管、董事、员工、顾问，或以其他方式受雇或受聘？"
          },
          4: {
            en: "Related Staff Members: Are you or any member of your family presently or in the last 24 months an officer, director, employee, or consultant of, or otherwise employed or retained by a vendor, purchaser, or competitor?",
            zh: "相关员工：您或您的家庭成员是否目前或在过去 24 个月中曾在供应商、采购方或竞争者处担任过高管、董事、员工、顾问，或以其他方式受雇或受聘？"
          }
        };


        return (
          <FormControl
            key={name}
            required
            error={!!validationErrors[name]}
            component="fieldset"
            sx={{ mb: 3, width: '100%' }}
          >
            <Typography sx={{ color: 'black',  fontWeight: 500, mb: 1 }}>
              {i}. {questionText[i]?.[language]} <span style={{ color: 'red' }}>*</span>
            </Typography>

            {validationErrors[name] && (
              <FormHelperText sx={{ml: '0px'}} >This field is required.</FormHelperText>
            )}

            <RadioGroup row name={name} value={formData[name] || ''} onChange={handleChange} style={{color: validationErrors.conflictDate ? '#dc2626' : 'black'}}>
              <FormControlLabel value="yes" control={<Radio        sx={{
                color: validationErrors[name] ? '#dc2626' : '#d1d5db',
                '&.Mui-checked': {
                  color: validationErrors[name] ? '#dc2626' : '#4f46e5',
                },
              }}/>} label={t("yes", language)}  />
              <FormControlLabel value="no" control={<Radio        sx={{
                color: validationErrors[name] ? '#dc2626' : '#d1d5db',
                '&.Mui-checked': {
                  color: validationErrors[name] ? '#dc2626' : '#4f46e5',
                },
              }}
            />} label={t("no", language)}  />
            </RadioGroup>

            <TextField
              multiline
              rows={3}
              fullWidth
              name={explainName}
              placeholder="If Yes, please explain..."
              value={formData[explainName] || ''}
              onChange={handleChange}
              variant="outlined"
              sx={{ mt: 2 }}
            />
          </FormControl>
        );
      })}


      {/* Final Certification */}
      <div style={{ marginBottom: '20px' }}>
        <p style={{ fontStyle: 'italic', fontSize: '15px', color: '#374151' }}>{t("conflictFurthermore", language)}</p>
      </div>

            {/* Full Name */}
      <div style={{ marginBottom: '6px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
              </label>

              <input autoFocus={false} 
                type="text"
                name="conflictName"
                value={formData.conflictName}
                onChange={handleChange}
                style={{
                  width: window.innerWidth < 480 ? '75%': '30%',
                  backgroundColor: 'white',
                  color: 'black',
                  padding: '14px',
                  border: '2px solid',
                  borderColor: validationErrors.conflictName ? '#dc2626' : '#d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />

              {validationErrors.conflictName && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                  This field is required.
                </p>
              )}
            </div>
          </div>

      {/* Date */}
      <div style={{ marginBottom: '42px' }}>
        <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>
         {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="date"
          name="conflictDate"
          value={formData.conflictDate}
          onChange={handleChange}
          style={{
            width: window.innerWidth < 480 ? '75%': '30%',
            backgroundColor: 'white',
            padding: '8px',
            border: '2px solid',
            borderColor: validationErrors.conflictDate ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        {validationErrors.conflictDate && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>

      {/* Agreement Checkbox */}
      <FormControl
        required
        error={!!validationErrors.agreeConflict1}
        component="fieldset"
        sx={{ mb: 3 }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="agreeConflict1"
                checked={formData.agreeConflict1}
                onChange={handleChange}
                sx={{
                  ml: '8px',
                  mr: '4px',
                  p: 0,
                  color: validationErrors.agreeConflict1 ? '#dc2626' : '#d1d5db',
                  '&.Mui-checked': {
                    color: validationErrors.agreeConflict1 ? '#dc2626' : '#4f46e5',
                  },
                }}
              />
            }
            label={
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: validationErrors.agreeConflict1 ? '#dc2626' : '#374151',
                }}
              >{t("conflictAgree1", language)}<span style={{ color: '#dc2626' }}> *</span>
              </span>
            }
          />
        </FormGroup>
        {validationErrors.agreeConflict1 && (
          <FormHelperText sx={{ml: '0px', color:'#dc2626'}}>This field is required.</FormHelperText>
        )}
      </FormControl>
      <FormControl
        required
        error={!!validationErrors.agreeConflict1}
        component="fieldset"
        sx={{ mb: 3 }}
      >
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox
                name="agreeConflict2"
                checked={formData.agreeConflict2}
                onChange={handleChange}
                sx={{
                  ml: '8px',
                  mr: '4px',
                  p: 0,
                  color: validationErrors.agreeConflict2 ? '#dc2626' : '#d1d5db',
                  '&.Mui-checked': {
                    color: validationErrors.agreeConflict2 ? '#dc2626' : '#4f46e5',
                  },
                }}
              />
            }
            label={
              <span
                style={{
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '14px',
                  color: validationErrors.agreeConflict2 ? '#dc2626' : '#374151',
                }}
              >{t("conflictAgree2", language)}<span style={{ color: '#dc2626' }}> *</span>
              </span>
            }
          />
        </FormGroup>
        {validationErrors.agreeConflict2 && (
          <FormHelperText sx={{ml: '0px', color:'#dc2626'}}>This field is required.</FormHelperText>
        )}
      </FormControl>
    </div>
  );



    case 9:
      return (
        <div style={pageStyle}>
          <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("ethicsTitle", language)}
          </h2>

          <div style={{
            backgroundColor: '#f3f4f6',
            padding: '20px',
            borderRadius: '12px',
            border: '1px solid #d1d5db',
            maxHeight: '300px',
            overflowY: 'auto',
            marginBottom: '20px',
            fontSize: '14px',
            color: '#374151',
            lineHeight: '1.6',
            whiteSpace: 'pre-wrap',
          }}>{t("ethicsText", language)}</div>

          <FormControl
                  required
                  error={!!validationErrors.ethicsAgreement}
                  component="fieldset"
                  sx={{ mt: 2, mb: 3 }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="ethicsAgreement"
                          checked={formData.ethicsAgreement}
                          onChange={handleChange}
                          sx={{
                            ml: '8px',
                            mr: '8px',
                            mb: 2, 
                            p: 0,
                            color: validationErrors.ethicsAgreement ? '#dc2626' : '#d1d5db',
                            '&.Mui-checked': {
                              color: validationErrors.ethicsAgreement ? '#dc2626' : '#4f46e5',
                            },
                          }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            color: validationErrors.ethicsAgreement ? '#dc2626' : '#374151',
                          }}
                        >
                          {t("ethicsAgreeText", language)}
                          <span style={{ color: '#dc2626' }}> *</span>
                        </span>
                      }
                    />
                  </FormGroup>
                  {validationErrors.ethicsAgreement && (
                    <FormHelperText sx={{ml: '0px', color:'#dc2626'}}>This field is required.</FormHelperText>
                  )}
                </FormControl>
                
          {/* Full Name */}
          <div style={{ marginBottom: '6px' }}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>
                    {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
                  </label>

                  <input autoFocus={false} 
                    type="text"
                    name="ethicsName"
                    value={formData.ethicsName}
                    onChange={handleChange}
                    style={{
                      width: window.innerWidth < 480 ? '75%': '30%',
                      backgroundColor: 'white',
                      color: 'black',
                      padding: '14px',
                      border: '2px solid',
                      borderColor: validationErrors.ethicsName ? '#dc2626' : '#d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
                    }}
                  />

                  {validationErrors.ethicsName && (
                    <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                      This field is required.
                    </p>
                  )}
                </div>
              </div>

          {/* Date */}
          <div style={{ marginBottom: '42px' }}>
            <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>
             {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
            </label>
            <input autoFocus={false} 
              type="date"
              name="ethicsDate"
              value={formData.ethicsDate}
              onChange={handleChange}
              style={{
                width: window.innerWidth < 480 ? '75%': '30%',
                backgroundColor: 'white',
                padding: '8px',
                border: '2px solid',
                borderColor: validationErrors.ethicsDate ? '#dc2626' : '#d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
            {validationErrors.ethicsDate && (
              <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                This field is required.
              </p>
            )}
          </div>

          {/* Signature */}
          <div style={{ marginTop: '24px' }}>
          </div>
        </div>
      );

      case 10:
        return (
          <div style={pageStyle}>
            <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
              {t("driverTitle", language)}
            </h2>

            <div style={{
              backgroundColor: '#f3f4f6',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              maxHeight: '300px',
              overflowY: 'auto',
              marginBottom: '40px',
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
            }}>{t("driverText", language)}</div>
            
            {/* Full Name */}
            <div style={{ marginBottom: '6px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>
                      {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
                    </label>

                    <input autoFocus={false} 
                      type="text"
                      name="driverName"
                      value={formData.driverName}
                      onChange={handleChange}
                      style={{
                        width: window.innerWidth < 480 ? '75%': '30%',
                        backgroundColor: 'white',
                        color: 'black',
                        padding: '14px',
                        border: '2px solid',
                        borderColor: validationErrors.driverName ? '#dc2626' : '#d1d5db',
                        borderRadius: '6px',
                        fontSize: '14px',
                      }}
                    />

                    {validationErrors.driverName && (
                      <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                        This field is required.
                      </p>
                    )}
                  </div>
                </div>

            {/* Date */}
            <div style={{ marginBottom: '42px' }}>
              <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>
               {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
              </label>
              <input autoFocus={false} 
                type="date"
                name="driverDate"
                value={formData.driverDate}
                onChange={handleChange}
                style={{
                  width: window.innerWidth < 480 ? '75%': '30%',
                  backgroundColor: 'white',
                  padding: '8px',
                  border: '2px solid',
                  borderColor: validationErrors.driverDate ? '#dc2626' : '#d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
              {validationErrors.driverDate && (
                <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                  This field is required.
                </p>
              )}
            </div>

            {/* Signature */}
            <div style={{ marginTop: '24px' }}>
            </div>
          </div>
        );

        case 11:
          return (
            <div style={pageStyle}>
              <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
                {t("drugfreeTitle", language)}
              </h2>

              <div style={{
                backgroundColor: '#f3f4f6',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                maxHeight: '300px',
                overflowY: 'auto',
                marginBottom: '40px',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
              }}>{t("drugfreeText", language)}</div>

              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>
                        {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input
                        autoFocus={false}
                        type="text"
                        name="drugFreeName"
                        value={formData.drugFreeName}
                        onChange={handleChange}
                        style={{
                          width: window.innerWidth < 480 ? '75%': '30%',
                          backgroundColor: 'white',
                          color: 'black',
                          padding: '14px',
                          border: '2px solid',
                          borderColor: validationErrors.drugFreeName ? '#dc2626' : '#d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />

                      {validationErrors.drugFreeName && (
                        <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                          This field is required.
                        </p>
                      )}
                    </div>
                  </div>

              {/* Date */}
              <div style={{ marginBottom: '42px' }}>
                <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>
                 {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  autoFocus={false}
                  type="date"
                  name="drugFreeDate"
                  value={formData.drugFreeDate}
                  onChange={handleChange}
                  style={{
                    width: window.innerWidth < 480 ? '75%': '30%',
                    backgroundColor: 'white',
                    padding: '8px',
                    border: '2px solid',
                    borderColor: validationErrors.drugFreeDate ? '#dc2626' : '#d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {validationErrors.drugFreeDate && (
                  <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                    This field is required.
                  </p>
                )}
              </div>
              
              {/* Signature */}
              <div style={{ marginTop: '24px' }}>
              </div>
            </div>
          );


          case 12:
            return (
              <div style={pageStyle}>
                <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
                {t("alcTestTitle", language)}  
                </h2>

                <div style={{
                  backgroundColor: '#f9fafb',
                  padding: '20px',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  maxHeight: '300px',
                  overflowY: 'auto',
                  marginBottom: '20px',
                  fontSize: '14px',
                  color: '#374151',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap',
                }}>
                {t("alcTestText", language)}
                </div>

              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label autoFocus={false} style={labelStyle}>
                        {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input autoFocus={false} 
                        type="text"
                        name="drugConsentName"
                        value={formData.drugConsentName}
                        onChange={handleChange}
                        style={{
                          width: window.innerWidth < 480 ? '75%': '30%',
                          backgroundColor: 'white',
                          color: 'black',
                          padding: '14px',
                          border: '2px solid',
                          borderColor: validationErrors.drugConsentName ? '#dc2626' : '#d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />

                      {validationErrors.drugConsentName && (
                        <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                          This field is required.
                        </p>
                      )}
                    </div>
                  </div>

              {/* Date */}
              <div style={{ marginBottom: '42px' }}>
                <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>
                 {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
                </label>
                <input autoFocus={false} 
                  type="date"
                  name="drugConsentDate"
                  value={formData.drugConsentDate}
                  onChange={handleChange}
                  style={{
                    width: window.innerWidth < 480 ? '75%': '30%',
                    backgroundColor: 'white',
                    padding: '8px',
                    border: '2px solid',
                    borderColor: validationErrors.drugConsentDate ? '#dc2626' : '#d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {validationErrors.drugConsentDate && (
                  <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                    This field is required.
                  </p>
                )}
              </div>

                {/* Signature of Representative */}
                <div style={{ marginBottom: '16px' }}>
                </div>

                {/* Drug / Herbal Declaration */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{color: 'black'}}>{t("alcTestF1", language)}</label>
                  <textarea
                    name="drugsHerbals"
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      background: 'white',
                      color: 'black',
                      border: '1px solid #d1d5db',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Lot Number, Expiration, Results */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <div style={{ flex: '1 1 30%' }}>
                    <label style={{color: 'black'}}>{t("alcTestF2", language)}</label>
                    <input autoFocus={false} type="text" name="lotNumber" style={inputStyle} />
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <label style={{color: 'black'}}>{t("alcTestF3", language)}</label>
                    <input autoFocus={false} type="date" name="expirationDate" style={inputStyle} />
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <label style={{color: 'black'}}>{t("alcTestF4", language)}</label>
                    <input autoFocus={false} type="text" name="results" style={inputStyle} />
                  </div>
                </div>

                {/* Negative / Positive / Initials */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <div style={{ flex: '1 1 30%' }}>
                    <label style={{color: 'black'}}>{t("alcTestF5", language)}</label>
                    <input autoFocus={false} type="checkbox" name="isNegative"   style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: 'white', // ✅ Force background
                      border: '2px solid #4f46e5', // or gray
                      borderRadius: '4px',
                      accentColor: '#4f46e5',         // ✅ Let browser render checkmark
                      WebkitBackgroundColor: 'white', // Redundant, doesn't affect native checkbox
                      cursor: 'pointer',
                      position: 'relative',
                    }}/>
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <label style={{color: 'black'}}>{t("alcTestF6", language)}</label>
                    <input autoFocus={false} type="checkbox" name="isPositive"   style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: 'white', // ✅ Force background
                      border: '2px solid #4f46e5', // or gray
                      borderRadius: '4px',
                      accentColor: '#4f46e5',
                      WebkitBackgroundColor: 'white',
                      cursor: 'pointer',
                      position: 'relative',
                    }}/>
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <label style={{color: 'black'}}>{t("alcTestF7", language)}</label>
                    <input autoFocus={false} type="text" name="initials" style={inputStyle} />
                  </div>
                </div>
              </div>
            );

      case 13:
        return (
          <div style={pageStyle}>
            <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("chhaTitle", language)}
            </h2>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              maxHeight: '400px',
              overflowY: 'auto',
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              marginBottom: '24px',
            }}>
            {t("chhaText", language)}
            </div>

              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>
                        {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input autoFocus={false} 
                        type="text"
                        name="chhaEmployeeName"
                        value={formData.chhaEmployeeName}
                        onChange={handleChange}
                        style={{
                          width: window.innerWidth < 480 ? '75%': '30%',
                          backgroundColor: 'white',
                          color: 'black',
                          padding: '14px',
                          border: '2px solid',
                          borderColor: validationErrors.chhaEmployeeName ? '#dc2626' : '#d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />

                      {validationErrors.chhaEmployeeName && (
                        <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                          This field is required.
                        </p>
                      )}
                    </div>
                  </div>

              {/* Date */}
              <div style={{ marginBottom: '42px' }}>
                <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>
                 {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
                </label>
                <input autoFocus={false} 
                  type="date"
                  name="chhaSignatureDate"
                  value={formData.chhaSignatureDate}
                  onChange={handleChange}
                  style={{
                    width: window.innerWidth < 480 ? '75%': '30%',
                    backgroundColor: 'white',
                    padding: '8px',
                    border: '2px solid',
                    borderColor: validationErrors.chhaSignatureDate ? '#dc2626' : '#d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {validationErrors.chhaSignatureDate && (
                  <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                    This field is required.
                  </p>
                )}
              </div>

            {/* Signature Canvas */}
            <div style={{ marginBottom: '6px' }}>
            </div>
          </div>
        );

      case 14:
        return (
          <div style={pageStyle}>
            <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("hhaTitle", language)}
            </h2>

            <div style={{
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '12px',
              border: '1px solid #d1d5db',
              maxHeight: '400px',
              overflowY: 'auto',
              fontSize: '14px',
              color: '#374151',
              lineHeight: '1.6',
              whiteSpace: 'pre-wrap',
              marginBottom: '24px',
            }}>
            {t("hhaText", language)}
            </div>


              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>
                        {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input autoFocus={false} 
                        type="text"
                        name="hhhaEmployeeName"
                        value={formData.hhhaEmployeeName}
                        onChange={handleChange}
                        style={{
                          width: window.innerWidth < 480 ? '75%': '30%',
                          backgroundColor: 'white',
                          color: 'black',
                          padding: '14px',
                          border: '2px solid',
                          borderColor: validationErrors.hhhaEmployeeName ? '#dc2626' : '#d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />

                      {validationErrors.hhhaEmployeeName && (
                        <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                          This field is required.
                        </p>
                      )}
                    </div>
                  </div>

              {/* Date */}
              <div style={{ marginBottom: '42px' }}>
                <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>
                 {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
                </label>
                <input autoFocus={false} 
                  type="date"
                  name="hhhaEmployeeDate"
                  value={formData.hhhaEmployeeDate}
                  onChange={handleChange}
                  style={{
                    width: window.innerWidth < 480 ? '75%': '30%',
                    backgroundColor: 'white',
                    padding: '8px',
                    border: '2px solid',
                    borderColor: validationErrors.hhhaEmployeeDate ? '#dc2626' : '#d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {validationErrors.hhhaEmployeeDate && (
                  <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                    This field is required.
                  </p>
                )}
              </div>
          </div>
        );


        case 15:
          return (
            <div style={pageStyle}>
              <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
              {t("empHandbookTitle", language)}
              </h2>

              <div style={{
                backgroundColor: '#f9fafb',
                padding: '20px',
                borderRadius: '12px',
                border: '1px solid #d1d5db',
                maxHeight: '400px',
                overflowY: 'auto',
                fontSize: '14px',
                color: '#374151',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap',
                marginBottom: '24px',
              }}>
              {t("empHandbookText", language)}
              </div>
              
               {/* Acknowledgment Checkbox */}
                <FormControl
                  required
                  error={!!validationErrors.handbookAgreement1}
                  component="fieldset"
                  sx={{ mb: 3 }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="handbookAgreement1"
                          checked={formData.handbookAgreement1}
                          onChange={handleChange}
                          sx={{
                            ml: '8px',
                            mr: '4px',
                            p: 0,
                            color: validationErrors.handbookAgreement1 ? '#dc2626' : '#d1d5db',
                            '&.Mui-checked': {
                              color: validationErrors.handbookAgreement1 ? '#dc2626' : '#4f46e5',
                            },
                          }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            color: validationErrors.handbookAgreement1 ? '#dc2626' : '#374151',
                          }}
                        >
                          {t("empHandbookAgree", language)}                          
                          <span style={{ color: '#dc2626' }}> *</span>
                        </span>
                      }
                    />
                  </FormGroup>
                  {validationErrors.handbookAgreement1 && (
                    <FormHelperText sx={{ml: '0px', color:'#dc2626'}}>This field is required.</FormHelperText>
                  )}
                </FormControl>
                <FormControl
                  required
                  error={!!validationErrors.handbookAgreement2}
                  component="fieldset"
                  sx={{ mb: 3 }}
                >
                  <FormGroup>
                    <FormControlLabel
                      control={
                        <Checkbox
                          name="handbookAgreement2"
                          checked={formData.handbookAgreement2}
                          onChange={handleChange}
                          sx={{
                            ml: '8px',
                            mr: '4px',
                            p: 0,
                            color: validationErrors.handbookAgreement2 ? '#dc2626' : '#d1d5db',
                            '&.Mui-checked': {
                              color: validationErrors.handbookAgreement2 ? '#dc2626' : '#4f46e5',
                            },
                          }}
                        />
                      }
                      label={
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            color: validationErrors.handbookAgreement2 ? '#dc2626' : '#374151',
                          }}
                        >
                          {t("empHandbookAgree2", language)}     
                          <span style={{ color: '#dc2626' }}> *</span>
                        </span>
                      }
                    />
                  </FormGroup>
                  {validationErrors.handbookAgreement2 && (
                    <FormHelperText sx={{ml: '0px', color:'#dc2626'}}>This field is required.</FormHelperText>
                  )}
                </FormControl>

              {/* Signature */}
              <div style={{ marginBottom: '16px' }}>
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>
                        {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input autoFocus={false} 
                        type="text"
                        name="handbookPrintedName"
                        value={formData.handbookPrintedName}
                        onChange={handleChange}
                        style={{
                          width: window.innerWidth < 480 ? '75%': '30%',
                          backgroundColor: 'white',
                          color: 'black',
                          padding: '14px',
                          border: '2px solid',
                          borderColor: validationErrors.handbookPrintedName ? '#dc2626' : '#d1d5db',
                          borderRadius: '6px',
                          fontSize: '14px',
                        }}
                      />

                      {validationErrors.handbookPrintedName && (
                        <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                          This field is required.
                        </p>
                      )}
                    </div>
                  </div>

              {/* Date */}
              <div style={{ marginBottom: '42px' }}>
                <label style={{ display: 'block', color: 'black', fontWeight: '500', marginBottom: '4px' }}>
                 {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
                </label>
                <input autoFocus={false} 
                  type="date"
                  name="handbookDate"
                  value={formData.handbookDate}
                  onChange={handleChange}
                  style={{
                    width: window.innerWidth < 480 ? '75%': '30%',
                    backgroundColor: 'white',
                    padding: '8px',
                    border: '2px solid',
                    borderColor: validationErrors.handbookDate ? '#dc2626' : '#d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px'
                  }}
                />
                {validationErrors.handbookDate && (
                  <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
                    This field is required.
                  </p>
                )}
              </div>
            </div>
          );

    case 21:
      return (
        <div style={pageStyle}>
          <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("disclaimer", language)}
          </h2>

          <div style={{ marginBottom: '24px', backgroundColor: '#f3f4f6', padding: '16px', borderRadius: '8px' }}>
            <p style={{ fontSize: '14px', color: '#374151', lineHeight: '1.6' }}>
              {t("disclaimerText", language)}
            </p>
          </div>

          {/* Just the signature date field now */}
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("signatureDate", language)}</label>
            <input autoFocus={false} 
              type="date"
              name="sigDate"
              defaultValue={new Date().toISOString().split('T')[0]}
              value={formData.sigDate}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
      );

      case 16:
  return (
    <div style={pageStyle}>
      <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '15px' }}>
      {t("tbQuesTitle", language)}     
      </h2>

      <p style={{ marginBottom: '35px', color: '#374151', fontSize: '16px' }}>
      {t("tbQuesInfo", language)}     
      </p>

      {[...Array(10)].map((_, i) => {
        const num = i + 1;
        const questions = {
          1: t("tbQuesQ1", language),
          2: t("tbQuesQ2", language),
          3: t("tbQuesQ3", language),
          4: t("tbQuesQ4", language),
          5: t("tbQuesQ5", language),
          6: t("tbQuesQ6", language),
          7: t("tbQuesQ7", language),
          8: t("tbQuesQ8", language),
          9: t("tbQuesQ9", language),
          10: t("tbQuesQ10", language),
        };

        const name = `tbQ${num}`;

        return (
          <FormControl
            key={name}
            required
            error={!!validationErrors[name]}
            component="fieldset"
            sx={{ mb: 3, width: '100%' }}
          >
            <Typography sx={{ color: 'black', fontSize: 15, fontWeight: 500, mb: 1 }}>
              {num}. {t("tbQuesTemp", language)}, {questions[num]}? <span style={{ color: 'red' }}>*</span>
            </Typography>

            {validationErrors[name] && (
              <FormHelperText>This field is required.</FormHelperText>
            )}

            <RadioGroup row name={name} value={formData[name] || ''} onChange={handleChange}>
              <FormControlLabel value="yes" control={<Radio />} label={t("yes", language)}  sx={{ color: 'black',  fontWeight: 500, mb: 1 }}/>
              <FormControlLabel value="no" control={<Radio />} label={t("no", language)}  sx={{ color: 'black',  fontWeight: 500, mb: 1 }}/>
            </RadioGroup>
          </FormControl>
        );
      })}

      {/* Tuberculosis Contact Question */}
      <FormControl
        required
        error={!!validationErrors.tbContact}
        component="fieldset"
        sx={{ mb: 3 }}
      >
        <Typography sx={{ color: 'black',  fontWeight: 500, mb: 1 }}>
          {t("tbQuesTemp1", language)}
          <span style={{ color: 'red' }}> *</span>
        </Typography>
        <RadioGroup row name="tbContact" value={formData.tbContact || ''} onChange={handleChange}>
          <FormControlLabel value="yes" control={<Radio />} label={t("yes", language)}  sx={{ color: 'black',  fontWeight: 500, mb: 1 }}/>
          <FormControlLabel value="no" control={<Radio />} label={t("no", language)}  sx={{ color: 'black',  fontWeight: 500, mb: 1 }}/>
        </RadioGroup>
        {validationErrors.tbContact && (
          <FormHelperText>This field is required.</FormHelperText>
        )}
      </FormControl>

      {/* Other Complaints */}
      <FormControl
        required
        error={!!validationErrors.tbOtherComplaints}
        component="fieldset"
        sx={{ mb: 3 }}
      >
        <Typography sx={{ color: 'black',  fontWeight: 500, mb: 1 }}>
        {t("tbQuesTemp2", language)} <span style={{ color: 'red' }}>*</span>
        </Typography>
        <RadioGroup row name="tbOtherComplaints" value={formData.tbOtherComplaints || ''} onChange={handleChange}>
          <FormControlLabel value="yes" control={<Radio />} label={t("yes", language)}  sx={{ color: 'black',  fontWeight: 500, mb: 1 }}/>
          <FormControlLabel value="no" control={<Radio />} label={t("no", language)}  sx={{ color: 'black',  fontWeight: 500, mb: 1 }}/>
        </RadioGroup>
        {validationErrors.tbOtherComplaints && (
          <FormHelperText>This field is required.</FormHelperText>
        )}
        {formData.tbOtherComplaints === 'yes' && (
          <TextField
            fullWidth
            multiline
            rows={3}
            name="tbOtherExplain"
            value={formData.tbOtherExplain || ''}
            onChange={handleChange}
            placeholder="If yes, please explain..."
            sx={{ mt: 2 }}
          />
        )}
      </FormControl>

      <div style={{ marginBottom: '20px'}}>
        <label style={{ color: 'black', fontStyle:"italic", marginBottom: '20px'}}>
        {t("tbQuesTemp3", language)}
        </label>
      </div>

      {/* Employee Name */}
      <div style={{ marginBottom: '20px' }}>
        <label style={labelStyle}>
          {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="text"
          name="tbName"
          value={formData.tbName || ''}
          onChange={handleChange}
          style={{
            width: window.innerWidth < 480 ? '75%': '30%',
            backgroundColor: 'white',
            color: 'black',
            padding: '14px',
            border: '2px solid',
            borderColor: validationErrors.tbName ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        {validationErrors.tbName && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>

      {/* Date */}
      <div style={{ marginBottom: '42px' }}>
        <label style={labelStyle}>
         {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="date"
          name="tbDate"
          value={formData.tbDate || ''}
          onChange={handleChange}
          style={{
            backgroundColor: 'white',
            padding: '8px',
            border: '2px solid',
            borderColor: validationErrors.tbDate ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        {validationErrors.tbDate && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>
    </div>
  );

  case 17:
  return (
    <div style={pageStyle}>
      <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
        {t("hepBTitle", language)}
      </h2>

      <p style={{ fontSize: '14px', marginBottom: '16px', color: '#374151' }}>
        {t("hepBChoice", language)}<br />
      </p>

      <p style={{ fontSize: '14px', marginBottom: '48px', color: '#374151' }}>
      {t("hepBInfo", language)}      
      </p>

      {/* Consent or Declination */}
      <FormControl
        required
        error={!!validationErrors.hepbConsentChoice}
        component="fieldset"
        sx={{ mb: 4 }}
      >
        <FormLabel component="legend" sx={{ fontWeight: 900 }}>
          {t("hepBChoice1", language)} <span style={{ color: 'red' }}>*</span>
        </FormLabel>
        <RadioGroup
          name="hepbConsentChoice"
          value={formData.hepbConsentChoice || ''}
          onChange={handleChange}
        >
          <FormControlLabel
            value="consent"
            control={<Radio />}
            sx={{color: 'black', mt: 2, mb: 4}}
            label={t("hepBConsent1", language)}
          />
          <FormControlLabel
            value="decline"
            control={<Radio />}
            sx={{color: 'black', mb: 4}}
            label={t("hepBConsent2", language)}
          />
        </RadioGroup>
        {validationErrors.hepbConsentChoice && (
          <FormHelperText>This field is required.</FormHelperText>
        )}
      </FormControl>

      {/* Documentation of Exclusion */}
      <FormControl
        required={!formData.hepbConsentChoice || formData.hepbConsentChoice === 'decline'}
        error={!!validationErrors.hepbExclusion}
        component="fieldset"
        sx={{ mb: 3 }}
      >
        <FormLabel component="legend" sx={{ fontWeight: 900 }}>
          {t("hepBDoc", language)}
        </FormLabel>
        <RadioGroup
          name="hepbExclusion"
          value={formData.hepbExclusion || ''}
          onChange={handleChange}
        >
          <FormControlLabel
            value="hepbExclusionPrevSeries"
            control={<Radio />}
            sx={{color: 'black', mt: 2, mb: 4}}
            label={t("hepBLabel1", language)}
          />
          <FormControlLabel
            value="hepbExclusionImmune"
            control={<Radio />}
            sx={{color: 'black', mb: 4}}
            label={t("hepBLabel2", language)}
          />
          <FormControlLabel
            value="hepbExclusionMedical"
            control={<Radio />}
            sx={{color: 'black', mb: 4}}
            label={t("hepBLabel3", language)}
          />
          <FormControlLabel
            value="hepbExclusionLowRisk"
            control={<Radio />}
            sx={{color: 'black', mb: 4}}
            label={t("hepBLabel4", language)}
          />
        </RadioGroup>
        {validationErrors.hepbExclusion && (
          <FormHelperText>This field is required.</FormHelperText>
        )}
      </FormControl>
      {/* Signature and Info */}

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
          {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="text"
          name="hepbConsentName"
          value={formData.hepbConsentName || ''}
          onChange={handleChange}
          style={{
            width: window.innerWidth < 480 ? '75%': '30%',
            backgroundColor: 'white',
            color: 'black',
            padding: '14px',
            border: '2px solid',
            borderColor: validationErrors.hepbConsentName ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        {validationErrors.hepbConsentName && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>

      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
         {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="date"
          name="hepbConsentDate"
          value={formData.hepbConsentDate || ''}
          onChange={handleChange}
          style={{
            background: 'white',
            padding: '8px',
            border: '2px solid',
            borderColor: validationErrors.hepbConsentDate ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        {validationErrors.hepbConsentDate && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>
    </div>
  );


  case 18:
  return (
    <div style={pageStyle}>
      <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
        {t("oshaIntroTitle", language)}
      </h2>

      <div
        style={{
          backgroundColor: '#f3f4f6',
          padding: '20px',
          borderRadius: '12px',
          border: '1px solid #d1d5db',
          marginBottom: '24px',
          fontSize: '14px',
          color: '#374151',
          lineHeight: '1.6'
        }}
      >
      {t("oshaIntroText", language)}
      </div>

      <p style={{ fontStyle: 'italic', color: '#374151', fontSize: '15px', marginBottom: '28px' }}>
      {t("oshaIntroAgree", language)}
      </p>

      {/* Signature */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
          {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="text"
          name="oshaSignature"
          value={formData.oshaSignature || ''}
          onChange={handleChange}
          style={{
            width: window.innerWidth < 480 ? '75%': '30%',
            backgroundColor: 'white',
            color: 'black',
            padding: '14px',
            border: '2px solid',
            borderColor: validationErrors.oshaSignature ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        {validationErrors.oshaSignature && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>

      {/* Date */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
         {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="date"
          name="oshaDate"
          value={formData.oshaDate || ''}
          onChange={handleChange}
          style={{
            background: 'white',
            padding: '8px',
            border: '2px solid',
            borderColor: validationErrors.oshaDate ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        {validationErrors.oshaDate && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>
    </div>
  );


  case 19:
  return (
    <div style={pageStyle}>

      <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '5px' }}>
      {t("oshaInfoTitle", language)}
      </h2>

      <p style={{ fontSize: '14px', color: '#374151', marginBottom: '30px' }}>
      {t("oshaInfoInfo", language)}
      </p>

      {/* OSHA CATEGORY */}

      <FormControl
        required
        error={!!validationErrors.exposureCategory}
        component="fieldset"
        sx={{ mb: 3 }}
      >
        <FormLabel component="legend" sx={{ fontWeight: 500, mb: 2 }}>
        {t("oshaInfoCat", language)} <span style={{ color: 'red' }}>*</span>
        </FormLabel>

        <RadioGroup
          name="exposureCategory"
          value={formData.exposureCategory || ''}
          onChange={handleChange}
        >
          <FormControlLabel
            value="CategoryI"
            control={<Radio />}
            sx={{ color: 'black', mb: window.innerWidth < 480 ? 5 : 3 }}
            label={
              <span>
                <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {t("oshaInfoCat1T", language)}
                </span>
                {t("oshaInfoCat1", language)}
              </span>
            }
          />

          <FormControlLabel
            value="CategoryII"
            control={<Radio />}
            sx={{ color: 'black', mb: window.innerWidth < 480 ? 5 : 3 }}
            label={
              <span>
                <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                  {t("oshaInfoCat2T", language)}
                </span>
                {t("oshaInfoCat2", language)}  
              </span>
            }
          />

          <FormControlLabel
            value="CategoryIII"
            control={<Radio />}
            sx={{ color: 'black' }}
            label={
              <span>
                <span style={{ fontWeight: 'bold', textDecoration: 'underline' }}>
                {t("oshaInfoCat3T", language)}
                </span>
                {t("oshaInfoCat3", language)}
              </span>
            }
          />

        </RadioGroup>

        {validationErrors.exposureCategory && (
          <FormHelperText>This field is required.</FormHelperText>
        )}
      </FormControl>

      {/* Acknowledgment Text */}
      <p style={{ fontStyle: 'italic', color: '#374151', fontSize: '15px', marginTop: '10px', marginBottom: '24px' }}>
        {t("oshaInfoAgree", language)}
      </p>

      {/* Signature */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
          {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="text"
          name="exposureSignature"
          value={formData.exposureSignature || ''}
          onChange={handleChange}
          style={{
            width: window.innerWidth < 480 ? '75%': '30%',
            backgroundColor: 'white',
            color: 'black',
            padding: '14px',
            border: '2px solid',
            borderColor: validationErrors.exposureSignature ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        {validationErrors.exposureSignature && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>

      {/* Date */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
         {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="date"
          name="exposureDate"
          value={formData.exposureDate || ''}
          onChange={handleChange}
          style={{
            background: 'white',
            padding: '8px',
            border: '2px solid',
            borderColor: validationErrors.exposureDate ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px'
          }}
        />
        {validationErrors.exposureDate && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>
    </div>
  );

  case 20:
  return (
    <div style={pageStyle}>
      <h2 style={{ color: 'black', fontSize: '22px', fontWeight: '700', marginBottom: '10px' }}>
      {t("horizonTitle", language)}
      </h2>

      <p style={{ fontSize: '14px', color: '#374151', marginBottom: '28px', fontStyle: 'oblique'}}>
      {t("horizonInfo", language)}
      </p>

      {[
        {
          name: 'horizonQ1',
          label:
            t("horizonQues1", language),
        },
        {
          name: 'horizonQ2',
          label: 
            t("horizonQues2", language),
        },
        {
          name: 'horizonQ3',
          label: t("horizonQues3", language),
        },
        {
          name: 'horizonQ4',
          label: t("horizonQues4", language),
        },
        {
          name: 'horizonQ5',
          label:
            t("horizonQues5", language),
        },
        {
          name: 'horizonQ6',
          label: t("horizonQues6", language),
        },
        {
          name: 'horizonQ7',
          label: t("horizonQues7", language),
        },
      ].map((q, index) => (
        <FormControl
          required
          error={!!validationErrors[q.name]}
          component="fieldset"
          sx={{ mb: window.innerWidth < 480 ? 4 : 5 }}
          key={q.name}
        >
          <FormLabel component="legend" sx={{ fontWeight: 500, fontSize: '15px' }}>
            {index + 1}. {q.label}
          </FormLabel>
          <RadioGroup
            row
            name={q.name}
            value={formData[q.name] || ''}
            onChange={handleChange}
          >
            <FormControlLabel value="yes" control={<Radio />} label={t("yes", language)}  sx={{color: 'black'}}/>
            <FormControlLabel value="no" control={<Radio />} label={t("no", language)}  sx={{color: 'black'}}/>
          </RadioGroup>
          {validationErrors[q.name] && (
            <FormHelperText sx={{ margin: 0 }}>This field is required.</FormHelperText>
          )}
        </FormControl>
      ))}

      {/* Name */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
          {t("employeeName", language)} <span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="text"
          name="horizonName"
          value={formData.horizonName || ''}
          onChange={handleChange}
          style={{
            width: window.innerWidth < 480 ? '75%': '30%',
            backgroundColor: 'white',
            color: 'black',
            padding: '14px',
            border: '2px solid',
            borderColor: validationErrors.horizonName ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        {validationErrors.horizonName && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>

      {/* Date */}
      <div style={{ marginBottom: '24px' }}>
        <label style={labelStyle}>
         {t("generalDate", language)}<span style={{ color: 'red' }}>*</span>
        </label>
        <input autoFocus={false} 
          type="date"
          name="horizonDate"
          value={formData.horizonDate || ''}
          onChange={handleChange}
          style={{
            background: 'white',
            padding: '8px',
            border: '2px solid',
            borderColor: validationErrors.horizonDate ? '#dc2626' : '#d1d5db',
            borderRadius: '6px',
            fontSize: '14px',
          }}
        />
        {validationErrors.horizonDate && (
          <p style={{ color: '#dc2626', fontSize: '13px', marginTop: '4px' }}>
            This field is required.
          </p>
        )}
      </div>
    </div>
  );


      default:
        return null;
    }
  };

  return (
    <div style={containerStyle}>    
      <div style={formContainerStyle}>
        <ProgressBar currentPage={currentPage} totalPages={totalPages} />
        <Button
          variant="outlined"
          onClick={() => setLanguage(language === "en" ? "zh" : "en")}
          style={{
            padding: '10px 20px',
            fontWeight: 600,
            fontSize: '14px',
            color: '#4f46e5',
            border: '2px solid #4f46e5',
            borderRadius: '8px',
            background: 'white',
            cursor: 'pointer',
            transition: 'all 0.25s ease-in-out',
            marginBottom: '16px',
          }}
          onMouseOver={(e) => {
            e.target.style.background = '#4f46e5';
            e.target.style.color = 'white';
            e.target.style.transform = 'scale(1.01)';
          }}
          onMouseOut={(e) => {
            e.target.style.background = 'white';
            e.target.style.color = '#4f46e5';
            e.target.style.transform = 'scale(1)';
          }}
        >
          {language === 'en' ? '🌐切换到中文' : '🌐Switch to English'}
        </Button>
        {renderPage()}

      {/* Always mount SignatureCanvas but hide it unless on page 4 */}
      <div style={{ display: currentPage === 21 ? 'block' : 'none' }}>
        <label style={labelStyle}>{t("signature", language)}</label>
        <div style={signatureContainerStyle}>
          <SignatureCanvas ref={sigRef} canvasProps={{ style: canvasStyle }}  
          onEnd={() => {
            if (currentPage === 21 && sigRef.current) {
              const empty = sigRef.current.isEmpty();
              setIsSignatureMissing(empty);
            }
          }}/>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            <button type="button" onClick={() => sigRef.current?.clear()} style={clearButtonStyle}>{t("clearSignature", language)}</button>
            <span style={{ fontSize: '12px', color: '#6b7280' }}>{t("signatureInstruction", language)}</span>
          </div>
        </div>
      </div>

        <div style={buttonContainerStyle}>
          <button
            onClick={handlePrevious}
            disabled={currentPage === 1}
            style={{
              ...secondaryButtonStyle,
              opacity: currentPage === 1 ? 0.5 : 1,
              cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
              flex: window.innerWidth < 480 ? '1' : 'none'
            }}
            onMouseOver={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#e5e7eb';
              }
            }}
            onMouseOut={(e) => {
              if (currentPage !== 1) {
                e.target.style.backgroundColor = '#f3f4f6';
              }
            }}
          >
            ← {t("previous", language)} 
          </button>

          {currentPage < totalPages ? (
            <button
              onClick={handleNext}
              style={{
                ...primaryButtonStyle,
                flex: window.innerWidth < 480 ? '1' : 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#5856eb';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#6366f1';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {t("next", language)}  →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSignatureMissing}
              style={{
                ...primaryButtonStyle,
                backgroundColor: isSignatureMissing ? '#9ca3af' : '#059669',
                cursor: isSignatureMissing ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                flex: window.innerWidth < 480 ? '1' : 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = isSignatureMissing ? '#9ca3af' : '#047857';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = isSignatureMissing ? '#9ca3af' : '#059669';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              {t("submit", language)}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;