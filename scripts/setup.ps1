$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot '.env'

if (Test-Path -LiteralPath $envPath) {
    Write-Host 'A .env file already exists. Leaving it unchanged.' -ForegroundColor Yellow
    exit 0
}

$random = [System.Security.Cryptography.RandomNumberGenerator]::Create()
try {
    $jwtBytes = New-Object byte[] 48
    $random.GetBytes($jwtBytes)
}
finally {
    $random.Dispose()
}

$jwtSecret = [Convert]::ToBase64String($jwtBytes)
$envLine = "JWT_SECRET=$jwtSecret"
Set-Content -LiteralPath $envPath -Value $envLine -Encoding ascii
Write-Host 'Created a private .env file with a random local JWT key.' -ForegroundColor Green
Write-Host 'Now start the app with: docker compose up --build'
