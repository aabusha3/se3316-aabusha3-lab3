const csv = require('csv-parser');
const fs = require('fs');
const express = require('express');
const app = express();
const genresRoute = express.Router();
const artistsRoute = express.Router();
const albumsRoute = express.Router();
const tracksRoute = express.Router();
const listsRoute = express.Router();

const genresArr = new Array();
fs.createReadStream("./lab3-data/genres.csv").pipe(csv()).on('data', (data) => genresArr.push(data));
const artistsArr = new Array();
fs.createReadStream("./lab3-data/raw_artists.csv").pipe(csv()).on('data', (data) => artistsArr.push(data));
const albumsArr = new Array();
fs.createReadStream("./lab3-data/raw_albums.csv").pipe(csv()).on('data', (data) => albumsArr.push(data));
const tracksArr = new Array();
fs.createReadStream("./lab3-data/raw_tracks.csv").pipe(csv()).on('data', (data) => tracksArr.push(data));


function strip(html){
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

app.use('/', express.static('static'));
app.use('/api/genres', genresRoute);
app.use('/api/artists', artistsRoute);
app.use('/api/albums', albumsRoute);
app.use('/api/tracks', tracksRoute);
app.use('/api/lists', listsRoute);

genresRoute.use(express.json());
artistsRoute.use(express.json());
albumsRoute.use(express.json());
tracksRoute.use(express.json());
listsRoute.use(express.json());

genresRoute.route('/')
    .get((req, res) => {
    res.send(genresArr);
    })
    .post((req, res) => {
        const newID = strip(req.body);
        newID.genre_id = Math.max(...genresArr.genre_id)+1;
        if(!(newID['#tracks'] && newID.parent && newID.title && newID.top_level)) 
            res.status(404).send(JSON.stringify('please make sure all parts of the genre are present in your request'));
        else {
            genresArr[parseInt(newID.genre_id)] = newID;
            res.send(newID);
        }
    });

genresRoute.route('/:genre_id')
    .get((req, res) => {
        const gId = parseInt(req.params.genre_id);
        const id = genresArr.find(g => parseInt(g.genre_id) === gId);
        if(id) res.send(id);
        else res.status(404).send(JSON.stringify(`Genre ID '${gId}' was not found`));
    })
    .put((req, res) => {
        const newID = strip(req.body);
        newID.genre_id = parseInt(req.params.genre_id);
        const indexID = genresArr.findIndex(g => parseInt(g.genre_id) === newID.genre_id);
        if(indexID < 0) genresArr.push(newID);
        else genresArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const gId = parseInt(req.params.genre_id);
        const newID = strip(req.body);
        const indexID = genresArr.findIndex(g => parseInt(g.genre_id) === gId);
        if(indexID < 0) res.status(404).send(JSON.stringify(`Genre ID '${gId}' was not found`));
        else {
            if(newID['#tracks']) genresArr[indexID]['#tracks'] = parseInt(genresArr[indexID]['#tracks']) + parseInt(newID['#tracks']);
            if(newID.parent) genresArr[indexID].parent = parseInt(genresArr[indexID].parent) + parseInt(newID.parent);
            if(newID.title) genresArr[indexID].title += (' ' + newID.title);
            if(newID.top_level) genresArr[indexID].top_level = parseInt(genresArr[indexID].top_level) + parseInt(newID.top_level);
            res.send(newID);
        }
    })
    .delete((req, res) => {
        const gId = parseInt(req.params.genre_id);
        const indexID = genresArr.findIndex(g => parseInt(g.genre_id) === gId);
        if(indexID < 0) res.status(404).send(JSON.stringify(`Genre ID '${gId}' does not exist`));
        else {
            res.send(JSON.stringify(`Removed Genre ID '${gId}'`));
            genresArr.splice(indexID, 1);
        }
    });


    
artistsRoute.route('/')
    .get((req, res) => {
    res.send(artistsArr);
    })
    .post((req, res) => {
        const newID = strip(req.body);
        newID.artist_id = Math.max(...artistsArr.artist_id)+1;
        if(!(newID.artist_name && newID.artist_handle && newID.tags && newID.artist_url 
            && newID.artist_favorites && newID.artist_comments  && newID.artist_date_created)) 
            res.status(404).send(JSON.stringify('please make sure all parts of the artist are present in your request'));
        else {
            artistsArr[parseInt(newID.artist_id)] = newID;
            res.send(newID);
        }
    });

artistsRoute.route('/:artist_id')
    .get((req, res) => {
        const rId = parseInt(req.params.artist_id);
        const id = artistsArr.find(r => parseInt(r.artist_id) === rId);
        if(id) res.send(id);
        else res.status(404).send(JSON.stringify(`Artist ID '${rId}' was not found`));
    })
    .put((req, res) => {
        const newID = strip(req.body);
        newID.artist_id = parseInt(req.params.artist_id);
        const indexID = artistsArr.findIndex(r => parseInt(r.artist_id) === newID.artist_id);
        if(indexID < 0) artistsArr.push(newID);
        else artistsArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const rId = parseInt(req.params.artist_id);
        const newID = strip(req.body);
        const indexID = artistsArr.findIndex(r => parseInt(r.artist_id) === rId);
        if(indexID < 0) res.status(404).send(JSON.stringify(`Artist ID '${rId}' was not found`));
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
        const rId = parseInt(req.params.artist_id);
        const indexID = artistsArr.findIndex(r => parseInt(r.artist_id) === rId);
        if(indexID < 0) res.status(404).send(JSON.stringify(`Artist ID '${rId}' does not exist`));
        else {
            res.send(JSON.stringify(`Removed Artist ID '${rId}'`));
            artistsArr.splice(indexID, 1);
        }
    });



albumsRoute.route('/')
    .get((req, res) => {
    res.send(albumsArr);
    })
    .post((req, res) => {
        const newID = strip(req.body);
        newID.album_id = Math.max(...albumsArr.album_id)+1;
        if(!(newID.album_title && newID.album_date_created && newID.album_favorites && newID.artist_name 
            && newID.artist_url && newID.artist_favorites  && newID.tags)) 
            res.status(404).send(JSON.stringify('please make sure all parts of the album are present in your request'));
        else {
            albumsArr[parseInt(newID.album_id)] = newID;
            res.send(newID);
        }
    });

albumsRoute.route('/:album_id')
    .get((req, res) => {
        const lId = parseInt(req.params.album_id);
        const id = albumsArr.find(l => parseInt(l.album_id) === lId);
        if(id) res.send(id);
        else res.status(404).send(JSON.stringify(`Album ID '${lId}' was not found`));
    })
    .put((req, res) => {
        const newID = strip(req.body);
        newID.album_id = parseInt(req.params.album_id);
        const indexID = albumsArr.findIndex(l => parseInt(l.album_id) === newID.album_id);
        if(indexID < 0) albumsArr.push(newID);
        else albumsArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const lId = parseInt(req.params.album_id);
        const newID = strip(req.body);
        const indexID = albumsArr.findIndex(l => parseInt(l.album_id) === lId);
        if(indexID < 0) res.status(404).send(JSON.stringify(`Album ID '${lId}' was not found`));
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
        const lId = parseInt(req.params.album_id);
        const indexID = albumsArr.findIndex(l => parseInt(l.album_id) === lId);
        if(indexID < 0) res.status(404).send(JSON.stringify(`Album ID '${lId}' does not exist`));
        else {
            res.send(JSON.stringify(`Removed Album ID '${lId}'`));
            albumsArr.splice(indexID, 1);
        }
    });
    

 
tracksRoute.route('/')
    .get((req, res) => {
    res.send(tracksArr);
    })
    .post((req, res) => {
        const newID = strip(req.body);
        newID.track_id = Math.max(...tracksArr.track_id)+1;
        if(!(newID.album_id && newID.album_title && newID.artist_id && newID.artist_name && newID.tags
            && newID.track_date_created && newID.track_date_recorded && newID.track_duration 
            && newID.track_genres && newID.track_number && newID.track_title)) 
            res.status(404).send(JSON.stringify('please make sure all parts of the tracks are present in your request'));
        else {
            tracksArr[parseInt(newID.track_id)] = newID;
            res.send(newID);
        }
    });
  
tracksRoute.route('/:track_id')
    .get((req, res) => {
        const tId = parseInt(req.params.track_id);
        const id = tracksArr.find(t => parseInt(t.track_id) === tId);
        if(id) res.send(id);
        else res.status(404).send(JSON.stringify(`Tracks ID '${tId}' was not found`));
    })
    .put((req, res) => {
        const newID = strip(req.body);
        newID.track_id = parseInt(req.params.track_id);
        const indexID = tracksArr.findIndex(t => parseInt(t.track_id) === newID.track_id);
        if(indexID < 0) tracksArr.push(newID);
        else tracksArr[indexID] = newID;
        res.send(newID);
    })
    .post((req, res) => {
        const tId = parseInt(req.params.track_id);
        const newID = strip(req.body);
        const indexID = tracksArr.findIndex(t => parseInt(t.track_id) === tId);
        if(indexID < 0) res.status(404).send(JSON.stringify(`Tracks ID '${tId}' was not found`));
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
        const tId = parseInt(req.params.track_id);
        const indexID = tracksArr.findIndex(t => parseInt(t.track_id) === tId);
        if(indexID < 0) res.status(404).send(JSON.stringify(`Tracks ID '${tId}' does not exist`));
        else {
            res.send(JSON.stringify(`Removed Tracks ID '${tId}'`));
            tracksArr.splice(indexID, 1);
        }
    });

    
listsRoute.route('/create/:name')
    .get((req, res) => {
        const name = strip(req.params.name);
        const path = `./StoredLists/${name}.json`
        fs.access(path, fs.F_OK, (err) => {
            if (err) {
                fs.open(path, 'w', function (err) {
                    if (err) return res.status(404).send(JSON.stringify(`List '${name}' Was Not Created :(`));
                    else return res.send(JSON.stringify(`List '${name}' Created Successfully`));
                });
            }
            else return res.status(404).send(JSON.stringify(`List '${name}' Already Exists`));
        });
    });

listsRoute.route('/write/:name/:id')
    .get((req, res) => {
        const name = strip(req.params.name);
        const id = parseInt(req.params.id);
        const path = `./StoredLists/${name}.json`
        const indexID = tracksArr.findIndex(t => parseInt(t.track_id) === id);
        if(indexID >= 0){
            fs.access(path, fs.F_OK, (err) => {
                if (err) return res.status(404).send(JSON.stringify(`List '${name}' Does Not Exist`));
                else {
                    let writeData = [];
                    fs.readFile(path, function(err, data) {
                        if (err) return res.status(404).send(JSON.stringify(`List '${name}' Could Not Be Read`));
                        else {
                            let exst = false;
                            if(data.length>0) data = JSON.parse(data);
                            for(d of data){
                                if(parseInt(d.track_id) === id){
                                    exst = true;
                                    break;
                                }
                            }
                            if(!exst){
                                writeData = data.length>0? 
                                (data.concat([{'track_id':`${id}`,
                                'track_title':tracksArr[indexID].track_title,  
                                'track_duration':tracksArr[indexID].track_duration, 
                                'artist_id':tracksArr[indexID].artist_id, 
                                'artist_name':tracksArr[indexID].artist_name,
                                'album_id':tracksArr[indexID].album_id, 
                                'album_title':tracksArr[indexID].album_title}])) 
                                : ([{'track_id':`${id}`,
                                'track_title':tracksArr[indexID].track_title,  
                                'track_duration':tracksArr[indexID].track_duration, 
                                'artist_id':tracksArr[indexID].artist_id, 
                                'artist_name':tracksArr[indexID].artist_name,
                                'album_id':tracksArr[indexID].album_id, 
                                'album_title':tracksArr[indexID].album_title}]);
                                fs.writeFile(path, JSON.stringify(writeData), function (errr) {
                                    if (errr) return res.status(404).send(JSON.stringify(`Track Id '${id}' Could Not Be Added`));
                                    else return res.send(JSON.stringify(`Track Id '${id}' Successfully Added`));
                                });
                            }
                            else return res.status(404).send(JSON.stringify(`Tracks ID '${id}' Is Already In Your List`));
                        }
                    });
                }
            });
        }
        else return res.status(404).send(JSON.stringify(`Tracks ID '${id}' Does Not Exist In The Track File`));
    });

listsRoute.route('/read/:name')
    .get((req, res) => {
        const name = strip(req.params.name);
        const path = `./StoredLists/${name}.json`
        fs.access(path, fs.F_OK, (err) => {
            if(err) return res.status(404).send(JSON.stringify(`List '${name}' Does Not Exist`));
            else{
                fs.readFile(path, function(errr, data) {
                    if (errr) return res.status(404).send(JSON.stringify(`List '${name}' Could Not Be Read`));
                    else {
                        if(data.length === 0) return res.status(404).send(JSON.stringify(`List '${name}' Is Empty`));
                        else return res.send(data);
                    }
                });
            }
        });
    });

listsRoute.route('/delete/:name')
    .get((req, res) => {
        const name = strip(req.params.name);
        const path = `./StoredLists/${name}.json`
        fs.access(path, fs.F_OK, (err) => {
            if(err) return res.status(404).send(JSON.stringify(`List '${name}' Does Not Exist`));
            else{
                fs.unlink(path, function(errr) {
                    if (errr) return res.status(404).send(JSON.stringify(`List '${name}' Could Not Be Deleted`));
                    else return res.send(JSON.stringify(`List '${name}' Successfully Deleted`));
                });
            }
        });
    });

listsRoute.route('/list')
    .get((req, res) => {
        const dir = './StoredLists/'
        fs.readdir(dir, (err, files) => {
            if(err) return res.status(404).send(JSON.stringify('Lists Could Not Be Read Or Do Not Exist'));
            else{
                let resData = [];
                let index = 0;
                for(file of files){
                    if(file === '.json') continue;
                    let totalTime = 0;
                    if(res.status === 404) break;
                    let path = `./StoredLists/${file}`
                    fs.readFile(path, function(errr, data) {
                        let name = path.replace('./StoredLists/','').replace('.json','');
                        if (errr) return res.status(404).send(JSON.stringify(`List '${name}' Could Not Be Read`));
                        else {
                            resData[index] = {};
                            resData[index]['name'] = name;
                            if(data.length>0) {
                                data = JSON.parse(data);
                                resData[index]['length'] = data.length;
                                data.forEach(d => totalTime += parseInt((d.track_duration).split(':')[0])*60 + parseInt((d.track_duration).split(':')[1]));
                                resData[index]['duration'] = '' + (parseInt(totalTime/60)) + ':' + (parseInt(totalTime%60) !== 0? parseInt(totalTime%60) : '00');
                            }
                            else {
                                resData[index]['length'] = 0;
                                resData[index]['duration'] = '0:00';
                            }
                        }
                        if(res.status !== 404 && files.length-1 === resData.length)
                            res.send(JSON.stringify(resData));
                        index++;
                    });
                }
            }
        });
    });

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening To ${port}`))




