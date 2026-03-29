# PICT Guard - Smart Gate Pass Management System

A modern, secure, and efficient college gate pass management system with QR code-based authentication. Built with FastAPI, React, and MongoDB.

**Version:** 2.0.0  
**Status:** ✅ Production Ready  
**Institution:** Pune Institute of Computer Technology (PICT)

---

## 📋 Table of Contents

- [Overview](#overview)
- [🚀 Features](#-features)
- [🏗️ Tech Stack](#️-tech-stack)
- [📦 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🚀 Getting Started](#-getting-started)
- [📋 Database Schema](#-database-schema)
- [🔐 Authentication](#-authentication)
- [📊 Bulk Upload Format](#-bulk-upload-format)
- [🔧 API Endpoints](#-api-endpoints)
- [🎯 Workflows](#-workflows)
- [🆘 Troubleshooting](#-troubleshooting)
- [🤝 Contributing](#-contributing)

---

## Overview

PICT Guard is a comprehensive solution for managing entry and exit of students, faculty, visitors, and alumni at an educational institution. It replaces traditional gate pass methods with digital QR codes that are:

- **Secure**: Unique UUID tokens with time-based validation
- **Fast**: Real-time scanning and verification
- **Efficient**: Automated email delivery of QR codes
- **User-Friendly**: Web and mobile access
- **Scalable**: MongoDB for flexible data storage



## 🚀 Features

### For Admin
- **Dashboard**: Real-time statistics showing visitors today, total students, faculty, and events
- **Student Management**: 
  - Add students individually with form validation
  - Bulk upload via Excel (supports 6 columns including Department)
  - Auto-calculated validity based on current year (1-4)
  - Edit and manage student records
  - View student details with QR codes
- **Faculty Management**: 
  - Add faculty members with auto-generated IDs (PICT-FAC-001 format)
  - Department and profession tracking
  - Set custom validity periods
  - Bulk upload for mass registration
- **Event Management**: 
  - Create time-bound events
  - Assign students to events
  - Auto-generate event-specific QR codes
  - Email notifications to participants
- **Visitor Management**:
  - Register daily/temporary visitors
  - Photo capture functionality
  - 24-hour automatic pass expiry
- **Analytics**: Real-time dashboard with key metrics

### For Students & Faculty
- **Secure Login**: Email + Mobile number authentication
- **Digital ID Card**: Professional gate pass with QR code
- **Profile Management**: View and update personal information
- **Visitor Management**: Faculty can register and manage visitors
- **Multiple Access**: Web portal and mobile app support
- **QR Display**: High-quality QR codes for gate scanning

### For Visitors & Alumni
- **Public Registration**: Self-service registration without login
- **Photo Capture**: Built-in webcam for selfie capture
- **Instant QR Code**: Immediate generation and email delivery
- **24-Hour Passes**: Automatic expiry for security
- **Alumni Tracking**: Career and company information
- **Email Confirmation**: QR sent to registered email

### For Guards
- **Simple Scanner Interface**: User-friendly QR code scanning portal
- **Traffic Light Feedback**: 
  - 🟢 **Green Screen**: Valid entry with user details
  - 🔴 **Red Screen**: Invalid/expired with reason
- **Quick Validation**: Instant verification against database
- **Multi-Device Support**: Multiple guard terminals (guard1, guard2, etc.)
- **Audit Trail**: Optional logging of all scans



## 📦 Installation

### Prerequisites

- **Python 3.9+** - For backend
- **Node.js 16+** - For frontend
- **MongoDB 4.4+** - Database
- **Git** - Version control
- **pip** - Python package manager
- **npm/yarn** - Node package manager

### Backend Setup

1. **Clone and navigate to backend**
   ```bash
   cd backend
   ```

2. **Create virtual environment**
   ```bash
   python -m venv venv
   
   # Windows
   venv\Scripts\activate
   
   # macOS/Linux
   source venv/bin/activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

5. **Run backend**
   ```bash
   python -m uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```
   Backend runs on: `http://localhost:8001`

### Frontend Setup

1. **Navigate to frontend**
   ```bash
   cd frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Configure environment**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your configuration
   ```

4. **Start development server**
   ```bash
   npm start
   # or
   yarn start
   ```
   Frontend runs on: `http://localhost:3000`

---

## ⚙️ Configuration

### Backend Configuration (.env)

```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/
DB_NAME=pict_guard

# Email (Gmail)
SENDER_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-app-password

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8001
```

See [backend/.env.example](backend/.env.example) for complete configuration options.

### Frontend Configuration (.env.local)

```env
# API
REACT_APP_BACKEND_URL=http://localhost:8001

# App
REACT_APP_NAME=PICT Guard
REACT_APP_VERSION=2.0.0

# Features
REACT_APP_ENABLE_EMAIL_NOTIFICATIONS=true
```

See [frontend/.env.example](frontend/.env.example) for complete configuration options.

### MongoDB Setup

1. **Local MongoDB**
   ```bash
   mongod --dbpath /path/to/data
   ```

2. **MongoDB Atlas (Cloud)**
   - Create account at https://www.mongodb.com/cloud/atlas
   - Create a cluster
   - Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/`

---

## 🚀 Getting Started

### Quick Start (Development)

```bash
# Terminal 1: Backend
cd backend
python -m venv venv
source venv/bin/activate  # or venv\Scripts\activate on Windows
pip install -r requirements.txt
cp .env.example .env
python -m uvicorn server:app --reload

# Terminal 2: Frontend
cd frontend
npm install
cp .env.example .env.local
npm start

# Terminal 3: MongoDB (if installed locally)
mongod
```

### First Time Setup

1. **Navigate to Admin Portal**
   - URL: `http://localhost:3000/admin/login`
   - Username: `admin`
   - Password: `admin123`

2. **Add your first student**
   - Click "Students" tab → "Add Student" button
   - Fill form with student details
   - Department selection is optional

3. **Bulk Upload Students**
   - Prepare Excel file using [sample_excel_files/students_bulk_upload.xlsx](sample_excel_files/students_bulk_upload.xlsx)
   - Upload via "Bulk Upload" section
   - System validates and imports data

4. **Test Student Login**
   - URL: `http://localhost:3000/user/login`
   - Email: Use email from added student
   - Password: Use mobile number

5. **Test Guard Scanner**
   - URL: `http://localhost:3000/guard/login`
   - Username: `guard1`
   - Password: `guard123`
   - Scan QR code from student dashboard



### Backend
- **FastAPI**: High-performance Python web framework with async support
- **Motor**: Async MongoDB driver for non-blocking database operations
- **Pydantic**: Data validation using Python type annotations
- **Python-QRCode**: QR code generation for gate passes
- **OpenPyXL**: Excel file processing for bulk uploads
- **python-multipart**: File upload handling
- **python-dotenv**: Environment variable management
- **passlib**: Password hashing and verification

### Frontend (Website)
- **React 19**: Latest React library for UI
- **Vite**: Fast build tool and dev server
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/UI**: Accessible React component library
- **React Router**: Client-side navigation
- **Axios**: HTTP client for API calls
- **QRCode.react**: React QR code component
- **React Webcam**: Camera integration
- **Sonner**: Toast notifications library
- **Lucide React**: Icon library

### Mobile App (Future)
- **React Native**: Cross-platform mobile development
- **Expo**: React Native framework
- **Same Backend**: Unified API for web and mobile

### Database
- **MongoDB**: NoSQL database with flexible schema
- **MongoDB Atlas**: Cloud hosting option

---

## 🔐 Authentication

### Admin Authentication
- **Username**: `admin`
- **Password**: `admin123`
- **Login URL**: `/admin/login`

### Guard Authentication
- **Username**: `guard1` (or guard2, guard3, etc.)
- **Password**: `guard123`
- **Login URL**: `/guard/login`

### Student/Faculty Authentication
- **Email**: Email address from database
- **Password**: Mobile number from database
- **Login URL**: `/user/login`

⚠️ **Important**: Change default credentials in production!

---

## 📋 Database Schema

**Note**: Departments are optional for students but required for faculty.

## 📋 Database Schema

### Students Collection
```json
{
  "reg_no": "unique_registration_number",
  "name": "Student Name",
  "email": "student@email.com",
  "mobile_no": "1234567890",
  "dob": "2000-01-01",
  "current_year": 2,
  "department": "Computer Engineering",
  "token": "unique_uuid",
  "valid_till": "2027-12-31T00:00:00Z",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Faculty Collection
```json
{
  "faculty_id": "fact_0001",
  "name": "Faculty Name",
  "email": "faculty@email.com",
  "mobile_no": "1234567890",
  "department": "Computer Science",
  "profession": "Professor",
  "token": "unique_uuid",
  "valid_till": "2027-12-31T00:00:00Z",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Visitors Collection
```json
{
  "name": "Visitor Name",
  "email": "visitor@email.com",
  "mobile_no": "1234567890",
  "person_to_visit": "Faculty/Student Name",
  "photo_base64": "base64_encoded_image",
  "purpose": "Meeting",
  "token": "unique_uuid",
  "valid_till": "2026-02-11T00:00:00Z",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Alumni Collection
```json
{
  "name": "Alumni Name",
  "email": "alumni@email.com",
  "mobile_no": "1234567890",
  "college_department": "Computer Engineering",
  "photo_base64": "base64_encoded_image",
  "purpose": "Campus Visit",
  "current_company": "Tech Corp",
  "job_position": "Software Engineer",
  "specialization": "AI/ML",
  "ctc_monthly": "100000",
  "other_details": "Additional info",
  "token": "unique_uuid",
  "valid_till": "2026-02-11T00:00:00Z",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Events Collection
```json
{
  "event_id": "unique_uuid",
  "event_name": "Tech Fest 2026",
  "event_type": "Festival",
  "date_from": "2026-03-01",
  "date_to": "2026-03-03",
  "description": "Annual tech festival",
  "created_at": "2026-02-10T00:00:00Z"
}
```

### Event Students Collection
```json
{
  "event_id": "unique_uuid",
  "reg_no": "student_reg_no",
  "name": "Student Name",
  "email": "student@email.com",
  "mobile_no": "1234567890",
  "token": "unique_uuid",
  "valid_from": "2026-03-01",
  "valid_to": "2026-03-03",
  "created_at": "2026-02-10T00:00:00Z"
}
```



## 🎯 Workflows

### Admin Workflow
1. Login to admin portal (`/admin/login`)
2. View dashboard with real-time statistics
3. **Manage Students**:
   - Add individual students via form
   - Bulk upload via Excel file
   - Assign departments (optional)
   - View student details and QR codes
4. **Manage Faculty**:
   - Add faculty with departments (required)
   - Set validity periods
   - Bulk upload faculty members
5. **Create Events**:
   - Define event dates and details
   - Assign students to events
   - System auto-generates event QR codes
6. **Monitor Activity**: Track visitors, check-ins, and system usage

### Student/Faculty Workflow
1. Access portal at `/user/login`
2. Login with email and mobile number
3. View digital ID card with QR code
4. Share QR with guard for entry/exit
5. Check profile and validity status
6. (Faculty Only) Manage registered visitors

### Visitor/Alumni Workflow
1. Visit public registration page `/visitor/register` or `/alumni/register`
2. Fill registration form
3. Capture selfie using built-in camera
4. Submit registration
5. Receive QR code instantly
6. QR sent to registered email
7. Valid for 24 hours only

### Guard Workflow
1. Access guard scanner at `/guard/login`
2. Login with guard credentials
3. Scan QR code using device camera or enter manually
4. System validates and displays:
   - ✅ **Green**: Valid entry with person details
   - ❌ **Red**: Invalid/expired with reason
5. Gate access automatically approved/denied
6. Screen auto-clears after 5 seconds for next scan

---

## 📊 Bulk Upload Format

### Students Excel File
Format: `RegNo | Name | Email | Mobile | DOB | Current Year | Department (optional)`

**Example**: [sample_excel_files/students_bulk_upload.xlsx](sample_excel_files/students_bulk_upload.xlsx)

| RegNo | Name | Email | Mobile | DOB | Year | Department |
|-------|------|-------|--------|-----|------|------------|
| 12101001 | Rahul Sharma | rahul@pict.edu | 9876543210 | 2003-03-15 | 3 | Computer Eng |
| 12101002 | Priya Singh | priya@pict.edu | 9876543211 | 2003-06-20 | 3 | Information Tech |

### Faculty Excel File
Format: `Name | Email | Mobile | Department | Profession | Valid Till`

**Example**: [sample_excel_files/faculty_bulk_upload.xlsx](sample_excel_files/faculty_bulk_upload.xlsx)

| Name | Email | Mobile | Department | Profession | Valid Till |
|------|-------|--------|------------|------------|------------|
| Dr. Rajesh | rajesh@pict.edu | 9988776655 | Computer Science | Professor | 2027-12-31 |
| Dr. Priya | priya@pict.edu | 9988776656 | Electronics | Assoc Prof | 2027-12-31 |

### Event Students Excel File
Format: `RegNo`

**Example**: [sample_excel_files/event_students_bulk_upload.xlsx](sample_excel_files/event_students_bulk_upload.xlsx)

| RegNo |
|-------|
| 12101001 |
| 12101002 |

---

## 🆘 Troubleshooting

### Backend Issues

**MongoDB Connection Error**
```
pymongo.errors.ServerSelectionTimeoutError
```
**Solution**:
- Check MongoDB is running: `mongod`
- Verify connection string in `.env`
- Check network connectivity to MongoDB Atlas

**Port Already in Use**
```bash
# Windows
netstat -ano | findstr :8001
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8001
kill -9 <PID>
```

**Import/Module Errors**
```bash
# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Issues

**Blank Page or White Screen**
1. Check browser console (F12)
2. Verify `REACT_APP_BACKEND_URL` in `.env.local`
3. Check backend is running
4. Clear cache: `Ctrl+Shift+Delete`

**API Calls Fail**
```
CORS Error: Access to XMLHttpRequest blocked
```
**Solution**:
- Check `CORS_ORIGINS` in backend `.env`
- Verify frontend URL is in allowed origins
- Restart backend after changing CORS settings

**File Upload Fails**
- Check file size limit in frontend `.env`
- Verify Excel format matches requirements
- Check file permissions

### Database Issues

**Slow Queries**
- Add indexes to frequently queried fields
- Use MongoDB Compass to analyze query performance
- Check disk space and memory

**Duplicate Students**
- Use update scripts to clean duplicates
- Add unique constraint on email and mobile

---

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/admin/login` - Admin portal login
- `POST /api/auth/user/login` - Student/Faculty login
- `POST /api/auth/guard/login` - Guard portal login

### Students
- `POST /api/students` - Add single student
- `POST /api/students/bulk` - Bulk upload students
- `GET /api/students` - Get all students
- `GET /api/students/{reg_no}` - Get student details
- `PUT /api/students/{reg_no}` - Update student

### Faculty
- `POST /api/faculty` - Add single faculty
- `POST /api/faculty/bulk` - Bulk upload faculty
- `GET /api/faculty` - Get all faculty
- `GET /api/faculty/{faculty_id}` - Get faculty details

### Events
- `POST /api/events` - Create event
- `GET /api/events` - Get all events
- `POST /api/events/students` - Add student to event
- `POST /api/events/students/bulk` - Bulk add students to event
- `GET /api/events/{event_id}/students` - Get event students

### Visitors & Alumni
- `POST /api/visitors` - Register visitor
- `POST /api/alumni` - Register alumni
- `GET /api/visitors` - Get visitor log (admin only)

### Validation
- `POST /api/validate-qr` - Validate QR token and check access

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/dashboard/today-visitors` - Get today's visitors count

---

## 📚 Utility Scripts

### Update Student Departments
For existing students without departments, run:

```bash
python update_student_departments.py
```

This script will:
- Find students with missing departments
- Attempt to match departments from email
- Prompt for manual assignment if needed
- Update database with department data

---

## 🌐 Deployment

### Production Checklist

- [ ] Change all default credentials (admin, guard1, etc.)
- [ ] Set up MongoDB on production server or MongoDB Atlas
- [ ] configure SSL/TLS certificates
- [ ] Set environment variables for production
- [ ] Enable CORS for production domain only
- [ ] Set up email service (Gmail or Resend)
- [ ] Configure backup strategy for MongoDB
- [ ] Set up monitoring and logging
- [ ] Performance test with expected user load
- [ ] Security audit and penetration testing

### Deployment Options

1. **Docker & Kubernetes**
   - Containerized deployment
   - Scalable infrastructure
   - Load balancing support

2. **Cloud Platforms**
   - **AWS**: EC2, RDS, S3
   - **Google Cloud**: App Engine, Cloud SQL
   - **Azure**: App Service, Cosmos DB
   - **Heroku**: PaaS for quick deployment

3. **Traditional Server**
   - Nginx reverse proxy
   - Supervisor for process management
   - Cron jobs for backups

---

## 📖 Documentation

- **[RUN_README.md](RUN_README.md)** - Local development setup instructions
- **[BULK_UPLOAD_GUIDE.md](BULK_UPLOAD_GUIDE.md)** - Excel upload guide with templates
- **[FACULTY_VISITOR_REGISTRATION.md](FACULTY_VISITOR_REGISTRATION.md)** - Visitor management
- **[PROJECT_COMPLETE_DOCUMENTATION.txt](PROJECT_COMPLETE_DOCUMENTATION.txt)** - Detailed technical documentation

---

## 🤝 Contributing

### Development Guidelines
1. Create feature branch: `git checkout -b feature/your-feature`
2. Follow code style guidelines
3. Add tests for new features
4. Commit with clear messages
5. Push and create pull request

### Code Style
- **Backend**: PEP 8 with 100-char line limit
- **Frontend**: ESLint with Prettier formatting
- **Naming**: camelCase for JS, snake_case for Python

---

## 📞 Support & Contact

For issues, questions, or suggestions:
- **GitHub Issues**: Create an issue in the repository
- **Email**: contact@pict.edu
- **Documentation**: See [RUN_README.md](RUN_README.md) for setup help

---

## 📄 License

This project is developed for **PICT (Pune Institute of Computer Technology)** gate pass management system.

**Copyright © 2026 Pune Institute of Computer Technology**

---

## 🎉 Acknowledgments

- **PICT Administration** - Requirements and feedback
- **Development Team** - Implementation and testing
- **Open Source Community** - Libraries and tools used

---

**Built with ❤️ for PICT**  
**Version 2.0.0 | Last Updated: March 2026**





## � Email Configuration

The system supports multiple email services:

### Gmail (SMTP)
1. Enable 2-factor authentication on your Google account
2. Generate app password: https://myaccount.google.com/apppasswords
3. Update `.env`:
   ```
   SENDER_EMAIL=your-email@gmail.com
   GMAIL_PASSWORD=your-16-char-app-password
   ```

### Resend (Email Service)
1. Sign up at https://resend.com
2. Get API key from dashboard
3. Update `.env`:
   ```
   RESEND_API_KEY=re_your_api_key_here
   ```

**Note**: Without proper email configuration, system works but emails won't be sent.

