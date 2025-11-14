#!/bin/bash

# Fetch pinned repositories from GitHub using GraphQL API
# This script requires GITHUB_TOKEN environment variable
#
# Usage: fetch-pinned-repos.sh <username> [output-file]
#   username: GitHub username to fetch pinned repos from (required)
#   output-file: Path to output JSON file (default: projects.json)

set -e

USERNAME="${1}"
OUTPUT_FILE="${2:-projects.json}"

if [ -z "$USERNAME" ]; then
  echo "Error: GitHub username is required as first argument"
  echo "Usage: $0 <username> [output-file]"
  exit 1
fi

if [ -z "$GITHUB_TOKEN" ]; then
  echo "Error: GITHUB_TOKEN environment variable is required"
  exit 1
fi

# GraphQL query to get pinned repositories with all needed information
read -r -d '' QUERY <<'EOF' || true
query {
  user(login: "USERNAME_PLACEHOLDER") {
    pinnedItems(first: 6, types: REPOSITORY) {
      nodes {
        ... on Repository {
          name
          description
          url
          updatedAt
          homepageUrl
          openGraphImageUrl
          usesCustomOpenGraphImage
        }
      }
    }
  }
}
EOF

# Replace username placeholder
QUERY="${QUERY//USERNAME_PLACEHOLDER/$USERNAME}"

echo "Fetching pinned repositories for $USERNAME..."

# Make the GraphQL request
RESPONSE=$(curl -s -H "Authorization: bearer $GITHUB_TOKEN" \
     -H "Content-Type: application/json" \
     -X POST \
     -d "$(jq -n --arg query "$QUERY" '{query: $query}')" \
     https://api.github.com/graphql)

# Check for errors
if echo "$RESPONSE" | jq -e '.errors' > /dev/null 2>&1; then
  echo "Error: GraphQL query failed"
  echo "$RESPONSE" | jq '.errors'
  exit 1
fi

# Check that .data.user exists (user not found or permission denied)
if ! echo "$RESPONSE" | jq -e '.data.user' > /dev/null 2>&1; then
  echo "Error: User not found or permission denied"
  exit 1
fi
# Extract pinned repos and transform to our format
echo "$RESPONSE" | jq '[.data.user.pinnedItems.nodes[] | {
  name: .name,
  description: (.description // "No description available"),
  updated: .updatedAt,
  url: .url,
  homepage: (.homepageUrl // ("/" + .name + "/")),
  thumbnail: ("assets/img/" + .name + ".png"),
  openGraphImageUrl: .openGraphImageUrl,
  usesCustomOpenGraphImage: .usesCustomOpenGraphImage
}] | sort_by(.updated) | reverse' > "$OUTPUT_FILE"

echo "Pinned repositories saved to $OUTPUT_FILE"
jq -r 'length | "Total repos: \(.)"' "$OUTPUT_FILE"
