/* ------------------------------------------------------------------ */
/*  LETTER TEMPLATES — India-focused, covers all common use cases       */
/* ------------------------------------------------------------------ */

export interface LetterField {
  key: string;
  label: string;
  placeholder: string;
  type: 'text' | 'textarea' | 'date' | 'select';
  options?: string[];
  required?: boolean;
  hint?: string;
}

export interface LetterTemplate {
  id: string;
  name: string;
  nameHi: string;
  category: 'employment' | 'bank' | 'school' | 'official' | 'personal';
  icon: string;
  description: string;
  fields: LetterField[];
  generate: (data: Record<string, string>) => string;
}

/* helpers */
function fmtDate(d: string): string {
  if (!d) return '___________';
  return new Date(d + 'T00:00:00').toLocaleDateString('en-IN', { day: '2-digit', month: 'long', year: 'numeric' });
}
const today = () => new Date().toISOString().slice(0, 10);
const blank = (v: string) => v || '___________';

/* ================================================================== */

export const CATEGORIES = [
  { id: 'all', label: 'All Letters', labelHi: 'सभी पत्र' },
  { id: 'employment', label: 'Employment', labelHi: 'रोजगार' },
  { id: 'bank', label: 'Banking', labelHi: 'बैंकिंग' },
  { id: 'school', label: 'School/College', labelHi: 'स्कूल/कॉलेज' },
  { id: 'official', label: 'Official/Govt', labelHi: 'सरकारी' },
  { id: 'personal', label: 'Personal', labelHi: 'व्यक्तिगत' },
] as const;

/* ================================================================== */
/*  TEMPLATES                                                          */
/* ================================================================== */

export const TEMPLATES: LetterTemplate[] = [
  /* ---- EMPLOYMENT ---- */
  {
    id: 'leave-application',
    name: 'Leave Application',
    nameHi: 'छुट्टी का आवेदन',
    category: 'employment',
    icon: '📋',
    description: 'Apply for casual, sick, or earned leave from your employer.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Priya Sharma', type: 'text', required: true },
      { key: 'designation', label: 'Designation', placeholder: 'Software Engineer', type: 'text' },
      { key: 'department', label: 'Department', placeholder: 'Engineering', type: 'text' },
      { key: 'empId', label: 'Employee ID', placeholder: 'EMP-2345', type: 'text' },
      { key: 'manager', label: 'Manager / HR Name', placeholder: 'Mr. Rajesh Kumar', type: 'text', required: true },
      { key: 'company', label: 'Company Name', placeholder: 'Acme Technologies Pvt Ltd', type: 'text', required: true },
      { key: 'leaveType', label: 'Leave Type', placeholder: 'Casual Leave', type: 'select', options: ['Casual Leave', 'Sick Leave', 'Earned Leave', 'Maternity Leave', 'Paternity Leave', 'Compensatory Off', 'Marriage Leave', 'Bereavement Leave'] },
      { key: 'fromDate', label: 'From Date', placeholder: '', type: 'date', required: true },
      { key: 'toDate', label: 'To Date', placeholder: '', type: 'date', required: true },
      { key: 'reason', label: 'Reason for Leave', placeholder: 'I need to attend a family function in my hometown.', type: 'textarea', required: true },
      { key: 'date', label: 'Application Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => {
      const from = fmtDate(d.fromDate);
      const to = fmtDate(d.toDate);
      return `To,
${blank(d.manager)}
${blank(d.company)}

Date: ${fmtDate(d.date || today())}

Subject: Application for ${d.leaveType || 'Leave'}

Respected Sir/Madam,

I, ${blank(d.name)}${d.designation ? `, working as ${d.designation}` : ''}${d.department ? ` in the ${d.department} department` : ''}${d.empId ? ` (Employee ID: ${d.empId})` : ''}, am writing to request ${d.leaveType || 'leave'} from ${from} to ${to}.

${d.reason || 'I kindly request you to grant me leave for the mentioned period.'}

I have ensured that my pending work is either completed or handed over to a colleague during my absence. I shall be reachable on my phone in case of any urgent matters.

I request you to kindly approve my leave application.

Thanking you.

Yours sincerely,
${blank(d.name)}${d.designation ? `\n${d.designation}` : ''}${d.empId ? `\nEmployee ID: ${d.empId}` : ''}`;
    },
  },
  {
    id: 'resignation-letter',
    name: 'Resignation Letter',
    nameHi: 'त्यागपत्र',
    category: 'employment',
    icon: '👋',
    description: 'Professionally resign from your current position.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Amit Patel', type: 'text', required: true },
      { key: 'designation', label: 'Current Designation', placeholder: 'Senior Analyst', type: 'text' },
      { key: 'department', label: 'Department', placeholder: 'Finance', type: 'text' },
      { key: 'manager', label: 'Reporting Manager', placeholder: 'Ms. Neha Singh', type: 'text', required: true },
      { key: 'company', label: 'Company Name', placeholder: 'XYZ Corp Ltd', type: 'text', required: true },
      { key: 'lastDate', label: 'Last Working Day', placeholder: '', type: 'date', required: true },
      { key: 'noticePeriod', label: 'Notice Period', placeholder: '30 days', type: 'select', options: ['15 days', '30 days', '60 days', '90 days'] },
      { key: 'reason', label: 'Reason (optional)', placeholder: 'I have received an opportunity that aligns with my career goals.', type: 'textarea', hint: 'Keep it professional and positive' },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.manager)}
