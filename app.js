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
        //console.log(str);
        //res.write(JSON.stringify(row)+'\n');
        res.write(str);
    })

    .on('end', () => {
        res.status(200).send();
    })
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening To ${port}`))




