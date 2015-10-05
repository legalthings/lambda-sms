# Lambda SMS

Send an SMS using a predefined template with Mustache.

## Installation

    npm install
    
## Setup

1. Rename `config.dist.json` to `config.json` and add your config to it
2. Create a dynamoDB database and a table and choose hash as the primary key type and name it `reference`
    
## Usage

    node_modules/.bin/node-lambda run
    
## Test

    npm test
    
## Deployment

    node_modules/.bin/node-lambda deploy