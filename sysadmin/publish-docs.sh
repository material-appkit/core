#!/bin/bash

SYSADMIN_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
ROOT_PATH=$SYSADMIN_PATH/..

SRC_PATH=$ROOT_PATH/documentation
BUILD_PATH=$SRC_PATH/public/
TARGET_PATH=$SYSADMIN_PATH/../docs/

# Generate the documentation build products
cd $SRC_PATH
gatsby build

# RSync the build products to their destination directory
rsync -avz --delete $BUILD_PATH $TARGET_PATH

# Clean up the build products
rm -rf $BUILD_PATH

# Commit all changes
cd $TARGET_PATH
git add --all
git commit -m "Updated documentation build products"
