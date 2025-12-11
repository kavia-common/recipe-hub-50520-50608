#!/bin/bash
cd /home/kavia/workspace/code-generation/recipe-hub-50520-50608/recipe_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

