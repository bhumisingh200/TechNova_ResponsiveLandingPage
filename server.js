const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const db = require('./db');

// Load environment variables from .env if it exists
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  fs.readFileSync(envPath, 'utf8').split('\n').forEach(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) return;
    const parts = trimmed.split('=');
    if (parts.length > 1) {
      const key = parts[0].trim();
      const val = parts.slice(1).join('=').trim().replace(/^['"]|['"]$/g, '');
      process.env[key] = val;
    }
  });
}

const mail = require('./mail');

function generateOfferLetterHtml(fullName, domain, onboardingTasks) {
  const offerDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const currentYear = new Date().getFullYear();
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Internship Offer Letter - TechNova</title>
  <style>
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0f172a;
      line-height: 1.6;
      background-color: #f8fafc;
      margin: 0;
      padding: 0;
      -webkit-font-smoothing: antialiased;
    }
    .email-container {
      max-width: 600px;
      margin: 40px auto;
      padding: 0;
      border: 1px solid #e2e8f0;
      border-radius: 20px;
      background-color: #ffffff;
      box-shadow: 0 10px 25px rgba(124, 58, 237, 0.05);
      overflow: hidden;
    }
    .header-banner {
      background: linear-gradient(135deg, #7c3aed, #0d9488);
      padding: 3rem 2rem;
      text-align: center;
      color: #ffffff;
    }
    .header-banner h1 {
      margin: 0;
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.025em;
    }
    .header-banner p {
      margin: 0.5rem 0 0 0;
      opacity: 0.9;
      font-size: 1.1rem;
      font-weight: 500;
    }
    .content-body {
      padding: 2.5rem 2rem;
    }
    .greeting {
      font-size: 1.25rem;
      font-weight: 700;
      color: #0f172a;
      margin-bottom: 1rem;
    }
    .highlight-box {
      background: rgba(124, 58, 237, 0.04);
      border: 1px dashed rgba(124, 58, 237, 0.2);
      border-radius: 12px;
      padding: 1.25rem;
      margin: 1.5rem 0;
    }
    .highlight-item {
      display: flex;
      justify-content: space-between;
      margin-bottom: 0.5rem;
    }
    .highlight-item:last-child {
      margin-bottom: 0;
    }
    .highlight-label {
      font-weight: 600;
      color: #64748b;
    }
    .highlight-value {
      font-weight: 700;
      color: #7c3aed;
    }
    .section-title {
      font-size: 1.1rem;
      font-weight: 700;
      color: #0f172a;
      margin-top: 2rem;
      margin-bottom: 0.75rem;
      text-transform: uppercase;
      letter-spacing: 0.05em;
    }
    .tasks-card {
      background: #f8fafc;
      padding: 1.5rem;
      border-radius: 12px;
      border-left: 4px solid #0d9488;
      margin: 1.5rem 0;
      font-size: 0.95rem;
    }
    .cta-container {
      text-align: center;
      margin: 2.5rem 0 1.5rem 0;
    }
    .btn {
      display: inline-block;
      padding: 1rem 2.2rem;
      background: linear-gradient(135deg, #7c3aed, #0d9488);
      color: #ffffff !important;
      text-decoration: none;
      border-radius: 999px;
      font-weight: 700;
      box-shadow: 0 4px 15px rgba(124, 58, 237, 0.3);
    }
    .signature-section {
      margin-top: 3rem;
      border-top: 1px solid #f1f5f9;
      padding-top: 1.5rem;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .signature-details h4 {
      margin: 0;
      color: #0f172a;
      font-size: 1rem;
    }
    .signature-details p {
      margin: 0.25rem 0 0 0;
      color: #64748b;
      font-size: 0.85rem;
    }
    .badge-seal {
      border: 2px solid #0d9488;
      color: #0d9488;
      font-weight: 800;
      text-transform: uppercase;
      font-size: 0.75rem;
      padding: 0.5rem 0.75rem;
      border-radius: 6px;
      transform: rotate(-5deg);
      letter-spacing: 0.1em;
    }
    .footer {
      background-color: #f1f5f9;
      padding: 1.5rem 2rem;
      text-align: center;
      color: #64748b;
      font-size: 0.85rem;
      border-top: 1px solid #e2e8f0;
    }
    .footer a {
      color: #7c3aed;
      text-decoration: none;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header-banner">
      <h1>TECHNOVA</h1>
      <p>INTERNSHIP OFFER LETTER</p>
    </div>
    <div class="content-body">
      <div class="greeting">Dear \${fullName},</div>
      <p>On behalf of Technova, we are absolutely delighted to extend our official offer for you to join us as an intern! Our selection committee was highly impressed by your credentials and your commitment to tech innovation.</p>
      
      <div class="highlight-box">
        <div class="highlight-item">
          <span class="highlight-label">Internship Track:</span>
          <span class="highlight-value">\${domain}</span>
        </div>
        <div class="highlight-item">
          <span class="highlight-label">Location:</span>
          <span class="highlight-value">Remote (Worldwide)</span>
        </div>
        <div class="highlight-item">
          <span class="highlight-label">Offer Issued:</span>
          <span class="highlight-value">\${offerDate}</span>
        </div>
      </div>

      <p>As a Technova intern, you will gain hands-on industry experience by building premium projects, collaborating with professional mentors, and refining your engineering capability. Your success will culminate in an official Certificate of Completion and grading review.</p>

      <div class="section-title">Your Onboarding Curriculum</div>
      <div class="tasks-card">
        <strong>Assigned Initial Tasks:</strong><br>
        \${onboardingTasks}
      </div>

      <p>To accept this offer and activate your internship status, please visit the portal page. If you are already logged in, you can accept directly from your candidate dashboard.</p>

      <div class="cta-container">
        <a href="http://localhost:3000/" class="btn">View &amp; Accept Offer</a>
      </div>

      <div class="signature-section">
        <div class="signature-details">
          <h4>HR Operations Team</h4>
          <p>Technova Internship Portal</p>
        </div>
        <div class="badge-seal">OFFICIAL OFFER</div>
      </div>
    </div>
    <div class="footer">
      <p>This is an automated system email. If you have questions, please reach out to <a href="mailto:support@technova.com">support@technova.com</a>.</p>
      <p>&copy; \${currentYear} Technova Corp. All rights reserved.</p>
    </div>
  </div>
</body>
</html>`;
}

const PORT = process.env.PORT || 3000;
const UPLOADS_DIR = path.join(__dirname, 'uploads');

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Memory-based session store
const sessions = {};

function parseCookies(req) {
  const list = {};
  const rc = req.headers.cookie;
  if (rc) {
    rc.split(';').forEach(cookie => {
      const parts = cookie.split('=');
      list[parts.shift().trim()] = decodeURIComponent(parts.join('='));
    });
  }
  return list;
}

function getSession(req) {
  const cookies = parseCookies(req);
  const sid = cookies.sessionId;
  if (sid && sessions[sid]) {
    return sessions[sid];
  }
  return null;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => resolve(body));
    req.on('error', err => reject(err));
  });
}

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain'
};

const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  let pathname = parsedUrl.pathname;
  const method = req.method;

  // Session check
  const session = getSession(req);
  console.log(`[Request] ${method} ${pathname} - Session: ${session ? JSON.stringify(session) : 'None'} - Cookie Header: ${req.headers.cookie || 'None'}`);

  // 1. API: Login
  if (pathname === '/login' && method === 'POST') {
    try {
      const body = await readBody(req);
      let params;
      try {
        params = JSON.parse(body);
      } catch (e) {
        params = querystring.parse(body);
      }
      const { role, email, password } = params;
      console.log(`[Login] Role: ${role}, Email: ${email}`);

      if (role === 'admin') {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@technova.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        if (email === adminEmail && password === adminPassword) {
          const sid = Math.random().toString(36).substr(2) + Date.now().toString(36);
          sessions[sid] = { role: 'admin', email };
          console.log(`[Login] Admin login success. Setting session: ${sid}`);
          res.writeHead(200, {
            'Set-Cookie': `sessionId=${sid}; Path=/; HttpOnly; SameSite=Strict`,
            'Content-Type': 'application/json'
          });
          res.end(JSON.stringify({ success: true, role: 'admin' }));
          return;
        }
        console.log(`[Login] Admin login invalid credentials.`);
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Invalid admin credentials.' }));
        return;
      }

      if (role === 'applicant') {
        if (!email || !password) {
          console.log(`[Login] Applicant login missing fields.`);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Email and password are required.' }));
          return;
        }
        const sid = Math.random().toString(36).substr(2) + Date.now().toString(36);
        sessions[sid] = { role: 'applicant', email };
        console.log(`[Login] Applicant login success. Setting session: ${sid}`);
        res.writeHead(200, {
          'Set-Cookie': `sessionId=${sid}; Path=/; HttpOnly; SameSite=Strict`,
          'Content-Type': 'application/json'
        });
        res.end(JSON.stringify({ success: true, role: 'applicant' }));
        return;
      }

      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Invalid role selection.' }));
    } catch (e) {
      console.error('[Login Error]', e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Internal Server Error' }));
    }
    return;
  }

  // 2. API: Logout
  if (pathname === '/logout') {
    const cookies = parseCookies(req);
    const sid = cookies.sessionId;
    console.log(`[Logout] Session: ${sid}`);
    if (sid && sessions[sid]) {
      delete sessions[sid];
    }
    res.writeHead(302, {
      'Set-Cookie': 'sessionId=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict',
      'Location': '/'
    });
    res.end();
    return;
  }

  // Redirect deprecated admin/login file paths to root page
  if (pathname === '/login.html' || (pathname === '/login' && method === 'GET')) {
    res.writeHead(302, { 'Location': '/' });
    res.end();
    return;
  }
  if (pathname === '/admin.html' || pathname === '/admin') {
    res.writeHead(302, { 'Location': '/' });
    res.end();
    return;
  }

  // Auth Protection Rules for Protected APIs and pages
  const isApi = pathname.startsWith('/api/');
  if (!session) {
    // Block protected APIs with a clean 401 response instead of a HTML redirect
    if (isApi && pathname !== '/api/subscribe' && pathname !== '/api/status' && pathname !== '/api/apply') {
      console.log(`[Auth] Blocked unauthenticated API request to ${pathname}.`);
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, loggedIn: false, message: 'Sign in to access this portal.' }));
      return;
    }
  }

  // 3. API: Status (Unified Endpoint for Session check & Application status)
  if (pathname === '/api/status' && method === 'GET') {
    try {
      if (!session) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, loggedIn: false }));
        return;
      }
      
      const email = session.email;
      const role = session.role;
      
      if (role === 'admin') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, loggedIn: true, role: 'admin', email }));
        return;
      }

      // Role is applicant
      const appRecord = db.querySingle(`SELECT * FROM applications WHERE email = ${db.escape(email)}`);
      
      if (appRecord) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          loggedIn: true, 
          role: 'applicant', 
          email, 
          status: appRecord.status, 
          application: appRecord 
        }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          loggedIn: true, 
          role: 'applicant', 
          email, 
          status: 'none' 
        }));
      }
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server error retrieving status.' }));
    }
    return;
  }

  // 4. API: Apply Submission (JSON parsing to bypass multer)
  if (pathname === '/api/apply' && method === 'POST') {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body);
      
      const { fullName, email, message, github, linkedin, leetcode, domain, resumeName, resumeData } = payload;
      
      if (!fullName || !email || !message || !github || !linkedin || !leetcode || !domain || !resumeName || !resumeData) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'All fields and resume file are required.' }));
        return;
      }

      // Decode and save resume
      const buffer = Buffer.from(resumeData, 'base64');
      const cleanName = `${Date.now()}-${resumeName.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9.-]/g, '')}`;
      fs.writeFileSync(path.join(UPLOADS_DIR, cleanName), buffer);
      const resumeUrl = `/uploads/${cleanName}`;

      const appId = Date.now().toString() + Math.random().toString(36).substr(2, 4);
      const createdAt = new Date().toISOString();

      db.execute(`
        INSERT INTO applications (id, fullName, email, message, github, linkedin, leetcode, domain, resume, status, createdAt)
        VALUES (
          ${db.escape(appId)},
          ${db.escape(fullName)},
          ${db.escape(email)},
          ${db.escape(message)},
          ${db.escape(github)},
          ${db.escape(linkedin)},
          ${db.escape(leetcode)},
          ${db.escape(domain)},
          ${db.escape(resumeUrl)},
          'pending',
          ${db.escape(createdAt)}
        )
      `);

      // Set cookie to auto-login the applicant on success!
      const sid = Math.random().toString(36).substr(2) + Date.now().toString(36);
      sessions[sid] = { role: 'applicant', email };
      console.log(`[Apply] Auto-login success for ${email}. Session: ${sid}`);

      res.writeHead(200, {
        'Set-Cookie': `sessionId=${sid}; Path=/; HttpOnly; SameSite=Strict`,
        'Content-Type': 'application/json'
      });
      res.end(JSON.stringify({ success: true, message: 'Your internship application has been submitted successfully.' }));
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Internal server error processing application.' }));
    }
    return;
  }

  // 5. API: Get Applications (Admin view)
  if (pathname === '/api/applications' && method === 'GET') {
    if (session.role !== 'admin') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
      return;
    }

    try {
      const apps = db.queryRows(`SELECT * FROM applications ORDER BY createdAt DESC`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(apps));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Server database query failed.' }));
    }
    return;
  }

  // 6. API: Approve Application
  if (pathname.startsWith('/api/applications/') && pathname.endsWith('/approve') && method === 'POST') {
    if (session.role !== 'admin') {
      res.writeHead(403, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Access denied.' }));
      return;
    }

    try {
      const parts = pathname.split('/');
      const appId = parts[3];
      const approvedAt = new Date().toISOString();
      const onboardingTasks = 'Complete the onboarding challenge: Build a layout mockup, review the Mentor Guide in the repository, and submit your first project demo.';

      // Fetch applicant details before update for email
      const applicant = db.querySingle(`SELECT fullName, email, domain FROM applications WHERE id = ${db.escape(appId)}`);

      db.execute(`
        UPDATE applications 
        SET status = 'approved', approvedAt = ${db.escape(approvedAt)}, tasks = ${db.escape(onboardingTasks)}
        WHERE id = ${db.escape(appId)}
      `);

      if (applicant) {
        const subject = `Technova Internship Offer - ${applicant.fullName}`;
        const html = generateOfferLetterHtml(applicant.fullName, applicant.domain, onboardingTasks);

        // Send email asynchronously so HTTP request resolves immediately
        mail.sendMail({ to: applicant.email, subject, html }).catch(err => {
          console.error(`[Mail Error] Failed to send email to ${applicant.email}:`, err);
        });
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Application approved and onboarding portal generated.' }));
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Approval update failed.' }));
    }
    return;
  }

  // 6.5. API: Download Offer Letter
  if (pathname === '/api/applications/download-offer' && method === 'GET') {
    try {
      let applicant = null;
      if (session.role === 'admin') {
        const appId = parsedUrl.searchParams.get('id');
        if (!appId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Missing application ID.' }));
          return;
        }
        applicant = db.querySingle(`SELECT * FROM applications WHERE id = ${db.escape(appId)}`);
      } else {
        applicant = db.querySingle(`SELECT * FROM applications WHERE email = ${db.escape(session.email)}`);
      }

      if (!applicant || (applicant.status !== 'approved' && applicant.status !== 'accepted')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Offer letter not available or applicant not approved.' }));
        return;
      }

      const html = generateOfferLetterHtml(applicant.fullName, applicant.domain, applicant.tasks || 'Complete onboarding tasks.');
      const safeName = applicant.fullName.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_-]/g, '');
      res.writeHead(200, {
        'Content-Type': 'text/html',
        'Content-Disposition': `attachment; filename="Technova_Offer_Letter_${safeName}.html"`
      });
      res.end(html);
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to download offer letter.' }));
    }
    return;
  }

  // 6.6. API: Email Offer Letter
  if (pathname === '/api/applications/email-offer' && method === 'POST') {
    try {
      let applicant = null;
      let appId = parsedUrl.searchParams.get('id');
      
      if (!appId) {
        const body = await readBody(req);
        try {
          const payload = JSON.parse(body);
          appId = payload.id;
        } catch (e) {}
      }

      if (session.role === 'admin') {
        if (!appId) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ success: false, message: 'Missing application ID.' }));
          return;
        }
        applicant = db.querySingle(`SELECT * FROM applications WHERE id = ${db.escape(appId)}`);
      } else {
        applicant = db.querySingle(`SELECT * FROM applications WHERE email = ${db.escape(session.email)}`);
      }

      if (!applicant || (applicant.status !== 'approved' && applicant.status !== 'accepted')) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Offer letter not available or applicant not approved.' }));
        return;
      }

      const subject = `Technova Internship Offer - ${applicant.fullName}`;
      const html = generateOfferLetterHtml(applicant.fullName, applicant.domain, applicant.tasks || 'Complete onboarding tasks.');

      // Send email
      await mail.sendMail({ to: applicant.email, subject, html });

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Offer letter email sent successfully!' }));
    } catch (e) {
      console.error(e);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Failed to send offer letter email.' }));
    }
    return;
  }

  // 7. API: Accept Offer
  if (pathname === '/api/accept' && method === 'POST') {
    try {
      const email = session.email;
      db.execute(`UPDATE applications SET status = 'accepted' WHERE email = ${db.escape(email)}`);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Offer accepted! Welcome to the Technova program!' }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Acceptance failed.' }));
    }
    return;
  }

  // 8. API: Newsletter Subscribe
  if (pathname === '/api/subscribe' && method === 'POST') {
    try {
      const body = await readBody(req);
      const payload = JSON.parse(body);
      const email = payload.email;

      if (!email) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: false, message: 'Email address is required.' }));
        return;
      }

      const now = new Date().toISOString();
      db.execute(`
        REPLACE INTO newsletter_subscribers (email, subscribedAt)
        VALUES (${db.escape(email)}, ${db.escape(now)})
      `);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Subscribed successfully!' }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Subscription failed.' }));
    }
    return;
  }

  // 9. Static File Serving
  if (pathname.startsWith('/TechNova_ResponsiveLandingPage/')) {
    pathname = pathname.replace('/TechNova_ResponsiveLandingPage', '');
  }
  if (pathname === '/') pathname = '/index.html';
  if (pathname === '/admin') pathname = '/admin.html';

  const filePath = path.join(__dirname, pathname);

  // Check if file is outside workspace for security
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403, { 'Content-Type': 'text/plain' });
    res.end('Access Denied');
    return;
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      res.end('File Not Found');
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';

    res.writeHead(200, { 'Content-Type': contentType });
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`Technova portal running at http://localhost:${PORT}`);
});
