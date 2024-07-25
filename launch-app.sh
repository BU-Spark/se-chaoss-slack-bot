#!/bin/bash

ln -s /global_node_modules/node_modules /app/node_modules
if [ "$1" == "DEBUG" ]
then
    /usr/bin/node --inspect=0.0.0.0:9229 app.js
else
    /usr/bin/node app.js
fi
