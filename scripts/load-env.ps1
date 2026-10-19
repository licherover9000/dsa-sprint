$ErrorActionPreference = 'Stop'

$projectRoot = Split-Path -Parent $PSScriptRoot
$envPath = Join-Path $projectRoot '.env'
if (-not (Test-Path -LiteralPath $envPath)) {
    throw 'No .env file found. Run .\scripts\setup.ps1 from the project folder first.'
}

foreach ($line in Get-Content -LiteralPath $envPath) {
    if ([string]::IsNullOrWhiteSpace($line) -or $line.TrimStart().StartsWith('#')) { continue }
    $parts = $line -split '=', 2
    if ($parts.Count -eq 2) {
        [Environment]::SetEnvironmentVariable($parts[0].Trim(), $parts[1], 'Process')
    }
}

Write-Host 'Loaded local .env values into this PowerShell window.' -ForegroundColor Green