${blank(d.company)}

Date: ${fmtDate(d.date || today())}

Subject: Resignation from the post of ${d.designation || 'my current position'}

Respected Sir/Madam,

I am writing to formally notify you of my resignation from the position of ${d.designation || 'my current role'}${d.department ? ` in the ${d.department} department` : ''} at ${blank(d.company)}.

${d.reason || 'After careful consideration, I have decided to move on from this role to explore new opportunities.'}

As per the company policy, I am serving a notice period of ${d.noticePeriod || '30 days'}. My last working day will be ${fmtDate(d.lastDate)}.

I am grateful for the opportunities and experiences I have gained during my tenure at ${blank(d.company)}. I am committed to ensuring a smooth transition and will be happy to train my replacement or hand over my responsibilities during the notice period.

I wish the company and the team continued success.

Thanking you for your understanding.

Yours sincerely,
${blank(d.name)}${d.designation ? `\n${d.designation}` : ''}`,
  },
  {
    id: 'experience-certificate-request',
    name: 'Experience Certificate Request',
    nameHi: 'अनुभव प्रमाणपत्र अनुरोध',
    category: 'employment',
    icon: '📜',
    description: 'Request experience/relieving certificate from employer.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Ravi Kumar', type: 'text', required: true },
      { key: 'designation', label: 'Last Designation', placeholder: 'Marketing Executive', type: 'text' },
      { key: 'empId', label: 'Employee ID', placeholder: 'EMP-1234', type: 'text' },
      { key: 'manager', label: 'HR Manager Name', placeholder: 'HR Department', type: 'text', required: true },
      { key: 'company', label: 'Company Name', placeholder: 'ABC Industries Ltd', type: 'text', required: true },
      { key: 'joinDate', label: 'Date of Joining', placeholder: '', type: 'date' },
      { key: 'lastDate', label: 'Last Working Day', placeholder: '', type: 'date' },
      { key: 'docType', label: 'Document Required', placeholder: 'Experience Certificate', type: 'select', options: ['Experience Certificate', 'Relieving Letter', 'Both Experience & Relieving'] },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.manager)}
${blank(d.company)}

Date: ${fmtDate(d.date || today())}

Subject: Request for ${d.docType || 'Experience Certificate'}

Respected Sir/Madam,

I, ${blank(d.name)}, was employed at ${blank(d.company)} as ${d.designation || 'an employee'}${d.empId ? ` (Employee ID: ${d.empId})` : ''}${d.joinDate ? ` from ${fmtDate(d.joinDate)}` : ''}${d.lastDate ? ` to ${fmtDate(d.lastDate)}` : ''}.

I kindly request you to issue my ${d.docType || 'Experience Certificate'} at your earliest convenience. I require this document for my future employment records.

I have completed all formalities including handover of company assets and clearance of pending dues.

I would be grateful if you could process this request within the next 7 working days.

Thanking you.

Yours sincerely,
${blank(d.name)}${d.empId ? `\nEmployee ID: ${d.empId}` : ''}`,
  },
  {
    id: 'salary-increment-request',
    name: 'Salary Increment Request',
    nameHi: 'वेतन वृद्धि अनुरोध',
    category: 'employment',
    icon: '💰',
    description: 'Request a salary raise from your employer.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Sneha Reddy', type: 'text', required: true },
      { key: 'designation', label: 'Designation', placeholder: 'Team Lead', type: 'text' },
      { key: 'department', label: 'Department', placeholder: 'Operations', type: 'text' },
      { key: 'manager', label: 'Reporting Manager', placeholder: 'Mr. Vikram Joshi', type: 'text', required: true },
      { key: 'company', label: 'Company Name', placeholder: 'TechStar Solutions', type: 'text', required: true },
      { key: 'tenure', label: 'Years at Company', placeholder: '3 years', type: 'text' },
      { key: 'achievements', label: 'Key Achievements', placeholder: 'Led a team of 8 to deliver the project 2 weeks ahead of schedule, resulting in 20% cost savings.', type: 'textarea', required: true, hint: 'Highlight measurable results' },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.manager)}
