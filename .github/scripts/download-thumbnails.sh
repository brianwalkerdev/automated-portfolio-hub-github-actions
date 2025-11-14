#!/bin/bash

# Download thumbnails for repositories from their Open Graph images
# This script reads projects.json and downloads thumbnails

set -e

PROJECTS_FILE="${1:-projects.json}"
THUMBNAIL_DIR="${2:-assets/img}"

if [ ! -f "$PROJECTS_FILE" ]; then
  echo "Error: Projects file $PROJECTS_FILE not found"
  exit 1
fi

# Create thumbnail directory if it doesn't exist
mkdir -p "$THUMBNAIL_DIR"

echo "Downloading thumbnails from projects.json..."

# Read the projects and download thumbnails
jq -r '.[] | "\(.name)|\(.openGraphImageUrl)|\(.usesCustomOpenGraphImage)"' "$PROJECTS_FILE" | while IFS='|' read -r name imageUrl hasCustomImage; do
  THUMBNAIL_PATH="$THUMBNAIL_DIR/$name.png"
  
  # Skip if thumbnail already exists
  if [ -f "$THUMBNAIL_PATH" ]; then
    echo "Thumbnail already exists for $name, skipping..."
    continue
  fi
  
  # Try to download the Open Graph image if it exists and is custom
  if [ "$imageUrl" != "null" ] && [ "$hasCustomImage" = "true" ]; then
    echo "Downloading custom thumbnail for $name from $imageUrl"
    if curl -L -f -s -o "$THUMBNAIL_PATH" "$imageUrl"; then
      echo "Successfully downloaded thumbnail for $name"
    else
      echo "Failed to download thumbnail for $name, will use fallback"
      rm -f "$THUMBNAIL_PATH"
    fi
  else
    echo "No custom Open Graph image for $name, will use fallback"
  fi
done

echo "Thumbnail download complete!"
