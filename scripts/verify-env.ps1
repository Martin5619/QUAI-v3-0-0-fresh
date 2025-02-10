# Environment Verification Script for QUAi V3
# Verifies environment setup and updates documentation

param(
    [switch]$UpdateDocs
)

# Configuration
$PROJECT_ROOT = Split-Path -Parent $PSScriptRoot
$ENV_FILE = Join-Path $PROJECT_ROOT ".env"
$ENV_LOCAL_FILE = Join-Path $PROJECT_ROOT ".env.local"
$SYSTEM_SETUP_DOC = Join-Path $PROJECT_ROOT "docs\development\SYSTEM_SETUP.md"

function Test-EnvFile {
    param($FilePath)
    
    if (-not (Test-Path $FilePath)) {
        Write-Error "Missing environment file: $FilePath"
        return $false
    }
    
    $content = Get-Content $FilePath
    $required = @(
        'NEXT_PUBLIC_API_URL',
        'DATABASE_URL',
        'DATABASE_NAME',
        'NEXTAUTH_URL',
        'NEXTAUTH_SECRET',
        'AI_PROVIDER',
        'ANTHROPIC_API_KEY',
        'GOOGLE_CLIENT_ID',
        'GOOGLE_CLIENT_SECRET',
        'BLOB_READ_WRITE_TOKEN',
        'STRIPE_SECRET_KEY',
        'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'
    )
    
    $missing = @()
    foreach ($var in $required) {
        if (-not ($content | Where-Object { $_ -match "^$var=" })) {
            $missing += $var
        }
    }
    
    if ($missing.Count -gt 0) {
        Write-Error "Missing variables in $FilePath : $($missing -join ', ')"
        return $false
    }
    
    return $true
}

function Test-DatabaseConnection {
    try {
        # Load .env file
        $envContent = Get-Content $ENV_FILE
        $dbUrl = ($envContent | Where-Object { $_ -match "^DATABASE_URL=" }).Split('=')[1].Trim('"')
        
        # Test connection using mongosh
        $result = mongosh $dbUrl --eval "db.runCommand({ping: 1})" --quiet
        if ($result -match '"ok" : 1') {
            return $true
        }
        
        Write-Error "Failed to connect to database"
        return $false
    }
    catch {
        Write-Error "Database connection error: $_"
        return $false
    }
}

function Update-SystemSetupDoc {
    param(
        [bool]$EnvStatus,
        [bool]$DbStatus
    )
    
    $timestamp = Get-Date -Format "yyyy-MM-dd HH:mm"
    $content = Get-Content $SYSTEM_SETUP_DOC
    
    # Update verification status
    $content = $content -replace "Last Tested: .*", "Last Tested: $timestamp UTC"
    
    # Update checkboxes
    if ($EnvStatus) {
        $content = $content -replace "- \[ \] Variables present in \.env", "- [x] Variables present in .env"
        $content = $content -replace "- \[ \] Variables present in \.env\.local", "- [x] Variables present in .env.local"
    }
    
    if ($DbStatus) {
        $content = $content -replace "- \[ \] Database connection verified", "- [x] Database connection verified"
    }
    
    $content | Set-Content $SYSTEM_SETUP_DOC
}

# Main verification
$envStatus = Test-EnvFile $ENV_FILE
$envLocalStatus = Test-EnvFile $ENV_LOCAL_FILE
$dbStatus = Test-DatabaseConnection

# Report results
Write-Host "`nEnvironment Verification Results:"
Write-Host "--------------------------------"
Write-Host ".env file: $(if ($envStatus) { '✓' } else { '✗' })"
Write-Host ".env.local file: $(if ($envLocalStatus) { '✓' } else { '✗' })"
Write-Host "Database connection: $(if ($dbStatus) { '✓' } else { '✗' })"

if ($UpdateDocs) {
    Update-SystemSetupDoc -EnvStatus ($envStatus -and $envLocalStatus) -DbStatus $dbStatus
    Write-Host "`nUpdated SYSTEM_SETUP.md documentation"
}

# Return overall status
if (-not ($envStatus -and $envLocalStatus -and $dbStatus)) {
    exit 1
}

exit 0
