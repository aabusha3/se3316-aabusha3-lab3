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



albumsRoute.route('/')
    .get((req, res) => {
    res.send(albumsArr);
    })
    .post((req, res) => {
        const newID = req.body;
        newID.album_id = albumsArr.length+1;
        if(!(newID.album_title && newID.album_date_created && newID.album_favorites && newID.artist_name 
            && newID.artist_url && newID.artist_favorites  && newID.tags)) 
            res.status(404).send('please make sure all parts of the album are present in your request');
        else {
            albumsArr[parseInt(newID.album_id)] = newID;
            res.send(newID);
        }
    });

albumsRoute.route('/:album_id')
    .get((req, res) => {
        const id = albumsArr.find(l => parseInt(l.album_id) === parseInt(req.params.album_id));
        if(id) res.send(id);
        else res.status(404).send(`Album ID ${req.params.album_id} was not found`);
    })
    .put((req, res) => {
        const newID = req.body;
        newID.album_id = parseInt(req.params.album_id);
        const indexID = albumsArr.findIndex(l => parseInt(l.album_id) === parseInt(newID.album_id));
        if(indexID < 0) albumsArr.push(newID);
        else albumsArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const newID = req.body;
        const indexID = albumsArr.findIndex(l => parseInt(l.album_id) === parseInt(req.params.album_id));
        if(indexID < 0) res.status(404).send(`Album ID ${req.params.album_id} was not found`);
        else {
            if(newID.album_title) albumsArr[indexID].album_title += (' ' + newID.album_title);
            if(newID.album_date_created) albumsArr[indexID].album_date_created = newID.album_date_created;
            if(newID.album_favorites) albumsArr[indexID].album_favorites = parseInt(albumsArr[indexID].album_favorites) + parseInt(newID.album_favorites);
            if(newID.artist_name) albumsArr[indexID].artist_name += (' ' + newID.artist_name);
            if(newID.artist_url) albumsArr[indexID].artist_url += (' ' + newID.artist_url);
            if(newID.artist_favorites) albumsArr[indexID].artist_favorites = parseInt(albumsArr[indexID].artist_favorites) + parseInt(newID.artist_favorites);
            if(newID.tags) albumsArr[indexID].tags += (' ' + newID.tags);
            res.send(newID);
        }
    })
    .delete((req, res) => {
        const indexID = albumsArr.findIndex(l => parseInt(l.album_id) === parseInt(req.params.album_id));
        if(indexID < 0) res.status(404).send(`Album ID ${req.params.album_id} does not exist`);
        else {
            res.send(`Removed Album ID ${req.params.album_id}`);
            albumsArr.splice(indexID, 1);
        }
    });
    

 
tracksRoute.route('/')
    .get((req, res) => {
    res.send(tracksArr);
    })
    .post((req, res) => {
        const newID = req.body;
        newID.track_id = tracksArr.length+1;
        if(!(newID.album_id && newID.album_title && newID.artist_id && newID.artist_name && newID.tags
            && newID.track_date_created && newID.track_date_recorded && newID.track_duration 
            && newID.track_genres && newID.track_number && newID.track_title)) 
            res.status(404).send('please make sure all parts of the tracks are present in your request');
        else {
            tracksArr[parseInt(newID.track_id)] = newID;
            res.send(newID);
        }
    });
  
tracksRoute.route('/:track_id')
    .get((req, res) => {
        const id = tracksArr.find(t => parseInt(t.track_id) === parseInt(req.params.track_id));
        if(id) res.send(id);
        else res.status(404).send(`Tracks ID ${req.params.track_id} was not found`);
    })
    .put((req, res) => {
        const newID = req.body;
        newID.track_id = parseInt(req.params.track_id);
        const indexID = tracksArr.findIndex(t => parseInt(t.track_id) === parseInt(newID.track_id));
        if(indexID < 0) tracksArr.push(newID);
        else tracksArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const newID = req.body;
        const indexID = tracksArr.findIndex(t => parseInt(t.track_id) === parseInt(req.params.track_id));
        if(indexID < 0) res.status(404).send(`Tracks ID ${req.params.track_id} was not found`);
        else {
            if(newID.album_id) tracksArr[indexID].album_id = parseInt(tracksArr[indexID].album_id) + parseInt(newID.album_id);
            if(newID.album_title) tracksArr[indexID].album_title += (' ' + newID.album_title);
            if(newID.artist_id) tracksArr[indexID].artist_id = parseInt(tracksArr[indexID].artist_id) + parseInt(newID.artist_id);
            if(newID.artist_name) tracksArr[indexID].artist_name += (' ' + newID.artist_name);
            if(newID.tags) tracksArr[indexID].tags += (' ' + newID.tags);
            if(newID.track_date_created) tracksArr[indexID].track_date_created = newID.track_date_created;
            if(newID.track_date_recorded) tracksArr[indexID].track_date_recorded = newID.track_date_recorded;
            if(newID.track_duration) tracksArr[indexID].track_duration = parseInt(tracksArr[indexID].track_duration) + parseInt(newID.track_duration);
            if(newID.track_genres) tracksArr[indexID].track_genres += (' ' + newID.track_genres);
            if(newID.track_number) tracksArr[indexID].track_number = parseInt(tracksArr[indexID].track_number) + parseInt(newID.track_number);
            if(newID.track_title) tracksArr[indexID].track_title += (' ' + newID.track_title);
            res.send(newID);
        }
    })
    .delete((req, res) => {
        const indexID = tracksArr.findIndex(t => parseInt(t.track_id) === parseInt(req.params.track_id));
        if(indexID < 0) res.status(404).send(`Tracks ID ${req.params.track_id} does not exist`);
        else {
            res.send(`Removed Tracks ID ${req.params.track_id}`);
            tracksArr.splice(indexID, 1);
        }
    });


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening To ${port}`))




