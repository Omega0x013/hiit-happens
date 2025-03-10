@REM Init the templates dir, we have to get it to install "something".
faas-cli template store pull node20

del .\template\node23\* /q
xcopy .\local_templates\node23\ .\template\node23\ /y
xcopy .\local_templates\node23\function\* .\template\node23\function /y