@echo off

if not exist input.lua (
	echo please add source into input.lua
	echo paste code here > input.lua
	timeout 5 > NUL
	exit
)

:question
echo (1) beautify (2) minify

set answer=
set /p answer=choose option: %=%

if /I %answer%==1 (
	node src/beautify.js
	echo beautified
) else if /I %answer%==2 (
	node src/minify.js
	echo minified
) else (
	echo invalid option, choose again
	goto :question
)

pause > NUL
