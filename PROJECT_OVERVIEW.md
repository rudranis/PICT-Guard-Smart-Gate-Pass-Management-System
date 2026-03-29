# PICT Guard V2 - Complete Project Overview

**Version:** 2.0.0 | **Status:** ✅ Production Ready | **Date:** March 2026

---

## 🎯 Executive Summary

PICT Guard V2 is a comprehensive **Smart Gate Pass Management System** built for Pune Institute of Computer Technology (PICT). It replaces traditional paper gate passes with digital QR codes, enabling:

- ✅ Real-time student/faculty/visitor verification
- ✅ Automated QR code email delivery
- ✅ Event management with auto-generated passes
- ✅ Bulk upload support (Excel)
- ✅ Mobile-friendly, responsive design
- ✅ Production-ready with error handling

---

## 📂 Project Structure

```
PICT_Guard/
├── backend/                  # FastAPI server (Python 3.11+)
│   ├── server.py            # Main application & endpoints
│   ├── requirements.txt      # Python dependencies
│   ├── .env                  # Configuration (SMTP, MongoDB, etc.)
│   └── .env.example          # Template for .env
│
├── frontend/                 # React 19 web app (Vite/Yarn)
│   ├── src/
│   │   ├── pages/           # Admin Dashboard, Logins, Portals
│   │   ├── components/      # Shadcn/UI components
│   │   └── lib/             # Utilities
│   ├── package.json         # Dependencies
│   ├── .env                 # Frontend config
│   └── tailwind.config.js   # Styling setup
│
├── sample_excel_files/      # Example upload templates
├── tests/                   # Test files
├── README.md                # Main documentation
├── RUN_README.md            # Setup & execution guide
└── PROJECT_OVERVIEW.md      # This file
```

---

## 🏗️ Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| **Frontend** | React | 19.x |
| **Frontend UI** | Shadcn/UI + Tailwind CSS | Latest |
| **Backend** | FastAPI | Latest |
| **Database** | MongoDB | 5.0+ |
| **Email** | Gmail SMTP | - |
| **Authentication** | JWT Tokens | - |
| **Package Manager** | Yarn | Latest |

---

## 💾 Database Schema

### Collections in MongoDB

#### 1. **Students**
```javascript
{
  _id: ObjectId,
  reg_no: "S24IT026",           // Registration number
  name: "Rudrani Shinde",
  email: "rudrani@pict.edu",
  mobile_no: "9876543210",
  department: "Information Technology",
  year: 3,                       // 1-4 (auto-calculated)
  entry_date: ISODate,
  qr_token: "uuid-token-hash"   // Unique QR code token
}
```

#### 2. **Faculty**
```javascript
{
  _id: ObjectId,
  faculty_id: "F001",
  name: "Dr. Sharma",
  email: "sharma@pict.edu",
  department: "IT",
  designation: "Professor",
  qr_token: "uuid-token-hash"
}
```

#### 3. **Visitors**
```javascript
{
  _id: ObjectId,
  name: "John Visitor",
  email: "john@company.com",
  mobile_no: "9999999999",
  purpose: "Campus Interview",
  date_of_visit: ISODate,
  qr_token: "uuid-token-hash",
  validity: ISODate          // Expiry date
}
```

#### 4. **Alumni**
```javascript
{
  _id: ObjectId,
  name: "Priya Singh",
  email: "priya@company.com",
  graduation_year: 2023,
  phone: "9876543210",
  qr_token: "uuid-token-hash"
}
```

#### 5. **Events**
```javascript
{
  _id: ObjectId,
  event_id: "evt_001",
  event_name: "Tech Fest 2026",
  event_date: ISODate,
  description: "Annual tech festival",
  created_at: ISODate
}
```

#### 6. **EventStudents**
```javascript
{
  _id: ObjectId,
  event_id: "evt_001",
  reg_no: "AI_ML_BASED_Workshop_exe001",  // External student ID
  name: "Sheikh Rizwan",
  email: "shaikh@gmail.com",
  mobile_no: "9999999999",
  college: "XYZ College",
  qr_token: "unique-token-hash",
  email_sent: true,
  created_at: ISODate
}
```

#### 7. **Admin**
```javascript
{
  _id: ObjectId,
  admin_id: "ADM001",
  username: "admin",
  password: "hashed-bcrypt-password",
  email: "admin@pict.edu",
  role: "superadmin",
  created_at: ISODate
}
```

---

