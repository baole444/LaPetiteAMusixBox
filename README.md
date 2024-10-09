# LePetiteAMusixBox
 A music (box) player built using React Native/Expo.

## Feature:
Queue music, allow queue up multiple track to play.
Loop track and skip track.
Playback is possible in background, allow you to listen to your favourite song while attending to other business.

## Server:
This repo come with a `node.js` base server located in `Server` folder. To start the server, run `node server.js`
Some server database/port connection property can be find in `/config/connection.yml`

### connection.yml default:
```yaml
mysql:
  host: 'localhost'
  user: 'LPAMB'
  password: 'LpamBroot'
  database: 'lpamb_track_data'
  connectionLimit: 100,
  maxIdle: 50,
  waitForConnections: true,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  idleTimeout: 120000,
  port: 3306
server:
  port: 25565
  storage: 'storage'
  track: 'music'
  certificate: 'cer'
  config: 'config'
```
#### Setup database:
Here is a quick mysql file yo setup the tables use by database (You still need to add data yourself):

```sql
use lpamb_track_data;

CREATE TABLE artist (
    artist_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    info TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE album (
    album_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    name VARCHAR(100) NOT NULL,
    release_date DATE,  -- Optional release date
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE music (
    track_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    title VARCHAR(100) NOT NULL,
    artist_id CHAR(36),
    album_id CHAR(36),
    genre VARCHAR(50),
    file_path VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (artist_id) REFERENCES artist(artist_id) ON DELETE CASCADE,
    FOREIGN KEY (album_id) REFERENCES album(album_id) ON DELETE CASCADE
);

CREATE TABLE users (
    user_id CHAR(36) PRIMARY KEY DEFAULT (UUID()),
    email VARCHAR(255) UNIQUE NOT NULL,
    username VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Connecting to the server:
By default server run on `https` at `https://localhost:25565`, however this will cause failure unless you have a certificate from trusted source. To deploy your own LPAMB Server, you can use [Ngrok service](https://ngrok.com/) with [Agent](https://ngrok.com/docs/agent/).

To start tunneling for LPAMB Server, you can run following:
```bash
ngrok http https://localhost:25565
```

Server IP is store in a single length async storage key, the test app provided a screen call `devIp.js` for you to try this out.

> [!NOTE]
> #### Valid ip look like:
>     `http://YourServerIp.xyz:whateverportifnot80`
>     `https://YourServerIp.xyz:whateverportifnot80`
>     `YourServerIp.xyz:whateverportifnot80`
>     `https://YourServerIp.xyz:whateverportifnot80/route/moreroute/routInfinitum`
> #### Invalid ip look like:
>    `https://YourServerIp.xyz:whateverportifnot80/route/moreroute/routInfinitum/`
>    
>    The reason the above is invalid because axios call in the app start with `/` by default, if you wish to change this behaviour consider trimming for user or change axios route.

## Known issues:
- A song without looping in background on empty queue may cause queue not next song not start due to remaining sound object.
- Notification based player doesn't show up.
- Marquee implement for Track title is not functioning (Likely due to library no longer supporting it).