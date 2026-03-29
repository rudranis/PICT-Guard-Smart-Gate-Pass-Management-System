# RUN README - Local Development Setup

## Prerequisites

Before running the project locally, ensure you have:

1. **Node.js** (v16 or higher)
2. **Python** (v3.11 or higher)
3. **MongoDB** (v5.0 or higher)
4. **Yarn** package manager
5. **Git**

## Installation Steps

### 1. Clone the Repository

```bash
git clone <repository-url>
cd pict-guard
```

### 2. MongoDB Setup

#### Option A: Local MongoDB

```bash
# Install MongoDB
# Ubuntu/Debian
sudo apt-get install -y mongodb-org

# macOS (using Homebrew)
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
sudo systemctl start mongod  # Linux
brew services start mongodb-community  # macOS
```

#### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/atlas](https://www.mongodb.com/atlas)
2. Create a free cluster
3. Get connection string
4. Update in `.env` file

### 3. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env  # or create manually

# Edit .env file with your configuration
nano .env
```

#### Backend .env Configuration

```env
MONGO_URL="mongodb://localhost:27017"
DB_NAME="pict_guard_db"
CORS_ORIGINS="*"
RESEND_API_KEY=""  # Optional: Get from resend.com
SENDER_EMAIL="onboarding@resend.dev"
```

#### Run Backend

```bash
# From /app/backend directory
uvicorn server:app --host 0.0.0.0 --port 8001 --reload
```

Backend will start at `http://localhost:8001`

### 4. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
yarn install

# Create .env file
cp .env.example .env  # or create manually

# Edit .env file
nano .env
```

#### Frontend .env Configuration

```env
REACT_APP_BACKEND_URL=http://localhost:8001
WDS_SOCKET_PORT=443
ENABLE_HEALTH_CHECK=false
```

#### Run Frontend

```bash
# From /app/frontend directory
yarn start
```

Frontend will start at `http://localhost:3000`

## 🧪 Testing the Application

### 1. Admin Portal

```bash
# Open browser and navigate to:
http://localhost:3000/admin/login

# Login with:
Username: admin
Password: admin123
```

**Test Admin Features:**
- View dashboard statistics
- Add a test student:
  - Reg No: S001
  - Name: Test Student
  - Email: student@test.com
  - Mobile: 1234567890
  - DOB: 2000-01-01
  - Year: 2
- Add a test faculty:
  - Name: Test Faculty
  - Email: faculty@test.com
  - Mobile: 9876543210
  - Department: Computer Science
  - Profession: Professor
  - Valid Till: 2027-12-31
- Create a test event
- Add students to event

### 2. Student/Faculty Portal

```bash
# Navigate to:
http://localhost:3000/user/login

# Login with:
Email: student@test.com  (or faculty@test.com)
Password: 1234567890  (mobile number)
```

**Expected Result:**
- View digital ID card
- See QR code
- Check validity date

### 3. Visitor Registration

```bash
# Navigate to:
http://localhost:3000/visitor/register
```

**Test Flow:**
1. Fill registration form
2. Click "Capture Photo"
3. Allow camera access
4. Take selfie
5. Submit form
6. View generated QR code
7. Check email (if configured)

### 4. Alumni Registration

```bash
# Navigate to:
http://localhost:3000/alumni/register
```

**Test Flow:** (Similar to visitor registration with additional fields)

### 5. Guard Scanner

```bash
# Navigate to:
http://localhost:3000/guard/login

# Login with:
Username: guard1
Password: guard123
```

**Test QR Validation:**
1. Copy token from student/faculty portal or visitor QR
2. Paste in scanner input
3. Press validate
4. Observe green (valid) or red (invalid) screen

## 📧 Email Configuration (Optional)

To enable email functionality:

