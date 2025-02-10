# System Setup Documentation
**CRITICAL: Environment Configuration and Testing Status**

## Environment Variables
### Status: ✓ Verified
Last Setup: 2025-02-09
Last Tested: 2025-02-10 11:03 UTC

### Configuration
```bash
# App
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3002
NEXTAUTH_SECRET=[secured]

# Database
DATABASE_URL=[secured-mongodb-url]
DATABASE_NAME=quai_v3

# AI Configuration
AI_PROVIDER=claude
AI_MAX_RETRIES=3
AI_BATCH_SIZE=2
AI_TEMPERATURE=0.7
AI_TIMEOUT_MS=120000
ANTHROPIC_API_KEY=[secured]

# Authentication
GOOGLE_CLIENT_ID=[secured]
GOOGLE_CLIENT_SECRET=[secured]

# Storage
BLOB_READ_WRITE_TOKEN=[secured]

# Payment
STRIPE_SECRET_KEY=[secured]
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=[secured]
```

### Verification Status
- [x] Variables present in .env
- [x] Variables present in .env.local
- [x] Database connection verified (quai_v3)
- [x] Auth system configured
- [x] AI system configured
- [x] Storage system configured
- [x] Payment system configured

## System Dependencies
### Node.js
- Version: 18.x+
- Status: ✓ Verified

### Database
- MongoDB Atlas
- Database: quai_v3
- Status: ✓ Verified
- Collections: Using _v3 suffix

### External Services
- Anthropic Claude AI
- Google OAuth
- Vercel Blob Storage
- Stripe Payments
Status: ✓ All Verified

## Port Configuration
- Next.js: 3002
- Status: ✓ Verified

## Security Notes
- All sensitive keys stored in .env.local
- Production keys separate from test keys
- Regular key rotation required
- Access restricted by IP where possible

## Backup Protocol
### Environment Backup
- Location: ./backups/env
- Frequency: Daily
- Last Backup: 2025-02-10 11:03 UTC
- Includes: .env and .env.local (encrypted)

### Database Backup
- Location: MongoDB Atlas
- Frequency: Continuous
- Point-in-time recovery: Enabled
- Retention: 7 days

## Quick Commands
```powershell
# Verify environment
.\scripts\verify-env.ps1

# Test database
.\scripts\test-db.ps1

# Create backup
.\scripts\backup-env.ps1
```

## Change History
### 2025-02-09
- Initial setup of environment variables
- MongoDB Atlas connection established
- Authentication services configured

### 2025-02-10
- Documentation updated
- All services verified
- Backup protocol established

**IMPORTANT**: Update this document after any environment changes
