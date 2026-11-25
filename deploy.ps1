# Lopix Site GitHub Pages Yayinlama Scripti
Write-Host "==========================================" -ForegroundColor Magenta
Write-Host "  LopiX Site - GitHub Pages Deploy        " -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Magenta

# Git kontrolu
if (-not (Get-Command git -ErrorAction SilentlyContinue)) {
    if (Test-Path "$env:LOCALAPPDATA\Programs\MinGit\cmd\git.exe") {
        $env:PATH = "$env:LOCALAPPDATA\Programs\MinGit\cmd;$env:PATH"
    }
}
$gitCmd = Get-Command git -ErrorAction SilentlyContinue

if (-not $gitCmd) {
    Write-Host "`n[UYARI] Git komutu sisteminizde bulunamadi." -ForegroundColor Yellow
    pause
    exit
}

Write-Host "`n[1/4] Git deposu kontrol ediliyor..." -ForegroundColor Green
if (-not (Test-Path ".git")) {
    git init
    git branch -M main
}

Write-Host "[2/4] Dosyalar ekleniyor ve commit ediliyor..." -ForegroundColor Green
git add .
git commit -m "feat: LopiX web sitesi ve projeleri yayinlandi"

Write-Host "[3/4] GitHub remote ayarlaniyor..." -ForegroundColor Green
$remotes = git remote
if ($remotes -notcontains "origin") {
    git remote add origin https://github.com/LopixSite/lopixsite.github.io.git
} else {
    git remote set-url origin https://github.com/LopixSite/lopixsite.github.io.git
}

Write-Host "[4/4] GitHub'a gonderiliyor (Push)..." -ForegroundColor Green
git push -u origin main --force

Write-Host "`n==========================================" -ForegroundColor Magenta
Write-Host " Tebrikler! LopiX Site basariyla yayinlandi!" -ForegroundColor Green
Write-Host " Sitenize https://lopixsite.github.io adresinden ulasabilirsiniz." -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Magenta
