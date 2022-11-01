const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const app = express();
const genresRoute = express.Router();
const artistsRoute = express.Router();
const albumsRoute = express.Router();
const tracksRoute = express.Router();

const genresArr = new Array();
fs.createReadStream("./lab3-data/genres.csv").pipe(csv()).on('data', (data) => genresArr.push(data));
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
   res.send(genresArr);
});


genresRoute.get('/s1', (req, res) => {
    const s1_genresArr = new Array(); 
    for(g of genresArr)
        s1_genresArr.push({Genre_Names:g['title'], Genre_ID:g['genre_id'], Parent_ID:g['parent']});
    res.send(s1_genresArr);
});


genresRoute.get('/:genre_id', (req, res) => {
    const id = genresArr.find(i => parseInt(i['genre_id']) === parseInt(req.params.genre_id));
    if(id) res.send(id);
    else res.status(404).send(`Genre ID ${req.params.genre_id} was not found`);
});

// genresRoute.put('/:genre_id', (req, res) => {

// });


// artistsRoute.get('/s2/:artist_id', (req, res) => {
//     console.log('hi1')
//     artistsFile
//     .on('error', (err) => {
//         console.log(err);
//     })

//     .pipe(csv())
//     .on('data', (row) => {
//         console.log('hi2')
//         if(parseInt(row["artist_id"]) === parseInt(req.params.artist_id)){
//             console.log('found it')
//             let str = `Artist ID: ${row["artist_id"]} Date Created: ${row["artist_date_created"]} Handle: ${row["artist_handle"]} Name: ${row["artist_name"]} Tags: ${row["tags"]} Favorites: ${row["artist_favorites"]}.\n`;
//             res.send(JSON.stringify(str));
//         }        
//     })

//     .on('end', () => {
//         console.log('hi9')
//         return res.end();
//     })
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening To ${port}`))




