#!/bin/bash
set -eu -o pipefail
export OUTPUT_DIR=output
export SRC_DIR=Bounce
export SRC_LIST=jquery* glyphic* Examples* bounce_window.html bounce.css bounce*.png background.js \
    blockly-nodemcu/blocks_compressed.js blockly-nodemcu/msg/messages.js CustomNodeBlocks.js

# TODO: Combine CSS.
export LIBRARY_SRC_LIST=\
    closure-library/closure/goog/css/common.css closure-library/closure/goog/css/menu.css \
    closure-library/closure/goog/css/menuitem.css closure-library/closure/goog/css/menuseparator.css \
    closure-library/closure/goog/css/toolbar.css

for file in ${SRC_LIST}; do
    cp ${SRC_DIR}/${file} ${OUTPUT_DIR}
done

for file in ${LIBRARY_SRC_LIST}; do
    cp ${file} ${OUTPUT_DIR}
done