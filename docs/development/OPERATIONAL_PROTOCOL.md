# Operational Protocol
**CRITICAL: This is our session startup and management guide**

## Session Startup Command
ALWAYS start each session with:
```powershell
.\scripts\session-manager.ps1
```

## Pre-Session Checklist
1. Environment Setup
   - Clear port 3002
   - Clear port 5555 (Prisma Studio)
   - Verify Node.js version
   - Check git status

2. Documentation Review
   - Read QUAI_V3_CENTRAL.md
   - Check APPROVED_STATES.md
   - Review ATTEMPTED_SOLUTIONS.md
   - Verify recovery points

3. Service Startup
   - Start Prisma Studio
   - Verify database connection
   - Check required ports
   - Test environment

4. Strategy Verification
   - Confirm _v3 suffix usage
   - Check project directory
   - Verify clean implementation
   - Review current goals

## During Session Rules
1. Code Changes
   ```markdown
   [] Check ATTEMPTED_SOLUTIONS.md before trying solutions
   [] Verify against APPROVED_STATES.md before modifications
   [] Create recovery point before changes
   [] Document all attempts, successful or not
   ```

2. Component Management
   ```markdown
   [] Use component-manager.ps1 for all changes
   [] Create backups before modifications
   [] Get explicit approval for changes
   [] Document all modifications
   ```

3. Database Operations
   ```markdown
   [] Keep Prisma Studio running
   [] Verify schema changes
   [] Test migrations
   [] Create recovery points
   ```

4. Port Management
   ```markdown
   [] Clear port 3002 before starting
   [] Clear port 5555 for Prisma Studio
   [] Check for conflicting processes
   [] Verify service startup
   ```

## Recovery Procedures
1. Component Recovery
   ```markdown
   [] Identify recovery point
   [] Use component-manager.ps1
   [] Verify dependencies
   [] Test functionality
   ```

2. Database Recovery
   ```markdown
   [] Stop current processes
   [] Use recovery point
   [] Verify schema
   [] Test connections
   ```

3. Service Recovery
   ```markdown
   [] Clear ports
   [] Restart services
   [] Verify connections
   [] Test functionality
   ```

## Session Logging
Every session is automatically logged:
1. Start time and duration
2. Changes attempted
3. Solutions tried
4. Recovery points created
5. Services started/stopped

## Quick Commands
1. Clear Ports:
   ```powershell
   Clear-Port 3002
   Clear-Port 5555
   ```

2. Start Services:
   ```powershell
   Start-Services
   ```

3. Check Strategy:
   ```powershell
   Test-ProjectStrategy
   ```

4. Create Recovery Point:
   ```powershell
   Track-ApprovedState -Component "component-name" -Version "version"
   ```

## Automated Checks
The session manager automatically:
1. Clears required ports
2. Starts necessary services
3. Verifies project strategy
4. Creates session logs
5. Monitors changes

## Error Recovery
If session-manager.ps1 reports errors:
1. Read error message carefully
2. Check specific component in APPROVED_STATES.md
3. Verify ATTEMPTED_SOLUTIONS.md
4. Follow recovery procedures
5. Document resolution

## Remember
1. NEVER skip session startup protocol
2. ALWAYS check before trying solutions
3. ALWAYS create recovery points
4. ALWAYS document attempts
5. ALWAYS follow project strategy
