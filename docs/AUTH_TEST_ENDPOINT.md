# Authentication Test Endpoint
Created: 2025-02-13T09:33:45Z

## Purpose
Isolated endpoint for testing authentication state without UI dependencies.

## Endpoint Details
- URL: `/api/auth/test`
- Method: GET
- Authentication: Required

## Response Format
```typescript
{
  auth: {
    isAuthenticated: boolean
    sessionValid: boolean
  }
  user: {
    id: string
    email: string
    firstName: string | null
    lastName: string | null
    role: string
    accountState: string
  }
  sessions: Array<{
    id: string
    expires: Date
  }>
}
```

## Error Responses
1. Not Authenticated (401)
   ```json
   { "error": "Not authenticated" }
   ```

2. User Not Found (404)
   ```json
   { "error": "User not found" }
   ```

3. Server Error (500)
   ```json
   { 
     "error": "Internal server error",
     "details": "Error message"
   }
   ```

## Testing Instructions
1. **Using Browser**
   - Visit: http://localhost:3002/api/auth/test
   - Should redirect to login if not authenticated

2. **Using cURL**
   ```bash
   # With session cookie
   curl http://localhost:3002/api/auth/test -H "Cookie: next-auth.session-token=<token>"
   ```

## Recovery Points
- Endpoint file: `src/app/api/auth/test/route.ts`
- Created: 2025-02-13T09:33:45Z
- Branch: feature/auth-testing-20250213-0917

## Status: READY FOR TESTING
Priority: High - Authentication Verification
