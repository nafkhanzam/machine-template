# Machine Template

## Installation

This repository can be used in two ways.

### \#1. Using this repository as a template

1. Create a new repository using this as the template.
2. Add files to `./root` directory as your own `/` machine root directory using `./add` command-line interface.
3. Run `./install` to apply this repository to your `/` machine.

### \#2. Install the deno scripts (without cloning this repository)

1. Run `deno install -A -n mt-add https://raw.githubusercontent.com/nafkhanzam/machine-template/main/scripts/add.ts`
2. Run `deno install -A -n mt-install https://raw.githubusercontent.com/nafkhanzam/machine-template/main/scripts/install.ts`
3. Run `mt-add` to add your files from `/` root directory to your machine repository.
4. Run `mt-install` to apply this repository to your `/` machine.

## Custom

Environment variable `ROOT` (default: `root`) will be used as the symbolic links in your machine are targetting to relatively to your current working directory.
