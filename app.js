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
artistsRoute.use(express.json());
albumsRoute.use(express.json());
tracksRoute.use(express.json());

genresRoute.route('/')
    .get((req, res) => {
    res.send(genresArr);
    })
    .post((req, res) => {
        const newID = req.body;
        newID.genre_id = genresArr.length+1;
        if(!(newID['#tracks'] && newID.parent && newID.title && newID.top_level)) 
            res.status(404).send('please make sure all parts of the genre are present in your request');
        else {
            genresArr[parseInt(newID.genre_id)] = newID;
            res.send(newID);
        }
    });

genresRoute.route('/:genre_id')
    .get((req, res) => {
        const id = genresArr.find(g => parseInt(g.genre_id) === parseInt(req.params.genre_id));
        if(id) res.send(id);
        else res.status(404).send(`Genre ID ${req.params.genre_id} was not found`);
    })
    .put((req, res) => {
        const newID = req.body;
        newID.genre_id = parseInt(req.params.genre_id);
        const indexID = genresArr.findIndex(g => parseInt(g.genre_id) === parseInt(newID.genre_id));
        if(indexID < 0) genresArr.push(newID);
        else genresArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const newID = req.body;
        const indexID = genresArr.findIndex(g => parseInt(g.genre_id) === parseInt(req.params.genre_id));
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
        const indexID = genresArr.findIndex(g => parseInt(g.genre_id) === parseInt(req.params.genre_id));
        if(indexID < 0) res.status(404).send(`Genre ID ${req.params.genre_id} does not exist`);
        else {
            res.send(`Removed Genre ID ${req.params.genre_id}`);
            genresArr.splice(indexID, 1);
        }
    });


artistsRoute.route('/')
    .get((req, res) => {
    res.send(artistsArr);
    })
    .post((req, res) => {
        const newID = req.body;
        newID.artist_id = artistsArr.length+1;
        if(!(newID.artist_name && newID.artist_handle && newID.tags && newID.artist_url 
            && newID.artist_favorites && newID.artist_comments  && newID.artist_date_created)) 
            res.status(404).send('please make sure all parts of the artist are present in your request');
        else {
            artistsArr[parseInt(newID.artist_id)] = newID;
            res.send(newID);
        }
    });

artistsRoute.route('/:artist_id')
    .get((req, res) => {
        const id = artistsArr.find(r => parseInt(r.artist_id) === parseInt(req.params.artist_id));
        if(id) res.send(id);
        else res.status(404).send(`Artist ID ${req.params.artist_id} was not found`);
    })
    .put((req, res) => {
        const newID = req.body;
        newID.artist_id = parseInt(req.params.artist_id);
        const indexID = artistsArr.findIndex(r => parseInt(r.artist_id) === parseInt(newID.artist_id));
        if(indexID < 0) artistsArr.push(newID);
        else artistsArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const newID = req.body;
        const indexID = artistsArr.findIndex(r => parseInt(r.artist_id) === parseInt(req.params.artist_id));
        if(indexID < 0) res.status(404).send(`Artist ID ${req.params.artist_id} was not found`);
        else {
            if(newID.artist_name) artistsArr[indexID].artist_name += (' ' + newID.artist_name);
            if(newID.artist_handle) artistsArr[indexID].artist_handle += (' ' + newID.artist_handle);
            if(newID.tags) artistsArr[indexID].tags += (' ' + newID.tags);
            if(newID.artist_url) artistsArr[indexID].artist_url += (' ' + newID.artist_url);
            if(newID.artist_favorites) artistsArr[indexID].artist_favorites = parseInt(artistsArr[indexID].artist_favorites) + parseInt(newID.artist_favorites);
            if(newID.artist_comments) artistsArr[indexID].artist_comments = parseInt(artistsArr[indexID].artist_comments) + parseInt(newID.artist_comments);
            if(newID.artist_date_created) artistsArr[indexID].artist_date_created += (' ' + newID.artist_date_created);
            res.send(newID);
        }
    })
    .delete((req, res) => {
        const indexID = artistsArr.findIndex(r => parseInt(r.artist_id) === parseInt(req.params.artist_id));
        if(indexID < 0) res.status(404).send(`Artist ID ${req.params.artist_id} does not exist`);
        else {
            res.send(`Removed Artist ID ${req.params.artist_id}`);
            artistsArr.splice(indexID, 1);
        }
    });


//     const s1_genresArr = new Array(); 
// genresRoute.route('/s1').get((req, res) => {
//     for(g of genresArr)
//         s1_genresArr.push({Genre_Names:g.title, Genre:g.genre_id, Parent:g.parent});
//     res.send(JSON.stringify(s1_genresArr));
// });

// artistsRoute.get('/s2/:artist_id', (req, res) => {
//     const id = artistsArr.find(r => parseInt(r['artist_id']) === parseInt(req.params.artist_id));
//     if(id) res.send(JSON.stringify({artist_id:id.artist_id, artist_name:id.artist_name, artist_handle:id.artist_handle, tags:id.tags, artist_url:id.artist_url, artist_favorites:id.artist_favorites}));
//     else res.status(404).send(`Artist ID ${req.params.artist_id} was not found`);
// });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening To ${port}`))




