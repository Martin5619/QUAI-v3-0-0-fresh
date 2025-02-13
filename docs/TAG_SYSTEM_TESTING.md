# Document Tag System Testing Plan
Created: 2025-02-13T09:14:30Z

## Test Environment
- Development server: http://localhost:3002
- Prisma Studio: http://localhost:5556
- Branch: feature/prisma-recovery-20250213

## Test Cases

### 1. Tag Management
#### 1.1 Create Tag
```typescript
// Test with authenticated user
const response = await fetch('/api/documents/tags', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'test-tag',
    description: 'Test tag for system verification'
  })
})
```
Expected: 
- Success response with tag data
- Tag visible in Prisma Studio
- Unique name constraint enforced

#### 1.2 List Tags
```typescript
const response = await fetch('/api/documents/tags')
```
Expected:
- List of tags with document counts
- Filtered by user's documents
- Sorted alphabetically

#### 1.3 Delete Tag
```typescript
const response = await fetch(`/api/documents/tags/${tagId}`, {
  method: 'DELETE'
})
```
Expected:
- Tag removed
- Related DocumentToTag entries removed
- Document relationships preserved

### 2. Document Tag Operations
#### 2.1 Create Document with Tags
```typescript
const response = await fetch('/api/documents', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    title: 'Test Document',
    content: 'Test content',
    format: 'text',
    tags: ['test-tag']
  })
})
```
Expected:
- Document created
- Tags associated
- Relationships visible in Prisma Studio

#### 2.2 Update Document Tags
```typescript
const response = await fetch(`/api/documents/${documentId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    tags: ['new-tag']
  })
})
```
Expected:
- Tags updated
- Old relationships removed
- New relationships created

## Test Procedure
1. Create test user account
2. Create test tags
3. Create test documents
4. Verify relationships
5. Test updates
6. Test deletions
7. Verify cascade behavior

## Verification Points
1. Data Integrity
   - [ ] Tag uniqueness
   - [ ] Document-tag relationships
   - [ ] Cascade deletes

2. API Behavior
   - [ ] Authentication
   - [ ] Input validation
   - [ ] Error handling

3. Performance
   - [ ] Response times
   - [ ] Query optimization

## Status: READY FOR TESTING
Priority: High - Part of document system recovery

## Next Steps
1. Create test user
2. Execute test cases
3. Document results
4. Address any issues
