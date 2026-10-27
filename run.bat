@echo off
setlocal
title Nguyen Minh Quan VoiceCraft Studio - AI Text-to-Speech

echo =====================================================================
echo           NGUYEN MINH QUAN VOICECRAFT STUDIO - TTS AI
echo =====================================================================
echo.

pushd "%~dp0"

set "PYTHON_EXE="

:: 1. Check if .venv already exists
if exist ".venv\Scripts\python.exe" (
    set "PYTHON_EXE=.venv\Scripts\python.exe"
    echo [+] Da tim thay moi truong ao .venv san co.
    goto :CHECK_DEPS
)

:: 2. Find Python to create .venv
echo [*] Dang kiem tra Python tren he thong...
set "SYS_PYTHON="

py -3 -m venv --help >nul 2>&1
if %errorlevel% equ 0 (
    set "SYS_PYTHON=py -3"
    goto :CREATE_VENV
)

py -m venv --help >nul 2>&1
if %errorlevel% equ 0 (
    set "SYS_PYTHON=py"
    goto :CREATE_VENV
)

python -m venv --help >nul 2>&1
if %errorlevel% equ 0 (
    set "SYS_PYTHON=python"
    goto :CREATE_VENV
)

echo.
echo [X] LOI: Khong tim thay Python tren may tinh!
echo     Vui long cai dat Python 3.9 tro len tu: https://www.python.org/
echo     Luu y: Nho tich vao o "Add python.exe to PATH" khi cai dat.
echo.
pause
popd
exit /b 1

:CREATE_VENV
echo [+] Tim thay Python: %SYS_PYTHON%
echo [+] Dang khoi tao moi truong ao .venv...
%SYS_PYTHON% -m venv .venv
if %errorlevel% neq 0 (
    echo [X] LOI: Khong the tao moi truong ao .venv!
    pause
    popd
    exit /b 1
)
set "PYTHON_EXE=.venv\Scripts\python.exe"
echo [+] Khoi tao .venv thanh cong.

:CHECK_DEPS
echo.
echo [*] Kiem tra cac thu vien can thiet...
"%PYTHON_EXE%" -c "import fastapi, uvicorn, edge_tts" >nul 2>&1
if %errorlevel% neq 0 (
    echo [+] Dang cai dat thu vien tu requirements.txt...
    "%PYTHON_EXE%" -m pip install --upgrade pip --quiet
    "%PYTHON_EXE%" -m pip install -r requirements.txt
    if %errorlevel% neq 0 (
        echo [X] LOI: Cai dat thu vien that bai. Vui long kiem tra ket noi Internet!
        pause
        popd
        exit /b 1
    )
    echo [+] Cai dat thu vien hoan tat.
) else (
    echo [+] Cac thu vien da san sang.
)

:START_SERVER
echo.
echo [*] Dang kiem tra may chu...
powershell -NoProfile -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/health' -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -eq 200) { exit 42 } } catch {}"
if %errorlevel% equ 42 (
    echo [+] May chu da dang chay tai http://127.0.0.1:8000
    start http://127.0.0.1:8000
    goto :WAIT_USER
)

echo [+] Dang khoi dong may chu backend tren cong 8000...
powershell -NoProfile -Command "Start-Process -FilePath '.venv\Scripts\python.exe' -ArgumentList '-m uvicorn backend.main:app --host 127.0.0.1 --port 8000' -WindowStyle Hidden"

echo [+] Dang cho may chu san sang...
powershell -NoProfile -Command "$ready = $false; for ($i=0; $i -lt 30; $i++) { try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1:8000/api/health' -UseBasicParsing -TimeoutSec 1; if ($r.StatusCode -eq 200) { $ready = $true; break } } catch { Start-Sleep -Milliseconds 500 } }; if (-not $ready) { exit 1 }"
if %errorlevel% neq 0 (
    echo.
    echo [X] LOI: May chu khoi dong khong thanh cong.
    pause
    popd
    exit /b 1
)

echo.
echo =====================================================================
echo  [SUCCESS] Nguyen Minh Quan VoiceCraft Studio da san sang!
echo  Dia chi: http://127.0.0.1:8000
echo =====================================================================
echo.
echo [*] Dang mo trinh duyet...
start http://127.0.0.1:8000

:WAIT_USER
echo.
echo ---------------------------------------------------------------------
echo  Giao dien web da mo tren trinh duyet cua ban.
echo  De DUNG may chu va thoat, hay nhan phim bat ky hoac dong cua so nay...
echo ---------------------------------------------------------------------
echo.
pause >nul

echo [+] Dang tat may chu...
powershell -NoProfile -Command "Get-Process -Name 'python' -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*uvicorn*backend.main*' } | Stop-Process -Force"
echo [+] Da dung Nguyen Minh Quan VoiceCraft Studio. Tam biet!
ping 127.0.0.1 -n 3 >nul 2>&1
popd
exit /b 0