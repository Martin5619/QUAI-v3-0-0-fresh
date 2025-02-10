# Verification Protocol

## Pre-Change Verification
1. Database State
   - Check current schema version
   - Verify _v3 suffix consistency
   - Document current state

2. Code State
   - Current feature implementation
   - Test coverage status
   - Dependencies affected

3. Recovery Point
   - Git commit hash
   - Database backup if needed
   - Environment state

## Change Implementation
1. Code Changes
   - Follow _v3 suffix convention
   - Maintain test coverage
   - Document all changes

2. Database Changes
   - Schema modifications
   - Data migrations
   - Backup procedures

3. Testing
   - Unit tests
   - Integration tests
   - E2E tests with Cypress

## Post-Change Verification
1. Feature Verification
   - Functionality testing
   - Performance impact
   - Error handling

2. Integration Verification
   - API endpoints
   - Frontend components
   - Database operations

3. Documentation
   - Update relevant docs
   - Record verification results
   - Update milestone status
