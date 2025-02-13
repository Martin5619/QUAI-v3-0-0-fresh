# DOITRIGHT - Development Guidelines and Protocols
Created: 2025-02-13T07:50:03Z

## Core Principles
1. **Documentation First**
   - All changes must be documented before implementation
   - Include rationale, approach, and potential impacts
   - Record all decisions and their context

2. **Version Control**
   - Follow established Git protocols
   - Use feature branches for all changes
   - Maintain clean commit history
   - Regular backups and verification

3. **Change Management**
   - Create feature branches for all changes
   - Document changes in both code and documentation
   - Record all chat interactions and decisions
   - Maintain recovery points

4. **Development Process**
   - Start with documentation review
   - Create feature branch
   - Implement changes incrementally
   - Regular commits with clear messages
   - Verify and test changes
   - Update documentation
   - Create pull request

## Current Project: QUAi V3.0.0
### Active Tasks
1. **Prisma Recovery Implementation**
   - Branch: feature/prisma-recovery-20250213-0748
   - Status: In Progress
   - Priority: High
   - Dependencies: None
   - Recovery Points: Maintained

2. **Documentation Updates**
   - Branch: feature/doitright-updates-20250213-0652
   - Status: Ready for Review
   - Priority: High
   - Dependencies: None

### Development Guidelines
1. **Code Organization**
   - Maintain clear directory structure
   - Follow component-based architecture
   - Keep related files together
   - Document file purposes

2. **Code Style**
   - Follow consistent naming conventions
   - Use clear, descriptive names
   - Add comments for complex logic
   - Include JSDoc documentation

3. **Testing**
   - Write tests before implementation
   - Maintain test coverage
   - Document test scenarios
   - Regular test execution

4. **Error Handling**
   - Implement comprehensive error handling
   - Log errors appropriately
   - Maintain error recovery procedures
   - Document error scenarios

## Database Management
1. **Backup Procedures**
   - Use standardized backup location: `C:\Users\marti\CascadeProjects\MongoDB Backups`
   - Organize by project and date: `[Project]\[YYYYMMDD]`
   - Create and maintain backup manifest
   - Use MongoDB Compass for collection exports
   - Export in JSON format for portability

2. **Backup Frequency**
   - Before schema changes
   - Before major feature implementations
   - Weekly scheduled backups
   - On-demand for critical changes

3. **Backup Documentation**
   - Create manifest for each backup
   - Track export progress
   - Document any issues
   - Verify backup integrity
   - Test recovery procedures

4. **Recovery Procedures**
   - Maintain test environment
   - Verify data relationships
   - Test Prisma compatibility
   - Document recovery steps

## Documentation Requirements
1. **Code Changes**
   - Document all changes in code
   - Include clear comments
   - Update relevant documentation
   - Record rationale

2. **Chat Interactions**
   - Record all significant decisions
   - Document approach and rationale
   - Save important context
   - Track progress

3. **Recovery Points**
   - Create before major changes
   - Document recovery procedures
   - Regular testing
   - Maintain backup integrity

## Current Status
1. **Git Configuration**
   - Remote standardized to 'origin'
   - Branch protection implemented
   - Feature branches created
   - Tracking relationships established

2. **Documentation**
   - DOITRIGHT.md created
   - Git protocols documented
   - Recovery procedures established
   - Ongoing updates

3. **Next Steps**
   - Implement Prisma recovery
   - Complete documentation updates
   - Regular verification
   - Maintain protocols

- Database backup protocols established
- Standardized backup locations defined
- Manifest tracking implemented

## Recovery Procedures
1. **Before Changes**
   - Review current state
   - Create recovery point
   - Document starting point
   - Verify backups

2. **During Implementation**
   - Regular commits
   - Clear documentation
   - Maintain recovery points
   - Test incrementally

3. **After Changes**
   - Verify implementation
   - Update documentation
   - Create recovery point
   - Test thoroughly

## Status: ACTIVE
Last Updated: 2025-02-13T08:03:35Z
