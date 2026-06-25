# Technova Internship Portal

> A premium, modern, fully responsive internship portal with student application submission, admin dashboard for review & approval, and automated offer letter generation.

---

## ✨ Features

### User-Facing Features
- **Hero Section** with typing animations and floating cards.
- **Internship Domain Showcase** (Web Dev, Java, AI/ML, Data Science, Cyber Security, UI/UX).
- **Learning Journey Timeline** with 5-step interactive process.
- **Animated Statistics Counter** (scrolls on viewport entrance).
- **Testimonials Carousel** with auto-slide and manually indexed dot markers.
- **FAQ Accordion** with smooth expand/collapse.
- **Interactive Application Form** collecting GitHub, LinkedIn, LeetCode, and resume files.
- **Milestone Onboarding Dashboard** displaying current status (None, Pending, Approved, Accepted) and onboarding tasks once approved.
- **Download & Email Offer**: Candidates can download their official offer letter as a beautiful offline HTML document or trigger a copy to be emailed to their inbox on-demand from their status modal.
- **Dark/Light Theme Toggle** (persists via localStorage and prevents theme flashes on login/admin pages).
- **Premium Glassmorphic Aesthetics** with beautiful gradient overlays, smooth scroll transitions, and custom scrollbar styling.

### Admin Features
- **Secure Admin Dashboard** (login-protected via custom HTTP-only cookies).
- **View All Applications** with real-time student details, tracks, and resume download links.
- **Approve Applications** with one click.
- **Automated Offer Letter** HTML email notification generated and sent to the student upon approval.
- **Application Status Tracking** (shows pending, approved, or accepted state).
- **Download & Resend Offers**: Admins can download the generated offer letter as a beautiful standalone HTML file or manually trigger a resend email directly from the admin dashboard for any approved/accepted applicant.

### Technical Highlights
- **Backend**: Pure Node.js built-in `http`, `fs`, `path`, and `querystring` modules (completely dependency-free, no Express or third-party frameworks).
- **Database**: Persistent MySQL database storing `applications` and `newsletter_subscribers`. Queries are run safely using a custom child-process shell executor wrapper in `db.js`.
- **Session Management**: Lightweight in-memory session store mapped to secure HTTP-only cookies (`sessionId`).
- **File Upload**: Direct browser-to-server Base64 file parser (`FileReader` API) transferring resume data inside standard JSON POST requests, bypassing `multer` dependencies.
- **Email Service**: Custom, dependency-free SMTP mailer (`mail.js`) built with Node's native `net` and `tls` socket modules. It supports STARTTLS handshakes, AUTH LOGIN credentials, and automatically saves a duplicate `.html` copy of all outgoing mails inside `sent_emails/` folder for visual confirmation.
- **Theme System**: Persisted light/dark theme toggle leveraging CSS custom variables on `:root` and `.dark` blocks, and inline loading headers on static files.

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- MySQL Server (default port: `3306`)

### Database Setup
Ensure your local MySQL service is running and configure the schema:
1. Log in to your MySQL terminal and create tables:
   ```sql
   CREATE DATABASE IF NOT EXISTS technova_db;
   USE technova_db;

   CREATE TABLE IF NOT EXISTS applications (
     id VARCHAR(50) PRIMARY KEY,
     fullName VARCHAR(100),
     email VARCHAR(100),
     message TEXT,
     github VARCHAR(255),
     linkedin VARCHAR(255),
     leetcode VARCHAR(255),
     domain VARCHAR(100),
     resume VARCHAR(255),
     status VARCHAR(20) DEFAULT 'pending',
     tasks TEXT DEFAULT NULL,
     createdAt VARCHAR(50),
     approvedAt VARCHAR(50) DEFAULT NULL
   );

   CREATE TABLE IF NOT EXISTS newsletter_subscribers (
     id INT AUTO_INCREMENT PRIMARY KEY,
     email VARCHAR(100) UNIQUE,
     subscribedAt VARCHAR(50)
   );
   ```

### Configuration
Create a `.env` file in the root of `TechNova_ResponsiveLandingPage/` directory:
```env
PORT=3000
SESSION_SECRET=your_super_secret

# Admin Credentials
ADMIN_EMAIL=admin@technova.com
ADMIN_PASSWORD=Admin@123

# Database configuration
DB_HOST=localhost
DB_USER=root
DB_PASS=Bhumi@2006
DB_NAME=technova_db

# Optional SMTP email settings
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
```

### Installation & Run

1. **Navigate to the directory**
   ```bash
   cd TechNova_ResponsiveLandingPage
   ```

2. **Start the server** (runs using Node's standard executable)
   ```bash
   node server.js
   ```
   The portal is now running at `http://localhost:3000`.

---

## 📋 User Flow

### Student Application
1. Visit `http://localhost:3000/login.html`
2. Select "Applicant" role. Enter any email and password.
3. Observe the sticky **Application Status Bar** displaying "None".
4. Fill the application form with your details and upload a PDF resume.
5. Submit the application. The status bar immediately transitions to **PENDING**.

### Admin Review & Selection Email
1. Visit `http://localhost:3000/login.html`
2. Select "Admin" role. Login with `admin@technova.com` / `Admin@123`.
3. View all applicant entries inside the dashboard.
4. Click **Approve Application** on a student card.
5. An offer letter email is generated and sent via SMTP to the student's email, and a backup `.html` file is saved to `/sent_emails/`.

### Student Acceptance
1. Sign back in as the applicant.
2. The status bar displays **APPROVED** with an active **View Offer & Tasks** button.
3. Click the button to inspect the onboarding instructions, download the official offer letter for offline viewing, or trigger an email copy.
4. Click **Accept Internship Offer** to accept the offer. The database status transitions to **ACCEPTED**.

---

## 🎨 Design System & Highlights
- **Dynamic Variable Theme Engine:** Cards, buttons, inputs, icons, and labels transition automatically on theme toggle.
- **Forced Dark Footer:** Standardized dark footer theme ensuring high contrast and optimal legibility.
- **Smooth Intersection Observers:** Triggers scroll reveal animations and stats counting efficiently without blocking the main event thread.
- **Mobile Snapping Timeline:** Adapts timeline cards to a horizontal swipe container on mobile viewports.

---

## 📁 Project Structure

```
TechNova_ResponsiveLandingPage/
├── index.html              # Main landing page & applicant flow
├── login.html              # Applicant/Admin login
├── admin.html              # Admin review panel
├── script.js               # Client-side validation, base64 loader, observers
├── admin.js                # Admin card creation logic
├── server.js               # Built-in Node http server, session engine, file saver
├── db.js                   # MySQL child-process querying helper
├── mail.js                 # Native socket SMTP mailer and email file logger
├── styles.css              # Glassmorphic light/dark mode responsive stylesheet
├── sent_emails/            # Generated offer letter email HTML files
└── uploads/                # Resume PDF file storage
```
