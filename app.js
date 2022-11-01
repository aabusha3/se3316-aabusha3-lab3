const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const app = express();
const genresRoute = express.Router();
const artistsRoute = express.Router();
const albumsRoute = express.Router();
const tracksRoute = express.Router();

const genresFile = fs.createReadStream("./lab3-data/genres.csv");
const artistsFile = fs.createReadStream("./lab3-data/raw_artists.csv");
const albumsFile = fs.createReadStream("./lab3-data/raw_albums.csv");
const tracksFile = fs.createReadStream("./lab3-data/raw_tracks.csv");

app.use('/', express.static('static'));
app.use('/api/genres', genresRoute);
app.use('/api/artists', artistsRoute);
app.use('/api/albums', albumsRoute);
app.use('/api/tracks', tracksRoute);

genresRoute.use(express.json());


genresRoute.get('/', (req, res) => {
    genresFile
    .on('error', (err) => {
        console.log(err);
    })

    .pipe(csv())
    .on('data', (row) => {
        //console.log(row);
        let str = `Genre ID: ${row["genre_id"]} Track: ${row["#tracks"]} Parent: ${row["parent"]} Title: ${row["title"]} Top Level: ${row["top_level"]}.\n`;
        //console.log(row["genre_id"].toString());
        //res.write(JSON.stringify(row)+'\n');
        res.send('<p>'+str+'</p>');
    })

    .on('end', () => {
        res.status(200).send();
    })
});

genresRoute.get('/s1', (req, res) => {
    genresFile
    .on('error', (err) => {
        console.log(err);
    })

    .pipe(csv())
    .on('data', (row) => {
        let str = `Genre Names: ${row["title"]}   Genre ID: ${row["genre_id"]}   Parent ID: ${row["parent"]}.\n`;
        res.send(JSON.stringify(str));
    })

    .on('end', () => {
        res.status(200).send();
    })
});


genresRoute.get('/:genre_id', (req, res) => {
    console.log('hi1')
    genresFile
    .on('error', (err) => {
        console.log(err);
    })

    .pipe(csv())
    .on('data', (row) => {
        console.log('hi2')
        if(parseInt(row["genre_id"]) === parseInt(req.params.genre_id)){
            console.log('found it')
            res.send(JSON.stringify(row["genre_id"]));
        }
        //else {console.log(`${req.params.genre_id} not found: on ${row["genre_id"]}`)}
        
    })

    .on('end', () => {
        console.log('hi9')
        return res.end();
    })
});

// genresRoute.put('/:genre_id', (req, res) => {

// });


artistsRoute.get('/s2/:artist_id', (req, res) => {
    console.log('hi1')
    artistsFile
    .on('error', (err) => {
        console.log(err);
    })

    .pipe(csv())
    .on('data', (row) => {
        console.log('hi2')
        if(parseInt(row["artist_id"]) === parseInt(req.params.artist_id)){
            console.log('found it')
            let str = `Artist ID: ${row["artist_id"]} Date Created: ${row["artist_date_created"]} Handle: ${row["artist_handle"]} Name: ${row["artist_name"]} Tags: ${row["tags"]} Favorites: ${row["artist_favorites"]}.\n`;
            res.send(JSON.stringify(str));
        }        
    })

    .on('end', () => {
        console.log('hi9')
        return res.end();
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening To ${port}`))




