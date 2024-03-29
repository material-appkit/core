#!/bin/bash

SCRIPTS_PATH="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
PROJECT_PATH=$SCRIPTS_PATH/..
BUILD_PATH=$PROJECT_PATH/build

# Transpile the source to ES5
cd $PROJECT_PATH
yarn build

# Insert the package.json containing necessary package info
cp $PROJECT_PATH/package.deployment.json $BUILD_PATH/package.json

# Publish the package to NPM
cd $BUILD_PATH
yarn publish

# Clean up the build products
rm -rf $BUILD_PATH