${blank(d.company)}

Date: ${fmtDate(d.date || today())}

Subject: Request for Salary Revision

Respected Sir/Madam,

I hope this letter finds you well. I, ${blank(d.name)}, am working as ${d.designation || 'an employee'}${d.department ? ` in the ${d.department} department` : ''} at ${blank(d.company)}${d.tenure ? ` for the past ${d.tenure}` : ''}.

During my tenure, I have consistently contributed to the growth and success of the organization. Some of my key achievements include:

${d.achievements || '(Key achievements and contributions)'}

Considering my contributions, increased responsibilities, and the current market standards, I would like to request a revision in my current salary.

I am confident that my dedication and performance will continue to add value to the organization. I look forward to discussing this matter with you at your convenience.

Thanking you for your consideration.

Yours sincerely,
${blank(d.name)}${d.designation ? `\n${d.designation}` : ''}`,
  },
  {
    id: 'transfer-request',
    name: 'Transfer Request Letter',
    nameHi: 'स्थानांतरण अनुरोध पत्र',
    category: 'employment',
    icon: '🔄',
    description: 'Request office/branch transfer from your employer.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Deepak Mishra', type: 'text', required: true },
      { key: 'designation', label: 'Designation', placeholder: 'Assistant Manager', type: 'text' },
      { key: 'empId', label: 'Employee ID', placeholder: 'EMP-5678', type: 'text' },
      { key: 'currentBranch', label: 'Current Branch/Office', placeholder: 'Mumbai - Andheri', type: 'text', required: true },
      { key: 'requestedBranch', label: 'Requested Branch/Office', placeholder: 'Pune - Hinjewadi', type: 'text', required: true },
      { key: 'manager', label: 'Manager / HR Name', placeholder: 'HR Department', type: 'text', required: true },
      { key: 'company', label: 'Company Name', placeholder: 'National Corp Ltd', type: 'text', required: true },
      { key: 'reason', label: 'Reason for Transfer', placeholder: 'Due to my spouse\'s job relocation, I need to move to Pune for family reasons.', type: 'textarea', required: true },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.manager)}
${blank(d.company)}

Date: ${fmtDate(d.date || today())}

Subject: Request for Transfer from ${d.currentBranch || 'Current Location'} to ${d.requestedBranch || 'Requested Location'}

Respected Sir/Madam,

I, ${blank(d.name)}, am working as ${d.designation || 'an employee'}${d.empId ? ` (Employee ID: ${d.empId})` : ''} at the ${blank(d.currentBranch)} branch of ${blank(d.company)}.

I would like to request a transfer to the ${blank(d.requestedBranch)} branch for the following reason:

${d.reason || '(Reason for transfer request)'}

I assure you that this transfer will not affect my work performance. I am willing to complete any formalities required for the transfer process.

I request you to kindly consider my application and process the transfer at the earliest.

Thanking you.

Yours sincerely,
${blank(d.name)}${d.designation ? `\n${d.designation}` : ''}${d.empId ? `\nEmployee ID: ${d.empId}` : ''}`,
  },

  /* ---- BANK ---- */
  {
    id: 'bank-account-opening',
    name: 'Bank Account Opening Request',
    nameHi: 'बैंक खाता खोलने का अनुरोध',
    category: 'bank',
    icon: '🏦',
    description: 'Request to open a new savings/current bank account.',
    fields: [
      { key: 'name', label: 'Your Full Name', placeholder: 'Rahul Verma', type: 'text', required: true },
      { key: 'fatherName', label: "Father's Name", placeholder: 'Shri Ram Verma', type: 'text' },
      { key: 'address', label: 'Residential Address', placeholder: '42, Green Park Colony, Sector 15, Gurugram', type: 'textarea', required: true },
      { key: 'phone', label: 'Phone Number', placeholder: '9876543210', type: 'text' },
      { key: 'branchManager', label: 'Branch Manager', placeholder: 'The Branch Manager', type: 'text' },
      { key: 'bankName', label: 'Bank Name & Branch', placeholder: 'State Bank of India, Sector 15 Branch, Gurugram', type: 'text', required: true },
      { key: 'accountType', label: 'Account Type', placeholder: 'Savings Account', type: 'select', options: ['Savings Account', 'Current Account', 'Fixed Deposit Account', 'Salary Account', 'NRI Account'] },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${d.branchManager || 'The Branch Manager'}
${blank(d.bankName)}

Date: ${fmtDate(d.date || today())}

Subject: Request to Open a ${d.accountType || 'Savings Account'}

Respected Sir/Madam,

I, ${blank(d.name)}${d.fatherName ? `, S/o ${d.fatherName}` : ''}, residing at ${d.address || '___________'}, would like to open a ${d.accountType || 'Savings Account'} in your esteemed bank.

I have enclosed the following documents for your reference:
1. Aadhaar Card (Photo ID Proof)
2. PAN Card
3. Passport-size Photographs (2 nos.)
4. Address Proof

${d.phone ? `My contact number is ${d.phone}.` : ''}

I request you to kindly process my application and open the account at the earliest.

Thanking you.

Yours faithfully,
${blank(d.name)}`,
  },
  {
    id: 'bank-account-closing',
    name: 'Bank Account Closing Request',
    nameHi: 'बैंक खाता बंद करने का अनुरोध',
    category: 'bank',
    icon: '🔐',
    description: 'Request to close an existing bank account.',
    fields: [
      { key: 'name', label: 'Your Full Name', placeholder: 'Meena Kumari', type: 'text', required: true },
      { key: 'accountNumber', label: 'Account Number', placeholder: '1234567890', type: 'text', required: true },
      { key: 'branchManager', label: 'Branch Manager', placeholder: 'The Branch Manager', type: 'text' },
      { key: 'bankName', label: 'Bank Name & Branch', placeholder: 'HDFC Bank, MG Road Branch, Bangalore', type: 'text', required: true },
      { key: 'reason', label: 'Reason for Closing', placeholder: 'I have relocated to another city and have opened an account with a different bank near my new residence.', type: 'textarea' },
      { key: 'transferTo', label: 'Transfer Balance To (Account No.)', placeholder: '9876543210 (Optional)', type: 'text', hint: 'Leave blank for demand draft' },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${d.branchManager || 'The Branch Manager'}
${blank(d.bankName)}

Date: ${fmtDate(d.date || today())}

Subject: Request to Close Bank Account No. ${blank(d.accountNumber)}

Respected Sir/Madam,

I, ${blank(d.name)}, holder of account number ${blank(d.accountNumber)} at your branch, would like to request the closure of my above-mentioned bank account.

${d.reason || 'I no longer require this account and wish to close it.'}

${d.transferTo ? `Kindly transfer the remaining balance to my account number ${d.transferTo}.` : 'Kindly issue a demand draft or cheque for the remaining balance in my account.'}

I have enclosed my passbook, cheque book, and debit card for the said account. I request you to process this request at the earliest.

Thanking you.

Yours faithfully,
${blank(d.name)}
Account No.: ${blank(d.accountNumber)}`,
  },
  {
    id: 'bank-cheque-book-request',
    name: 'Cheque Book Request',
    nameHi: 'चेक बुक अनुरोध',
    category: 'bank',
    icon: '📝',
    description: 'Request a new cheque book from your bank.',
    fields: [
      { key: 'name', label: 'Your Full Name', placeholder: 'Sunil Mehta', type: 'text', required: true },
      { key: 'accountNumber', label: 'Account Number', placeholder: '9876543210', type: 'text', required: true },
      { key: 'branchManager', label: 'Branch Manager', placeholder: 'The Branch Manager', type: 'text' },
      { key: 'bankName', label: 'Bank Name & Branch', placeholder: 'Punjab National Bank, Civil Lines Branch, Delhi', type: 'text', required: true },
      { key: 'leaves', label: 'Number of Leaves', placeholder: '25 leaves', type: 'select', options: ['10 leaves', '25 leaves', '50 leaves', '100 leaves'] },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${d.branchManager || 'The Branch Manager'}
${blank(d.bankName)}

Date: ${fmtDate(d.date || today())}

Subject: Request for New Cheque Book

Respected Sir/Madam,

I, ${blank(d.name)}, holder of account number ${blank(d.accountNumber)} at your branch, kindly request you to issue a new cheque book of ${d.leaves || '25 leaves'} for my above-mentioned account.

I have exhausted all the leaves in my current cheque book and require a new one for regular transactions.

Kindly process my request at the earliest.

Thanking you.

Yours faithfully,
${blank(d.name)}
Account No.: ${blank(d.accountNumber)}`,
  },
  {
    id: 'bank-address-change',
    name: 'Bank Address Change Request',
    nameHi: 'बैंक पता बदलने का अनुरोध',
    category: 'bank',
    icon: '🏠',
    description: 'Update your residential address in bank records.',
    fields: [
      { key: 'name', label: 'Your Full Name', placeholder: 'Anita Joshi', type: 'text', required: true },
      { key: 'accountNumber', label: 'Account Number', placeholder: '1122334455', type: 'text', required: true },
      { key: 'branchManager', label: 'Branch Manager', placeholder: 'The Branch Manager', type: 'text' },
      { key: 'bankName', label: 'Bank Name & Branch', placeholder: 'Axis Bank, Koramangala Branch, Bangalore', type: 'text', required: true },
      { key: 'oldAddress', label: 'Old Address', placeholder: '23, MG Road, Old Town', type: 'textarea', required: true },
      { key: 'newAddress', label: 'New Address', placeholder: '45, Whitefield Main Road, New Town', type: 'textarea', required: true },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${d.branchManager || 'The Branch Manager'}
${blank(d.bankName)}

Date: ${fmtDate(d.date || today())}

Subject: Request for Change of Address in Account No. ${blank(d.accountNumber)}

Respected Sir/Madam,

I, ${blank(d.name)}, holder of account number ${blank(d.accountNumber)} at your branch, wish to update my residential address in your bank records.

Old Address:
${d.oldAddress || '___________'}

New Address:
${d.newAddress || '___________'}

I have enclosed a copy of my updated Aadhaar card / utility bill as proof of my new address. Kindly update my records accordingly.

Thanking you.

Yours faithfully,
${blank(d.name)}
Account No.: ${blank(d.accountNumber)}`,
  },

  /* ---- SCHOOL / COLLEGE ---- */
  {
    id: 'school-leave-application',
    name: 'School Leave Application',
    nameHi: 'स्कूल छुट्टी आवेदन',
    category: 'school',
    icon: '🎒',
    description: 'Leave application written by parent for school student.',
    fields: [
      { key: 'studentName', label: 'Student Name', placeholder: 'Aanya Sharma', type: 'text', required: true },
      { key: 'class', label: 'Class & Section', placeholder: 'Class 8-B', type: 'text', required: true },
      { key: 'rollNo', label: 'Roll Number', placeholder: '23', type: 'text' },
      { key: 'parentName', label: "Parent's Name", placeholder: 'Mrs. Kavita Sharma', type: 'text', required: true },
      { key: 'principal', label: 'Principal/Teacher Name', placeholder: 'The Class Teacher / The Principal', type: 'text' },
      { key: 'school', label: 'School Name', placeholder: 'Delhi Public School, Vasant Kunj', type: 'text', required: true },
      { key: 'fromDate', label: 'From Date', placeholder: '', type: 'date', required: true },
      { key: 'toDate', label: 'To Date', placeholder: '', type: 'date', required: true },
      { key: 'reason', label: 'Reason for Leave', placeholder: 'My daughter has fever and the doctor has advised rest for 3 days.', type: 'textarea', required: true },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${d.principal || 'The Principal'}
${blank(d.school)}

Date: ${fmtDate(d.date || today())}

Subject: Leave Application for ${blank(d.studentName)} (${d.class || '___________'}${d.rollNo ? `, Roll No. ${d.rollNo}` : ''})

Respected Sir/Madam,

I am writing to inform you that my child, ${blank(d.studentName)}, studying in ${blank(d.class)}${d.rollNo ? ` (Roll No. ${d.rollNo})` : ''}, will not be able to attend school from ${fmtDate(d.fromDate)} to ${fmtDate(d.toDate)}.

${d.reason || 'The reason for the absence is mentioned above.'}

I request you to kindly grant leave for the mentioned period. The missed classwork and homework will be completed promptly after returning.

Thanking you.

Yours sincerely,
${blank(d.parentName)}
(Parent/Guardian of ${blank(d.studentName)})`,
  },
  {
    id: 'college-bonafide-request',
    name: 'Bonafide Certificate Request',
    nameHi: 'बोनाफाइड प्रमाणपत्र अनुरोध',
    category: 'school',
    icon: '🎓',
    description: 'Request bonafide/enrollment certificate from college.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Rohan Deshmukh', type: 'text', required: true },
      { key: 'course', label: 'Course & Year', placeholder: 'B.Tech CSE, 3rd Year', type: 'text', required: true },
      { key: 'rollNo', label: 'Roll/Enrollment Number', placeholder: 'BT-2023-0456', type: 'text', required: true },
      { key: 'principal', label: 'Addressed To', placeholder: 'The Principal', type: 'text' },
      { key: 'college', label: 'College Name', placeholder: 'College of Engineering, Pune', type: 'text', required: true },
      { key: 'purpose', label: 'Purpose', placeholder: 'Bank education loan', type: 'select', options: ['Bank Education Loan', 'Passport Application', 'Scholarship Application', 'Internship Verification', 'Competitive Exam', 'Railway Concession Pass', 'Other'] },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${d.principal || 'The Principal'}
${blank(d.college)}

Date: ${fmtDate(d.date || today())}

Subject: Request for Bonafide Certificate

Respected Sir/Madam,

I, ${blank(d.name)}, am a student of ${blank(d.course)} at ${blank(d.college)} (Roll No.: ${blank(d.rollNo)}).

I kindly request you to issue a Bonafide Certificate in my name for the purpose of ${d.purpose || 'official requirements'}.

I need this certificate at the earliest and shall be grateful for your prompt assistance.

Thanking you.

Yours obediently,
${blank(d.name)}
${blank(d.course)}
Roll No.: ${blank(d.rollNo)}`,
  },
  {
    id: 'tc-request',
    name: 'Transfer Certificate (TC) Request',
    nameHi: 'स्थानांतरण प्रमाणपत्र (TC) अनुरोध',
    category: 'school',
    icon: '📄',
    description: 'Request TC from school or college.',
    fields: [
      { key: 'name', label: 'Student Name', placeholder: 'Karan Singh', type: 'text', required: true },
      { key: 'parentName', label: "Parent's Name", placeholder: 'Mr. Baldev Singh', type: 'text' },
      { key: 'class', label: 'Class / Course', placeholder: 'Class 10 / B.Com 2nd Year', type: 'text', required: true },
      { key: 'rollNo', label: 'Roll/Admission Number', placeholder: 'A-2023-789', type: 'text' },
      { key: 'principal', label: 'Addressed To', placeholder: 'The Principal', type: 'text' },
      { key: 'institution', label: 'School/College Name', placeholder: 'St. Xavier High School, Mumbai', type: 'text', required: true },
      { key: 'reason', label: 'Reason for TC', placeholder: 'My family is relocating to Bangalore due to my father\'s job transfer.', type: 'textarea', required: true },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${d.principal || 'The Principal'}
${blank(d.institution)}

Date: ${fmtDate(d.date || today())}

Subject: Request for Transfer Certificate

Respected Sir/Madam,

I, ${blank(d.name)}${d.parentName ? ` (${d.parentName}'s ward)` : ''}, am a student of ${blank(d.class)}${d.rollNo ? ` (Roll No.: ${d.rollNo})` : ''} in your esteemed institution.

I request you to kindly issue my Transfer Certificate (TC) due to the following reason:

${d.reason || '(Reason for requesting TC)'}

I have cleared all dues and returned all library books. I request you to process my TC at the earliest.

Thanking you.

Yours obediently,
${blank(d.name)}${d.parentName ? `\n(Parent: ${d.parentName})` : ''}
${blank(d.class)}${d.rollNo ? `\nRoll No.: ${d.rollNo}` : ''}`,
  },

  /* ---- OFFICIAL / GOVT ---- */
  {
    id: 'complaint-letter',
    name: 'Complaint Letter',
    nameHi: 'शिकायत पत्र',
    category: 'official',
    icon: '⚠️',
    description: 'Formal complaint to an organization, office, or authority.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Sunita Devi', type: 'text', required: true },
      { key: 'address', label: 'Your Address', placeholder: '56, Rajpur Road, Dehradun', type: 'textarea', required: true },
      { key: 'phone', label: 'Phone Number', placeholder: '9988776655', type: 'text' },
      { key: 'addressedTo', label: 'Addressed To', placeholder: 'The Municipal Commissioner', type: 'text', required: true },
      { key: 'organization', label: 'Organization/Office', placeholder: 'Dehradun Municipal Corporation', type: 'text', required: true },
      { key: 'subject', label: 'Complaint Subject', placeholder: 'Poor sanitation and garbage collection in Ward 15', type: 'text', required: true },
      { key: 'complaint', label: 'Complaint Details', placeholder: 'Garbage has not been collected in our area for the past 2 weeks. The overflowing bins are causing health hazards and foul smell.', type: 'textarea', required: true },
      { key: 'action', label: 'Action Requested', placeholder: 'Immediate resumption of daily garbage collection and cleaning of the area.', type: 'textarea' },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.addressedTo)}
${blank(d.organization)}

Date: ${fmtDate(d.date || today())}

Subject: ${d.subject || 'Complaint'}

Respected Sir/Madam,

I, ${blank(d.name)}, a resident of ${d.address || '___________'}, am writing this letter to bring to your notice a serious concern regarding ${d.subject ? d.subject.toLowerCase() : 'the following matter'}.

${d.complaint || '(Complaint details)'}

${d.action ? `I request you to kindly take the following action:\n\n${d.action}` : 'I request you to kindly look into this matter and take necessary action at the earliest.'}

If the issue is not resolved within a reasonable timeframe, I shall be compelled to escalate this matter to higher authorities.

${d.phone ? `You may reach me at ${d.phone} for any further information.` : ''}

Thanking you.

Yours faithfully,
${blank(d.name)}
${d.address || ''}`,
  },
  {
    id: 'noc-request',
    name: 'NOC Request Letter',
    nameHi: 'अनापत्ति प्रमाणपत्र (NOC) अनुरोध',
    category: 'official',
    icon: '✅',
    description: 'Request No Objection Certificate from society, employer, etc.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Vijay Patil', type: 'text', required: true },
      { key: 'addressedTo', label: 'Addressed To', placeholder: 'The Secretary', type: 'text', required: true },
      { key: 'organization', label: 'Organization', placeholder: 'Green Valley Housing Society', type: 'text', required: true },
      { key: 'purpose', label: 'Purpose of NOC', placeholder: 'Renovation of flat interior', type: 'select', options: ['Property Sale/Transfer', 'Interior Renovation', 'Passport Application', 'Vehicle Transfer', 'Business Registration', 'Loan Application', 'Other'] },
      { key: 'details', label: 'Additional Details', placeholder: 'I wish to renovate my kitchen and bathroom in Flat 302, Building A.', type: 'textarea' },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.addressedTo)}
${blank(d.organization)}

Date: ${fmtDate(d.date || today())}

Subject: Request for No Objection Certificate (NOC) — ${d.purpose || 'General Purpose'}

Respected Sir/Madam,

I, ${blank(d.name)}, am writing this letter to request a No Objection Certificate (NOC) from your office for the purpose of ${d.purpose ? d.purpose.toLowerCase() : 'the mentioned purpose'}.

${d.details || 'I require this NOC for official purposes and shall provide any additional documents if required.'}

I request you to kindly issue the NOC at the earliest.

Thanking you.

Yours sincerely,
${blank(d.name)}`,
  },

  /* ---- PERSONAL ---- */
  {
    id: 'landlord-notice',
    name: 'Notice to Vacate (Tenant to Landlord)',
    nameHi: 'मकान खाली करने की सूचना',
    category: 'personal',
    icon: '🏡',
    description: 'Inform your landlord that you plan to vacate the property.',
    fields: [
      { key: 'name', label: 'Your Name (Tenant)', placeholder: 'Arjun Nair', type: 'text', required: true },
      { key: 'address', label: 'Rented Property Address', placeholder: 'Flat 201, Sunshine Apartments, Koramangala', type: 'textarea', required: true },
      { key: 'landlord', label: 'Landlord Name', placeholder: 'Mr. Mohan Das', type: 'text', required: true },
      { key: 'vacateDate', label: 'Planned Vacating Date', placeholder: '', type: 'date', required: true },
      { key: 'noticePeriod', label: 'Notice Period as per Agreement', placeholder: '1 month', type: 'select', options: ['15 days', '1 month', '2 months', '3 months'] },
      { key: 'reason', label: 'Reason (optional)', placeholder: 'I am relocating to Hyderabad for a new job.', type: 'textarea' },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.landlord)}
(Landlord)

Date: ${fmtDate(d.date || today())}

Subject: Notice to Vacate — ${d.noticePeriod || '1 month'} Prior Notice

Dear ${blank(d.landlord)},

I, ${blank(d.name)}, am currently residing at ${d.address || '___________'} as your tenant.

This letter serves as a formal notice that I intend to vacate the above-mentioned premises on or before ${fmtDate(d.vacateDate)}, in accordance with the ${d.noticePeriod || '1 month'} notice period stipulated in our rent agreement.

${d.reason || ''}

I request you to kindly:
1. Inspect the property at a mutually convenient time before the vacating date.
2. Refund my security deposit after deducting any legitimate charges, if applicable.
3. Arrange for the final meter readings (electricity, water, gas).

I shall ensure the property is returned in good condition, subject to normal wear and tear.

Thanking you for being a considerate landlord.

Yours sincerely,
${blank(d.name)}`,
  },
  {
    id: 'character-certificate-request',
    name: 'Character Certificate Request',
    nameHi: 'चरित्र प्रमाणपत्र अनुरोध',
    category: 'personal',
    icon: '🏅',
    description: 'Request character/conduct certificate from institution or police.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Pooja Yadav', type: 'text', required: true },
      { key: 'fatherName', label: "Father's Name", placeholder: 'Shri Ramesh Yadav', type: 'text' },
      { key: 'address', label: 'Your Address', placeholder: '12, Civil Lines, Jaipur', type: 'textarea', required: true },
      { key: 'addressedTo', label: 'Addressed To', placeholder: 'The Station House Officer', type: 'text', required: true },
      { key: 'organization', label: 'Police Station / Institution', placeholder: 'Civil Lines Police Station, Jaipur', type: 'text', required: true },
      { key: 'purpose', label: 'Purpose', placeholder: 'Government job application', type: 'select', options: ['Government Job Application', 'Passport Application', 'Visa Application', 'Court Requirement', 'Education Admission', 'Other'] },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.addressedTo)}
