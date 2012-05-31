@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe" "%~dp0\jsx" %*
) ELSE (
  node  "%~dp0\jsx" %*
)
