# Document Tag System Analysis
Created: 2025-02-13T09:09:00Z

## Current Database Structure

### Collection: document_tags_v3
```json
{
  "_id": ObjectId,
  "name": String,        // Unique tag name
  "description": String, // Optional description
  "createdAt": Date,    // Creation timestamp
  "updatedAt": Date     // Last update timestamp
}
```

### Collection: document_to_tags_v3
```json
{
  "_id": ObjectId,
  "documentId": ObjectId,  // References documents_v3._id
  "tagId": ObjectId,       // References document_tags_v3._id
  "createdAt": Date,       // Creation timestamp
  "updatedAt": Date        // Last update timestamp
}
```

### Relationships
1. Many-to-Many relationship between Document_v3 and DocumentTag_v3
2. DocumentToTag_v3 serves as the junction table
3. Cascading deletes implemented through MongoDB

## Code Analysis
1. API Implementation (/api/documents/tags/):
   - Uses Prisma models that match this structure
   - Implements proper relationship handling
   - Includes tag count functionality

2. Frontend Components:
   - Tag selection in document upload
   - Tag filtering in document list
   - Tag management interface

## Proposed Schema Changes

```prisma
model DocumentTag_v3 {
  id          String            @id @default(auto()) @map("_id") @db.ObjectId
  name        String            @unique
  description String?
  documents   DocumentToTag_v3[]
  createdAt   DateTime          @default(now())
  updatedAt   DateTime          @updatedAt

  @@map("document_tags_v3")
}

model DocumentToTag_v3 {
  id         String       @id @default(auto()) @map("_id") @db.ObjectId
  documentId String       @db.ObjectId
  tagId      String       @db.ObjectId
  document   Document_v3  @relation(fields: [documentId], references: [id], onDelete: Cascade)
  tag        DocumentTag_v3 @relation(fields: [tagId], references: [id], onDelete: Cascade)
  createdAt  DateTime     @default(now())
  updatedAt  DateTime     @updatedAt

  @@unique([documentId, tagId])
  @@map("document_to_tags_v3")
}
```

Update to Document_v3 model:
```prisma
model Document_v3 {
  id          String            @id @default(auto()) @map("_id") @db.ObjectId
  userId      String            @db.ObjectId
  title       String
  content     String
  type        String           // PDF, DOC, etc.
  size        Int              // In bytes
  tags        DocumentToTag_v3[]
  user        User_v3          @relation(fields: [userId], references: [id], onDelete: Cascade)
  createdAt   DateTime         @default(now())
  updatedAt   DateTime         @updatedAt

  @@map("documents_v3")
}
```

## Implementation Notes
1. Schema matches existing database structure
2. Preserves all current relationships
3. Maintains data integrity with cascading deletes
4. Supports existing API implementation

## Migration Impact
1. No data migration needed - schema matches DB
2. Existing relationships preserved
3. API code already aligned with structure

## Next Steps
1. Review proposed schema changes
2. Apply schema updates
3. Verify relationships in Prisma Studio
4. Test API endpoints
5. Validate frontend integration
