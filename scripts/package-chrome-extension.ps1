param(
  [string]$ExtensionDir = "chrome-extension",
  [string]$OutputDir = "dist",
  [switch]$SkipChecks
)

$ErrorActionPreference = "Stop"

$repoRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
$extensionPath = Resolve-Path (Join-Path $repoRoot $ExtensionDir)
$manifestPath = Join-Path $extensionPath "manifest.json"

if (-not (Test-Path -LiteralPath $manifestPath)) {
  throw "manifest.json was not found at $manifestPath"
}

if (-not $SkipChecks) {
  Push-Location $repoRoot
  try {
    node scripts/check-chrome-extension.mjs
  } finally {
    Pop-Location
  }
}

$manifest = Get-Content -Raw -LiteralPath $manifestPath | ConvertFrom-Json
$outputPath = Join-Path $repoRoot $OutputDir
New-Item -ItemType Directory -Force -Path $outputPath | Out-Null

$zipPath = Join-Path $outputPath ("iconsearch-chrome-{0}.zip" -f $manifest.version)
if (Test-Path -LiteralPath $zipPath) {
  Remove-Item -LiteralPath $zipPath -Force
}

$items = Get-ChildItem -LiteralPath $extensionPath -Force
Compress-Archive -LiteralPath $items.FullName -DestinationPath $zipPath -Force

Write-Host "Packaged Chrome extension $($manifest.version): $zipPath"
