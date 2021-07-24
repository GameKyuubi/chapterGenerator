#! /bin/bash

SCRIPT_DIR=$(cd $(dirname "${BASH_SOURCE[0]}") && pwd)
node $SCRIPT_DIR/generator.js $1 $SCRIPT_DIR/../logs/
