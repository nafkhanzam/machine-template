# Machine Template

## Installation

This repository can be used in two ways.

### \#1. Using this repository as a template

1. Create a new repository using this as the template.
2. Add files to `./root` directory as your own `/` machine root directory using `./add` command-line interface.
3. Run `./install` to apply this repository to your `/` machine.

### \#2. Install the deno scripts

1. Run `deno install -A -n mt-add scripts/add.ts`.
2. Run `deno install -A -n mt-install scripts/install.ts`.
3. Run `mt-add` to add your files from `/` root directory to your machine repository.
4. Run `mt-install` to apply this repository to your `/` machine.
