#!/bin/bash
set -eu
${CLOSURE_DIR}/closure/bin/build/closurebuilder.py \
    --input=Bounce/app/start.js \
    -o compiled \
    -c ${DEPS_DIR}/compiler/compiler.jar \
    --output_file=${OUTPUT_DIR}/start_compressed.js \
    --root=Bounce/app \
    --root=${CLOSURE_DIR} \
    --root=Bounce/blockly-nodemcu
#    --compiler_flags="--compilation_level=WHITESPACE_ONLY" \
