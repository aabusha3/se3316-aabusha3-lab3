document.getElementById('step1').addEventListener('click', step1);
function step1(){
    fetch('/api/genres')
    .then(res => res.json()
        .then(data => {
            const ul = document.getElementById('step1Result');
            while(ul.firstChild) ul.removeChild(ul.firstChild);
            data.forEach(d => {
                const li = document.createElement('li');
                li.appendChild(document.createTextNode(`Name: ${d.title} ID: ${d.genre_id} Parent: ${d.parent}`))
                ul.appendChild(li);
            });
    }));
}

document.getElementById('step2').addEventListener('click', step2);
function step2(){
    fetch(`/api/artists/${document.getElementById('id_step2').value}`)
    .then(res => res.json()
        .then(d => {
            const li = document.getElementById('step2Result');
            li.innerHTML = '';
            li.appendChild(document.createTextNode(`ID: ${d.artist_id} Name: ${d.artist_name} Handle: ${d.artist_handle} Tags: ${d.tags} URL: ${d.artist_url} Favorites: ${d.artist_favorites} Comments: ${d.artist_comments} Date Created: ${d.artist_date_created}`))
    }));
}

// artistsRoute.get('/s2/:artist_id', (req, res) => {
//     const id = artistsArr.find(r => parseInt(r['artist_id']) === parseInt(req.params.artist_id));
//     if(id) res.send(JSON.stringify({artist_id:id.artist_id, artist_name:id.artist_name, 
//          artist_handle:id.artist_handle, tags:id.tags, artist_url:id.artist_url, 
//          artist_favorites:id.artist_favorites}));
//     else res.status(404).send(`Artist ID ${req.params.artist_id} was not found`);
// });