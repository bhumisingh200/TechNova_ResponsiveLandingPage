# 🚀 TechNova Internship Portal

<div align="center">

### A Premium Full-Stack Internship Management Platform

Modern • Responsive • Secure • Feature-Rich

Streamlining the internship application, evaluation, onboarding, and offer management process through an elegant student and administrator experience.

[Live Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## 📖 Overview

TechNova Internship Portal is a comprehensive internship management platform designed to simplify the complete internship lifecycle—from student applications to onboarding and offer acceptance.

The platform combines a modern responsive landing page, application management system, administrator dashboard, resume processing, automated offer letter generation, email notifications, and internship progress tracking into a unified experience.

This project demonstrates advanced frontend development, backend engineering, database integration, session management, file handling, and email automation using pure Node.js and MySQL.

---

# ✨ Key Highlights

### 🎓 Student Experience

✔ Explore internship opportunities

✔ Submit internship applications

✔ Upload resumes

✔ Share GitHub, LinkedIn & LeetCode profiles

✔ Track application status in real-time

✔ Access onboarding instructions

✔ Download official offer letters

✔ Accept internship offers digitally

---

### 🏢 Administrator Experience

✔ Secure admin authentication

✔ Review candidate profiles

✔ Download resumes

✔ Approve applications

✔ Generate internship offers

✔ Send automated emails

✔ Track candidate progress

✔ Re-send offer letters when required

---

# 🌟 Features

## 🎯 Modern Landing Page

A visually appealing and fully responsive landing page designed to create a professional first impression.

### Includes

* Animated Hero Section
* Typing Text Effect
* Floating Internship Cards
* Internship Domain Showcase
* Learning Journey Timeline
* Animated Statistics Counters
* Testimonials Carousel
* FAQ Accordion
* Newsletter Subscription
* Contact Form
* Smooth Scrolling Navigation

---

## 💼 Internship Domains

Students can explore various internship tracks:

| Domain           | Description                         |
| ---------------- | ----------------------------------- |
| Web Development  | Frontend & Backend Development      |
| Java Development | Core Java & Enterprise Applications |
| AI / ML          | Machine Learning Fundamentals       |
| Data Science     | Analytics & Data Processing         |
| Cyber Security   | Security Fundamentals               |
| UI/UX Design     | Design Thinking & User Experience   |

---

## 📝 Internship Application System

Students can apply directly through the platform.

### Application Details Collected

* Full Name
* Email Address
* Internship Domain
* GitHub Profile
* LinkedIn Profile
* LeetCode Profile
* Resume Upload
* Cover Message

### Validation Features

* Email Validation
* Required Fields Validation
* Resume Validation
* URL Verification
* Client-Side Error Handling

---

## 📂 Resume Management

Applicants can upload their resumes directly during the application process.

### Supported Features

* PDF Resume Upload
* Secure Storage
* Resume Retrieval
* Admin Download Access

---

## 📊 Application Tracking System

Every application progresses through multiple stages.

### Workflow

```text
Not Applied
     ↓
Pending Review
     ↓
Approved
     ↓
Accepted
```

Students can monitor their status using the onboarding dashboard.

---

## 🎓 Student Dashboard

The onboarding dashboard provides:

### Features

* Application Status Tracking
* Internship Progress Updates
* Assigned Tasks
* Offer Letter Access
* Internship Acceptance Workflow
* Onboarding Guidance

---

## 🏢 Admin Dashboard

A dedicated administrator portal for managing applicants.

### Administrative Controls

#### Candidate Management

* Review Applications
* View Candidate Profiles
* Download Resumes
* Review GitHub Profiles
* Review LinkedIn Profiles
* Review LeetCode Profiles

#### Application Actions

* Approve Applications
* Track Application Progress
* Monitor Internship Domains
* Manage Candidate Records

---

## 📧 Automated Offer Letter System

Upon approval, the platform automatically generates a professional internship offer letter.

### Student Capabilities

* View Offer Letter
* Download Offer Letter
* Request Email Copy
* Accept Offer

### Administrator Capabilities

* Generate Offer Letter
* Download Offer Letter
* Re-Send Offer Emails

### Email System

Custom SMTP implementation built entirely using Node.js native networking modules.

---

## 🌙 Dark Mode Support

A complete light and dark theme system.

### Features

* One-Click Theme Switching
* Theme Persistence
* LocalStorage Integration
* Smooth Transitions
* Cross-Page Consistency

---

# 🎨 UI / UX Highlights

### Premium Design System

* Glassmorphism Components
* Modern Gradients
* Floating Elements
* Responsive Layouts
* Custom Scrollbar
* Animated Buttons
* Interactive Cards
* Soft Shadows
* Consistent Design Language

### User Experience Enhancements

* Sticky Navigation
* Mobile Hamburger Menu
* Back-To-Top Button
* Scroll Reveal Animations
* Smooth Page Transitions
* Loading Effects

---

# 🛠 Technology Stack

## Frontend

* HTML5
* CSS3
* JavaScript (ES6)

## Backend

* Node.js
* HTTP Module
* FS Module
* Path Module
* Querystring Module

## Database

* MySQL

## Authentication

* Session-Based Authentication
* HTTP-Only Cookies

## Email Service

* Native SMTP Client
* Automated Email Generation

---

# 🧠 Concepts Demonstrated

### Frontend Engineering

* Responsive Web Design
* DOM Manipulation
* Form Validation
* Event Handling
* Local Storage
* CSS Variables
* Animations
* Accessibility

### Backend Engineering

* API Development
* Session Management
* Authentication
* File Handling
* Resume Processing
* Email Automation

### Database Management

* MySQL Integration
* CRUD Operations
* Data Persistence

---

# 📁 Project Structure

```text
TechNova_ResponsiveLandingPage/
│
├── index.html       # Unified SPA (Landing page, Student Dashboard, Admin Panel)
├── styles.css       # Premium responsive layout styles (Glassmorphism, 3D tilt, dark/light variables)
├── script.js        # Core client-side interactions, form validation, 3D tilt, administrative AJAX handlers
│
├── server.js        # Node.js backend server handling sessions, auth routes, and API logic
├── db.js            # Database wrapper executing native MySQL queries via execSync
├── mail.js          # Native SMTP email implementation for dispatching offer letters
│
├── uploads/         # Directory for storing submitted candidate PDF resumes
├── .env.example     # Template for environment variables config
└── README.md        # Comprehensive documentation
```

---

# 🚀 Getting Started

Follow these instructions to set up and run the project locally.

### Prerequisites

1. **Node.js**: Install Node.js (v14 or higher).
2. **MySQL Server**: Install MySQL Server. Ensure `mysql` or `mysql.exe` is configured in your system environment path or matches the configuration in `db.js`.
   - Default MySQL executable path: `C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe`
   - Default Database name: `technova_db`
   - Default Root User: `root`
   - Default Password: `Bhumi@2006`

### Database Setup

Run the following SQL queries in your MySQL console to initialize the database schema:

```sql
CREATE DATABASE IF NOT EXISTS technova_db;
USE technova_db;

CREATE TABLE IF NOT EXISTS applications (
  id VARCHAR(255) PRIMARY KEY,
  fullName VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  message TEXT,
  github VARCHAR(255) NOT NULL,
  linkedin VARCHAR(255) NOT NULL,
  leetcode VARCHAR(255) NOT NULL,
  domain VARCHAR(100) NOT NULL,
  resume VARCHAR(255) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  createdAt VARCHAR(255) NOT NULL
);
```

### Installation & Run

1. Clone or copy this repository to your local system.
2. Navigate to the project directory:
   ```bash
   cd TechNova_ResponsiveLandingPage
   ```
3. Create a `.env` file in the root directory by copying `.env.example`:
   ```bash
   cp .env.example .env
   ```
4. Update the port, session secret, and optional SMTP settings inside the `.env` file as needed.
5. Start the Node.js server:
   ```bash
   node server.js
   ```
6. Open your web browser and navigate to:
   ```text
   http://localhost:3000/
   ```

---

# 📸 Screenshots

After completing the project, create a folder:

```text
screenshots/
```

Add these screenshots:

### 1. Homepage Hero Section

File:

```text
screenshots/homepage.png
```

Capture:

* Hero Banner
* Typing Animation
* CTA Buttons

---

### 2. Internship Domains Section

File:

```text
screenshots/domains.png
```

Capture:

* Internship Cards
* Hover Effects

---

### 3. Student Application Form

File:

```text
screenshots/application-form.png
```

Capture:

* GitHub Field
* LinkedIn Field
* LeetCode Field
* Resume Upload

---

### 4. Student Dashboard

File:

```text
screenshots/student-dashboard.png
```

Capture:

* Status Tracking
* Tasks
* Offer Access

---

### 5. Admin Dashboard

File:

```text
screenshots/admin-dashboard.png
```

Capture:

* Candidate List
* Resume Download
* Approval Actions

---

### 6. Offer Letter Preview

File:

```text
screenshots/offer-letter.png
```

Capture:

* Generated Offer Letter

---

### 7. Dark Mode

File:

```text
screenshots/dark-mode.png
```

Capture:

* Entire Page in Dark Theme

---

### 8. Mobile Responsive View

File:

```text
screenshots/mobile-view.png
```

Capture:

* Mobile Navigation
* Responsive Layout

---

# 🚀 Future Enhancements

* AI Resume Screening
* Candidate Ranking System
* Interview Scheduling
* Certificate Generation
* Analytics Dashboard
* Multi-Admin Support
* Role-Based Access Control
* AI Internship Recommendations

---

# 👩‍💻 Author

### Bhumi Singh

B.Tech CSE (AI)

Aspiring Software Engineer • Java Developer • Full Stack Developer

---

⭐ If you found this project interesting, consider giving it a star on GitHub.
