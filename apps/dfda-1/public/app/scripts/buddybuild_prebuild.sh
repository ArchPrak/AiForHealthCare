#!/usr/bin/env bash

echo "=== buddybuild_prebuild.sh ==="

#echo "ENVIRONMENTAL VARIABLES"
#printenv | more

echo "Current folder is $PWD"
#echo "Folder contents are:"
#ls

echo "CUREDAO_CLIENT_ID is ${CUREDAO_CLIENT_ID}"

echo "If you have trouble with the Google and InAppBrowser plugins, make sure you use XCode version < 7.3.1"

npm install -g gulp bower
