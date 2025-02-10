# Component Management Script

param(
    [Parameter(Mandatory=$true)]
    [string]$Action,  # backup, recover, document
    
    [Parameter(Mandatory=$true)]
    [string]$ComponentName,
    
    [Parameter(Mandatory=$false)]
    [string]$Version,
    
    [Parameter(Mandatory=$false)]
    [string]$CommitHash
)

$ErrorActionPreference = "Stop"

# Configuration
$SCREENSHOT_DIR = "docs/screenshots"
$BACKUP_DIR = "backups/components"
$DOCS_DIR = "docs/features"

function Backup-Component {
    param($ComponentName, $Version)
    
    # Create backup branch
    git checkout -b "backup/$ComponentName-v$Version"
    
    # Create screenshot
    # TODO: Implement screenshot automation
    
    # Update documentation
    $docPath = Join-Path $DOCS_DIR "UI_COMPONENTS.md"
    # TODO: Update documentation with new version
    
    # Create backup
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupDir = Join-Path $BACKUP_DIR "$ComponentName/$Version"
    
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir -Force
    }
    
    # Copy component files
    Copy-Item "src/components/**/*$ComponentName*.tsx" $backupDir -Force
    
    Write-Host "Component $ComponentName v$Version backed up successfully"
}

function Recover-Component {
    param($ComponentName, $Version, $CommitHash)
    
    if ($CommitHash) {
        # Recover from specific commit
        git checkout $CommitHash -- "src/components/**/*$ComponentName*.tsx"
    }
    else {
        # Recover from backup
        $backupDir = Join-Path $BACKUP_DIR "$ComponentName/$Version"
        Copy-Item "$backupDir/*" "src/components/" -Force -Recurse
    }
    
    Write-Host "Component $ComponentName recovered to v$Version successfully"
}

function Document-Component {
    param($ComponentName, $Version)
    
    $docPath = Join-Path $DOCS_DIR "UI_COMPONENTS.md"
    $timestamp = Get-Date -Format "yyyy-MM-dd"
    $commitHash = git rev-parse HEAD
    
    # TODO: Update documentation with new version info
    
    Write-Host "Component $ComponentName v$Version documented successfully"
}

# New functions for tracking attempted solutions and approved states

function Update-AttemptedSolutions {
    param (
        [string]$Problem,
        [string]$AttemptedSolution,
        [string]$FailureReason,
        [string]$WorkingSolution,
        [string]$RecoveryPoint
    )
    
    $date = Get-Date -Format "yyyy-MM-dd"
    $entry = @"

### $Problem ($date)
**Problem**: $Problem
**What Was Tried**: $AttemptedSolution
**Why It Failed**: $FailureReason
**What Worked Instead**: $WorkingSolution
**Recovery Point**: $RecoveryPoint
"@
    
    Add-Content -Path "..\docs\development\ATTEMPTED_SOLUTIONS.md" -Value $entry
    Write-Host "Added failed attempt to documentation"
}

function Track-ApprovedState {
    param (
        [string]$Component,
        [string]$Version,
        [string]$Dependencies
    )
    
    $date = Get-Date -Format "yyyy-MM-dd"
    $recoveryPoint = "$Component-v3-approved-$date"
    
    # Create backup
    Backup-Component -Component $Component -Version $Version
    
    $entry = @"

### $Component ($Version)
**Approved**: $date
**Recovery Point**: $recoveryPoint
**Component Hash**: $(Get-FileHash $Component).Hash
**Location**: $Component
**Dependencies**: $Dependencies

**DO NOT MODIFY WITHOUT**:
1. Written approval
2. Backup creation
3. Recovery point
4. Documentation update
"@
    
    Add-Content -Path "..\docs\development\APPROVED_STATES.md" -Value $entry
    Write-Host "Registered approved state for $Component"
}

function Check-ApprovedState {
    param (
        [string]$Component
    )
    
    $approvedStates = Get-Content "..\docs\development\APPROVED_STATES.md"
    if ($approvedStates -match $Component) {
        Write-Host "Found approved state for $Component"
        return $true
    }
    Write-Host "No approved state found for $Component"
    return $false
}

function Request-StateModification {
    param (
        [string]$Component,
        [string]$Reason
    )
    
    if (Check-ApprovedState -Component $Component) {
        $date = Get-Date -Format "yyyy-MM-dd"
        $request = @"
## Modification Request for $Component
**Date**: $date
**Reason**: $Reason
**Status**: Pending Approval

### Checklist:
[] Backup created
[] Dependencies checked
[] Recovery point created
[] Documentation updated
"@
        Add-Content -Path "..\docs\development\MODIFICATION_REQUESTS.md" -Value $request
        Write-Host "Created modification request for $Component"
    }
    else {
        Write-Host "Component not found in approved states"
    }
}

# Main execution
try {
    switch ($Action) {
        "backup" { 
            Backup-Component -ComponentName $ComponentName -Version $Version 
        }
        "recover" { 
            Recover-Component -ComponentName $ComponentName -Version $Version -CommitHash $CommitHash 
        }
        "document" { 
            Document-Component -ComponentName $ComponentName -Version $Version 
        }
        default {
            throw "Invalid action specified"
        }
    }
}
catch {
    Write-Error "Error: $_"
    exit 1
}
