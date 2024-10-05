const term = require('./interface');
const { cfg } = require('./connection');


function listTable(dataBase) {
    const query = 'SHOW TABLES;';
    dataBase.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            term.prompt();
            return;
        }
        if (results.length > 0) {
            console.log('Tables in the database:');
            results.forEach((row) => {
                console.log('-> ', row[`Tables_in_${cfg.mysql.database}`]);
            });
            term.prompt();
        } else {
            console.log(`No tables found in the database ${cfg.mysql.database}`);
            term.prompt();
        }
    });
    term.prompt();
};

async function postQueryMusicSearch(dataBase, title) {
    const query = `select * from music where title like '%${title}%'`;

    return new Promise((resolve, reject) => {
        dataBase.query(query, async (error, results) => {
            if (error) {
                console.error('Error executing query: ', error);
                reject('Server encounter an error.\n Please try again later');
                return;
            }
            if (results.length > 0) {
                const response = [];

                for (const row of results) {
                    const artistName = await getArtistTitle(dataBase, row.artist_id);
                    const albumName = await getAlbumTitle(dataBase, row.album_id);
                    
                    response.push({
                        trackId: row.track_id,
                        artistId: row.artist_id,
                        albumId: row.album_id,
                        title: row.title,
                        artist: artistName,
                        album: albumName,
                        genre: row.genre,
                        create_at: new Date(row.created_at).toLocaleString(),
                    });
                }

                resolve(response);
            } else {
                resolve(`There were no result for "${title}".`);
            }
        });
    });
}

async function postQueryTitle(dataBase, id) {
    const query = `select title from music where track_id = '${id}'`;

    return new Promise((resolve, reject) => {
        dataBase.query(query, async (error, results) => {
            if (error) {
                console.error('Error executing query: ', error);
                reject('Server encounter an error.\n Please try again later');
                return;
            }
            if (results && results.length > 0) {
                const title = results[0].title;

                resolve(title);
            } else {
                resolve(`There were no result for "${id}".`);
            }
        });
    });
}

async function internalPathLookUp(dataBase, track_id) {
    const query = `select file_path from music where track_id = '${track_id}';`;

    return new Promise((resolve, reject) => {
        dataBase.query(query, async (error, results) => {
            if (error) {
                console.error('Error executing query: ', error);
                reject('Server encounter an error.\n Please try again later');
                return;
            }
            if (results && results.length > 0) {
                const file_name = results[0].file_path;
                console.log(`Query for ${file_name} successfully.`)
                resolve(file_name);
            } else {
                resolve(`Query encounter error which was not catched\n    Error: ${error}\n    Track_id: ${track_id}\n    Result: ${results}`);
            }
        });
    });
}

function musicRsDump(dataBase, title) {
    term.prompt();
    const query = `select * from music where title like '%${title}%'`;
    dataBase.query(query, (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            return;
        }
        if (results.length > 0) {
            console.log(`List of track with name contain "${title}":`);
            console.log(results);
            term.prompt();
        } else {
            console.log(`No track with matching name "${title}" in LPAMB DB.`);
        }
    });
    term.prompt();
}

async function searchMusic(dataBase, title) {
    term.prompt();
    const query = `select * from music where title like '%${title}%'`;
    dataBase.query(query, async (error, results) => {
        if (error) {
            console.error('Error executing query: ', error);
            return;
        }
        if (results.length > 0) {
            console.log(`List of track with name contain "${title}":`);
            for (const row of results) {
                const artistName = await getArtistTitle(dataBase, row.artist_id);
                const albumName = await getAlbumTitle(dataBase, row.album_id);
                console.log(`Title: ${row.title}`);
                console.log(`Artist: ${artistName}`);
                console.log(`Album: ${albumName}`);
                console.log(`File Path: ${row.file_path}`);
                console.log(`Created At: ${new Date(row.created_at).toLocaleString()}`);
                console.log('<==============>');

            }
            term.prompt();
        } else {
            console.log(`No track with matching name "${title}" in LPAMB DB.`);
        }
    });
    term.prompt();
}

// Backend method, only use for extracting title from UUID
async function getArtistTitle(dataBase, artist_id) {
    const query = `select \`name\` from artist where artist_id = '${artist_id}'`;
    return new Promise((resolve, reject) => {
        dataBase.query(query, (error, results) => {
            if (error) {
                reject('Unknow artist');
                return;
            }
            if (results.length > 0) {
                resolve(results[0].name);
                return;
            } else {
                resolve('Unknow artist');
            }
        });
    });
}

async function getAlbumTitle(dataBase, album_id) {
    const query = `select \`name\` from album where album_id = '${album_id}'`;
    return new Promise((resolve, reject) => {
        dataBase.query(query, (error, results) => {
            if (error) {
                reject('Unknow album');
                return;
            }
            if (results.length > 0) {
                resolve(results[0].name);
                return;
            } else {
                resolve('Unknow album');
            }
        });
    });
}

module.exports = {
    listTable,
    postQueryMusicSearch,
    postQueryTitle,
    internalPathLookUp,
    musicRsDump,
    searchMusic,
    getArtistTitle,
    getAlbumTitle
};