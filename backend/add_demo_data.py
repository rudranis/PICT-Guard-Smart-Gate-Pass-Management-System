"""
Add demo data for faculty, students, alumni, and visitors to MongoDB
Run this script to populate the database with sample data
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import datetime, timezone, timedelta

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def add_demo_data():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]

    # Sample Faculty Data
    faculty_data = [
        {
            "faculty_id": "PICT-FAC-001",
            "name": "Dr. Rajesh Kumar",
            "email": "rajesh.kumar@pict.edu",
            "mobile_no": "9876543210",
            "department": "Computer Engineering",
            "profession": "Professor",
            "token": "token_fac_001",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "faculty_id": "PICT-FAC-002",
            "name": "Prof. Neha Singh",
            "email": "neha.singh@pict.edu",
            "mobile_no": "9876543211",
            "department": "Information Technology",
            "profession": "Associate Professor",
            "token": "token_fac_002",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "faculty_id": "PICT-FAC-003",
            "name": "Dr. Amit Patel",
            "email": "amit.patel@pict.edu",
            "mobile_no": "9876543212",
            "department": "Electronics and Telecommunication",
            "profession": "Associate Professor",
            "token": "token_fac_003",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "faculty_id": "PICT-FAC-004",
            "name": "Prof. Priya Sharma",
            "email": "priya.sharma@pict.edu",
            "mobile_no": "9876543213",
            "department": "Computer Engineering",
            "profession": "Assistant Professor",
            "token": "token_fac_004",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "faculty_id": "PICT-FAC-005",
            "name": "Dr. Vikram Deshmukh",
            "email": "vikram.deshmukh@pict.edu",
            "mobile_no": "9876543214",
            "department": "Artificial Intelligence",
            "profession": "Professor",
            "token": "token_fac_005",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]

    # Sample Student Data
    student_data = [
        {
            "reg_no": "PICT-2022-001",
            "name": "Aditya Verma",
            "email": "aditya.verma@student.pict.edu",
            "mobile_no": "9987654321",
            "dob": "2003-05-15",
            "current_year": 3,
            "token": "token_std_001",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "reg_no": "PICT-2022-002",
            "name": "Bhavna Reddy",
            "email": "bhavna.reddy@student.pict.edu",
            "mobile_no": "9987654322",
            "dob": "2003-07-22",
            "current_year": 3,
            "token": "token_std_002",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "reg_no": "PICT-2022-003",
            "name": "Chetan Prabhu",
            "email": "chetan.prabhu@student.pict.edu",
            "mobile_no": "9987654323",
            "dob": "2003-09-10",
            "current_year": 3,
            "token": "token_std_003",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "reg_no": "PICT-2023-004",
            "name": "Disha Gupta",
            "email": "disha.gupta@student.pict.edu",
            "mobile_no": "9987654324",
            "dob": "2004-02-14",
            "current_year": 2,
            "token": "token_std_004",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "reg_no": "PICT-2023-005",
            "name": "Eshwar Nair",
            "email": "eshwar.nair@student.pict.edu",
            "mobile_no": "9987654325",
            "dob": "2004-06-08",
            "current_year": 2,
            "token": "token_std_005",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "reg_no": "PICT-2024-006",
            "name": "Farhan Khan",
            "email": "farhan.khan@student.pict.edu",
            "mobile_no": "9987654326",
            "dob": "2005-01-20",
            "current_year": 1,
            "token": "token_std_006",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "reg_no": "PICT-2024-007",
            "name": "Gitika Singh",
            "email": "gitika.singh@student.pict.edu",
            "mobile_no": "9987654327",
            "dob": "2005-04-11",
            "current_year": 1,
            "token": "token_std_007",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "reg_no": "PICT-2024-008",
            "name": "Harsh Jain",
            "email": "harsh.jain@student.pict.edu",
            "mobile_no": "9987654328",
            "dob": "2005-08-30",
            "current_year": 1,
            "token": "token_std_008",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]

    # Sample Alumni Data
    alumni_data = [
        {
            "first_name": "Rahul",
            "middle_name": "Kumar",
            "last_name": "Sharma",
            "email": "rahul.sharma@alumni.pict.edu",
            "secondary_email": "rahul.k.sharma@gmail.com",
            "mobile_no": "9123456789",
            "secondary_phone": "9198765432",
            "gender": "Male",
            "enrollment_number": "2019-CE-001",
            "degree": "BTech",
            "branch": "Computer Engineering",
            "sub_institute": "Pune Institute of Computer Technology",
            "year_of_joining": 2019,
            "year_of_passing": 2023,
            "company": "TCS",
            "designation": "Senior Software Engineer",
            "address": "Bangalore, Karnataka",
            "linkedin_profile": "https://linkedin.com/in/rahul-sharma",
            "registered_for_portal": "yes",
            "token": "token_alum_001",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "first_name": "Sneha",
            "middle_name": "Priya",
            "last_name": "Desai",
            "email": "sneha.desai@alumni.pict.edu",
            "secondary_email": "sneha.p.desai@gmail.com",
            "mobile_no": "9123456790",
            "secondary_phone": "9198765433",
            "gender": "Female",
            "enrollment_number": "2019-IT-045",
            "degree": "BTech",
            "branch": "Information Technology",
            "sub_institute": "Pune Institute of Computer Technology",
            "year_of_joining": 2019,
            "year_of_passing": 2023,
            "company": "Infosys",
            "designation": "Software Developer",
            "address": "Pune, Maharashtra",
            "linkedin_profile": "https://linkedin.com/in/sneha-desai",
            "registered_for_portal": "yes",
            "token": "token_alum_002",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "first_name": "Akhil",
            "middle_name": "Raj",
            "last_name": "Patel",
            "email": "akhil.patel@alumni.pict.edu",
            "secondary_email": "akhil.r.patel@gmail.com",
            "mobile_no": "9123456791",
            "secondary_phone": "9198765434",
            "gender": "Male",
            "enrollment_number": "2020-ET-078",
            "degree": "BTech",
            "branch": "Electronics and Telecommunication Engineering",
            "sub_institute": "Pune Institute of Computer Technology",
            "year_of_joining": 2020,
            "year_of_passing": 2024,
            "company": "Qualcomm",
            "designation": "Design Engineer",
            "address": "Bangalore, Karnataka",
            "linkedin_profile": "https://linkedin.com/in/akhil-patel",
            "registered_for_portal": "yes",
            "token": "token_alum_003",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        },
        {
            "first_name": "Pooja",
            "middle_name": "Anjali",
            "last_name": "Verma",
            "email": "pooja.verma@alumni.pict.edu",
            "secondary_email": "pooja.a.verma@gmail.com",
            "mobile_no": "9123456792",
            "secondary_phone": "9198765435",
            "gender": "Female",
            "enrollment_number": "2018-CE-092",
            "degree": "BTech",
            "branch": "Computer Engineering",
            "sub_institute": "Pune Institute of Computer Technology",
            "year_of_joining": 2018,
            "year_of_passing": 2022,
            "company": "Google",
            "designation": "Software Engineer",
            "address": "Sunnyvale, USA",
            "linkedin_profile": "https://linkedin.com/in/pooja-verma",
            "registered_for_portal": "yes",
            "token": "token_alum_004",
            "valid_till": (datetime.now(timezone.utc) + timedelta(days=365)).isoformat(),
            "created_at": datetime.now(timezone.utc).isoformat()
        }
    ]

    # Sample Visitor Data
    visitor_data = [
        {
            "full_name": "Rajkumar Singh",
            "phone_number": "9876543329",
            "email": "rajkumar.singh@company.com",
            "gender": "Male",
            "date_of_birth": "1990-03-15",
            "id_type": "Aadhar Card",
            "id_number": "1234-5678-9012",
            "visitor_type": "visitor",
            "person_to_visit_id": "PICT-FAC-001",
            "person_to_visit_name": "Dr. Rajesh Kumar",
            "person_to_visit_mobile": "9876543210",
            "purpose": "Project Discussion",
            "token": "token_vis_001",
            "valid_till": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        },
        {
            "full_name": "Priyanka Joshi",
            "phone_number": "9876543330",
            "email": "priyanka.joshi@company.com",
            "gender": "Female",
            "date_of_birth": "1992-07-22",
            "id_type": "Passport",
            "id_number": "AB1234567",
            "visitor_type": "visitor",
            "person_to_visit_id": "PICT-FAC-002",
            "person_to_visit_name": "Prof. Neha Singh",
            "person_to_visit_mobile": "9876543211",
            "purpose": "Research Collaboration",
            "token": "token_vis_002",
            "valid_till": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        },
        {
            "full_name": "Vikram Gupta",
            "phone_number": "9876543331",
            "email": "vikram.gupta@company.com",
            "gender": "Male",
            "date_of_birth": "1988-10-08",
            "id_type": "Driving License",
            "id_number": "DL7534621",
            "visitor_type": "worker",
            "person_to_visit_id": "",
            "person_to_visit_name": "Campus Maintenance",
            "person_to_visit_mobile": "9876543240",
            "purpose": "Facility Maintenance",
            "token": "token_vis_003",
            "valid_till": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        },
        {
            "full_name": "Isha Malhotra",
            "phone_number": "9876543332",
            "email": "isha.malhotra@company.com",
            "gender": "Female",
            "date_of_birth": "1995-01-30",
            "id_type": "Voter ID",
            "id_number": "VT-2024-78965",
            "visitor_type": "visitor",
            "person_to_visit_id": "PICT-FAC-003",
            "person_to_visit_name": "Dr. Amit Patel",
            "person_to_visit_mobile": "9876543212",
            "purpose": "Guest Lecture",
            "token": "token_vis_004",
            "valid_till": (datetime.now(timezone.utc) + timedelta(hours=24)).isoformat()
        }
    ]

    # Clear existing collections (optional - comment out if you want to keep existing data)
    # await db.faculty.delete_many({})
    # await db.students.delete_many({})
    # await db.alumni.delete_many({})
    # await db.visitors.delete_many({})

    # Insert demo data
    try:
        # Insert Faculty
        faculty_result = await db.faculty.insert_many(faculty_data)
        print(f"✅ Inserted {len(faculty_result.inserted_ids)} faculty members")

        # Insert Students
        student_result = await db.students.insert_many(student_data)
        print(f"✅ Inserted {len(student_result.inserted_ids)} students")

        # Insert Alumni
        alumni_result = await db.alumni.insert_many(alumni_data)
        print(f"✅ Inserted {len(alumni_result.inserted_ids)} alumni")

        # Insert Visitors
        visitor_result = await db.visitors.insert_many(visitor_data)
        print(f"✅ Inserted {len(visitor_result.inserted_ids)} visitors")

        print("\n✅ Demo data added successfully!")
    except Exception as e:
        print(f"❌ Error adding demo data: {str(e)}")
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(add_demo_data())
