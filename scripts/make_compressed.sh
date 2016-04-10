#!/bin/bash
set -e
${CLOSURE_DIR}/closure/bin/build/closurebuilder.py \
    --input=app/start.js \
    -o compiled \
    -c compiler/compiler.jar \
    --output_file=${OUTPUT_DIR}/start_compressed.js \
    --root=Bounce/app \
    --root=${CLOSURE_DIR} \
    --root=Bounce/blockly-nodemcu
