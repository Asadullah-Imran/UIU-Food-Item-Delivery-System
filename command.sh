#!/bin/bash

# Check if both arguments are provided
if [ -z "$1" ] || [ -z "$2" ]; then
  echo "Error: Missing arguments."
  echo "Usage: ./push.sh \"<commit_message>\" <branch_name>"
  exit 1
fi

COMMIT_MSG="$1"
BRANCH_NAME="$2"

git add .
git commit -m "$COMMIT_MSG"
git push origin "$BRANCH_NAME"