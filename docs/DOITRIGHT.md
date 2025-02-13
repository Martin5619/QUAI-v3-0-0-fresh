# DOITRIGHT - Critical Development Guidelines

## Core Principles
1. **Documentation First**
   - READ all of QUAI_V3_CENTRAL.md and associated documents
   - Document all changes in implementation logs
   - Time stamp all changes for easy reference
   - Cross-reference new documents in QUAI_V3_CENTRAL.md
   - Save all chat history in memories
   - Maintain clear timeline of decisions
   - Track approvals and rejections

2. **Schema Management**
   - Always build forward on schema
   - Never change schema backwards
   - Question and report potentially unnecessary fields/models
   - Maintain all relationships between models and fields
   - Never remove fields or models
   - Check Prisma and schema before changes to avoid duplication
   - IMMEDIATE STOP and report for any schema-related changes
   - Explicit approval required for all schema modifications
   - Document all schema-related discussions

3. **Change Management**
   - Report ALL planned changes before implementation
   - Get approval for changes after impact assessment
   - Keep logs of every change (good and bad)
   - Document implementation details
   - Create new branches for sectional changes
   - Regular commits at each change point
   - Regular GitHub backups
   - Provide clear rationale for each action
   - Await explicit approval before proceeding
   - Document expected outcomes
   - Create micro-branches for focused changes

4. **Environment Management**
   - All .env and .env.local files are correct and verified
   - Keep site on port 3002
   - Start Prisma for assistance
   - Check dependencies and components pre-change
   - Track all environment variables
   - Document configuration changes
   - Maintain environment parity
   - Report discrepancies
   - Regular environment verification

5. **Version Control**
   - Full rollback and reversion plans required
   - Regular backups for reversions
   - Clear documentation of recovery points
   - Use v2.4.16 only as reference for old features
   - Remember this is a new V3 product build
   - Secure separate branches for each feature
   - Maintain clean development phases
   - Document branch purposes and states
   - Clear merge requirements
   - GitHub backup after each significant change

6. **Development Process**
   - Schema-driven development
   - Check QUAI_V3_CENTRAL.md for design guidance
   - Follow V3 design and instructions
   - Check dependencies before changes
   - Document all changes with timestamps
   - Save all chat history in memories
   - Document sequence of events
   - Track approvals and rejections

7. **Dependency Management**
   - Report any new dependency requirements
   - Document version constraints
   - Track dependency conflicts
   - Maintain compatibility matrix
   - Review dependencies before changes
   - Regular dependency audits

8. **Testing Protocol**
   - Document test cases before changes
   - Report test results after changes
   - Maintain test coverage metrics
   - Track regression tests
   - Verify functionality after changes
   - Document test procedures

## Implementation Requirements
1. Read this document at:
   - Start of each chat session
   - Before making any changes
   - When considering schema modifications
   - Before creating new branches
   - When planning feature implementations

2. Respond to "READ DOITRIGHT" with:
   - Confirmation of guidelines review
   - Application to current task
   - Any potential conflicts or concerns
   - Clear plan of action
   - Expected outcomes
   - Required approvals
   - Recovery points identification

3. Branch Management:
   - Create focused micro-branches for each change
   - Document branch purpose and scope
   - Maintain clean commit history
   - Regular GitHub backups
   - Clear merge criteria

4. Documentation Requirements:
   - Update relevant documentation immediately
   - Cross-reference related documents
   - Maintain conversation history in memories
   - Track all decisions and approvals
   - Keep clear timeline of changes

## Last Updated: 2025-02-13T06:58:42Z
