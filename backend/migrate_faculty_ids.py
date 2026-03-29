"""
Migration Script: Convert old fact_XXXX format to new PICT-FAC-XXX format
This script updates all faculty IDs in the database to ensure consistency
"""

import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
import os
from pathlib import Path
from datetime import datetime

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def migrate_faculty_ids():
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("=" * 70)
    print("FACULTY ID FORMAT MIGRATION")
    print("Converting: fact_XXXX → PICT-FAC-XXX")
    print("=" * 70)
    
    try:
        # Find all faculty with old format IDs (fact_XXXX)
        old_format_docs = await db.faculty.find(
            {"faculty_id": {"$regex": "^fact_"}}
        ).to_list(None)
        
        if not old_format_docs:
            print("\n✅ No old format IDs found. Database is already standardized!")
            return
        
        print(f"\n📋 Found {len(old_format_docs)} faculty records with old format IDs")
        print("\nRecords to migrate:")
        print("-" * 70)
        
        # Prepare migration data
        migration_updates = []
        for doc in old_format_docs:
            old_id = doc['faculty_id']
            
            # Extract number from fact_0001 format
            try:
                old_num = int(old_id.split("_")[1])
            except (ValueError, IndexError):
                print(f"⚠️  Skipping invalid ID format: {old_id}")
                continue
            
            # Convert to new format PICT-FAC-XXX
            new_id = f"PICT-FAC-{old_num:03d}"
            
            migration_updates.append({
                'old_id': old_id,
                'new_id': new_id,
                'name': doc.get('name', 'Unknown'),
                'email': doc.get('email', 'Unknown')
            })
            
            print(f"  {old_id:15} → {new_id:15} ({doc.get('name', 'Unknown')})")
        
        print("\n" + "-" * 70)
        print(f"✓ Ready to migrate {len(migration_updates)} records")
        
        # Perform the migration
        print("\n🔄 Migrating records...")
        updated_count = 0
        errors = []
        
        for update in migration_updates:
            try:
                result = await db.faculty.update_one(
                    {"faculty_id": update['old_id']},
                    {"$set": {"faculty_id": update['new_id']}}
                )
                
                if result.modified_count > 0:
                    updated_count += 1
                    print(f"  ✓ {update['old_id']} → {update['new_id']}")
                else:
                    errors.append(f"Failed to update {update['old_id']}")
                    print(f"  ✗ Failed to update {update['old_id']}")
            except Exception as e:
                errors.append(f"{update['old_id']}: {str(e)}")
                print(f"  ✗ Error updating {update['old_id']}: {str(e)}")
        
        print("\n" + "=" * 70)
        print("MIGRATION SUMMARY")
        print("=" * 70)
        
        # Verify migration
        remaining_old = await db.faculty.count_documents(
            {"faculty_id": {"$regex": "^fact_"}}
        )
        new_format_count = await db.faculty.count_documents(
            {"faculty_id": {"$regex": "^PICT-FAC-"}}
        )
        
        print(f"\n📊 Results:")
        print(f"  ✓ Records migrated: {updated_count}")
        print(f"  ✓ New format (PICT-FAC-XXX): {new_format_count}")
        print(f"  ✓ Old format (fact_XXXX) remaining: {remaining_old}")
        
        if errors:
            print(f"\n⚠️  Errors encountered: {len(errors)}")
            for error in errors:
                print(f"  - {error}")
        
        if remaining_old == 0:
            print("\n✅ MIGRATION COMPLETED SUCCESSFULLY!")
            print("   All faculty IDs are now in PICT-FAC-XXX format")
        else:
            print(f"\n⚠️  WARNING: {remaining_old} records still have old format IDs")
        
        print("\n" + "=" * 70)
        
    except Exception as e:
        print(f"\n❌ Migration failed: {str(e)}")
        import traceback
        traceback.print_exc()
    finally:
        client.close()

if __name__ == "__main__":
    print("\n🚀 Starting Faculty ID Migration Script")
    print(f"   Started at: {datetime.now()}")
    print()
    
    asyncio.run(migrate_faculty_ids())
    
    print(f"\n✨ Migration completed at: {datetime.now()}\n")
