const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const app = express();

// app.get('/', (req, res) =>{
//     res.send('Hello World');
// });

app.use('/', express.static('static'));

const genres = fs.createReadStream("./lab3-data/genres.csv");
const albums = fs.createReadStream("./lab3-data/raw_albums.csv");
const artists = fs.createReadStream("./lab3-data/raw_artists.csv");
const tracks = fs.createReadStream("./lab3-data/raw_tracks.csv");
// app.get('/', (req, res) => {
//     res.send('hello')
// });

app.get('/api/genres', (req, res) => {
    genres
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




