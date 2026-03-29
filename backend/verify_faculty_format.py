"""
Verification: Confirm all faculty records are in PICT-FAC-XXX format
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def verify_faculty_format():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("\n" + "=" * 70)
    print("FACULTY DATABASE VERIFICATION")
    print("=" * 70)
    
    try:
        # Get all faculty sorted by faculty_id
        faculty_list = await db.faculty.find({}).sort("faculty_id", 1).to_list(None)
        
        print(f"\n📊 Total Faculty Records: {len(faculty_list)}\n")
        print(f"{'Faculty ID':<18} {'Name':<28} {'Department':<18}")
        print("-" * 70)
        
        for fac in faculty_list:
            fac_id = fac.get("faculty_id", "N/A")
            name = fac.get("name", "N/A")[:28]
            dept = fac.get("department", "N/A")[:18]
            print(f"{fac_id:<18} {name:<28} {dept:<18}")
        
        # Check format consistency
        print("\n" + "=" * 70)
        print("FORMAT ANALYSIS")
        print("=" * 70)
        
        pict_fac_count = await db.faculty.count_documents(
            {"faculty_id": {"$regex": "^PICT-FAC-"}}
        )
        fact_count = await db.faculty.count_documents(
            {"faculty_id": {"$regex": "^fact_"}}
        )
        
        print(f"\n✓ PICT-FAC-XXX format: {pict_fac_count} records")
        print(f"✓ Old fact_XXXX format: {fact_count} records")
        
        if fact_count == 0 and pict_fac_count > 0:
            print("\n✅ SUCCESS! ALL RECORDS ARE IN CORRECT FORMAT!")
            print("   Database is now fully standardized to PICT-FAC-XXX format")
        else:
            print(f"\n⚠️  WARNING: Inconsistent formats detected")
            print(f"   PICT-FAC-XXX: {pict_fac_count}, fact_XXXX: {fact_count}")
        
        print("\n" + "=" * 70)
        
    except Exception as e:
        print(f"\n❌ Verification failed: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(verify_faculty_format())
