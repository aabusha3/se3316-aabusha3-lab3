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
const artistsArr = new Array();
fs.createReadStream("./lab3-data/raw_artists.csv").pipe(csv()).on('data', (data) => artistsArr.push(data));
const albumsArr = new Array();
fs.createReadStream("./lab3-data/raw_albums.csv").pipe(csv()).on('data', (data) => albumsArr.push(data));
const tracksArr = new Array();
fs.createReadStream("./lab3-data/raw_tracks.csv").pipe(csv()).on('data', (data) => tracksArr.push(data));


app.use('/', express.static('static'));
app.use('/api/genres', genresRoute);
app.use('/api/artists', artistsRoute);
app.use('/api/albums', albumsRoute);
app.use('/api/tracks', tracksRoute);

genresRoute.use(express.json());

genresRoute.route('/')
    .get((req, res) => {
    res.send(genresArr);
    })
    .post((req, res) => {
        const newID = req.body;
        newID.genre_id = genresArr.length;
        if(!(newID['#tracks'] && newID.parent && newID.title && newID.top_level)) res.status(404).send('please make sure all parts of the genre are present in your request');
        else {
            genresArr[parseInt(newID.genre_id)] = newID;
            res.send(newID);
        }
    });

genresRoute.route('/:genre_id')
    .get((req, res) => {
        const id = genresArr.find(g => parseInt(g['genre_id']) === parseInt(req.params.genre_id));
        if(id) res.send(id);
        else res.status(404).send(`Genre ID ${req.params.genre_id} was not found`);
    })
    .put((req, res) => {
        const newID = req.body;
        newID.genre_id = parseInt(req.params.genre_id);
        const indexID = genresArr.findIndex(g => parseInt(g['genre_id']) === parseInt(newID.genre_id));
        if(indexID < 0) genresArr.push(newID);
        else genresArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const newID = req.body;
        const indexID = genresArr.findIndex(g => parseInt(g['genre_id']) === parseInt(req.params.genre_id));
        if(indexID < 0) res.status(404).send(`Genre ID ${req.params.genre_id} was not found`);
        else {
            if(newID['#tracks']) genresArr[indexID]['#tracks'] = parseInt(genresArr[indexID]['#tracks']) + parseInt(newID['#tracks']);
            if(newID.parent) genresArr[indexID].parent = parseInt(genresArr[indexID].parent) + parseInt(newID.parent);
            if(newID.title) genresArr[indexID].title += (' ' + newID.title);
            if(newID.top_level) genresArr[indexID].top_level = parseInt(genresArr[indexID].top_level) + parseInt(newID.top_level);
            res.send(newID);
        }
    })
    .delete((req, res) => {
        const indexID = genresArr.findIndex(g => parseInt(g['genre_id']) === parseInt(req.params.genre_id));
        if(indexID < 0) res.status(404).send(`${req.params.genre_id} does not exist`);
        else {
            res.send(`Removed ${indsexID+1}`);
            genresArr.splice(indexID, 1);
        }
    });



genresRoute.get('/s1', (req, res) => {
    const s1_genresArr = new Array(); 
    for(g of genresArr)
        s1_genresArr.push({Genre_Names:g['title'], Genre_ID:g['genre_id'], Parent_ID:g['parent']});
    res.send(s1_genresArr);
});

artistsRoute.get('/s2/:artist_id', (req, res) => {
    const id = artistsArr.find(r => parseInt(r['artist_id']) === parseInt(req.params.artist_id));
    if(id) res.send(JSON.stringify({artist_id:id.artist_id, artist_name:id.artist_name, artist_handle:id.artist_handle, tags:id.tags, artist_url:id.artist_url, artist_favorites:id.artist_favorites}));
    else res.status(404).send(`Artist ID ${req.params.artist_id} was not found`);
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening To ${port}`))




