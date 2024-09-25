const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const os = require('os');
const term = require('./interface');
const { DBconnect, getPool, cfg } = require('./connection');
//console.log('Term object in server:', term);
const port = 25565;
const platform = os.platform();
// tracking instants of server
let Instant; 
let dataBase;
function start() {
    // server init
    const server = express();
    server.use(cors());
    server.use(parser.json());

    console.log(`Running on ${platform}`);
    
    // server get request
    server.get('/', (request, respond) => {
        respond.send('Test server for LPAMB project 2.');
        console.log('Request recived.');
        term.prompt();
    });
    // server post request
    server.post('/test', (request, respond) => {
        const { data } = request.body;
        respond.json({ received: data });
        term.prompt();
    });
    
    // server listening log
    Instant = server.listen(port, ()=> {
        console.log(`Server listening on port ${port}`);
        term.prompt();
    });
    

}

DBconnect((conn) => {
    dataBase = conn;
    start();
})

// Server console command function


// Allow restart server to apply change in logic or code
function restart() {
    let script = '';

    if (platform === 'win32') {
        script = 'restart.bat';
    } else {
        script = 'restart.sh';
    }
    console.log('Executing restart script...');

    Instant.close(() => {
        const newInst = spawn(script, {
            detached: true,
            shell: true,
            stdio: 'ignore'
        });
        
        newInst.unref();

        console.log('New server process started with PID:', newInst.pid);
    
        process.exit(0);
    });
}

term.on('line', (input) => {
    const [cmd, ...args] = input.trim().toLowerCase().split(' ');

    switch (cmd) {
        case 'usedb':
            dbInterface(args);
            break;
        case 'stop':
            console.log('Stopping server....');
            Instant.close(() => {
                console.log('Server stopped.');
                process.exit(0);
            });
            break;
        case 'restart':
            console.log('Stopping server....');
            restart();
            break;
        case 'help':
        case '?':
            console.log(`List of possible command:\n    "help"/"?": Show this list.\n    "stop": Stop the server.\n    "restart": End current server and restart it.\n    "usedb": Switch to database interface.\n`);
            break;
        default:
            console.log(`Unknow command: ${cmd}.\nType "help" or "?" to show list of possible command, as well as their function`);
            break;
            
    };

    term.prompt();
});

term.on('close', () => {
    console.log('Exiting server...\nHanded back console for OS.');
    Instant.close(() => {
        process.exit(0);
    })
});

function dbInterface(args) {
    const subCmd = args[0];
    switch (subCmd) {
        case 'list':
            console.log('Listing tables in DB...');
            listTable();
            break
        default:
            console.log(`Unknow subcommand: ${subCmd}.\nType "help" or "?" to show list of possible command, as well as their function`)
    }
}

function listTable() {
    term.prompt();
    const query = 'SHOW TABLES;';
    dataBase.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            return;
        }
        if (results.length > 0) {
            console.log('Tables in the database:');
            results.forEach((row) => {
                console.log(row[`Tables_in_${cfg.mysql.database}`]); // Adjust based on your database name
            });
        } else {
            console.log(`No tables found in the database ${cfg.mysql.database}`);
        }
    });
    term.prompt();
}