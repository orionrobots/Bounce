#!/bin/bash
# Windows - use gow - https://github.com/bmatzelle/gow/releases
# update_libs.sh - only needed if:
#   * You change the libraries in bounce_base.js
#   * You wish to update to another version of google closure.
#   * Changing the compile options

set -eu -o pipefail
set -x

function install_deps() {
    echo "Retrieving dependencies"
    echo ${DEPS_DIR}
    mkdir -p ${DEPS_DIR}
    pushd ${DEPS_DIR}
    if [ ! -d compiler ]; then
        wget -nc http://dl.google.com/closure-compiler/compiler-latest.zip && mkdir compiler && unzip compiler-latest.zip -d compiler
    fi
    if [ ! -d closure-library-20160315 ]; then
        wget -nc https://github.com/google/closure-library/archive/v20160315.tar.gz -O closure-library.tgz && tar -xzf closure-library.tgz
    fi
    popd
    echo "Dependencies prepared"
}

export DEPS_DIR=deps
export OUTPUT_DIR=Bounce
export LIB_BASE=lib/bounce_base.js
export CLOSURE_DIR=deps/closure-library-20160315
export CSS_OUTPUT=${OUTPUT_DIR}/goog_combined.css
export CSS_INPUT="\
    closure/goog/css/common.css closure/goog/css/menu.css \
    closure/goog/css/menuitem.css closure/goog/css/menuseparator.css \
    closure/goog/css/toolbar.css"

# Download and install 3rd party deps
install_deps

echo "Combining CSS..."
# Combine CSS from 3rd party stuff - put in output.
echo >${CSS_OUTPUT}
for file in ${CSS_INPUT}; do
    cat ${CLOSURE_DIR}/${file} >>${CSS_OUTPUT}
done

# TODO: Find CSS minifier later here.

echo "CSS Complete."
echo "Copying image files..."

# Copy any image files to media...
mkdir -p ${OUTPUT_DIR}/editor
cp ${CLOSURE_DIR}/closure/goog/images/toolbar-bg.png ${OUTPUT_DIR}/editor


echo "Building..."
# Compressed files go into Bounce folder
${CLOSURE_DIR}/closure/bin/build/closurebuilder.py \
    --input=${LIB_BASE} \
    -o compiled \
    -c ${DEPS_DIR}/compiler/compiler.jar \
    --output_file=${OUTPUT_DIR}/bounce_base_compressed.js \
    --root=${CLOSURE_DIR} \
    --root=Bounce/blockly-nodemcu \
    --root=lib

echo "Building output complete"
echo "Done."
