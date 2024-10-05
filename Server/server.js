const express = require('express');
const parser = require('body-parser');
const cors = require('cors');
const { spawn } = require('child_process');
const os = require('os');
const term = require('./interface');
const { DBconnect, cfg } = require('./connection');
const {
    listTable,
    postQueryMusicSearch,
    postQueryTitle,
    musicRsDump,
    searchMusic,
    internalPathLookUp,
} = require('./queryFunction');
const fs = require('fs');
const path = require('path');


const port = cfg.server.port;
const platform = os.platform();
let Instant; 
let dataBase;


function start(dataBase) {
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

    server.post('/search', async (req, rep) => {
        const { data } = req.body;
        console.log(`Request search for "${data}" recieved.`);
        
        try {
            const results = await postQueryMusicSearch(dataBase, data);
            rep.json(results);
        } catch (e) {
            rep.status(404).json({message:e});
        }
    })

    server.post('/api/response/title', async (req, rep) => {
        const { data } = req.body;
        console.log(`Request search for "${data}" recieved.`);
        
        try {
            const results = await postQueryTitle(dataBase, data);
            rep.json(results);
        } catch (e) {
            rep.status(404).json({message:e});
        }
    })

    server.get('/api/test/play', async (req, rep) => {
        const data = '64687e78-8002-11ef-b7b4-d8bbc1b40ca4';
        console.log(`Stream file with uuid ${data} recieved.`);
        let finalPath;

        try {
            // return the file path from the server's database
            const file_path = await internalPathLookUp(dataBase, data);
            
            // parsing path into full path
            finalPath = path.join(__dirname, cfg.server.storage, cfg.server.track, `${file_path}`);
            console.log(finalPath);
            // check file existence
            if (!fs.existsSync(finalPath)) {
                console.warn(`Warning: ${file_path}`);
                
                return rep.status(404).send('Server encountered an error');
            }

            rep.setHeader('Content-Type', 'audio/mpeg');

            const stream = fs.createReadStream(finalPath);

            stream.pipe(rep);

            stream.on('error', (er) => {
                console.error('Stream error: ', er);

                rep.status(500).send('Server encounting an error playing your music');
            });
        } catch (e) {
            console.error(e, ': ', finalPath);
            rep.status(404).send('Server encounting an error playing your music');
        }
    });

    const logToFile = (data) => {
        const logFilePath = path.join(__dirname, 'serverResponse.log'); // Specify the log file path
        fs.appendFile(logFilePath, `${new Date().toISOString()}: ${data}\n`, (err) => {
            if (err) {
                console.error('Error writing to log file:', err);
            }
        });
    };

    server.post('/api/response/play', async (req, rep) => {
        const { data } = req.body;
        console.log(`Stream file with uuid ${data} recieved.`);
        let finalPath;

        try {
            // return the file path from the server's database
            const file_path = await internalPathLookUp(dataBase, data);
            
            // parsing path into full path
            finalPath = path.join(__dirname, cfg.server.storage, cfg.server.track, `${file_path}`);
            // check file existence
            if (!fs.existsSync(finalPath)) {
                console.warn(`Warning: ${file_path}`);
                
                return rep.status(404).send('Server encountered an error');
            }

            rep.setHeader('Content-Type', 'audio/mpeg');

            const stream = fs.createReadStream(finalPath);
            
            // these log are only for testing, and will be remove soon
            //const logStream = fs.createWriteStream(path.join(__dirname, 'audioData.log'), { flags: 'a' })

            stream.pipe(rep);
            //stream.pipe(logStream);

            stream.on('error', (er) => {
                console.error('Stream error: ', er);

                rep.status(500).send('Server encounting an error playing your music');
            });
        } catch (e) {
            console.error(e, ': ', finalPath);
            rep.status(404).send('Server encounting an error playing your music');
        }
    });
    
    // server listening log
    Instant = server.listen(port, ()=> {
        console.log(`Server listening on port ${port}`);
        term.prompt();
    });
    

}

DBconnect((conn) => {
    dataBase = conn;
    start(dataBase);

    term.on('line', (input) => {
        const [cmd, ...args] = input.trim().toLowerCase().split(' ');
    
        switch (cmd) {
            case 'usedb':
                dbInterface(args, dataBase);
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

function dbInterface(args, dataBase) {
    const subCmd = args[0];
    switch (subCmd) {
        case 'list':
            console.log('Listing tables in DB...');
            listTable(dataBase);
            break;
        case 'music':
            if (args.length < 2) {
                console.log('Please provide a title, spacing in name is acceptable.');
            } else {
                let trackTitle = args.slice(1).join(' ');
                let modifier = null;
                
                if (trackTitle.includes('/')) {
                    const processArg = trackTitle.split(' ');
                    const modArg = processArg[processArg.length - 1];

                    if(modArg.startsWith('/'))  {
                        modifier = modArg;
                        trackTitle = processArg.slice(0, -1).join(' ');
                    }
                }

                console.log(`Searching for track contain "${trackTitle}" ...`);
                if (modifier === '/raw') {
                    console.log('Dumping raw information...');
                    musicRsDump(dataBase, trackTitle);
                } else {
                    searchMusic(dataBase, trackTitle);
                }
            }
            break;
            case 'help':
            case '?':
                console.log(`List of possible subcommand:\n    "help"/"?": Show this list.\n    "list": List tables in DB.\n    "music <name>": List track(s) that contain the keyword in their title.`);
                break;
        
            default:
            console.log(`Unknow subcommand: ${subCmd}.\nType "help" or "?" to show list of possible command, as well as their function`)
    }
}