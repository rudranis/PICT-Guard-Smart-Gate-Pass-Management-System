"""
Clean Duplicates: Remove old format fact_XXXX records that have newer PICT-FAC-XXX equivalents
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def clean_duplicate_faculty():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("=" * 70)
    print("FACULTY DUPLICATE CLEANUP")
    print("Removing old format (fact_XXXX) duplicates")
    print("=" * 70)
    
    try:
        # Find all faculty with old format IDs
        old_format_docs = await db.faculty.find(
            {"faculty_id": {"$regex": "^fact_"}}
        ).to_list(None)
        
        if not old_format_docs:
            print("\n✅ No old format records found!")
            return
        
        print(f"\n📋 Found {len(old_format_docs)} old format records")
        print("\nRecords to remove:")
        print("-" * 70)
        
        deleted_count = 0
        for doc in old_format_docs:
            old_id = doc['faculty_id']
            name = doc.get('name', 'Unknown')
            email = doc.get('email', 'Unknown')
            
            # Extract number and check if equivalent new format exists
            try:
                old_num = int(old_id.split("_")[1])
                new_id = f"PICT-FAC-{old_num:03d}"
                
                # Check if the new format ID exists
                new_doc = await db.faculty.find_one({"faculty_id": new_id})
                
                if new_doc:
                    # New format exists, so delete this old one
                    result = await db.faculty.delete_one({"faculty_id": old_id})
                    if result.deleted_count > 0:
                        deleted_count += 1
                        print(f"  ✓ Deleted {old_id:15} → {new_id} exists ({name})")
                    else:
                        print(f"  ✗ Failed to delete {old_id}")
                else:
                    # New format doesn't exist, keep the old one for now
                    print(f"  ℹ️  Keeping {old_id:15} (no {new_id} equivalent)")
            except (ValueError, IndexError):
                print(f"  ✗ Invalid ID format: {old_id}")
        
        print("\n" + "=" * 70)
        print("CLEANUP SUMMARY")
        print("=" * 70)
        
        # Verify cleanup
        remaining_old = await db.faculty.count_documents(
            {"faculty_id": {"$regex": "^fact_"}}
        )
        new_format_count = await db.faculty.count_documents(
            {"faculty_id": {"$regex": "^PICT-FAC-"}}
        )
        total_faculty = await db.faculty.count_documents({})
        
        print(f"\n📊 Results:")
        print(f"  ✓ Records deleted: {deleted_count}")
        print(f"  ✓ New format (PICT-FAC-XXX): {new_format_count}")
        print(f"  ✓ Old format (fact_XXXX) remaining: {remaining_old}")
        print(f"  ✓ Total faculty records: {total_faculty}")
        
        if remaining_old == 0:
            print("\n✅ CLEANUP COMPLETED SUCCESSFULLY!")
            print("   All faculty IDs are now in PICT-FAC-XXX format")
        else:
            print(f"\n⚠️  {remaining_old} old format records remain (no PICT-FAC equivalent)")
        
        print("\n" + "=" * 70)
        
    except Exception as e:
        print(f"\n❌ Cleanup failed: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    print("\n🚀 Starting Faculty Duplicate Cleanup Script")
    print(f"   Started at: {datetime.now()}")
    print()
    
    asyncio.run(clean_duplicate_faculty())
    
    print(f"\n✨ Cleanup completed at: {datetime.now()}\n")
