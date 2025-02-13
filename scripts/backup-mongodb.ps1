# MongoDB Atlas Backup Script
# Timestamp: 2025-02-13T14:11:46Z

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$backupDir = "C:\Users\marti\CascadeProjects\MongoDB Backups\QUAi-v3\$timestamp"

# Create backup directory
New-Item -ItemType Directory -Force -Path $backupDir

# MongoDB collections to backup
$collections = @(
    "accounts_v3",
    "sessions_v3",
    "users_v3",
    "usages_v3",
    "documents_v3",
    "question_sets_v3",
    "questions_v3",
    "quiz_attempts_v3",
    "question_responses_v3",
    "onboarding_states_v3"
)

# Export each collection
foreach ($collection in $collections) {
    Write-Host "Backing up $collection..."
    mongoexport --uri="$env:DATABASE_URL" --collection=$collection --out="$backupDir\$collection.json"
}

# Create backup manifest
$manifest = @{
    timestamp = (Get-Date).ToString("o")
    collections = $collections
    branch = "feature/prisma-recovery-20250213-0748"
    commit = (git rev-parse HEAD)
    backupPath = $backupDir
}

$manifest | ConvertTo-Json | Set-Content "$backupDir\BACKUP_MANIFEST.json"

Write-Host "Backup completed at $backupDir"
