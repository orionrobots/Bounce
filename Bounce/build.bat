@echo off
rem git clone https://github.com/google/closure-library - before trying this.
rem This will prepare/minimise start.js. Due to google apps csp -
rem the closure stuff wont work without it.

date /t
closure-library\closure\bin\build\closurebuilder.py ^
    --input=app\start.js ^
    -o compiled ^
    -c compiler-latest/compiler.jar ^
    --output_file=start_compressed.js ^
    --root=app ^
    --root=closure-library ^
    --root=blockly-nodemcu
date /t
