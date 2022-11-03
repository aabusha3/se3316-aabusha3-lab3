document.getElementById('step1_alt').addEventListener('click', step1Clear);
function step1Clear(){
    const ul = document.getElementById('step1Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step1Status').innerText = 'Genres Cleared Successfully';
}
document.getElementById('step1').addEventListener('click', step1);
function step1(){
    const status = document.getElementById('step1Status');
    status.innerText = '';

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
            status.innerText = 'Genres Displayed Successfully';
        })
        .catch(err => status.innerText = `Genres List Data Not Found\t${err}`)
    )
    .catch(err => status.innerText = `Genres List Could Not Be Found\t${err}`);
}


document.getElementById('step2_alt').addEventListener('click', step2Clear);
function step2Clear(){
    const li = document.getElementById('step2Result');
    li.innerHTML = '';
    document.getElementById('step2Status').innerText = "Artist's Info Cleared Successfully";
}
document.getElementById('step2').addEventListener('click', step2);
function step2(){
    const status = document.getElementById('step2Status');
    const id = parseInt(document.getElementById('id_step2').value);
    const li = document.getElementById('step2Result');
    status.innerText = '';
    li.innerHTML = '';

    fetch(`/api/artists/${id}`)
    .then(res => res.json()
        .then(d => {
            li.appendChild(document.createTextNode(`ID: ${d.artist_id} Name: ${d.artist_name} 
            Handle: ${d.artist_handle} Tags: ${d.tags} URL: ${d.artist_url} Favorites: ${d.artist_favorites} 
            Comments: ${d.artist_comments} Date Created: ${d.artist_date_created}`))
            status.innerText = `Artist ${id} Found`;
        })
        .catch(err => status.innerText = `Artist ${id} Not Found\t${err}`)
    )
    .catch(err => status.innerText = `Artists List Could Not Be Found\t${err}`);
}


document.getElementById('step3_alt').addEventListener('click', step3Clear);
function step3Clear(){
    const li = document.getElementById('step3Result');
    li.innerHTML = '';
    document.getElementById('step3Status').innerText = "Track's Info Cleared Successfully";
}
document.getElementById('step3').addEventListener('click', step3);
function step3(){
    const status = document.getElementById('step3Status');
    const id = parseInt(document.getElementById('id_step3').value);
    const li = document.getElementById('step3Result');
    status.innerText = '';
    li.innerHTML = '';

    fetch(`/api/tracks/${id}`)
    .then(res => res.json()
        .then(d => {
            li.appendChild(document.createTextNode(`Album ID: ${d.album_id} Album Title: ${d.album_title} 
            Artist ID: ${d.artist_id} Artist Name: ${d.artist_name} Tags: ${d.tags} 
            Date Created: ${d.track_date_created} Date Recorded: ${d.track_date_recorded} 
            Duration: ${d.track_duration} Genres: ${d.track_genres} Track#: ${d.track_number} 
            Track Title: ${d.track_title}`))
            status.innerText = `Track ${id} Found`;
        })
        .catch(err => status.innerText = `Track ${id} Not Found\t${err}`)
    )
    .catch(err => status.innerText = `Tracks List Could Not Be Found\t${err}`);
}


document.getElementById('step4_alt').addEventListener('click', step4Clear);
function step4Clear(){
    const ul = document.getElementById('step4Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step4Status').innerText = 'Filetered Track Ids Cleared Successfully';
}
document.getElementById('step4').addEventListener('click', step4);
function step4(){
    let max = 12;
    const status = document.getElementById('step4Status');
    const tt = document.getElementById('tt_step4').value.toLowerCase();
    const at = document.getElementById('at_step4').value.toLowerCase();
    const ul = document.getElementById('step4Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    status.innerText = 'Searching The Archives, Please Be Patient';

    fetch('/api/tracks')
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
            status.innerText = 'Track IDs Displayed Successfully';
        })
        .catch(err => status.innerText = `Tracks List Data Not Found\t${err}`)
    )
    .catch(err => status.innerText = `Tracks List Could Not Be Found\t${err}`);
}


document.getElementById('step5_alt').addEventListener('click', step5Clear);
function step5Clear(){
    const ul = document.getElementById('step5Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step5Status').innerText = 'Filetered Artist Ids Cleared Successfully';
}
document.getElementById('step5').addEventListener('click', step5);
function step5(){
    const status = document.getElementById('step5Status');
    const name = document.getElementById('name_step5').value.toLowerCase();
    const ul = document.getElementById('step5Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    status.innerText = 'Searching The Archives, Please Be Patient';

    fetch('/api/artists')
    .then(res => res.json()
        .then(data => {
            data.forEach(d => {
                if(name.length>0 && d.artist_name.toLowerCase().includes(name)){
                    const li = document.createElement('li');
                    li.appendChild(document.createTextNode(`Artist ID: ${d.artist_id}`))
                    ul.appendChild(li);
                }
            });
            status.innerText = 'Artist IDs Displayed Successfully';
        })
        .catch(err => status.innerText = `Artists List Data Not Found\t${err}`)
    )
    .catch(err => status.innerText = `Artists List Could Not Be Found\t${err}`);
}


document.getElementById('step6').addEventListener('click', step6);
function step6(){
    const status = document.getElementById('step6Status');
    const name = document.getElementById('name_step6').value;
    status.innerText = 'Searching The Archives, Please Be Patient';

    fetch(`/api/lists/${name}`)
    .then(res => res.json()
        .then(data => {
            status.innerText = data;
    }));
}