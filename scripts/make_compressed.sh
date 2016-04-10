#!/bin/bash
set -e
closure-library/closure/bin/build/closurebuilder.py \
    --input=app\start.js \
    -o compiled \
    -c compiler/compiler.jar \
    --output_file=output/start_compressed.js \
    --root=Bounce/app \
    --root=closure-library \
    --root=Bounce/blockly-nodemcu
