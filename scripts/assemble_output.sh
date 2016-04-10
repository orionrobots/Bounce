#!/bin/bash
set -eu -o pipefail
set -x
export SRC_DIR=Bounce
export SRC_LIST="jquery* glyphic* bounce_window.html Examples.xml bounce.css bounce*.png background.js \
    blockly-nodemcu/blocks_compressed.js manifest.json blockly-nodemcu/msg/messages.js CustomNodeBlocks.js"

# TODO: Combine CSS.
export GOOG_CSS_LIST="\
    closure/goog/css/common.css closure/goog/css/menu.css \
    closure/goog/css/menuitem.css closure/goog/css/menuseparator.css \
    closure/goog/css/toolbar.css"

for file in ${SRC_LIST}; do
    cp ${SRC_DIR}/${file} ${OUTPUT_DIR}
done

mkdir -p ${OUTPUT_DIR}/css

cp ${SRC_DIR}/bounce.css ${OUTPUT_DIR}/css

cp -r ${SRC_DIR}/blockly-nodemcu ${OUTPUT_DIR}
cp -r ${SRC_DIR}/Examples ${OUTPUT_DIR}

for file in ${GOOG_CSS_LIST}; do
    cp ${CLOSURE_DIR}/${file} ${OUTPUT_DIR}/css
done

mkdir -p ${OUTPUT_DIR}/editor
cp ${CLOSURE_DIR}/closure/goog/images/toolbar-bg.png ${OUTPUT_DIR}/editor
