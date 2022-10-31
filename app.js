const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const app = express();
const genresRoute = express.Router();

// app.get('/', (req, res) =>{
//     res.send('Hello World');
// });

app.use('/', express.static('static'));

app.use('/api/genres', genresRoute)

const genresFile = fs.createReadStream("./lab3-data/genres.csv");
const albumsFile = fs.createReadStream("./lab3-data/raw_albums.csv");
const artistsFile = fs.createReadStream("./lab3-data/raw_artists.csv");
const tracksFile = fs.createReadStream("./lab3-data/raw_tracks.csv");

function getGenres(){}


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
        res.write(str);
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
            res.write(row["genre_id"]);
        }
        //else {console.log(`${req.params.genre_id} not found: on ${row["genre_id"]}`)}
        
    })

    .on('end', () => {
        console.log('hi9')
        return res.end();
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening To ${port}`))




