document.getElementById('step1').addEventListener('click', step1);
document.getElementById('step1_alt').addEventListener('click', step1Clear);
function step1Clear(){
    const ul = document.getElementById('step1Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step1Status').innerText = 'Genres Cleared Succesufully';
}
function step1(){
    document.getElementById('step1Status').innerText = '';
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
            document.getElementById('step1Status').innerText = 'Genres Displayed Succesufully';
        })
        .catch(err => document.getElementById('step1Status').innerText = `Genres List Data Not Found\t${err}`)
    )
    .catch(err => document.getElementById('step1Status').innerText = `Genres List Could Not Be Found\t${err}`);
}


document.getElementById('step2').addEventListener('click', step2);
document.getElementById('step2_alt').addEventListener('click', step2Clear);
function step2Clear(){
    const li = document.getElementById('step2Result');
    li.innerHTML = '';
    document.getElementById('step2Status').innerText = "Artist's Info Cleared Succesufully";
}
function step2(){
    const id = parseInt(document.getElementById('id_step2').value);
    const li = document.getElementById('step2Result');
    document.getElementById('step2Status').innerText = '';
    li.innerHTML = '';
    fetch(`/api/artists/${id}`)
    .then(res => res.json()
        .then(d => {
            li.appendChild(document.createTextNode(`ID: ${d.artist_id} Name: ${d.artist_name} 
            Handle: ${d.artist_handle} Tags: ${d.tags} URL: ${d.artist_url} Favorites: ${d.artist_favorites} 
            Comments: ${d.artist_comments} Date Created: ${d.artist_date_created}`))
            document.getElementById('step2Status').innerText = `Artist ${id} Found`;
        })
        .catch(err => document.getElementById('step2Status').innerText = `Artist ${id} Not Found\t${err}`)
    )
    .catch(err => document.getElementById('step2Status').innerText = `Artists List Could Not Be Found\t${err}`);
}


document.getElementById('step3_alt').addEventListener('click', step3Clear);
function step3Clear(){
    const li = document.getElementById('step3Result');
    li.innerHTML = '';
    document.getElementById('step3Status').innerText = "Track's Info Cleared Succesufully";
}
document.getElementById('step3').addEventListener('click', step3);
function step3(){
    const id = parseInt(document.getElementById('id_step3').value);
    const li = document.getElementById('step3Result');
    document.getElementById('step3Status').innerText = '';
    li.innerHTML = '';
    fetch(`/api/tracks/${id}`)
    .then(res => res.json()
        .then(d => {
            li.appendChild(document.createTextNode(`Album ID: ${d.album_id} Album Title: ${d.album_title} 
            Artist ID: ${d.artist_id} Artist Name: ${d.artist_name} Tags: ${d.tags} 
            Date Created: ${d.track_date_created} Date Recorded: ${d.track_date_recorded} 
            Duration: ${d.track_duration} Genres: ${d.track_genres} Track#: ${d.track_number} 
            Track Title: ${d.track_title}`))
            document.getElementById('step3Status').innerText = `Track ${id} Found`;
        })
        .catch(err => document.getElementById('step3Status').innerText = `Track ${id} Not Found\t${err}`)
    )
    .catch(err => document.getElementById('step3Status').innerText = `Tracks List Could Not Be Found\t${err}`);
}


document.getElementById('step4_alt').addEventListener('click', step4Clear);
function step4Clear(){
    const ul = document.getElementById('step4Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step4Status').innerText = 'Filetered Track Ids Cleared Succesufully';
}
document.getElementById('step4').addEventListener('click', step4);
function step4(){
    let max = 12;
    const tt = document.getElementById('tt_step4').value.toLowerCase();
    const at = document.getElementById('at_step4').value.toLowerCase();
    const ul = document.getElementById('step4Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step4Status').innerText = 'Searching The Archives, Please Be Patient';

    fetch(`/api/tracks`)
    .then(res => res.json()
        .then(data => {
            for(d of data){
                if((tt.length>0 && d.track_title.toLowerCase().includes(tt)) || (at.length>0 && d.album_title.toLowerCase().includes(at))){
                    const li = document.createElement('li');
                    li.appendChild(document.createTextNode(`Track ID: ${d.track_id}`))
                    ul.appendChild(li);
                    max--;
                }
                if(max === 0) break;
            }
            document.getElementById('step4Status').innerText = 'Track IDs Displayed Succesufully';
        })
        .catch(err => document.getElementById('step4Status').innerText = `Tracks List Data Not Found\t${err}`)
    )
    .catch(err => document.getElementById('step4Status').innerText = `Tracks List Could Not Be Found\t${err}`);
}