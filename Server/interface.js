const readline = require('readline');

const input = process.stdin;
const output = process.stdout;

const term = readline.createInterface({
    input: input,
    output: output
});

// Setting for console command prefix
term.setPrompt('LPAMB Server > ');

//console.log('Exporting term:', term);
module.exports = term;