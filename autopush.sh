#!/bin/bash
git add .

# Extract the changed files and their changes
CHANGES=$(git diff --name-status HEAD)

# Format the changes to send to GPT-4
FORMATTED_CHANGES=$(echo "$CHANGES" | sed ':a;N;$!ba;s/\n/; /g')

# Request payload for OpenAI API
read -r -d '' PAYLOAD << EOM
{
  "model": "gpt-4",
  "messages": [
    {"role": "system", "content": "You are a helpful assistant tasked with generating commit messages based on code changes."},
    {"role": "user", "content": "These are the changes in my code: $FORMATTED_CHANGES. Can you prepare a commit message for me?"}
  ]
}
EOM

# Reading the API key from an environment variable
API_KEY=$YOUR_OPENAI_API_KEY

# Send the request to OpenAI's API and get the commit message suggestion
RESPONSE=$(curl -s -X POST \
  -H "Authorization: Bearer $API_KEY" \
  -H "Content-Type: application/json" \
  -d "$PAYLOAD" \
  https://api.openai.com/v1/chat/completions)

# Extract the assistant's reply from the API response using jq
COMMIT_MSG=$(echo "$RESPONSE" | jq -r '.choices[0].message.content')

# Commit with the suggested commit message
git commit -m "$COMMIT_MSG"
git push origin master