1. **Sign up for Resend:**
   - Visit [resend.com](https://resend.com)
   - Create free account
   - Get API key from dashboard

2. **Update Backend .env:**
   ```env
   RESEND_API_KEY=re_xxxxxxxxxxxx
   SENDER_EMAIL=your-verified-email@resend.dev
   ```

3. **Restart Backend:**
   ```bash
   # Stop the running backend (Ctrl+C)
   # Start again
   uvicorn server:app --host 0.0.0.0 --port 8001 --reload
   ```

**Note**: Free tier allows 100 emails/day which is sufficient for testing.

## 🔧 Troubleshooting

### Backend Issues

**Issue**: ModuleNotFoundError
```bash
# Solution: Reinstall dependencies
pip install -r requirements.txt
```

**Issue**: MongoDB connection error
```bash
# Solution: Check if MongoDB is running
sudo systemctl status mongod  # Linux
brew services list  # macOS

# Check connection string in .env
```

**Issue**: Port 8001 already in use
```bash
# Solution: Kill process on port 8001
lsof -ti:8001 | xargs kill -9

# Or use different port
uvicorn server:app --host 0.0.0.0 --port 8002 --reload
# Update REACT_APP_BACKEND_URL in frontend .env
```

### Frontend Issues

**Issue**: yarn: command not found
```bash
# Solution: Install Yarn
npm install -g yarn
```

**Issue**: Port 3000 already in use
```bash
# Solution: Kill process on port 3000
lsof -ti:3000 | xargs kill -9

# Or run on different port
PORT=3001 yarn start
```

**Issue**: Module not found errors
```bash
# Solution: Clear cache and reinstall
rm -rf node_modules
rm yarn.lock
yarn install
```

**Issue**: Camera not working
```bash
# Solution: 
# 1. Use HTTPS (camera requires secure context)
# 2. Or use localhost (allowed in development)
# 3. Check browser permissions
# 4. Try different browser (Chrome recommended)
```

### API Connection Issues

**Issue**: CORS errors
```bash
# Solution: Check CORS_ORIGINS in backend .env
CORS_ORIGINS="http://localhost:3000,http://localhost:3001"

# Restart backend after changes
```

**Issue**: 404 errors on API calls
```bash
# Solution: Verify REACT_APP_BACKEND_URL in frontend .env
REACT_APP_BACKEND_URL=http://localhost:8001

# Restart frontend after changes
```

## 📦 Bulk Upload Testing

### Create Test Excel Files

#### students_bulk.xlsx
| Reg No | Name | Email | Mobile | DOB | Current Year |
|--------|------|-------|--------|-----|-------------|
| S001 | Alice Smith | alice@test.com | 1111111111 | 2001-05-15 | 2 |
| S002 | Bob Johnson | bob@test.com | 2222222222 | 2002-08-20 | 3 |
| S003 | Carol White | carol@test.com | 3333333333 | 2000-12-10 | 1 |

#### faculty_bulk.xlsx
| Name | Email | Mobile | Department | Profession | Valid Till |
|------|-------|--------|------------|------------|------------|
| Dr. John Doe | john@test.com | 4444444444 | CS | Professor | 2027-12-31 |
| Dr. Jane Smith | jane@test.com | 5555555555 | IT | Asst Prof | 2027-12-31 |

#### event_students_bulk.xlsx
| Reg No |
|--------|
| S001 |
| S002 |
| S003 |

### Upload Process

1. Login to admin portal
2. Go to respective tab (Students/Faculty/Events)
3. Click "Upload" in bulk upload section
4. Select Excel file
5. View success/error messages

## 🎯 Production Deployment

### Using Docker

```bash
# Build images
docker-compose build

# Run containers
docker-compose up -d
```

### Using Kubernetes

```bash
# Apply configurations
kubectl apply -f k8s/
```

### Environment Variables for Production

```env
# Backend
MONGO_URL="mongodb+srv://user:pass@cluster.mongodb.net/"
DB_NAME="pict_guard_production"
RESEND_API_KEY="re_live_key"
SENDER_EMAIL="noreply@yourdomain.com"
CORS_ORIGINS="https://yourdomain.com"

# Frontend
REACT_APP_BACKEND_URL=https://api.yourdomain.com
```

## 📊 Database Management

### Backup MongoDB

```bash
mongodump --uri="mongodb://localhost:27017/pict_guard_db" --out=/backup/
```

### Restore MongoDB

```bash
mongorestore --uri="mongodb://localhost:27017/pict_guard_db" /backup/pict_guard_db/
```

### Clear Database (for testing)

```bash
mongosh
use pict_guard_db
db.dropDatabase()
```

## 🎨 Development Tips

### Hot Reload

Both frontend and backend have hot reload enabled:
- **Frontend**: Changes reflect immediately
- **Backend**: Server restarts on file changes

### Debug Mode

```bash
# Backend with debug logging
LOG_LEVEL=DEBUG uvicorn server:app --reload

# Frontend with React DevTools
# Install React Developer Tools browser extension
```

### API Testing

Use tools like:
- **Postman**: Import API collection
- **curl**: Command-line testing
- **Swagger/OpenAPI**: Visit `http://localhost:8001/docs`

## 📱 Mobile App Development

### React Native Setup

```bash
# Install React Native CLI
npm install -g react-native-cli

# Create new project (if not exists)
cd app
npx react-native init PICTGuardMobile

# Install dependencies
cd PICTGuardMobile
npm install axios react-native-qrcode-svg react-native-camera

# Run on Android
npx react-native run-android

# Run on iOS (macOS only)
cd ios && pod install && cd ..
npx react-native run-ios
```

## 🔐 Security Notes

1. **Change default credentials** in production
2. **Use strong API keys** for email service
3. **Enable HTTPS** in production
4. **Implement rate limiting** for public endpoints
5. **Regular backups** of MongoDB
6. **Monitor logs** for suspicious activity

## 📞 Support

For issues during local setup:
1. Check this README first
2. Review error logs in terminal
3. Check browser console for frontend issues
4. Verify all environment variables
5. Ensure all services are running

## 🎉 Success Checklist

- [ ] MongoDB running and accessible
- [ ] Backend started on port 8001
- [ ] Frontend started on port 3000
- [ ] Can access homepage
- [ ] Admin login works
- [ ] Can add student
- [ ] Student login works
- [ ] Can view QR code
- [ ] Guard login works
- [ ] QR validation works
- [ ] Visitor registration works
- [ ] Camera capture works (optional)
- [ ] Email sending works (optional)

---

**Ready for your presentation! 🚀**