## 🔐 Authentication & Security

### Admin Login
- **Endpoint:** `POST /api/login`
- **Credentials:** Username + Password (hashed with bcrypt)
- **Response:** JWT token stored in localStorage
- **Token Validation:** Every protected endpoint requires valid JWT

### JWT Implementation
- Token includes: `admin_id`, `role`, `iat`, `exp`
- Expiration: 24 hours (configurable)
- Refresh: Manual login required

### Guard Scanner QR Verification
- **Endpoint:** `POST /api/scan`
- **Input:** QR token (scanned from QR code)
- **Output:** Student details if valid, error if expired/invalid

---

## 📧 Email Configuration (Gmail SMTP)

### Setup Requirements

1. **Gmail Account Setup:**
   - Enable 2-Factor Authentication
   - Create App-Specific Password at: https://myaccount.google.com/apppasswords
   - Copy the 16-character password

2. **Backend .env Configuration:**
   ```env
   SENDER_EMAIL=your-email@gmail.com
   GMAIL_PASSWORD=your-16-char-app-password
   ```

3. **Test Connection:**
   ```bash
   curl http://localhost:8001/api/health/email
   ```

### Email Delivery Features

- **QR Code Emails:** HTML formatted with embedded QR image
- **Auto-generated ID Preview:** Students see their assigned ID
- **Resend Functionality:** Individual or bulk resend
- **Error Handling:** Specific messages for auth, timeout, network errors

### Email Error Troubleshooting

| Error | Cause | Solution |
|-------|-------|----------|
| SMTPAuthenticationError | Wrong app password | Regenerate from Google Account |
| TimeoutError | No internet/firewall blocked | Check network, allow port 587 |
| Connection refused | Backend not running | Start backend: `python server.py` |
| Network Error | Frontend can't reach backend | Check REACT_APP_BACKEND_URL in .env |

---

## 📊 Bulk Upload Format (Excel)

### File: `event_students_bulk_upload.xlsx`

**Sheet 1: PICT Students**
```
| Reg No (Only 1 column) |
|------------------------| 
| S24IT026               |
| S24IT027               |
```
- Auto-fills: Name, Email, Mobile from database

**Sheet 2: External Students**
```
| Full Name      | Email               | Mobile      |
|----------------|---------------------|-------------|
| Rajesh Kumar   | rajesh@example.com  | 9876543210  |
| Priya Singh    | priya@example.com   | 9876543211  |
```
- Auto-generates: External ID (`EventName_exe001`, `EventName_exe002`, etc.)
- Auto-sends QR code email

**Sheet 3: Help & Instructions**
- Format guidelines
- Examples
- Email verification process

### Upload Endpoints
- `POST /api/events/{event_id}/bulk-add-pict-students` - Upload PICT students
- `POST /api/events/{event_id}/bulk-add-external-students` - Upload external students

---

## 🚀 API Endpoints Summary

### Admin Operations
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/login` | POST | Admin login |
| `/api/dashboard/stats` | GET | Dashboard statistics |
| `/api/students` | GET/POST | Manage students |
| `/api/faculty` | GET/POST | Manage faculty |
| `/api/visitors` | GET/POST | Manage visitors |
| `/api/alumni` | GET/POST | Manage alumni |
| `/api/events` | GET/POST | Create/manage events |

### Event Management
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/events/{event_id}/add-student` | POST | Add student to event |
| `/api/events/{event_id}/students` | GET | View event students |
| `/api/events/{event_id}/bulk-add-pict-students` | POST | Bulk upload PICT students |
| `/api/events/{event_id}/bulk-add-external-students` | POST | Bulk upload external students |
| `/api/events/{event_id}/resend-email/{student_id}` | POST | Resend QR email |
| `/api/events/{event_id}/bulk-resend-emails` | POST | Bulk resend all emails |

### Gate Operations
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/scan` | POST | Scan QR code |
| `/api/health/email` | GET | Test Gmail connectivity |

---

## 🎯 Workflows

### Student Registration Flow

```
1. Admin adds PICT Student (via form or bulk upload)
   ↓
2. System retrieves student details from database
   ↓
3. Auto-generates QR token (UUID)
   ↓
4. Sends email with QR code + student details
   ↓
5. Student receives email with embedded QR image
   ↓
6. Student shows QR at gate → Guard scans → Access granted
```

### External Student Registration Flow (Events)

```
1. Admin creates Event (e.g., "Tech Fest 2026")
   ↓
