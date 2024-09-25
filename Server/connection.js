const mysql = require('mysql2');
const yml = require('js-yaml');
const fs = require('fs');
const term = require('./interface');
//console.log('Term object in connection:', term);

// Load connection info
const cfg = yml.load(fs.readFileSync('./config/connection.yml', 'utf8'))

let conn;

function RootCred(callback) {
    term.question('Root username: ', (rootUser) => {
        term.question('Root password: ', (rootPassword) => {
            callback(rootUser, rootPassword);
        });
    });
}

function DBconnect(callback) {
    conn = mysql.createPool({
        host: cfg.mysql.host,
        user: cfg.mysql.user,
        password: cfg.mysql.password,
        database: cfg.mysql.database,
        port: cfg.mysql.port
    });
    
    // Establish connection to database
    conn.getConnection((e, connection) => {
        if (e && e.code === 'ER_ACCESS_DENIED_ERROR') {
            console.log('Database or user not found, Please sign in as root to preform database or user creation.');
            
            RootCred((rootUser, rootPassword) => {
                const AdConn = mysql.createConnection({
                    host: cfg.mysql.host,
                    user: rootUser,
                    password: rootPassword,
                    port: cfg.mysql.port
                });
    
                AdConn.connect((rootErr) => {
                    if (rootErr) {
                        console.error('Cannot connect as root: ', rootErr);
                        return;
                    }
    
                    console.log('Connected... Performing user and/or database creation...');
                    
                    // Loading data from config file
                    const dataBaseQ = `CREATE DATABASE IF NOT EXISTS ${cfg.mysql.database};`;
                    const userQuery = `CREATE USER IF NOT EXISTS '${cfg.mysql.user}'@'localhost' IDENTIFIED BY '${cfg.mysql.password}'`;
                    const grantQuery = `GRANT ALL PRIVILEGES ON ${cfg.mysql.database}.* TO '${cfg.mysql.user}'@'%'`;
                    const flushQ = `FLUSH PRIVILEGES`;
                    
    
                    AdConn.query(dataBaseQ, (eDB) => {
                        if (eDB) {
                            console.error('Failed to create database: ', eDB);
                        } else {
                            console.log('Database created or already exists.');
                            
                            AdConn.query(userQuery, (eU) => {
                                if (eU) {
                                    console.error('Failed to create user: ', eU);
                                } else {
                                    console.log('User created or already exists.');
                                    
                                    AdConn.query(grantQuery, (eG) => {
                                        if (eU) {
                                            console.error('Failed to grant permission: ', eG);
                                        } else {
                                            console.log('Permission granted.');
                                        
                                            AdConn.query(flushQ, (eF) => {
                                                if (eU) {
                                                    console.error('Failed to flush permission: ', eF);
                                                } else {
                                                    console.log('Permission flushed.');
                                                }  
                                                
                                                AdConn.end(() => {
                                                    console.log('Ending connection as root. Switching to user...');
                                                    callback(conn);
                                                
                                                });
                                            });
                                        }
                                    });
                                }
                            });
                        }
                    });
                });
            }); 

        } else if (e) {
            console.error('Error connecting: ', e);
        } else {
            console.log('Connected to Database.');
            connection.release();
            callback(conn);
        }
    });
}


module.exports = {
    cfg,
    DBconnect,
    getPool: () => conn
};