import React, { useRef, useState, useImperativeHandle, forwardRef } from "react";
import { Button, Typography, Checkbox, FormControl, FormControlLabel, FormHelperText, FormGroup, FormLabel, Radio, RadioGroup, TextField} from "@mui/material";

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
  });
  const [validationErrors, setValidationErrors] = useState({});
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
    const { name, type, value, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;

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
    6: ['backgroundCheckName', 'agreeBackgroundCheck'],
    7: ['confidentialityEmployeeName', 'confidentialityDate', 'agreeConfidentiality'],
    8: ['policyTrainingName', 'policyTrainingDate', 'agreePolicyTraining'],
    9: ['conflictName', 'conflictDate', 'conflictQ1', 'conflictQ2', 'conflictQ3', 'conflictQ4', 'agreeConflict1', 'agreeConflict2'],
    10: ['ethicsName', 'ethicsDate', 'ethicsAgreement'],
    11: ['driverName', 'driverDate'],
    12: ['drugFreeName', 'drugFreeDate'],
    13: ['drugConsentName', 'drugConsentDate'],
    14: ['chhaEmployeeName', 'chhaSignatureDate'],
    15: ['hhhaEmployeeName', 'hhhaEmployeeDate'],
    16: ['handbookPrintedName', 'handbookDate', 'handbookAgreement1', 'handbookAgreement2'],
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
              value={formData.prevEmployer1}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerPhone", language)} </label>
            <input
              type="tel"
              name="prevPhone1"
              value={formData.prevPhone1}
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
              value={formData.prevAddress1}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("jobTitle", language)} </label>
            <input
              type="text"
              name="prevJobTitle1"
              value={formData.prevJobTitle1}
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
                value={formData.prevFrom1}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentTo", language)} </label>
              <input
                type="date"
                name="prevTo1"
                value={formData.prevTo1}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("responsibilities", language)} </label>
            <textarea
              name="prevResponsibilities1"
              value={formData.prevResponsibilities1}
              onChange={handleChange}
              rows={3}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("reasonForLeaving", language)} </label>
            <textarea
              name="prevReason1"
              value={formData.prevReason1}
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
              value={formData.prevEmployer2}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("employerPhone", language)} </label>
            <input
              type="tel"
              name="prevPhone2"
              value={formData.prevPhone2}
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
              value={formData.prevAddress2}
              onChange={handleChange}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("jobTitle", language)} </label>
            <input
              type="text"
              name="prevJobTitle2"
              value={formData.prevJobTitle2}
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
                value={formData.prevFrom2}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>{t("employmentTo", language)} </label>
              <input
                type="date"
                name="prevTo2"
                value={formData.prevTo2}
                onChange={handleChange}
                style={inputStyle}
              />
            </div>
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("responsibilities", language)} </label>
            <textarea
              name="prevResponsibilities2"
              value={formData.prevResponsibilities2}
              onChange={handleChange}
              rows={3}
              style={inputStyle}
            />
          </div>
          <div style={inputGroupStyle}>
            <label style={labelStyle}>{t("reasonForLeaving", language)} </label>
            <textarea
              name="prevReason2"
              value={formData.prevReason2}
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
            <p><strong><u>Notice</u></strong></p>
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
                    I have read and agree to the terms above regarding the background check.
                    <span style={{ color: '#dc2626' }}> *</span>
                  </span>
                }
              />
            </FormGroup>
          </FormControl>

          <div style={{ marginBottom: '6px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Employee Name <span style={{ color: 'red' }}>*</span>
              </label>

              <input
                type="text"
                name="backgroundCheckName"
                value={formData.backgroundCheckName}
                onChange={handleChange}
                style={{
                  width: '30%',
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
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
            <input
              type="date"
              name="backgroundCheckDate"
              defaultValue={new Date().toISOString().split('T')[0]}
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
                    I have read and agree to the confidentiality and non-disclosure agreement above.
                    <span style={{ color: '#dc2626' }}> *</span>
                  </span>
                }
              />
            </FormGroup>
          </FormControl>

          <div style={{ marginBottom: '6px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Employee Name <span style={{ color: 'red' }}>*</span>
              </label>

              <input
                type="text"
                name="confidentialityEmployeeName"
                value={formData.confidentialityEmployeeName}
                onChange={handleChange}
                style={{
                  width: '30%',
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
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
            <input
              type="date"
              name="confidentialityDate"
              defaultValue={new Date().toISOString().split('T')[0]}
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
              ADHERENCE TO POLICIES AND PROCEDURES, FEDERAL, STATE, AND ACCREDITATION REGULATIONS, STANDARDS, LAWS, AND GUIDELINES
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
              <p><strong>AND STAFF TRAINING</strong></p>
              <p>I understand that copies of the policy and procedures manuals are available, and I understand that it is my responsibility to read the policies. I also agree to comply with E Neighbor Homecare LLC. Policies and procedures, federal/state laws and regulations, accrediting agencies, and national practice standards. If I have any questions or need any clarification, I will ask the Administrator/CEO .</p>
              <p>I understand I will be responsible for maintaining skills and knowledge to comply withE Neighbor Homecare LLC the scope of Services and any provider's requirements.</p>
              <p>I understand that nothing contained in any policy or procedure manual constitutes a contractual relationship between E Neighbor Homecare LLC and its employees, contractor, or volunteers.</p>
              <p>I understand that I am required to attend and participate in services as scheduled and annual training by E Neighbor Homecare LLC to be in compliance with new or revised policies and procedures.</p>
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
                    I have read and agree to the confidentiality and non-disclosure agreement above.
                    <span style={{ color: '#dc2626' }}> *</span>
                  </span>
                }
              />
            </FormGroup>
          </FormControl>

          <div style={{ marginBottom: '6px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Employee Name <span style={{ color: 'red' }}>*</span>
              </label>

              <input
                type="text"
                name="policyTrainingName"
                value={formData.policyTrainingName}
                onChange={handleChange}
                style={{
                  width: '30%',
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
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>Date</label>
              <input
                type="date"
                name="policyTrainingDate"
                defaultValue={new Date().toISOString().split('T')[0]}
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
      <p>I have been provided a copy/information and understand E Neighbor Homecare LLC. Disclosure/Conflict of Interest policy.</p>
      <p>The following questions are designed for you to determine the nature and extent of any outside interest that might possibly involve a conflict of interest with the affairs of the organization. Please read each question carefully and then answer briefly and concisely in the space that follows. In the event that you have any doubts as to what the question means, answer it to the best of your ability and identify the reason for the doubt.</p>
      <p><strong>Glossary</strong></p>
      <p><em>Competitor:</em> A person offering for sale or selling products and/or services in competition with this organization.</p>
      <p><em>Family:</em> Spouse, parents, children, brothers, sisters, in-laws, and those in your household.</p>
      <p><em>Purchaser:</em>  Any person who buys, rents, or otherwise procures, has bought, rented, procured, or in any way has received from this organization any goods, materials, wares, merchandise, supplies, machinery, equipment, or professional and/or another service.</p>
      <p><em>Person:</em> An individual, firm, partnership, trust, corporation, or other business entity.</p>
      <p><em>Vendor:</em> Any person who sells, rents, agrees to furnish, has offered to sell, rent, or agree to furnish, or has sold supplies, machinery, equipment, real estate, credit, insurance, or service, profession or otherwise, to or on behalf of the organization.</p>
      <p></p>
      </div>

      <strong style={{marginTop: '22px', marginBottom: '28px', fontSize: '17px', fontStyle: 'italic'}}>I certify that I have: Ownership, Entertainment, Gifts, Loans:</strong>

      {/* Conflict Questions */}
      {[1, 2, 3, 4].map(i => {
        const name = `conflictQ${i}`;
        const explainName = `${name}Explain`;
        const questionText = {
          1: "Do you or any member of your family directly or indirectly own, or during the past 24 months preceding the date hereof, have you or any member of your family-owned, directly or indirectly, any interest whatsoever in, or shared in the profits or income of a vendor, purchaser, or competitor?",
          2: "During the 24 months preceding the date hereof, have you or any member of your family received, directlyor  indirectly, any compensation, entertainment, gifts, credits, loans, or anything of value from a vendor, purchaser, or competitor?",
          3: "Employment Status: Are you or any member of your family presently has been in the last 24 months an officer, director, employee, or consultant of, or otherwise employed or retained as a vendor, purchaser, or competitor?",
          4: "Related Staff Members: Are you or any member of your family presently has been in the last 24 months an officer, director, employee, or consultant of, or otherwise employed or retained as a vendor, purchaser, or competitor?"
        }[i];

        return (
          <FormControl
            key={name}
            required
            error={!!validationErrors[name]}
            component="fieldset"
            sx={{ mb: 3, width: '100%' }}
          >
            <Typography sx={{ fontWeight: 500, mb: 1 }}>
              {i}. {questionText} <span style={{ color: 'red' }}>*</span>
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
              }}/>} label="Yes" />
              <FormControlLabel value="no" control={<Radio        sx={{
                color: validationErrors[name] ? '#dc2626' : '#d1d5db',
                '&.Mui-checked': {
                  color: validationErrors[name] ? '#dc2626' : '#4f46e5',
                },
              }}
            />} label="No" />
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
        <p style={{ fontStyle: 'italic', fontSize: '15px', color: '#374151' }}>
          Furthermore, I understand that I have a duty to report any relationship that may arise that could be perceived as a conflict of interest or may be considered a conflict of interest between myself and the E Neighbor Homecare LLC.  
        </p>
      </div>

            {/* Full Name */}
      <div style={{ marginBottom: '6px' }}>
            <div style={inputGroupStyle}>
              <label style={labelStyle}>
                Employee Name <span style={{ color: 'red' }}>*</span>
              </label>

              <input
                type="text"
                name="conflictName"
                value={formData.conflictName}
                onChange={handleChange}
                style={{
                  width: '30%',
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
        <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
          Date <span style={{ color: 'red' }}>*</span>
        </label>
        <input
          type="date"
          name="conflictDate"
          value={formData.conflictDate}
          onChange={handleChange}
          style={{
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
              >
                I acknowledge that it is my responsibility to bring any such potential conflicts of interest to the attention of the corporate Compliance Officer.
                <span style={{ color: '#dc2626' }}> *</span>
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
              >
                I acknowledge and certify the above responses are true and accurate to the best of my knowledge.
                <span style={{ color: '#dc2626' }}> *</span>
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
          </div>

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
                          I have read, acknowledge and agree to comply with all terms, policies, and conditions outlined above.
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
                    Employee Name <span style={{ color: 'red' }}>*</span>
                  </label>

                  <input
                    type="text"
                    name="ethicsName"
                    value={formData.ethicsName}
                    onChange={handleChange}
                    style={{
                      width: '30%',
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
            <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
              Date <span style={{ color: 'red' }}>*</span>
            </label>
            <input
              type="date"
              name="ethicsDate"
              value={formData.ethicsDate}
              onChange={handleChange}
              style={{
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
              <p>I understand that operating a vehicle on E Neighbor Homecare LLC business means driving either a personal vehicle or owned/leased vehicle by E Neighbor Homecare LLC in the course of employment (i.e., any driving other than commuting to and from the agency office and my home in my personal vehicle) or situations in which any car allowance or mileage reimbursement is paid to me by E Neighbor Homecare LLC.</p>
              <p>&nbsp;</p>
              <p>I understand that I must possess a valid and current driver's license for my state. I also understand that I must submit proof of automobile insurance (a copy of the declaration page or the policy) to my supervisor upon employment if a Commercial Driver's License is required for my job duties. I understand that state law requires certain minimum auto insurance coverage for all vehicle employees, contractors, or volunteers who use their personal car to perform business on behalf of E Neighbor Homecare LLC</p>
              <p>&nbsp;</p>
              <p>I affirm that I have auto insurance coverage as required by the state, and I agree to maintain coverage as required by state law. E Neighbor Homecare LLC the right to request proof of insurance at any time during the term of employment.</p>
              <p>&nbsp;</p>
              <p>I agree to notify my supervisor if I incur any violation that materially changes my driving record. I understand that disciplinary action (which may include termination) will be taken if my driving record is classified as high risk and/or unacceptable.</p>
              <p><em>&nbsp;</em></p>
              <p>I understand that my driving record is subject to review at any time by pharmacy management.</p>
            </div>
            
            {/* Full Name */}
            <div style={{ marginBottom: '6px' }}>
                  <div style={inputGroupStyle}>
                    <label style={labelStyle}>
                      Employee Name <span style={{ color: 'red' }}>*</span>
                    </label>

                    <input
                      type="text"
                      name="driverName"
                      value={formData.driverName}
                      onChange={handleChange}
                      style={{
                        width: '30%',
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
              <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                Date <span style={{ color: 'red' }}>*</span>
              </label>
              <input
                type="date"
                name="driverDate"
                value={formData.driverDate}
                onChange={handleChange}
                style={{
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
                <p>E Neighbor Homecare LLC maintains a drug-free workplace concerning the use, possession, and distribution of drugs.</p>
                <p>All employees are prohibited from unlawful possession or use of a controlled substance or any alcoholic beverages while in the workplace. Employees are also prohibited from the unlawful manufacture, distribution, or dispensing of a controlled substance while in the workplace.</p>
                <p>Prior to hire, all employees will have a drug test conducted. If the drug test results are positive, then E Neighbor Homecare LLC will send the sample to an independent laboratory for testing. If the test result is positive, E Neighbor Homecare LLC will not employ an individual.&nbsp;</p>
                <p>Employees may be subject to reasonable suspicion urine testing for unlawful drugs when the organization or its client had cause to believe that the drug or alcohol policy has been violated.</p>
                <p>Any violation of this policy will result in disciplinary action, <strong>including</strong> termination of employment.</p>
                <p>I acknowledge that I understand that E Neighbor Homecare LLC is a Drug-Free Workplace and understand that E Neighbor Homecare LLC has no tolerance for the use or being under the influence of drugs or alcohol in the workplace.&nbsp;</p>
                <p>&nbsp;</p>
              </div>

              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>
                        Employee Name <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input
                        type="text"
                        name="drugFreeName"
                        value={formData.drugFreeName}
                        onChange={handleChange}
                        style={{
                          width: '30%',
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
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  name="drugFreeDate"
                  value={formData.drugFreeDate}
                  onChange={handleChange}
                  style={{
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
                  <p>&nbsp;I, _________________________________, hereby agree, upon a request made under the drug/alcohol testing policy of E Neighbor Homecare LLC to submit to a drug or alcohol test and to furnish a sample of my urine, breath, and/or blood for analysis. I understand and agree that if I at any time refuse to submit to a drug or alcohol test under E Neighbor Homecare LLC policy, or if I otherwise fail to cooperate with the testing procedures, I will be subject to immediate termination. I further authorize and give full permission to have the E Neighbor Homecare LLC and/or its E Neighbor Homecare LLC physician send the specimen or specimens so collected to a laboratory for a screening test. The testing is to check for the presence of any prohibited substances under the policy and for the laboratory or other testing facility to release any and all documentation relating to such test to the E Neighbor Homecare LLC and/or to any governmental entity involved in a legal proceeding or investigation connected with the test. Finally, I authorize the E Neighbor Homecare LLC to disclose any documentation relating to such test to any governmental entity involved in a legal proceeding or investigation connected with the test.</p>
                  <p>&nbsp;</p>
                  <p>I understand that only duly authorized E Neighbor Homecare LLC officers, employees, and agents will have access to information furnished or obtained in connection with the test. The information will maintain and protect the confidentiality of such information to the greatest extent possible, and they will share such information only to the extent necessary to make employment decisions and to respond to inquiries or notices from government entities.</p>
                  <p>&nbsp;</p>
                  <p>I will hold harmless the E Neighbor Homecare LLC staff that performs the testing, E Neighbor Homecare LLC physician, and any testing laboratory of E Neighbor Homecare LLC.&nbsp;I will not sue or hold responsible such parties for any alleged harm to me that might result from such testing, including loss of employment or any other kind of adverse job action that might arise as a result of the drug or alcohol test, even if an E Neighbor Homecare LLC or laboratory representative makes an error in the administration or analysis of the test or the reporting of the results.</p>
                  <p>&nbsp;</p>
                  <p>This policy and authorization have been explained to me in a language I understand, and I have been told that if I have any questions about the test or the policy, they will be answered.</p>
                  <p>&nbsp;</p>
                  <p>I understand that E Neighbor Homecare LLC will require a drug screen and/or alcohol test under this policy whenever I am involved in a job-related incident/accident, job-related motor vehicle accident, on the job injury.</p>
                </div>

              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>
                        Employee Name <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input
                        type="text"
                        name="drugConsentName"
                        value={formData.drugConsentName}
                        onChange={handleChange}
                        style={{
                          width: '30%',
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
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  name="drugConsentDate"
                  value={formData.drugConsentDate}
                  onChange={handleChange}
                  style={{
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
              <p><u>JOB SUMMARY</u>: A Certified Home Health Aide (CHHA) works in support of the patient&rsquo;s/client&rsquo;s safety, dignity, well-being and ability to remain living at home. The CHHA travels to the patient&rsquo;s/client&rsquo;s home to provide direct care, under professional nursing supervision, in accordance with a written Plan of Care that includes personal care, grooming, ambulation, special procedures, homemaking, meal preparation, housekeeping and assistance with other activities of daily living.&nbsp; The Certified Home Health Aide is supervised by a RN, and there are no supervision responsibilities with this position.&nbsp; The CHHA has HIPAA restricted access to certain patient/client information, and is an hourly, per-diem, non-exempt Direct Care staff member with no guaranteed minimum number of hours per week.</p>
              <p>&nbsp;</p>
              <p><u>QUALIFICATIONS</u>:</p>
              <ol>
              <li>Have a high school diploma or GED, or a satisfactory combination of education and life experience needed to perform the duties and essential functions of the job.</li>
              <li>Have a valid New Jersey Board of Nursing, Home Health Aide certification.</li>
              <li>Have the willingness to travel throughout the service area.&nbsp; This includes being able to drive and have a valid driver&rsquo;s license and auto insurance or have the ability to independently travel on public transportation.</li>
              <li>Demonstrate good communication skills and mature attitude.</li>
              <li>Be honest, dependable and be able to perform the physical demands of the position.</li>
              </ol>
              <p>&nbsp;</p>
              <p><u>RESPONSIBILITIES</u>:</p>
              <ol>
              <li>Travel to patient&rsquo;s/client&rsquo;s home, read and interpret the patient&rsquo;s/client&rsquo;s care plan and provide direct care as specified by the written plan of care.&nbsp; The care includes personal care to patients/clients such as, bathing, mouth, nail, hair and skin care, shaving, exercises as directed, and activities related to dressing and toileting including bedpan.&nbsp; Assist patient/client with ambulating, transfer activities, and the use of assistive devices like mechanical lifts, walkers, wheelchair, commode chair, braces, and prosthesis.&nbsp; Perform special delegated procedures including taking vital signs and weight, feeding, measuring intake and output, and assisting patient/client with self-administered medications.&nbsp; These activities require a variety of physical demands, including, but not limited to, those outlined in Working Conditions and Essential Functions below, and reliable attendance at scheduled assignment.&nbsp;</li>
              <li>Perform light housekeeping, meal preparation and other support services as part of the plan of care.&nbsp; This includes duties such as menu planning and shopping lists, running errands, preparing meals including special diets, presenting food, and cleaning dishes, appliances, and work area afterwards, going shopping, dusting, laundry, vacuuming, general cleaning of bathroom, kitchen, and living area when part of the written plan of care.&nbsp; Such activities include using a wide variety of household equipment and home appliances and the physical demands, including but not limited to those as outlined in Working Conditions and Essential Functions of this Job Description.</li>
              <li>Observe the patient&rsquo;s/client&rsquo;s condition, behavior, appearance, and hygiene needs, living arrangements, and home environment while in the home and report and document changes or problems to the appropriate staff member.&nbsp;</li>
              <li>Write visit reports (Daily Activity Report, etc.) to accurately record the care provided in the home, and complete other forms to document the work of this position, including incident reports and time and attendance reports.&nbsp; Ensure the patient/client signs the Daily Activity Report and Time Sheets as instructed.&nbsp; Submit these reports on time.&nbsp;</li>
              <li>Maintain dependable attendance, be regularly available for assignments, and be timely for scheduled visits.&nbsp; Call the office for assignments often or when late for an assignment.</li>
              <li>Attend at least twelve (12) hours of in-service training annually.</li>
              <li>Adhere to agency policies and procedures.</li>
              <li>Maintain a valid NJ Board of Nursing Home Health Aide certification.</li>
              <li>Always protect and maintain patient/client and agency confidentiality.</li>
              <li>Maintain a professional image, good appearance, and personal hygiene.</li>
              <li>Accept assignments and be punctual.</li>
              <li>Attend agency meetings and training as directed.</li>
              <li>Perform other duties as assigned.</li>
              </ol>
              <p>&nbsp;</p>
              <p><u>WORKING ENVIRONMENT</u>:</p>
              <p>Work is in a variety of home environments.&nbsp; Frequent travel by car or public transportation throughout the service area is necessary.&nbsp; Tasks may involve exposure to blood, body fluids, or tissue (OSHA Category I) and household chemicals, dust, and disinfectants.&nbsp; This position routinely requires driving a car or independently using public transportation, lifting, bending, reaching, kneeling, pushing and pulling, stretching, standing, stooping, walking, walking up and down stairs, seeing, hearing, speaking, writing, reading, carrying, weight bearing activities, and the use of a wide assortment of large and small home appliances.</p>
              <p>&nbsp;</p>
              <p><u>JOB RELATIONSHIPS</u>:</p>
              <p>Supervised by: Director of Nursing/ Nursing Supervisor</p>
              <p>&nbsp;</p>
              <p><u>RISK EXPOSURE</u>:</p>
              <p>High risk: <u>LIFTING REQUIREMENTS</u>:</p>
              <p>Ability to perform the following tasks if necessary:</p>
              <ul>
              <li>Ability to participate in physical activity.</li>
              <li>Ability to work for extended period of time while standing and being involved in physical activity.</li>
              <li>Heavy lifting.</li>
              <li>Ability to do extensive bending, lifting and standing on a regular basis.</li>
              </ul>
              <p>I have read the above job description and fully understand the conditions set forth therein, and if employed as a Certified Home Health Aide, I will perform these duties to the best of my knowledge and ability.</p>
              <p>&nbsp;</p>
              <p>&nbsp;</p>
            </div>

              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>
                        Employee Name <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input
                        type="text"
                        name="chhaEmployeeName"
                        value={formData.chhaEmployeeName}
                        onChange={handleChange}
                        style={{
                          width: '30%',
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
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  name="chhaSignatureDate"
                  value={formData.chhaSignatureDate}
                  onChange={handleChange}
                  style={{
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
            <p>Parties to this agreement are E Neighbor Home Care and the individual (&ldquo;Homemaker Home Health Aide&rdquo; or &ldquo;HHHA&rdquo;) whose signatures appear below and who for full consideration, given and received, each intending to be legally bound, agree with one another as follows:</p>
            <ol>
            <li>The scope of home care services for E Neighbor Home Care the HHHA may perform when placed with patient/client has been explained to Homemaker Home Health Aide (See Job Description on Page 3 below). HHHA agrees s/he will follow all E Neighbor Home Care requirements, as well as all Federal and State rules and regulations (e.g. HIPPAA requirements and all other requirements noted in the Employee Handbook) in providing home care to E Neighbor Home Care patients/clients, including regular communication with the Office and participating in training exercises.</li>
            <ul style={{marginTop: '14px', marginBottom: '14px'}}>
            <li>E Neighbor Home Care assigns Home Health Aides for personal care, companionship, and homemaking services. HHHAs must give 24-hour notice for schedule changes and cannot leave assignments without company instructions, except for approved appointments or errands. They cannot take patients off the premises without permission.</li>
            </ul>
            <li>HHHA agrees to call in and out using patient&rsquo;s/client&rsquo;s home phone at start/end of each shift and complete a weekly time sheet and activity log of the total hours worked and duties performed. The HHHA will have the timesheet/ activity log signed by the patient/client. Any changes in scheduling, patient/client needs, or necessary work arrangements should be reported E Neighbor Home Care .The time sheets/activity logs are to be e-mailed to E Neighbor Home Care at the close of each weekly assignment. Live-in workers agree to accept room and board offered at the work site as part of their compensation package.</li>
            <li>For and in consideration of benefits received, HHHA agrees to release E Neighbor Home Care and their officers, directors, employees, all patients/clients and any third party(s) from any and all potential or actual claims, liability, loss and/or damages incurred or claimed to be associated with this Agreement including all services to patients/clients, excepting gross negligence only.</li>

            <li>HHHA agrees to work with patients/clients only through E Neighbor Home Care with referral and placement, starting and stopping services at the direction of E Neighbor Home Care .If services are stopped for any reason Homemaker home health Aide agrees to leave the patient&rsquo;s/client&rsquo;s care and home and not work with that patient/client in any way other than with E Neighbor Home Care for a period of three (3) years. HHHA understands that it is illegal for me to transfer or attempt to transfer any case to another Agency or take ownership of any job that HHHA is employed in.</li>
            <li>Employment with E Neighbor Home Care is temporary and at-will, and can be terminated at any time by either party. There is no guarantee of hours, type of work, conditions, or duration of employment. E Neighbor Home Care can change policies, compensation, and conditions without notice. Upon termination, the Home Health Aide must return all company property and confidential information.</li>
            <li>Homemaker Home Health Aide also agrees (to):
            <ol style={{marginTop: '14px', marginBottom: '14px'}}>
            <li>All services provided to patients shall be in accordance the Plan of Care.Further, the services may not be altered in type, scope or duration, except by specific orders (in writing) issued as a result of changes made by the RN.</li>
            <li>Unless otherwise stated, live in Home Health Aides&rsquo; schedule will generally consist of a 16-hour day with three (3) scheduled hour-long breaks per day as outlined on the live in time and activity sheet provided.</li>
            <li>Follow E Neighbor Home Care's Fraud, Ethics, and Compliance policies, including zero fraud tolerance, respect for patients and their property, and Non-Conflict of Interest/Non-Compete Clauses. Fraud results in immediate dismissal and possible legal action.</li>
            <li>Not accept monetary or other gifts from patients or family members without the company&rsquo;s explicit approval.</li>
            <li>Restrict use of electronic devices (cell phone, laptop, tablets, etc) to emergency needs while on duty</li>
            <li>Not smoke in or too close to the patient&rsquo;s/client&rsquo;s home</li>
            <li>Not to dispose of ANY items or property belonging to the patients/clients without getting their explicit permission to do so.</li>
            <li>Guests and visitors are not permitted in the patient&rsquo;s home without the patient&rsquo;s and company&rsquo;s approval.</li>
            <li>Be responsible for his/her own transportation to and from assignments.</li>
            <li>Immediately notify E Neighbor Home Care and be prepared to leave the assignment if s/he is experiencing any contagious condition (flu, cold, fever, etc.) and not return until s/he has fully recovered and is symptom free. (A doctor&rsquo;s note may be required).</li>
            <li>Adhere to E Neighbor Home Care professional attire code (per attachment provided).</li>
            </ol>
            Uphold E Neighbor Home Care&rsquo;s standards of excellence, integrity, and respect, and maintain a professional image&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; in behavior, appearance, attitude, and decorum at all times.</li>
            <li>I acknowledge that I have been informed about the New Jersey <em>Consumer&rsquo;s Guide to Homemaker-Home Health Aides</em> published by the New Jersey Board of Nursing which I can read via the internet (<a href="http://www.njconsumeraffairs.gov">njconsumeraffairs.gov</a>) or request hardcopy from E Neighbor Home Care.</li>
            <li>The parties aim to resolve disputes through mutual and voluntary settlement. If a dispute arises and cannot be settled through negotiation, it will first be submitted to non-binding arbitration by the American Arbitration Association before considering binding arbitration, litigation, or other dispute resolution methods.</li>
            <li>It is agreed that this agreement shall be governed by, construed and enforced in accordance with the laws of the state of New Jersey.</li>
            <li>This agreement shall constitute the entire agreement between the parties and any prior understanding of representation of any kind preceding the date of this agreement shall not be binding upon either party except to the extent incorporated in this agreement.</li>

            <li>Any changes to this agreement must be in writing and signed by both parties or agreed to by email. Failure to follow this agreement, engaging in unprofessional behavior, or actions conflicting with the company's interests (such as unauthorized monetary transactions, arguing with or disrespecting clients or their families, using clients' addresses for personal purposes, or getting involved in clients' personal affairs) can lead to disciplinary actions, including dismissal. E Neighbor Home Care will not tolerate such behavior and may also take disciplinary actions, including dismissal, for any violations</li>
            <ul style={{marginTop: '14px', marginBottom: '14px'}}>
            <li>Abuse or exploitation, of any kind, of patient/client, property or family members. Furthermore, Home Health Aides are required to report any observation of abuse, neglect or exploitation of patients/clients.</li>
            <li>Failure to fulfill requirements of the assignment</li>
            <li>Failure to advise supervisor of reportable incidents</li>
            <li>Falsification of Documents (Personal information/Employment record per application or current work)</li>
            <li>Illegal drug use of any kind and consumption or being under the influence of alcohol while on duty</li>
            <li>Sexual harassment</li>
            <li>Excessive tardiness/absenteeism</li>
            <li>Failure to respect patient&rsquo;s/client&rsquo;s privacy per HIPPAA regulations or to comply with any other regulations</li>
            <li>Insubordination &nbsp;</li>
            </ul>
            </ol>

            <p>I have read and understand this Agreement; by signing and printing my name here I agree to be bound by it.&nbsp;&nbsp;&nbsp;&nbsp;</p>
            </div>


              {/* Full Name */}
              <div style={{ marginBottom: '6px' }}>
                    <div style={inputGroupStyle}>
                      <label style={labelStyle}>
                        Employee Name <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input
                        type="text"
                        name="hhhaEmployeeName"
                        value={formData.hhhaEmployeeName}
                        onChange={handleChange}
                        style={{
                          width: '30%',
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
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  name="hhhaEmployeeDate"
                  value={formData.hhhaEmployeeDate}
                  onChange={handleChange}
                  style={{
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
                <p>The Employee Handbook contains important information about the Agency, and I understand that I should consult the Agency&rsquo;s CEO or my supervisor, regarding any questions not answered in the handbook. I have entered into my employment relationship with the Agency voluntarily as an at-will employee and understand that there is no specified length of employment. Accordingly, either the Agency or I can terminate the relationship at will, at any time, with or without cause, and with or without advance notice.</p>
                <p>&nbsp;</p>
                <p>Since the information, policies, and benefits described herein are subject to change at any time, and I acknowledge that revisions to the handbook may occur. All such changes will generally be communicated through official notices, and I understand that revised information may supersede, modify, or eliminate existing policies. Only the CEO of the Agency has the ability to adopt any revisions to the policies in this handbook.</p>
                <p>&nbsp;</p>
                <p>Furthermore, I understand that this handbook is neither a contract of employment nor a legally binding employment agreement. I have had an opportunity to read the handbook, and I understand that I may ask my supervisor any questions I might have concern the handbook. I accept the terms of the handbook. I also understand that it is my responsibility to comply with the policies contained in this handbook and any revisions made to it.</p>
                <p>&nbsp;</p>
                <p>I further agree that if I remain with the Agency following any modifications to the handbook, I hereby accept and agree to such changes.</p>
                <p></p>
                <p>I understand that I am obligated to read the entire handbook and comply with E Neighbor Homecare LLC. Policies and Procedures as outlined in this handbook.</p>
                <p>&nbsp;</p>
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
                            I have received a hard copy of the Employee Handbook on the date listed below.                          
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
                          I have received an electronic copy of the Employee Handbook on the date listed below.
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
                        Employee Name <span style={{ color: 'red' }}>*</span>
                      </label>

                      <input
                        type="text"
                        name="handbookPrintedName"
                        value={formData.handbookPrintedName}
                        onChange={handleChange}
                        style={{
                          width: '30%',
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
                <label style={{ display: 'block', fontWeight: '500', marginBottom: '4px' }}>
                  Date <span style={{ color: 'red' }}>*</span>
                </label>
                <input
                  type="date"
                  name="handbookDate"
                  value={formData.handbookDate}
                  onChange={handleChange}
                  style={{
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