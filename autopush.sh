#!/bin/bash
# Load environment variables from .env file
source .env

git add .

# Extract the changed files and their changes
CHANGES=$(git diff HEAD)

# Format the changes to send to GPT-4
FORMATTED_CHANGES=$(echo "$CHANGES" | sed -E ':a;N;1,$!ba;s/\n/; /g')
FORMATTED_CHANGES_JSON=$(echo "$CHANGES" | jq -R -s .)

# Request payload for OpenAI API
PAYLOAD=$(jq -n \
           --arg changes "$FORMATTED_CHANGES_JSON" \
           '{
              model: "gpt-4",
              messages: [
                {role: "system", content: "You are a helpful assistant tasked with generating GIT commit messages based on code changes. Rules you must follow: List the changes from the most important ones, Use the Imperative Mood, Keep It Short, Find good ontext and Motivation, Avoid Vague Messages, Use Bullet Points. Example commit message: Update newsletter text content:\n- Changed wording for clarity in course invite description\n- Modified date format for better readability"},
                {role: "user", content: "These are the changes in my code: \($changes). Please prepare a short and technical commit message that could be added to git repository."}
              ],
              temperature: 1,
              max_tokens: 2000,
              top_p: 1,
              frequency_penalty: 0,
              presence_penalty: 0
            }')


# Reading the API key from an environment variable
API_KEY=$OPENAI_API_KEY

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
