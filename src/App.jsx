import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Button, Typography } from "@mui/material";

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
    disclaimerText: "I certify that my answers are true and complete to the best of my knowledge. If this application leads to employment, I understand that false or misleading information may result in my release.",
    agreeCheckbox: "I agree to the above terms.",

    employeeApplication: "Employee Application",
    workedHereBefore: "Have you ever worked for this Pharmacy?",
    ifSoWhen: "If so, when?",
    educationRefsEmployment: "Education, Previous Employment",
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
    disclaimerText: "我保证上述所填信息真实、完整。如有虚假或误导信息，将可能导致我的雇佣关系被终止。",
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

  },
};

const t = (key, language) => translations[language]?.[key] || key;


const SignatureCanvas = forwardRef((props, ref) => {
  const canvasRef = useRef();
  const [isDrawing, setIsDrawing] = useState(false);

  useImperativeHandle(ref, () => ({
    clear: () => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    },
    getTrimmedCanvas: () => {
      return {
        toDataURL: (format) => {
          return canvasRef.current.toDataURL(format);
        },
      };
    },
  }));

  const getEventPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    };
  };

  const startDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(true);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getEventPos(e);
    ctx.beginPath();
    ctx.moveTo(pos.x, pos.y);
  };

  const draw = (e) => {
    e.preventDefault();
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const pos = getEventPos(e);
    ctx.lineTo(pos.x, pos.y);
    ctx.stroke();
  };

  const stopDrawing = (e) => {
    e.preventDefault();
    setIsDrawing(false);
  };

  return (
    <canvas
      ref={canvasRef}
      width={500}
      height={150}
      style={{
        width: "100%",
        height: "150px",
        border: "2px dashed #d1d5db",
        borderRadius: "8px",
        cursor: "crosshair",
        backgroundColor: "white",
        touchAction: "none",
      }}
      onMouseDown={startDrawing}
      onMouseMove={draw}
      onMouseUp={stopDrawing}
      onMouseLeave={stopDrawing}
      onTouchStart={startDrawing}
      onTouchMove={draw}
      onTouchEnd={stopDrawing}
    />
  );
});

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
    backgroundCheckDate: "",
    agreeBackgroundCheck: false,
    signatureBackground: "",

    // Page 7 - Confidentiality NDA
    confidentialityEmployeeName: "",
    confidentialityDate: "",
    agreeConfidentiality: false,
    signatureConfidentiality: "",

    // Page 8 - Policy & Training
    policyTrainingName: "",
    policyTrainingDate: "",
    agreePolicyTraining: false,

    // Page 9 - Conflict of Interest
    conflictName: "",
    conflictDate: "",
    conflictQ1: "",
    conflictQ1Explain: "",
    conflictQ2: "",
    conflictQ2Explain: "",
    conflictQ3: "",
    conflictQ3Explain: "",
    conflictQ4: "",
    conflictQ4Explain: "",
    agreeConflict: false,

    // Page 10 - Ethics
    ethicsName: "",
    ethicsDate: "",
    signatureEthics: "",

    // Page 11 - Driver Compliance
    driverName: "",
    driverDate: "",
    signatureDriver: "",

    // Page 12 - Drug-Free Policy
    drugFreeName: "",
    drugFreeDate: "",
    signatureDrugFree: "",

    // Page 13 - Drug Testing Consent
    drugConsentName: "",
    drugConsentDate: "",
    drugsHerbals: "",
    lotNumber: "",
    expirationDate: "",
    results: "",
    isNegative: false,
    isPositive: false,
    initials: "",

    // Page 14 - CHHA Summary
    chhaEmployeeName: "",
    chhaSignatureDate: "",
    signatureCHHA: "",

    // Page 15 - HHHA Agreement
    hhhaEmployeeName: "",
    hhhaEmployeeDate: "",
    signatureHHHA: "",

    // Page 16 - Handbook
    handbookDate: "",
    handbookPrintedName: "",
    receivedHandbookHardcopy: false,
    receivedHandbookElectronic: false,
    signatureHandbook: "",
  });

  const [focusedInput, setFocusedInput] = useState(null);

  const totalPages = 17; // previously 4

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

  const handleChange = (e) => {
    const { name, value } = e.target;

    let formattedValue = value;
    if (name === 'ssn') {
      formattedValue = formatSSN(value);
    } else if (name === 'phone') {
      formattedValue = formatPhone(value);
    }

    setFormData((prev) => ({
      ...prev,
      [name]: formattedValue,
    }));
  };

  const handleClear = () => {
    sigRef.current.clear();
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

const handleSubmit = async () => {
  const signature = sigRef.current.getTrimmedCanvas().toDataURL("image/png");
  const fullData = { ...formData, signature };

  try {
    const response = await fetch("http://localhost:3001/api/save-form", {
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


const formContainerStyle = {
  width: '70vw',                   // ← force full screen width
  minHeight: '100vh',               // ← stretch vertically too
  backgroundColor: 'white',
  padding: '40px',
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
    '@media (minWidth: 768px)': {
      width: '100vw', 
      borderRadius: '20px',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
      padding: '40px',
      margin: '20px'
    }
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
    color: '#374151',
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
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("personalInfo", language)} 
          </h2>

          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("firstName", language)} *</label>
              <input
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
              <input
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
              <input
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
              <input
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
            <input
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
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("streetAddress2", language)} </label>
            <input
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
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("state", language)}</label>
              <input
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
            <input
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
              <input
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
              <input
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
              <input
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
            <input
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
              <label>
                <input
                  type="radio"
                  name="usCitizen"
                  value="yes"
                  checked={formData.usCitizen === 'yes'}
                  onChange={handleChange}
                />
                &nbsp;{t("yes", language)} 
              </label>
              <label>
                <input
                  type="radio"
                  name="usCitizen"
                  value="no"
                  checked={formData.usCitizen === 'no'}
                  onChange={handleChange}
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
              <label>
                <input
                  type="radio"
                  name="workAuth"
                  value="yes"
                  checked={formData.workAuth === 'yes'}
                  onChange={handleChange}
                />
                &nbsp;{t("yes", language)} 
              </label>
              <label>
                <input
                  type="radio"
                  name="workAuth"
                  value="no"
                  checked={formData.workAuth === 'no'}
                  onChange={handleChange}
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
              <label>
                <input
                  type="radio"
                  name="felony"
                  value="yes"
                  checked={formData.felony === 'yes'}
                  onChange={handleChange}
                />
                &nbsp;{t("yes", language)} 
              </label>
              <label>
                <input
                  type="radio"
                  name="felony"
                  value="no"
                  checked={formData.felony === 'no'}
                  onChange={handleChange}
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

    case 3:
      return (
        <div style={pageStyle}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            {t("educationRefsEmployment", language)} 
          </h2>

          {/* --- EDUCATION --- */}
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '8px', marginBottom: '12px' }}>{t("education", language)} </h3>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("sName", language)} </label>
            <input
              type="text"
              name="collegeName"
              value={formData.collegeName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("sAddress", language)} </label>
            <input
              type="text"
              name="collegeAddress"
              value={formData.collegeAddress}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("sFrom", language)} </label>
              <input
                type="date"
                name="collegeFrom"
                value={formData.collegeFrom}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("sTo", language)} </label>
              <input
                type="date"
                name="collegeTo"
                value={formData.collegeTo}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("sGraduate", language)} </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label>
                <input type="radio" name="collegeGraduate" value="yes" checked={formData.collegeGraduate === 'yes'} onChange={handleChange} />{t("yes", language)} 
              </label>
              <label>
                <input type="radio" name="collegeGraduate" value="no" checked={formData.collegeGraduate === 'no'} onChange={handleChange} />{t("no", language)} 
              </label>
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("sDegree", language)} </label>
            <input
              type="text"
              name="collegeDegree"
              value={formData.collegeDegree}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          {/* --- PREVIOUS EMPLOYMENT --- */}
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '12px' }}>{t("previousEmployment", language)} 1</h3>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerName", language)} </label>
            <input
              type="text"
              name="prevEmployer1"
              value={formData.prevEmployer}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerPhone", language)} </label>
            <input
              type="tel"
              name="prevPhone1"
              value={formData.prevPhone}
              onChange={handleChange}
              placeholder="(000) 000-0000"
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerAddress", language)} </label>
            <input
              type="text"
              name="prevAddress1"
              value={formData.prevAddress}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("jobTitle", language)} </label>
            <input
              type="text"
              name="prevJobTitle1"
              value={formData.prevJobTitle}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentFrom", language)} </label>
              <input
                type="date"
                name="prevFrom1"
                value={formData.prevFrom}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentTo", language)} </label>
              <input
                type="date"
                name="prevTo1"
                value={formData.prevTo}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("responsibilities", language)} </label>
            <textarea
              name="prevResponsibilities1"
              value={formData.prevResponsibilities}
              onChange={handleChange}
              rows={3}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("reasonForLeaving", language)} </label>
            <textarea
              name="prevReason1"
              value={formData.prevReason}
              onChange={handleChange}
              rows={3}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("mayWeContact", language)} </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label>
                <input type="radio" name="prevContact1" value="yes" checked={formData.prevContact1 === 'yes'} onChange={handleChange} />{t("yes", language)} 
              </label>
              <label>
                <input type="radio" name="prevContact1" value="no" checked={formData.prevContact2 === 'no'} onChange={handleChange} />{t("no", language)} 
              </label>
            </div>
          </div>
                    {/* --- PREVIOUS EMPLOYMENT 2--- */}
          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '12px' }}>{t("previousEmployment", language)} 2</h3>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerName", language)} </label>
            <input
              type="text"
              name="prevEmployer2"
              value={formData.prevEmployer}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerPhone", language)} </label>
            <input
              type="tel"
              name="prevPhone2"
              value={formData.prevPhone}
              onChange={handleChange}
              placeholder="(000) 000-0000"
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerAddress", language)} </label>
            <input
              type="text"
              name="prevAddress2"
              value={formData.prevAddress}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("jobTitle", language)} </label>
            <input
              type="text"
              name="prevJobTitle2"
              value={formData.prevJobTitle}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={finalGridStyle}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentFrom", language)} </label>
              <input
                type="date"
                name="prevFrom2"
                value={formData.prevFrom}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentTo", language)} </label>
              <input
                type="date"
                name="prevTo2"
                value={formData.prevTo}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("responsibilities", language)} </label>
            <textarea
              name="prevResponsibilities2"
              value={formData.prevResponsibilities}
              onChange={handleChange}
              rows={3}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("reasonForLeaving", language)} </label>
            <textarea
              name="prevReason2"
              value={formData.prevReason}
              onChange={handleChange}
              rows={3}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("mayWeContact", language)} </label>
            <div style={{ display: 'flex', gap: '24px' }}>
              <label>
                <input type="radio" name="prevContact2" value="yes" checked={formData.prevContact2 === 'yes'} onChange={handleChange} />{t("yes", language)} 
              </label>
              <label>
                <input type="radio" name="prevContact2" value="no" checked={formData.prevContact2 === 'no'} onChange={handleChange} />{t("no", language)} 
              </label>
            </div>
          </div>
        </div>
      );


    case 4:
      return (
        <div style={pageStyle}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '5px' }}>
            {t("emergencyContactInfo", language)} 
          </h2>

           {/* --- REFERENCES --- */}
          {[1, 2].map((i) => (
            <div key={i} style={{ marginBottom: '10px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '12px' }}>{t("references", language)} {i}</h3>
              <div style={finalGridStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t("firstName", language)} </label>
                  <input
                    type="text"
                    name={`ref${i}Name`}
                    value={formData[`ref${i}Name`]}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t("relation", language)} </label>
                  <input
                    type="text"
                    name={`ref${i}Relation`}
                    value={formData[`ref${i}Relation`]}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
              <div style={finalGridStyle}>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t("referenceAddress", language)} </label>
                  <input
                    type="text"
                    name={`ref${i}Address`}
                    value={formData[`ref${i}Address`]}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
                <div style={inputGroupStyle}>
                  <label style={labelStyle}>{t("referencePhone", language)} </label>
                  <input
                    type="tel"
                    name={`ref${i}Phone`}
                    placeholder="(000) 000-0000"
                    value={formData[`ref${i}Phone`]}
                    onChange={handleChange}
                    style={inputStyle}
                  />
                </div>
              </div>
            </div>
          ))}


          <h3 style={{ fontSize: '18px', fontWeight: '600', marginTop: '32px', marginBottom: '12px' }}>{t("emergencyContact", language)} </h3>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("emergencyFullName", language)} </label>
            <input
              type="text"
              name="emergencyName"
              placeholder={t("fullName", language)} 
              value={formData.emergencyName}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("emergencyRelation", language)}</label>
            <input
              type="text"
              name="emergencyRelationship"
              placeholder={t("relationshipToYou", language)} 
              value={formData.emergencyRelationship}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>

          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("emergencyPhone", language)}</label>
            <input
              type="tel"
              name="emergencyPhone"
              placeholder="(000) 000-0000"
              value={formData.emergencyPhone}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
        </div>
      );


    case 5:
      return (
        <div style={pageStyle}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
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
            <input
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

    case 6:
      return (
        <div style={pageStyle}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            Background Check Notice and Authorization
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
            <p><strong>Notice</strong></p>
            <p>
              E Neighbor Homecare LLC provides notice that background checks will be performed for employment with the company.
              These background checks include but are not limited to:
            </p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Criminal Background Checks</li>
              <li>Sex Offender Registry</li>
              <li>Office of Inspector General (OIG)</li>
              <li>System for Award Management (SAM)</li>
            </ul>

            <p><strong>Authorization</strong></p>
            <p>
              I hereby authorize E Neighbor Homecare LLC to conduct the background checks described above.
              I also authorize the use of law enforcement agencies and/or private criminal background check organizations to assist
              E Neighbor Homecare LLC in collecting this information.
            </p>
            <p>
              I understand that records of arrests on pending charges and/or convictions are not an absolute bar to employment.
              This information will be used to determine whether the background check results reasonably bear on my trustworthiness
              or my ability to perform job duties safely and effectively.
            </p>

            <p><strong>Attestation</strong></p>
            <p>
              To the best of my knowledge, the information provided in this Notice and Authorization and any attachments is true and complete.
              I understand that any falsification or omission of information may disqualify me for this position and/or may serve as grounds
              for the termination of my employment with E Neighbor Homecare LLC.
            </p>
            <p>
              By signing below, I hereby authorize E Neighbor Homecare LLC to conduct a criminal background check and acknowledge that I have been
              informed of a summary of my rights under the Fair Credit Reporting Act.
            </p>
            <p>
              In addition to those rights, I understand that I have a right to appeal an adverse employment decision made based on my background
              check within three business days of receiving notice. A decision on my appeal will be made within seven working days from E Neighbor
              Homecare LLC's receipt of the appeal.
            </p>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', marginBottom: '20px' }}>
            <input type="checkbox" required style={{ width: '18px', height: '18px' }} />
            I have read and agree to the terms above regarding the background check.
          </label>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Employee Full Name</label>
            <input
              type="text"
              name="backgroundCheckName"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
            <input
              type="date"
              name="backgroundCheckDate"
              required
              style={{
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
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            Confidentiality and Non-Disclosure Agreement
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
            <p>
              This HIPAA (employee) non-disclosure agreement (the “Agreement”) is made between E Neighbor Homecare LLC and the employee.
              The Agreement is intended to prevent the unauthorized disclosure of Confidential Information (as defined below) by Employee.
            </p>

            <p><strong>1. Personal Health Information</strong></p>
            <p>
              During the course of employment, employees may have access to personal health information (PHI) relating to clients or patients of
              E Neighbor Homecare LLC. PHI may consist of medical records, billing, financial records, or any individually identifiable health
              information. PHI is protected by the Health Insurance Portability and Accountability Act (HIPAA). HIPAA permits access to PHI on a
              "need to know" basis. Therefore, unless authorization has been granted, any intentional accessing of PHI, or circumvention of PHI
              security protocols, is prohibited.
            </p>

            <p>I agree to abide by the following HIPAA privacy & security rules:</p>
            <ul style={{ paddingLeft: '20px' }}>
              <li>Following the “minimum necessary disclosure standard” protocol when using or disclosing routine protected health information.</li>
              <li>Accessing only patient information for which you have been given authorization, including computer and hard copy files.</li>
              <li>Only logging on using the assigned user ID and only logging on to one computer at a time.</li>
              <li>If assigned a laptop or other electronic device that contains confidential information, keep the equipment secure at all times.</li>
              <li>Practicing confidentiality and heightened sensitivity to the use of identifiable health information used in daily business practice.</li>
              <li>Not engaging in the disclosure of patient information except for treatment, payment, and/or operation purposes.</li>
              <li>Responding to patient requests for their personal records using the practice’s protocol.</li>
              <li>Referring violations of the HIPAA Rules by Business Associates directly to the practice’s designated Privacy Officer.</li>
              <li>Reporting any inadvertent access to PHI that should not have been accessed.</li>
              <li>Attending initial HIPAA training and any additional training offered by the practice for any revisions to the federal/state HIPAA regulations and/or significant changes made by the practice to the Privacy & Security Policy.</li>
              <li>Not downloading or installing games, data or software without prior approval from the Administrator/CEO.</li>
              <li>Creating a unique password that is difficult to guess and changing it regularly as requested.</li>
              <li>Shredding all confidential data prior to discarding (including phone messages from patients, etc.).</li>
              <li>Following the E Neighbor Homecare LLC Privacy and Confidentially Policies and Procedures.</li>
            </ul>

            <p><strong>2. Confidential Information</strong></p>
            <p>
              "Confidential Information" consists of PHI as well as proprietary information relating to E Neighbor Homecare LLC business, including but
              not limited to: medical and financial records, revenues, identification and account numbers and names, PINs, and passwords, or other
              information conveyed in writing or in a discussion that is indicated to be confidential.
            </p>

            <p><strong>3. Non-Disclosure</strong></p>
            <p>
              Without E Neighbor Homecare LLC prior written consent, the employee will not: (a) disclose Confidential Information to any third party,
              whether electronically, orally, or in writing; (b) make or permit to be made copies or other reproductions of Confidential Information;
              (c) make any use of Confidential Information; or (d) use or disclose Confidential Information in violation of applicable law, including
              but not limited to HIPAA.
            </p>

            <p><strong>4. Return of Confidential Materials</strong></p>
            <p>
              Upon E Neighbor Homecare LLC's request, employee shall immediately return all original materials provided by E Neighbor Homecare LLC and
              any copies, notes, or other documents in employee's possession pertaining to Confidential Information.
            </p>

            <p><strong>5. Term</strong></p>
            <p>
              The non-disclosure terms of this Agreement shall survive any termination, cancellation, expiration or other conclusions of employment
              (or this Agreement) unless the parties otherwise expressly agree in writing or E Neighbor Homecare LLC sends employee written notice
              releasing it from this Agreement.
            </p>

            <p><strong>6. Notice of Immunity From Liability</strong></p>
            <p>
              An individual shall not be held criminally or civilly liable under any federal or state trade secret law for the disclosure of a trade
              secret that is made (i) in confidence to a federal, state, or local government official, either directly or indirectly, or to an attorney;
              and (ii) solely for the purpose of reporting or investigating a suspected violation of law; or is made in a complaint or other document
              filed in a lawsuit or other proceeding, if such filing is made under seal. An individual who files a lawsuit for retaliation by an employer
              for reporting a suspected violation of law may disclose the trade secret to the attorney of the individual and use the trade secret
              information in the court proceeding if the individual (i) files any document containing the trade secret under seal; and (ii) does not
              disclose the trade secret, except pursuant to a court order.
            </p>

            <p><strong>7. General Provisions</strong></p>
            <ul style={{ paddingLeft: '20px' }}>
              <li><strong>(a)</strong> Relationships: Nothing in this Agreement shall constitute either party a partner, joint venturer, or employee of the other.</li>
              <li><strong>(b)</strong> Severability: If a court finds any provision invalid or unenforceable, the remainder shall still be in effect.</li>
              <li><strong>(c)</strong> Integration: This Agreement is the complete understanding and supersedes prior agreements unless amended in writing.</li>
              <li><strong>(d)</strong> Waiver: Not exercising a right doesn’t waive it.</li>
              <li><strong>(e)</strong> Injunctive Relief: Misuse of Confidential Info may cause irreparable harm and is grounds for court injunction.</li>
              <li><strong>(f)</strong> Attorney Fees: The prevailing party in any dispute may recover attorney fees and costs.</li>
              <li><strong>(g)</strong> Governing Law: This Agreement is governed by the laws of the state in which E Neighbor Homecare LLC operates.</li>
              <li><strong>(h)</strong> Jurisdiction: Parties agree to the exclusive jurisdiction of the state and federal courts relating to this Agreement.</li>
            </ul>
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', marginBottom: '20px' }}>
            <input type="checkbox" required style={{ width: '18px', height: '18px' }} />
            I have read and agree to the confidentiality and non-disclosure agreement above.
          </label>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Employee Full Name</label>
            <input
              type="text"
              name="confidentialityEmployeeName"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
            <input
              type="date"
              name="confidentialityDate"
              required
              style={{
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
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
              Policy Adherence & Staff Training Acknowledgment
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
              <p>
                I understand that copies of the policy and procedures manuals are available, and I understand that it is my responsibility to read the policies.
                I also agree to comply with E Neighbor Homecare LLC Policies and procedures, federal/state laws and regulations, accrediting agencies,
                and national practice standards. If I have any questions or need any clarification, I will ask the Administrator/CEO.
              </p>
              <p>
                I understand I will be responsible for maintaining skills and knowledge to comply with E Neighbor Homecare LLC scope of services and any provider's requirements.
              </p>
              <p>
                I understand that nothing contained in any policy or procedure manual constitutes a contractual relationship between E Neighbor Homecare LLC
                and its employees, contractors, or volunteers.
              </p>
              <p>
                I understand that I am required to attend and participate in services as scheduled and annual training by E Neighbor Homecare LLC to be in compliance
                with new or revised policies and procedures.
              </p>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', marginBottom: '20px' }}>
              <input type="checkbox" required style={{ width: '18px', height: '18px' }} />
              I have read and agree to the policies, procedures, and training requirements above.
            </label>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Employee Full Name</label>
              <input
                type="text"
                name="policyTrainingName"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                name="policyTrainingDate"
                required
                style={{
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

      case 9:
        return (
          <div style={pageStyle}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
              Conflict of Interest Disclosure
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
              <p>
                I have been provided a copy/information and understand E Neighbor Homecare LLC's Disclosure/Conflict of Interest policy.
              </p>
              <p>The following glossary terms are used:</p>
              <ul style={{ paddingLeft: '20px' }}>
                <li><strong>Competitor:</strong> A person or entity offering competing products/services.</li>
                <li><strong>Family:</strong> Spouse, parents, children, siblings, in-laws, and household members.</li>
                <li><strong>Purchaser:</strong> Anyone who receives goods/services from E Neighbor Homecare LLC.</li>
                <li><strong>Person:</strong> Any individual or business entity.</li>
                <li><strong>Vendor:</strong> Any provider of goods/services to the organization.</li>
              </ul>
            </div>

            {/* Full Name */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Full Name</label>
              <input
                type="text"
                name="conflictName"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Date */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                name="conflictDate"
                required
                style={{
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Questions */}
            {[
              {
                q: "1. Do you or any family member currently or within the past 24 months have ownership or financial interest in a vendor, purchaser, or competitor?",
                name: "conflictQ1",
              },
              {
                q: "2. In the past 24 months, have you or a family member received compensation, entertainment, gifts, or loans from a vendor, purchaser, or competitor?",
                name: "conflictQ2",
              },
              {
                q: "3. Are you or a family member now or in the past 24 months employed by a vendor, purchaser, or competitor?",
                name: "conflictQ3",
              },
              {
                q: "4. Are you or a family member now or in the past 24 months related to staff employed by a vendor, purchaser, or competitor?",
                name: "conflictQ4",
              },
            ].map(({ q, name }, idx) => (
              <div key={idx} style={{ marginBottom: '20px' }}>
                <label style={{ fontWeight: '500', display: 'block', marginBottom: '4px' }}>{q}</label>
                <div style={{ display: 'flex', gap: '20px', marginBottom: '8px' }}>
                  <label>
                    <input type="radio" name={name} value="yes" required /> Yes
                  </label>
                  <label>
                    <input type="radio" name={name} value="no" /> No
                  </label>
                </div>
                <textarea
                  placeholder="If Yes, please explain..."
                  name={`${name}Explain`}
                  rows={3}
                  style={{
                    width: '100%',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    padding: '8px',
                    fontSize: '14px',
                  }}
                />
              </div>
            ))}

            {/* Final Attestation */}
            <div style={{ marginBottom: '20px' }}>
              <p style={{ fontSize: '14px', color: '#374151' }}>
                I understand that I have a duty to report any relationship that could be perceived as a conflict of interest
                with E Neighbor Homecare LLC, and that it is my responsibility to notify the Corporate Compliance Officer of any such concerns.
              </p>
            </div>

            {/* Agreement Checkbox */}
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '14px', color: '#374151', marginBottom: '20px' }}>
              <input type="checkbox" required style={{ width: '18px', height: '18px' }} />
              I acknowledge and certify the above responses are true and accurate to the best of my knowledge.
            </label>

            {/* Signature */}
            <div style={{ marginTop: '24px' }}>
            </div>
          </div>
        );


        case 10:
      return (
        <div style={pageStyle}>
          <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
            Code of Business Conduct and Ethics
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
          }}>
            <p>
              The success of our business is dependent on the trust and confidence we earn from our employees, customers, and shareholders. We gain credibility by adhering to our commitments, displaying honesty and integrity, and reaching company goals solely through honorable conduct. It is easy to say what we must do, but the proof is in our actions. Ultimately, we will be judged on what we do.
            </p>
            <p>
              E Neighbor Homecare LLC's commitment to integrity begins with complying with laws, rules, and regulations where we do business. Further, each of us must have an understanding of the company policies, laws, rules, and regulations that apply to our specific roles. If we are unsure of whether a contemplated action is permitted by law or E Neighbor Homecare LLC policy, we should seek advice from the Administrator/CEO. We are responsible for preventing violations of law and for speaking up if we see possible violations.
            </p>
            <p>
              The use of good judgment based on high ethical principles will guide you with respect to lines of acceptable conduct. If a situation arises for which it is difficult to determine the proper course of action, the matter should be discussed immediately with your immediate supervisor.
            </p>
            <p>
              In consideration of the employment of the undersigned by E Neighbor Homecare LLC, the employee agrees: (1) that during the employee's employment with E Neighbor Homecare LLC, the employee shall not solicit patients of E Neighbor Homecare LLC or attempt to influence such patients to change providers, (2) that upon the termination of employee's employment with E Neighbor Homecare LLC, the employee shall not, for a period of three months after such termination, service any patients of E Neighbor Homecare LLC serviced by the employee during the last six months of the employee's employment by E Neighbor Homecare LLC, (3) to keep confidential all patient records, patient information, pharmacy trade secrets, pharmacy computer passwords, pharmacy phone access codes or any other passwords or pharmacy secrets, (4) to maintain professional boundaries to include clients, vendors and providers and (5) to serve faithfully and act in a way that will merit the continued trust and confidence of the public.
            </p>
            <p>
              As a user of information at E Neighbor Homecare LLC, you may develop, use, or maintain (1) patient information (for health care, quality improvement, peer review, education, billing, reimbursement, administration, research, or for other purposes), (2) personnel information (for employment, payroll, or other business purposes), or (3) confidential business information of E Neighbor Homecare LLC and/or third parties, including third-party software and other licensed products or processes. This information from any source and in any form, including, but not limited to, paper record, oral communication, audio recording, and electronic display, is strictly confidential. Access to confidential information is permitted only on a need-to-know basis and limited to the minimum amount of confidential information necessary to accomplish the intended purpose of the use, disclosure, or request.
            </p>
            <p>
              To avoid conflicts of interest, we must ensure that our decisions for E Neighbor Homecare LLC are objective and fair. Sometimes our personal or family interests might conflict with business decisions. We must always prioritize E Neighbor Homecare LLC's legitimate interests. Using company property or information for personal gain or seizing business opportunities for personal benefit is prohibited.
            </p>
            <p>
              I agree to follow the E Neighbor Homecare LLC Policies and Procedures Manual. I understand that these policies and procedures may change, and it is my responsibility to stay informed and comply with any updates.
            </p>
            <p>
              All employees must follow this business ethics policy. Violating it may result in disciplinary action, including termination. Unauthorized use or release of confidential information may lead to personal, civil, or criminal penalties. I agree to comply with the Confidentiality statements and the E Neighbor Homecare LLC Privacy and Information Security Policies, which I'll read. If I breach these terms, E Neighbor Homecare LLC can seek damages.
            </p>
            <p>
              I agree to read E Neighbor Homecare LLC Compliance and Business Ethics policies. If I have questions, I will direct my questions to my supervisor.
            </p>
            <p>
              The signatures and dates below signify acceptance of the terms of E Neighbor Homecare LLC Compliance and Business Ethical policies and procedures.
            </p>
          </div>

          {/* Name Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Print Employee Name</label>
            <input
              type="text"
              name="ethicsName"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Date Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
            <input
              type="date"
              name="ethicsDate"
              required
              style={{
                width: '100%',
                padding: '8px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px',
              }}
            />
          </div>

          {/* Signature */}
          <div style={{ marginTop: '24px' }}>
          </div>
        </div>
      );

      case 11:
        return (
          <div style={pageStyle}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
              Driver Compliance Acknowledgement
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
            }}>
              <p>
                I understand that operating a vehicle on E Neighbor Homecare LLC business means driving either a personal vehicle or owned/leased vehicle by E Neighbor Homecare LLC in the course of employment (i.e., any driving other than commuting to and from the agency office and my home in my personal vehicle) or situations in which any car allowance or mileage reimbursement is paid to me by E Neighbor Homecare LLC.{"\n\n"}
                
                I understand that I must possess a valid and current driver's license for my state. I also understand that I must submit proof of automobile insurance (a copy of the declaration page or the policy) to my supervisor upon employment if a Commercial Driver's License is required for my job duties. I understand that state law requires certain minimum auto insurance coverage for all vehicle employees, contractors, or volunteers who use their personal car to perform business on behalf of E Neighbor Homecare LLC.{"\n\n"}
                
                I affirm that I have auto insurance coverage as required by the state, and I agree to maintain coverage as required by state law. E Neighbor Homecare LLC reserves the right to request proof of insurance at any time during the term of employment.{"\n\n"}

                I agree to notify my supervisor if I incur any violation that materially changes my driving record. I understand that disciplinary action (which may include termination) will be taken if my driving record is classified as high risk and/or unacceptable.{"\n\n"}

                I understand that my driving record is subject to review at any time by pharmacy management.
              </p>
            </div>

            {/* Name Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Employee Name (please print)</label>
              <input
                type="text"
                name="driverName"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Date Input */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                name="driverDate"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px',
                }}
              />
            </div>

            {/* Signature */}
            <div style={{ marginTop: '24px' }}>
            </div>
          </div>
        );

        case 12:
          return (
            <div style={pageStyle}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
                Drug-Free Workplace Policy
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
              }}>
                <p>
                  E Neighbor Homecare LLC maintains a drug-free workplace concerning the use, possession, and distribution of drugs.{"\n\n"}

                  All employees are prohibited from unlawful possession or use of a controlled substance or any alcoholic beverages while in the workplace. Employees are also prohibited from the unlawful manufacture, distribution, or dispensing of a controlled substance while in the workplace.{"\n\n"}

                  Prior to hire, all employees will have a drug test conducted. If the drug test results are positive, then E Neighbor Homecare LLC will send the sample to an independent laboratory for testing. If the test result is positive, E Neighbor Homecare LLC will not employ an individual.{"\n\n"}

                  Employees may be subject to reasonable suspicion urine testing for unlawful drugs when the organization or its client has cause to believe that the drug or alcohol policy has been violated.{"\n\n"}

                  Any violation of this policy will result in disciplinary action, including termination of employment.{"\n\n"}

                  I acknowledge that I understand that E Neighbor Homecare LLC is a Drug-Free Workplace and understand that E Neighbor Homecare LLC has no tolerance for the use or being under the influence of drugs or alcohol in the workplace.
                </p>
              </div>

              {/* Date Input */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Employee Full Name</label>
                <input
                  type="text"
                  name="drugFreeName"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
                <label style={{ display: 'block', fontWeight: '500', marginTop: '15px', marginBottom: '4px' }}>Date</label>
                <input
                  type="date"
                  name="drugFreeDate"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
              </div>

              {/* Signature */}
              <div style={{ marginTop: '24px' }}>
              </div>
            </div>
          );


          case 13:
            return (
              <div style={pageStyle}>
                <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
                  Employee Agreement and Consent to Drug and/or Alcohol Testing
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
                  <p>
                    I, _________________________________, hereby agree, upon a request made under the drug/alcohol testing policy of E Neighbor Homecare LLC to submit to a drug or alcohol test and to furnish a sample of my urine, breath, and/or blood for analysis. I understand and agree that if I at any time refuse to submit to a drug or alcohol test under E Neighbor Homecare LLC policy, or if I otherwise fail to cooperate with the testing procedures, I will be subject to immediate termination.{"\n\n"}

                    I further authorize and give full permission to have the E Neighbor Homecare LLC and/or its E Neighbor Homecare LLC physician send the specimen or specimens so collected to a laboratory for a screening test. The testing is to check for the presence of any prohibited substances under the policy and for the laboratory or other testing facility to release any and all documentation relating to such test to the E Neighbor Homecare LLC and/or to any governmental entity involved in a legal proceeding or investigation connected with the test.{"\n\n"}

                    Finally, I authorize the E Neighbor Homecare LLC to disclose any documentation relating to such test to any governmental entity involved in a legal proceeding or investigation connected with the test.{"\n\n"}

                    I understand that only duly authorized E Neighbor Homecare LLC officers, employees, and agents will have access to information furnished or obtained in connection with the test. The information will be maintained and protected to the greatest extent possible, and shared only to the extent necessary.{"\n\n"}

                    I will hold harmless the E Neighbor Homecare LLC staff that performs the testing, E Neighbor Homecare LLC physician, and any testing laboratory of E Neighbor Homecare LLC. I will not sue or hold responsible such parties for any alleged harm, even in the case of an error.{"\n\n"}

                    This policy and authorization have been explained to me in a language I understand, and I have been told that any questions I have will be answered.{"\n\n"}

                    I understand that E Neighbor Homecare LLC will require a drug screen and/or alcohol test under this policy whenever I am involved in a job-related incident/accident, job-related motor vehicle accident, or on-the-job injury.
                  </p>
                </div>

                {/* Signature of Employee */}
                <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Employee Full Name</label>
                <input
                  type="text"
                  name="drugFreeName"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    border: '1px solid #d1d5db',
                    borderRadius: '6px',
                    fontSize: '14px',
                  }}
                />
                </div>

                {/* Date for Employee */}
                <div style={{ marginBottom: '24px' }}>
                  <label>Date</label>
                  <input
                    type="date"
                    name="drugConsentDate"
                    required
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                    }}
                  />
                </div>

                {/* Signature of Representative */}
                <div style={{ marginBottom: '16px' }}>
                </div>

                {/* Drug / Herbal Declaration */}
                <div style={{ marginBottom: '16px' }}>
                  <label>I may be taking the following Drugs/Herbals</label>
                  <textarea
                    name="drugsHerbals"
                    rows="2"
                    style={{
                      width: '100%',
                      padding: '8px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      resize: 'vertical',
                    }}
                  />
                </div>

                {/* Lot Number, Expiration, Results */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <div style={{ flex: '1 1 30%' }}>
                    <label>Lot Number</label>
                    <input type="text" name="lotNumber" style={inputStyle} />
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <label>Expiration Date</label>
                    <input type="date" name="expirationDate" style={inputStyle} />
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <label>Results</label>
                    <input type="text" name="results" style={inputStyle} />
                  </div>
                </div>

                {/* Negative / Positive / Initials */}
                <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', marginBottom: '16px' }}>
                  <div style={{ flex: '1 1 30%' }}>
                    <label>Negative</label>
                    <input type="checkbox" name="isNegative" />
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <label>Positive</label>
                    <input type="checkbox" name="isPositive" />
                  </div>
                  <div style={{ flex: '1 1 30%' }}>
                    <label>Initials</label>
                    <input type="text" name="initials" style={inputStyle} />
                  </div>
                </div>
              </div>
            );

      case 14:
        return (
          <div style={pageStyle}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
              Certified Home Health Aide — Job Summary & Acknowledgment
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
              <p>
                <strong>JOB SUMMARY:</strong> A Certified Home Health Aide (CHHA) works in support of the patient’s/client’s safety, dignity, well-being and ability to remain living at home. The CHHA travels to the patient’s/client’s home to provide direct care, under professional nursing supervision, in accordance with a written Plan of Care that includes personal care, grooming, ambulation, special procedures, homemaking, meal preparation, housekeeping and assistance with other activities of daily living. The Certified Home Health Aide is supervised by a RN, and there are no supervision responsibilities with this position. The CHHA has HIPAA restricted access to certain patient/client information, and is an hourly, per-diem, non-exempt Direct Care staff member with no guaranteed minimum number of hours per week.{"\n\n"}

                <strong>QUALIFICATIONS:</strong>{"\n"}
                1. High school diploma or GED or sufficient life experience{"\n"}
                2. NJ Board of Nursing, Home Health Aide certification{"\n"}
                3. Transportation ability (car or public transit){"\n"}
                4. Strong communication and mature attitude{"\n"}
                5. Physical capability and dependability{"\n\n"}

                <strong>RESPONSIBILITIES:</strong>{"\n"}
                - Deliver personal care per Plan of Care{"\n"}
                - Perform light housekeeping and meal prep{"\n"}
                - Monitor and document client conditions{"\n"}
                - Submit accurate activity/time logs{"\n"}
                - Maintain punctuality, certifications, confidentiality, and professionalism{"\n"}
                - Complete annual training and attend meetings{"\n\n"}

                <strong>WORKING ENVIRONMENT:</strong>{"\n"}
                - Various home environments with physical and health risk exposures{"\n"}
                - Includes driving, lifting, and using household equipment{"\n\n"}

                <strong>JOB RELATIONSHIPS:</strong> Supervised by Director of Nursing/Nursing Supervisor{"\n\n"}

                <strong>RISK EXPOSURE:</strong> High Risk - Requires:{"\n"}
                • Physical activity{"\n"}
                • Standing for extended periods{"\n"}
                • Heavy lifting and repetitive physical exertion
              </p>
            </div>

            {/* Name Field */}
            <div style={{ marginBottom: '16px' }}>
              <label>Employee Name</label>
              <input
                type="text"
                name="chhaEmployeeName"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>

            {/* Signature Canvas */}
            <div style={{ marginBottom: '6px' }}>
            </div>

            {/* Date Field */}
            <div style={{ marginBottom: '16px' }}>
              <label>Date</label>
              <input
                type="date"
                name="chhaSignatureDate"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>
          </div>
        );

      case 15:
        return (
          <div style={pageStyle}>
            <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
              Homemaker Home Health Aide Service Agreement
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
              <p>
                This Agreement is between E Neighbor Home Care and the Homemaker Home Health Aide (HHHA). It outlines terms including scope of services, compliance with regulations (HIPAA, etc.), shift policies, liability waivers, exclusivity, at-will employment, and behavioral expectations.{"\n\n"}

                HHHA agrees to:{"\n"}
                - Follow E Neighbor Home Care’s protocols and training requirements.{"\n"}
                - Call in/out via client’s home phone and submit accurate logs.{"\n"}
                - Accept liability release clauses and exclusivity clause (3 years).{"\n"}
                - Accept at-will employment and property return policy.{"\n"}
                - Abide by standards on fraud prevention, conflict of interest, attire, electronic use, smoking, illness reporting, and guest restrictions.{"\n"}
                - Understand this agreement is governed by NJ law and can only be amended in writing.{"\n\n"}

                Prohibited behavior includes, but is not limited to:{"\n"}
                - Abuse/exploitation of clients, falsification of records, illegal drug/alcohol use, harassment, insubordination, privacy violations.{"\n\n"}

                Acknowledgment of the NJ Consumer’s Guide and arbitration clause are included. This is the entire binding agreement.
              </p>
            </div>

            {/* Employee Name & Signature */}
            <div style={{ marginBottom: '16px' }}>
              <label>Employee Print Name</label>
              <input
                type="text"
                name="hhhaEmployeeName"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                  marginBottom: '8px',
                }}
              />
            </div>

            {/* Employee Date Field */}
            <div style={{ marginBottom: '16px' }}>
              <label>Date (Employee)</label>
              <input
                type="date"
                name="hhhaEmployeeDate"
                required
                style={{
                  width: '100%',
                  padding: '8px',
                  borderRadius: '6px',
                  border: '1px solid #d1d5db',
                }}
              />
            </div>
          </div>
        );


        case 16:
          return (
            <div style={pageStyle}>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>
                Employee Handbook Signature Page
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
                <p>
                  The Employee Handbook contains important information about the Agency, and I understand that I should consult the Agency’s CEO or my supervisor regarding any questions not answered in the handbook.{"\n\n"}
                  I have entered into my employment relationship with the Agency voluntarily as an at-will employee and understand that there is no specified length of employment. Accordingly, either the Agency or I can terminate the relationship at will, at any time, with or without cause, and with or without advance notice.{"\n\n"}
                  Since the information, policies, and benefits described herein are subject to change at any time, and I acknowledge that revisions to the handbook may occur. All such changes will generally be communicated through official notices, and I understand that revised information may supersede, modify, or eliminate existing policies.{"\n\n"}
                  Furthermore, I understand that this handbook is neither a contract of employment nor a legally binding employment agreement. I have had an opportunity to read the handbook, and I understand that I may ask my supervisor any questions I might have concerning the handbook. I accept the terms of the handbook. I also understand that it is my responsibility to comply with the policies contained in this handbook and any revisions made to it.{"\n\n"}
                  I further agree that if I remain with the Agency following any modifications to the handbook, I hereby accept and agree to such changes.{"\n\n"}
                  I understand that I am obligated to read the entire handbook and comply with E Neighbor Homecare LLC Policies and Procedures as outlined in this handbook.
                </p>
              </div>

              {/* Acknowledgment checkboxes */}
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input type="checkbox" required />
                  I have received a hard copy of the Employee Handbook on the date listed below.
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                  <input type="checkbox" required />
                  I have received an electronic copy of the Employee Handbook on the date listed below.
                </label>
              </div>

              {/* Signature */}
              <div style={{ marginBottom: '16px' }}>
              </div>

              {/* Date */}
              <div style={{ marginBottom: '16px' }}>
                <label>Date</label>
                <input
                  type="date"
                  name="handbookDate"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                  }}
                />
              </div>

              {/* Printed Name */}
              <div style={{ marginBottom: '16px' }}>
                <label>Printed Employee Name</label>
                <input
                  type="text"
                  name="handbookPrintedName"
                  required
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid #d1d5db',
                  }}
                />
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
      <div style={{ display: currentPage === 5 ? 'block' : 'none' }}>
        <label style={labelStyle}>{t("signature", language)}</label>
        <div style={signatureContainerStyle}>
          <SignatureCanvas ref={sigRef} />
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
              style={{
                ...primaryButtonStyle,
                backgroundColor: '#059669',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                flex: window.innerWidth < 480 ? '1' : 'none'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#047857';
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#059669';
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