const http = require('http');
const fs = require('fs');
const path = require('path');
const querystring = require('querystring');
const db = require('./db');

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

  // 1. API: Login
  if (pathname === '/login' && method === 'POST') {
    try {
      const body = await readBody(req);
      const params = querystring.parse(body);
      const { role, email, password } = params;

      if (role === 'admin') {
        const adminEmail = process.env.ADMIN_EMAIL || 'admin@technova.com';
        const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@123';
        if (email === adminEmail && password === adminPassword) {
          const sid = Math.random().toString(36).substr(2) + Date.now().toString(36);
          sessions[sid] = { role: 'admin', email };
          res.writeHead(302, {
            'Set-Cookie': `sessionId=${sid}; Path=/; HttpOnly; SameSite=Strict`,
            'Location': '/admin'
          });
          res.end();
          return;
        }
        res.writeHead(302, { 'Location': '/login.html?error=invalid-admin' });
        res.end();
        return;
      }

      if (role === 'applicant') {
        if (!email || !password) {
          res.writeHead(302, { 'Location': '/login.html?error=missing' });
          res.end();
          return;
        }
        const sid = Math.random().toString(36).substr(2) + Date.now().toString(36);
        sessions[sid] = { role: 'applicant', email };
        res.writeHead(302, {
          'Set-Cookie': `sessionId=${sid}; Path=/; HttpOnly; SameSite=Strict`,
          'Location': '/'
        });
        res.end();
        return;
      }

      res.writeHead(302, { 'Location': '/login.html' });
      res.end();
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
    return;
  }

  // 2. API: Logout
  if (pathname === '/logout') {
    const cookies = parseCookies(req);
    const sid = cookies.sessionId;
    if (sid && sessions[sid]) {
      delete sessions[sid];
    }
    res.writeHead(302, {
      'Set-Cookie': 'sessionId=; Path=/; Max-Age=0; HttpOnly; SameSite=Strict',
      'Location': '/login.html'
    });
    res.end();
    return;
  }

  // Auth Protection Rules
  const isApi = pathname.startsWith('/api/');
  if (!session) {
    if (pathname === '/' || pathname === '/index.html' || pathname === '/admin' || pathname === '/admin.html' || (isApi && pathname !== '/api/subscribe')) {
      res.writeHead(302, { 'Location': '/login.html' });
      res.end();
      return;
    }
  } else {
    // If logged in, block applicant from admin, and redirect signed-in users from login.html
    if (pathname === '/login.html') {
      res.writeHead(302, { 'Location': session.role === 'admin' ? '/admin' : '/' });
      res.end();
      return;
    }
    if ((pathname === '/admin' || pathname === '/admin.html') && session.role !== 'admin') {
      res.writeHead(302, { 'Location': '/' });
      res.end();
      return;
    }
  }

  // 3. API: Status
  if (pathname === '/api/status' && method === 'GET') {
    try {
      const email = session.email;
      const appRecord = db.querySingle(`SELECT * FROM applications WHERE email = ${db.escape(email)}`);
      
      if (appRecord) {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, status: appRecord.status, application: appRecord }));
      } else {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ success: true, status: 'none' }));
      }
    } catch (e) {
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

      res.writeHead(200, { 'Content-Type': 'application/json' });
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

      db.execute(`
        UPDATE applications 
        SET status = 'approved', approvedAt = ${db.escape(approvedAt)}, tasks = ${db.escape(onboardingTasks)}
        WHERE id = ${db.escape(appId)}
      `);

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: true, message: 'Application approved and onboarding portal generated.' }));
    } catch (e) {
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ success: false, message: 'Approval update failed.' }));
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