2. Admin adds external students (via form or Excel)
   ↓
3. System auto-generates External ID: "Tech_Fest_2026_exe001"
   ↓
4. Checks for duplicates (email, mobile)
   ↓
5. Auto-sends QR email with:
   - Generated External ID
   - Embedded QR code
   - Event details
   ↓
6. External student uses QR to enter event
```

### Bulk Upload Flow

```
1. Prepare Excel file with proper format
   ↓
2. Upload via Admin Dashboard
   ↓
3. System validates each row:
   - Check required fields
   - Check for duplicates
   ↓
4. For valid rows:
   - Add to database
   - Generate QR token
   - Send email
   ↓
5. Show results:
   - ✅ Successfully added: X
   - ❌ Failed: Y
   - Reason for failures
```

---

## 📋 Event System Guide

### Creating an Event

1. Go to **Admin Dashboard** → **Events**
2. Click **Create Event**
3. Fill in:
   - Event Name (e.g., "Tech Fest 2026")
   - Date
   - Description
4. Click **Save**

### Adding Students to Event

**Option 1: Manual Entry**
- Click **External Student** tab
- Fill: Full Name, Email, Mobile
- System auto-generates: `EventName_exe001`, `exe002`, etc.
- Click **Add & Send QR Email**

**Option 2: Bulk Upload**
- Prepare Excel file (3 columns: Name, Email, Mobile)
- Upload file
- Verify results

### Resending Emails

- **Individual:** Click **Resend** button next to student
- **Bulk:** Click **Resend All Emails** for entire event
- System shows: Count sent + any failures

---

## 🔧 Configuration Files

### Backend `.env` Template
```env
# MongoDB
MONGO_URL=mongodb://localhost:27017/
DB_NAME=pict_guard

# Gmail SMTP
SENDER_EMAIL=your-email@gmail.com
GMAIL_PASSWORD=your-16-char-app-password

# CORS
CORS_ORIGINS=http://localhost:3000,http://localhost:5173

# Server
BACKEND_HOST=0.0.0.0
BACKEND_PORT=8001

# Security
SECRET_KEY=your-super-secret-key-change-in-production
```

### Frontend `.env` Template
```env
REACT_APP_BACKEND_URL=http://localhost:8001
```

---

## 🚀 Quick Start

### 1. Prerequisites
```bash
Node.js 16+, Python 3.11+, MongoDB 5.0+, Yarn
```

### 2. Backend Setup
```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env
# Edit .env with your MongoDB & Gmail credentials
python server.py
```

### 3. Frontend Setup
```bash
cd frontend
yarn install
# Edit .env with backend URL
yarn dev
```

### 4. Access Application
- **Admin:** http://localhost:3000 → Login with admin credentials
- **Backend:** http://localhost:8001
- **API Docs:** http://localhost:8001/docs (Swagger)

---

## 🆘 Common Issues & Solutions

### Email Not Sending
1. Check backend is running: `python server.py`
2. Verify Gmail app password in `.env`
3. Test with: `curl http://localhost:8001/api/health/email`
4. Check internet connection and firewall allows port 587

### MongoDB Connection Error
1. Ensure MongoDB is running
2. Check connection string in `.env`
3. For Atlas: Verify IP whitelist includes your address

### Frontend Can't Reach Backend
1. Check backend is running on port 8001
2. Verify `REACT_APP_BACKEND_URL` in frontend `.env`
3. Check CORS settings in backend `.env`

### External Student Not Getting Email
1. Verify email format is valid
2. Check SENDER_EMAIL and GMAIL_PASSWORD in backend
3. Check database connection
4. Try **Resend Email** button from UI

---

## 📦 File Organization

### Essential Files Only
✅ README.md - Main documentation  
✅ RUN_README.md - Setup guide  
✅ PROJECT_OVERVIEW.md - This file  
✅ backend/ - Server code  
✅ frontend/ - React application  
✅ sample_excel_files/ - Upload templates  

### Removed (Not Needed)
❌ Outdated markdown guides  
❌ Utility scripts  
❌ Old documentation  

---

## 📞 Support

For issues or questions:
1. Check the relevant README file
2. Test using `/api/health/email` endpoint
3. Check backend console for detailed error logs
4. Verify `.env` configuration matches requirements

---

**Last Updated:** March 29, 2026  
**Maintained By:** PICT IT Team  
**Status:** ✅ Production Ready
