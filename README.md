# Technova Internship Portal

> A premium, modern, fully responsive internship portal with student application submission, admin dashboard for review & approval, and automated offer letter generation.

## ✨ Features

### User-Facing Features
- **Hero Section** with typing animations and floating cards
- **Internship Domain Showcase** (Web Dev, Java, AI/ML, Data Science, Cyber Security, UI/UX)
- **Learning Journey Timeline** with 5-step process
- **Animated Statistics Counter** (scrolls on viewport)
- **Testimonials Carousel** with auto-slide
- **FAQ Accordion** with smooth expand/collapse
- **Interactive Application Form** collecting GitHub, LinkedIn, LeetCode, resume
- **Dark/Light Theme Toggle** (persists via localStorage)
- **Responsive Design** across all devices
- **Premium Glassmorphism** UI with gradient overlays
- **Smooth Scroll Animations** on section reveal

### Admin Features
- **Secure Admin Dashboard** (login-protected)
- **View All Applications** with applicant details
- **Approve Applications** with one click
- **Automated Offer Letter** email generation
- **Application Status Tracking** (pending/approved)

### Technical Highlights
- **Backend**: Express.js + Node.js
- **Database**: JSON-based (applications.json)
- **Session Management**: Express sessions with 24-hour persistence
- **File Upload**: Multer for resume storage
- **Email Service**: Nodemailer (Ethereal test or SMTP)
- **Frontend**: Vanilla JS (no frameworks)
- **Styling**: Pure CSS with animations

## 🚀 Quick Start

### Prerequisites
- Node.js (v14+)
- npm

### Installation

1. **Navigate to project**
   ```bash
   cd TechNova_ResponsiveLandingPage
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```
   Server runs at `http://localhost:3000`

## 📋 User Flow

### Student Application
1. Visit `http://localhost:3000/login.html`
2. Select "Applicant" role
3. Enter any email and password
4. Fill application form with GitHub, LinkedIn, LeetCode, resume
5. Submit application
6. Admin approves → Offer letter sent via email

### Admin Review
1. Visit `http://localhost:3000/login.html`
2. Select "Admin" role
3. Login: `admin@technova.com` / `Admin@123`
4. View all applications
5. Click "Approve Application"
6. Offer letter auto-sent to applicant

## 🔐 Admin Credentials

- **Email**: `admin@technova.com`
- **Password**: `Admin@123`

## 🎨 Design Highlights

- Glassmorphism cards with blur effects
- Animated gradients on buttons
- Parallax mouse tracking
- Smooth reveal animations
- Interactive hover states
- Dark/Light theme support
- Custom scrollbar styling

## 📁 Project Structure

```
TechNova_ResponsiveLandingPage/
├── index.html              # Main landing page
├── login.html              # Login page
├── admin.html              # Admin dashboard
├── styles.css              # Complete styling
├── script.js               # Client-side logic
├── admin.js                # Admin dashboard
├── server.js               # Express backend
├── package.json            # Dependencies
├── data/                   # Applications storage
└── uploads/                # Resume file storage
```
