# Session Manager Script
# ALWAYS RUN THIS AT THE START OF EACH SESSION

# Configuration
$PORT = 3002
$PRISMA_STUDIO_PORT = 5555
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot

# Function to check if a port is in use
function Test-Port {
    param($port)
    $process = Get-NetTCPConnection -LocalPort $port -ErrorAction SilentlyContinue
    return $null -ne $process
}

# Function to kill process on port
function Clear-Port {
    param($port)
    if (Test-Port $port) {
        $process = Get-NetTCPConnection -LocalPort $port
        Stop-Process -Id (Get-Process -Id $process.OwningProcess).Id -Force
        Write-Host "Cleared process on port $port"
    }
}

# Function to verify environment
function Test-Environment {
    # Check Node version
    $nodeVersion = node -v
    Write-Host "Node Version: $nodeVersion"
    
    # Check npm version
    $npmVersion = npm -v
    Write-Host "NPM Version: $npmVersion"
    
    # Check if ports are clear
    Clear-Port $PORT
    Clear-Port $PRISMA_STUDIO_PORT
    
    # Check git status
    Set-Location $PROJECT_ROOT
    git status
}

# Function to start required services
function Start-Services {
    # Start Prisma Studio
    Start-Process -FilePath "npx" -ArgumentList "prisma studio" -WorkingDirectory $PROJECT_ROOT
    Write-Host "Started Prisma Studio on port $PRISMA_STUDIO_PORT"
    
    # Wait for Prisma Studio to start
    Start-Sleep -Seconds 5
}

# Function to verify project strategy compliance
function Test-ProjectStrategy {
    # Check for _v3 suffix in new files
    $newFiles = git status --porcelain | Where-Object { $_ -match '^\?\?' }
    foreach ($file in $newFiles) {
        if ($file -match '\.(ts|tsx|js|jsx)$' -and $file -notmatch '_v3') {
            Write-Warning "New file without _v3 suffix detected: $file"
        }
    }
    
    # Check if we're in the correct project directory
    if (-not (Test-Path "$PROJECT_ROOT\package.json")) {
        Write-Error "Not in QUAi v3.0.0 project directory!"
        return $false
    }
    
    return $true
}

# Function to run pre-session checklist
function Start-SessionChecklist {
    Write-Host "=== PRE-SESSION CHECKLIST ===" -ForegroundColor Green
    
    # 1. Environment Check
    Write-Host "`n1. Checking Environment..." -ForegroundColor Yellow
    Test-Environment
    
    # 2. Project Strategy Check
    Write-Host "`n2. Verifying Project Strategy..." -ForegroundColor Yellow
    if (-not (Test-ProjectStrategy)) {
        Write-Error "Project strategy check failed!"
        return
    }
    
    # 3. Start Required Services
    Write-Host "`n3. Starting Required Services..." -ForegroundColor Yellow
    Start-Services
    
    # 4. Documentation Check
    Write-Host "`n4. Checking Documentation..." -ForegroundColor Yellow
    $docsToCheck = @(
        "QUAI_V3_CENTRAL.md",
        "docs\development\APPROVED_STATES.md",
        "docs\development\ATTEMPTED_SOLUTIONS.md"
    )
    
    foreach ($doc in $docsToCheck) {
        if (-not (Test-Path "$PROJECT_ROOT\$doc")) {
            Write-Error "Missing required documentation: $doc"
            return
        }
    }
    
    # 5. Recovery Point Check
    Write-Host "`n5. Verifying Recovery Points..." -ForegroundColor Yellow
    $components = Get-Content "$PROJECT_ROOT\docs\development\APPROVED_STATES.md" | 
                 Select-String -Pattern "^### (.+) \(v3" | 
                 ForEach-Object { $_.Matches.Groups[1].Value }
    
    foreach ($component in $components) {
        Write-Host "Checking recovery point for: $component"
    }
    
    Write-Host "`n=== CHECKLIST COMPLETE ===" -ForegroundColor Green
    Write-Host "Ready to start development session!"
}

# Function to create session log
function New-SessionLog {
    $date = Get-Date -Format "yyyy-MM-dd_HH-mm"
    $logFile = "$PROJECT_ROOT\logs\session_$date.log"
    
    # Create log directory if it doesn't exist
    New-Item -ItemType Directory -Force -Path "$PROJECT_ROOT\logs"
    
    # Start transcript
    Start-Transcript -Path $logFile
    
    Write-Host "Session log started at: $date"
    return $logFile
}

# Main execution
try {
    # Start session log
    $logFile = New-SessionLog
    
    # Run checklist
    Start-SessionChecklist
    
    # Keep transcript running
    Write-Host "Session initialized. Log file: $logFile"
}
catch {
    Write-Error "Session initialization failed: $_"
}
finally {
    # Stop transcript
    Stop-Transcript
}
