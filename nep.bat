@echo off

if NOT EXIST node_modules (
    npm i
)

node "C:\Program Files\NodeExtension\index.js" %1 %2
exit /b 0