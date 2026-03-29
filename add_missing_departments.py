"""
Script to add missing departments to students in MongoDB
Finds all students without a department and updates them
"""

from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
import asyncio
from pathlib import Path

# Load environment variables
ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / 'backend/.env')

MONGO_URL = os.getenv('MONGO_URL', 'mongodb://localhost:27017/')
DB_NAME = os.getenv('DB_NAME', 'pict_guard')

# Default departments for PICT
DEPARTMENTS = [
    "Information Technology",
    "Computer Engineering",
    "Artificial Intelligence",
    "Electronics and Telecommunication Engineering",
    "Electronics and Computer Engineering",
    "Other"
]

async def add_missing_departments():
    """Connect to MongoDB and add default department to students without one"""
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    students_collection = db['students']
    
    try:
        # Count students without department
        students_without_dept = await students_collection.count_documents({
            "$or": [
                {"department": ""},
                {"department": None},
                {"department": {"$exists": False}}
            ]
        })
        
        if students_without_dept == 0:
            print("✅ All students have departments!")
            return
        
        print(f"\n📊 Found {students_without_dept} students without department\n")
        
        # Show departments available
        print("Available Departments:")
        for i, dept in enumerate(DEPARTMENTS, 1):
            print(f"  {i}. {dept}")
        
        choice = input("\nSelect department to assign to missing records (1-6) or 'skip': ").strip()
        
        if choice.lower() == 'skip':
            print("❌ Skipped")
            return
        
        try:
            dept_idx = int(choice) - 1
            if 0 <= dept_idx < len(DEPARTMENTS):
                selected_dept = DEPARTMENTS[dept_idx]
            else:
                print("❌ Invalid choice")
                return
        except ValueError:
            print("❌ Invalid input")
            return
        
        # Update all students without department
        result = await students_collection.update_many(
            {
                "$or": [
                    {"department": ""},
                    {"department": None},
                    {"department": {"$exists": False}}
                ]
            },
            {"$set": {"department": selected_dept}}
        )
        
        print(f"\n✅ Updated {result.modified_count} students with department: {selected_dept}")
        
        # Show updated students
        updated_students = await students_collection.find(
            {"department": selected_dept},
            {"reg_no": 1, "name": 1, "department": 1, "_id": 0}
        ).to_list(None)
        
        print(f"\n📋 Updated Students ({len(updated_students)}):")
        for student in updated_students[:10]:  # Show first 10
            print(f"  • {student['reg_no']} - {student['name']}")
        
        if len(updated_students) > 10:
            print(f"  ... and {len(updated_students) - 10} more")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

async def list_students_without_department():
    """List all students without department"""
    
    client = AsyncIOMotorClient(MONGO_URL)
    db = client[DB_NAME]
    students_collection = db['students']
    
    try:
        students = await students_collection.find(
            {
                "$or": [
                    {"department": ""},
                    {"department": None},
                    {"department": {"$exists": False}}
                ]
            },
            {"reg_no": 1, "name": 1, "email": 1, "department": 1, "_id": 0}
        ).to_list(None)
        
        if not students:
            print("✅ All students have departments!")
            return
        
        print(f"\n📋 Students Without Department ({len(students)}):\n")
        print(f"{'Reg No':<15} {'Name':<30} {'Email':<30} {'Dept':<20}")
        print("-" * 95)
        
        for student in students:
            reg_no = student.get('reg_no', 'N/A')
            name = student.get('name', 'N/A')[:28]
            email = student.get('email', 'N/A')[:28]
            dept = student.get('department') or "MISSING"
            print(f"{reg_no:<15} {name:<30} {email:<30} {dept:<20}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        client.close()

if __name__ == "__main__":
    import sys
    
    print("🔧 PICT Guard - Add Missing Departments Script\n")
    
    if len(sys.argv) > 1 and sys.argv[1] == "list":
        print("Listing students without department...\n")
        asyncio.run(list_students_without_department())
    else:
        print("Adding missing departments...\n")
        asyncio.run(add_missing_departments())