${blank(d.organization)}

Date: ${fmtDate(d.date || today())}

Subject: Request for Character/Police Verification Certificate

Respected Sir/Madam,

I, ${blank(d.name)}${d.fatherName ? `, S/o / D/o ${d.fatherName}` : ''}, a resident of ${d.address || '___________'}, respectfully request you to issue a Character Certificate / Police Verification Certificate in my name.

This certificate is required for ${d.purpose ? d.purpose.toLowerCase() : 'official purposes'}.

I hereby declare that I have no criminal record and have not been involved in any unlawful activities. I am ready to provide any additional documents or information required for the verification process.

Thanking you.

Yours faithfully,
${blank(d.name)}`,
  },
  {
    id: 'permission-letter',
    name: 'Permission Request Letter',
    nameHi: 'अनुमति अनुरोध पत्र',
    category: 'personal',
    icon: '🙏',
    description: 'General permission request for event, activity, etc.',
    fields: [
      { key: 'name', label: 'Your Name', placeholder: 'Aman Gupta', type: 'text', required: true },
      { key: 'addressedTo', label: 'Addressed To', placeholder: 'The RWA President', type: 'text', required: true },
      { key: 'organization', label: 'Organization/Authority', placeholder: 'Green Park RWA, Block C', type: 'text', required: true },
      { key: 'subject', label: 'Permission For', placeholder: 'Organizing a birthday party in the community hall', type: 'text', required: true },
      { key: 'details', label: 'Details', placeholder: 'I would like to organize a birthday celebration for my daughter on 25th March 2026 from 5 PM to 9 PM in the community hall. Expected guests: 30-40 people.', type: 'textarea', required: true },
      { key: 'date', label: 'Date', placeholder: '', type: 'date' },
    ],
    generate: (d) => `To,
${blank(d.addressedTo)}
${blank(d.organization)}

Date: ${fmtDate(d.date || today())}

Subject: Permission Request — ${d.subject || '(Purpose)'}

Respected Sir/Madam,

I, ${blank(d.name)}, am writing to respectfully request your permission for the following:

${d.details || '(Details of the request)'}

I assure you that all necessary precautions will be taken and the rules of the premises will be strictly followed. Any damage, if caused, shall be my responsibility.

I would be grateful if you could grant permission for the same.

Thanking you.

Yours sincerely,
${blank(d.name)}`,
  },
];
