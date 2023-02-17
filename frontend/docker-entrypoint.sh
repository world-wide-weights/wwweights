#! /bin/sh

# Script needed for frontend to be able to react to env var changes at runtime
# With our current frontend structure some env vars have to be set at build time
# To still allow for configuration of the docker image via env vars we set placeholders at runtime
# and replace them at startup (e.g in this very script)

# The first part wrapped in a function
makeSedCommands() {
  printenv | \
      grep  '^NEXT_PUBLIC' | \
      sed -r "s/=/ /g" | \
      xargs -n 2 sh -c 'echo "sed -i \"s#PLACEHOLDER_$0#$1#g\""'
}

# Set the delimiter to newlines (needed for looping over the function output)
IFS=$'\n'
# For each sed command
for c in $(makeSedCommands); do
  # For each file in the .next directory
  for f in $(find .next -type f); do
    # Execute the command against the file
    COMMAND="$c $f"
    eval $COMMAND
  done
done

echo "Starting Nextjs"
# Run any arguments passed to this script
exec "$@"