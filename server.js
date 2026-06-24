const express = require('express');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const multer = require('multer');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const UPLOADS_DIR = path.join(__dirname, 'uploads');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'applications.json');

fs.mkdirSync(DATA_DIR, { recursive: true });
fs.mkdirSync(UPLOADS_DIR, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOADS_DIR),
  filename: (req, file, cb) => {
    const safeName = `${Date.now()}-${file.originalname.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;
    cb(null, safeName);
  }
});

const upload = multer({ storage });

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'technova_super_secret',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));

function loadApplications() {
  try {
    const raw = fs.readFileSync(APPLICATIONS_FILE, 'utf8');
    return JSON.parse(raw || '[]');
  } catch (error) {
    return [];
  }
}

function saveApplications(applications) {
  fs.writeFileSync(APPLICATIONS_FILE, JSON.stringify(applications, null, 2), 'utf8');
}

function ensureApplicantAuth(req, res, next) {
  if (req.session.user || req.session.admin) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

function ensureAdminAuth(req, res, next) {
  if (req.session.admin) {
    next();
  } else {
    res.redirect('/login.html');
  }
}

async function createTransporter() {
  if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_SECURE === 'true',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    });
  }

  const testAccount = await nodemailer.createTestAccount();
  return nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false,
    auth: {
      user: testAccount.user,
      pass: testAccount.pass
    }
  });
}

function getOfferMessage(application) {
  return `Dear ${application.fullName},\n\n` +
    `Congratulations! Your Technova internship application has been approved. We are excited to welcome you to the ${application.domain} track.\n\n` +
    `Offer details:\n` +
    `- Internship Track: ${application.domain}\n` +
    `- Start Date: ${application.startDate || 'Within 7 days of acceptance'}\n` +
    `- Assigned Tasks: ${application.tasks || 'Complete the onboarding project and review the mentor notes.'}\n\n` +
    `Next Steps:\n` +
    `1. Confirm your acceptance by replying to this email.\n` +
    `2. Review the onboarding task packet attached in the portal.\n\n` +
    `We look forward to helping you build your portfolio and grow your skills.\n\n` +
    `Best regards,\nTechnova Internship Team`;
}

app.get('/', ensureApplicantAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/index.html', ensureApplicantAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin', ensureAdminAuth, (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

app.get('/login.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

app.post('/login', (req, res) => {
  const { role, email, password } = req.body;

  if (role === 'admin') {
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@technova.com';
    const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
    if (email === adminEmail && password === adminPassword) {
      req.session.admin = { email };
      return res.redirect('/admin');
    }
    return res.redirect('/login.html?error=invalid-admin');
  }

  if (role === 'applicant') {
    if (!email || !password) {
      return res.redirect('/login.html?error=missing');
    }
    req.session.user = { email };
    return res.redirect('/');
  }

  res.redirect('/login.html');
});

app.get('/logout', (req, res) => {
  req.session.destroy(() => {
    res.redirect('/login.html');
  });
});

app.post('/api/apply', ensureApplicantAuth, upload.single('resume'), (req, res) => {
  const { fullName, email, message, github, linkedin, leetcode, domain } = req.body;
  const resumeFile = req.file ? `/uploads/${req.file.filename}` : null;

  if (!fullName || !email || !message || !github || !linkedin || !leetcode || !domain || !resumeFile) {
    return res.status(400).json({ success: false, message: 'All fields and resume are required.' });
  }

  const applications = loadApplications();
  const application = {
    id: Date.now().toString(),
    fullName,
    email,
    message,
    github,
    linkedin,
    leetcode,
    domain,
    resume: resumeFile,
    status: 'pending',
    createdAt: new Date().toISOString()
  };

  applications.unshift(application);
  saveApplications(applications);

  res.json({ success: true, message: 'Your internship application has been submitted. Admin will review it shortly.' });
});

app.get('/api/applications', ensureAdminAuth, (req, res) => {
  const applications = loadApplications();
  res.json(applications);
});

app.post('/api/applications/:id/approve', ensureAdminAuth, async (req, res) => {
  const applications = loadApplications();
  const application = applications.find((app) => app.id === req.params.id);

  if (!application) {
    return res.status(404).json({ success: false, message: 'Application not found.' });
  }

  if (application.status === 'approved') {
    return res.json({ success: true, message: 'Application already approved.' });
  }

  application.status = 'approved';
  application.approvedAt = new Date().toISOString();
  application.tasks = 'Complete the onboarding challenge, review the Mentor Guide, and submit your first project demo.';
  saveApplications(applications);

  try {
    const transporter = await createTransporter();
    const mailOptions = {
      from: 'Technova HR <hr@technova.com>',
      to: application.email,
      subject: 'Technova Internship Offer Letter and Task Allocation',
      text: getOfferMessage(application),
      html: `<p>Dear ${application.fullName},</p>
             <p>Congratulations! Your Technova internship application has been approved for the <strong>${application.domain}</strong> track.</p>
             <p><strong>Offer details</strong></p>
             <ul>
               <li>Internship Track: ${application.domain}</li>
               <li>Start Date: Within 7 days of acceptance</li>
               <li>Assigned Tasks: Complete the onboarding challenge, review the Mentor Guide, and submit your first project demo.</li>
             </ul>
             <p>Please reply to this email to confirm your acceptance and access the onboarding packet in the portal.</p>
             <p>Best regards,<br>Technova Internship Team</p>`
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Offer email sent:', info.messageId);
    if (nodemailer.getTestMessageUrl(info)) {
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
    }

    return res.json({ success: true, message: 'Application approved and offer email sent.' });
  } catch (error) {
    console.error('Email error:', error);
    return res.status(500).json({ success: false, message: 'Approval saved but offer email failed to send.' });
  }
});

app.use('/uploads', express.static(UPLOADS_DIR));
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`Technova portal running at http://localhost:${PORT}`);
});
