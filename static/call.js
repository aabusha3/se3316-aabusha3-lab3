function strip(html){
    let doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || "";
}

document.getElementById('step1_alt').addEventListener('click', step1Clear);
function step1Clear(){
    const ul = document.getElementById('step1Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step1Status').innerText = document.createTextNode('Genres Cleared Successfully').textContent;
}
document.getElementById('step1').addEventListener('click', step1);
function step1(){
    const status = document.getElementById('step1Status');
    const ul = document.getElementById('step1Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    status.innerText = document.createTextNode('').textContent;

    fetch('/api/genres')
    .then(res => res.json()
        .then(data => {
            data.forEach(d => {
                const li = document.createElement('li');
                li.appendChild(document.createTextNode(`Name: ${d.title} ID: ${d.genre_id} Parent: ${d.parent}`))
                ul.appendChild(li);
            });
            status.innerText = document.createTextNode('Genres Displayed Successfully').textContent;
        })
        .catch(err => status.innerText = document.createTextNode(`Genres List Data Not Found`).textContent)
    )
    .catch(err => status.innerText = document.createTextNode(`Genres List Could Not Be Found`).textContent);
}


document.getElementById('step2_alt').addEventListener('click', step2Clear);
function step2Clear(){
    const ul = document.getElementById('step2Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step2Status').innerText = document.createTextNode("Artist's Info Cleared Successfully").textContent;
}
document.getElementById('step2').addEventListener('click', step2);
function step2(){
    const status = document.getElementById('step2Status');
    const id = parseInt(document.getElementById('id_step2').value);
    const ul = document.getElementById('step2Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    status.innerText = document.createTextNode('').textContent;
   
    if(id.toString() === 'NaN') return status.innerText = document.createTextNode(`Entered Id Is Not A Number`).textContent;
    fetch(`/api/artists/id/${id}`)
    .then(res => res.json()
        .then(d => {
            if(res.status === 404 || res.status === 500) return status.innerText = document.createTextNode(d).textContent;
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(`ID: ${d.artist_id} Name: ${d.artist_name} 
            Handle: ${d.artist_handle} Tags: ${d.tags} URL: ${d.artist_url} Favorites: ${d.artist_favorites} 
            Comments: ${d.artist_comments} Date Created: ${d.artist_date_created}`));
            ul.appendChild(li);
            status.innerText = document.createTextNode(`Artist ${id} Found`).textContent;
        })
        .catch(err => status.innerText = document.createTextNode(`Artist ${id} Not Found`).textContent)
    )
    .catch(err => status.innerText = document.createTextNode(`Artists List Could Not Be Found`).textContent); 
}


document.getElementById('step3_alt').addEventListener('click', step3Clear);
function step3Clear(){
    const ul = document.getElementById('step3Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step3Status').innerText = document.createTextNode("Track's Info Cleared Successfully").textContent;
}
document.getElementById('step3').addEventListener('click', step3);
function step3(){
    const status = document.getElementById('step3Status');
    const id = parseInt(document.getElementById('id_step3').value);
    const ul = document.getElementById('step3Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    status.innerText = document.createTextNode('').textContent;

    if(id.toString() === 'NaN') return status.innerText = document.createTextNode(`Entered Id Is Not A Number`).textContent;
    fetch(`/api/tracks/find/${id}`)
    .then(res => res.json()
        .then(d => {
            if(res.status === 404 || res.status === 500) return status.innerText = document.createTextNode(d).textContent;
            const li = document.createElement('li');
            li.appendChild(document.createTextNode(`Album ID: ${d.album_id} Album Title: ${d.album_title} 
            Artist ID: ${d.artist_id} Artist Name: ${d.artist_name} Tags: ${d.tags} 
            Date Created: ${d.track_date_created} Date Recorded: ${d.track_date_recorded} 
            Duration: ${d.track_duration} Genres: ${d.track_genres} Track#: ${d.track_number} 
            Track Title: ${d.track_title}`));
            ul.appendChild(li);
            status.innerText = document.createTextNode(`Track ${id} Found`).textContent;
        })
        .catch(err => status.innerText = document.createTextNode(`Track ${id} Not Found`).textContent)
    )
    .catch(err => status.innerText = document.createTextNode(`Tracks List Could Not Be Found`).textContent);
}


document.getElementById('step4_alt').addEventListener('click', step4Clear);
function step4Clear(){
    const ul = document.getElementById('step4Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step4Status').innerText = document.createTextNode('Filtered Track Ids Cleared Successfully').textContent;
}
document.getElementById('step4').addEventListener('click', step4);
function step4(){
    const status = document.getElementById('step4Status');
    const tt = strip(document.getElementById('tt_step4').value).toLowerCase();
    const at = strip(document.getElementById('at_step4').value).toLowerCase();
    const ul = document.getElementById('step4Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    status.innerText = document.createTextNode('Searching The Archives, Please Be Patient').textContent;

    if(tt.length > 0){
        if(at.length > 0){
            fetch(`/api/tracks/ttat/${tt}/${at}`)
            .then(res => res.json()
                .then(data => {
                    if(res.status === 404 || res.status === 500) return status.innerText = document.createTextNode(data).textContent;
                    if(data.length === 0) return status.innerText = document.createTextNode('No Track Info Found').textContent;
                    for(d of data){
                        const li = document.createElement('li');
                        li.appendChild(document.createTextNode(`Track ID: ${d.track_id}: Album ID: ${d.album_id} Album Title: ${d.album_title} 
                        Artist ID: ${d.artist_id} Artist Name: ${d.artist_name} Tags: ${d.tags} 
                        Date Created: ${d.track_date_created} Date Recorded: ${d.track_date_recorded} 
                        Duration: ${d.track_duration} Genres: ${d.track_genres} Track#: ${d.track_number} 
                        Track Title: ${d.track_title}`));
                        ul.appendChild(li);
                    }
                    status.innerText = document.createTextNode(`Tracks Found`).textContent;
                })
                .catch(err => status.innerText = document.createTextNode(`Tracks List Data Not Found`).textContent)
            )
            .catch(err => status.innerText = document.createTextNode(`Tracks List Could Not Be Found`).textContent);
        }
        else{
            fetch(`/api/tracks/tt/${tt}`)
            .then(res => res.json()
                .then(data => {
                    if(res.status === 404 || res.status === 500) return status.innerText = document.createTextNode(data).textContent;
                    if(data.length === 0) return status.innerText = document.createTextNode('No Track Info Found').textContent;
                    for(d of data){
                        const li = document.createElement('li');
                        li.appendChild(document.createTextNode(`Track ID: ${d.track_id}: Album ID: ${d.album_id} Album Title: ${d.album_title} 
                        Artist ID: ${d.artist_id} Artist Name: ${d.artist_name} Tags: ${d.tags} 
                        Date Created: ${d.track_date_created} Date Recorded: ${d.track_date_recorded} 
                        Duration: ${d.track_duration} Genres: ${d.track_genres} Track#: ${d.track_number} 
                        Track Title: ${d.track_title}`));
                        ul.appendChild(li);
                    }
                    status.innerText = document.createTextNode(`Tracks Found`).textContent;
                })
                .catch(err => status.innerText = document.createTextNode(`Tracks List Data Not Found`).textContent)
            )
            .catch(err => status.innerText = document.createTextNode(`Tracks List Could Not Be Found`).textContent);
        }
    }
    else{
        if(at.length > 0){
            fetch(`/api/tracks/at/${at}`)
            .then(res => res.json()
                .then(data => {
                    if(res.status === 404 || res.status === 500) return status.innerText = document.createTextNode(data).textContent;
                    if(data.length === 0) return status.innerText = document.createTextNode('No Track Info Found').textContent;
                    for(d of data){
                        const li = document.createElement('li');
                        li.appendChild(document.createTextNode(`Track ID: ${d.track_id}: Album ID: ${d.album_id} Album Title: ${d.album_title} 
                        Artist ID: ${d.artist_id} Artist Name: ${d.artist_name} Tags: ${d.tags} 
                        Date Created: ${d.track_date_created} Date Recorded: ${d.track_date_recorded} 
                        Duration: ${d.track_duration} Genres: ${d.track_genres} Track#: ${d.track_number} 
                        Track Title: ${d.track_title}`));
                        ul.appendChild(li);
                    }
                    status.innerText = document.createTextNode(`Tracks Found`).textContent;
                })
                .catch(err => status.innerText = document.createTextNode(`Tracks List Data Not Found`).textContent)
            )
            .catch(err => status.innerText = document.createTextNode(`Tracks List Could Not Be Found`).textContent);
        }
        else{
            status.innerText = document.createTextNode('Please Enter In A Value').textContent;
        }
    }
}


document.getElementById('step5_alt').addEventListener('click', step5Clear);
function step5Clear(){
    const ul = document.getElementById('step5Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step5Status').innerText = document.createTextNode('Filtered Artist Ids Cleared Successfully').textContent;
}
document.getElementById('step5').addEventListener('click', step5);
function step5(){
    const status = document.getElementById('step5Status');
    const name = strip(document.getElementById('name_step5').value).toLowerCase();
    const ul = document.getElementById('step5Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    status.innerText = document.createTextNode('Searching The Archives, Please Be Patient').textContent;

    if(name.length > 0){
        fetch(`/api/artists/name/${name}`)
        .then(res => res.json()
            .then(data => {
                if(res.status === 404 || res.status === 500) return status.innerText = document.createTextNode(data).textContent;
                if(data.length === 0) return status.innerText = document.createTextNode('No Artist IDs Found').textContent;
                for(d of data){
                    const li = document.createElement('li');
                    li.appendChild(document.createTextNode(`ID: ${d.artist_id} Name: ${d.artist_name} 
                    Handle: ${d.artist_handle} Tags: ${d.tags} URL: ${d.artist_url} Favorites: ${d.artist_favorites} 
                    Comments: ${d.artist_comments} Date Created: ${d.artist_date_created}`));
                    ul.appendChild(li);
                }
                status.innerText = document.createTextNode('Artists Found').textContent;
            })
            .catch(err => status.innerText = document.createTextNode(`Artists List Data Not Found`).textContent)
        )
        .catch(err => status.innerText = document.createTextNode(`Artists List Could Not Be Found`).textContent);
    }
    else{
        status.innerText = document.createTextNode('Please Enter In A Value').textContent;
    }
}


document.getElementById('step6').addEventListener('click', step6);
function step6(){
    const status = document.getElementById('step69Status');
    const name = strip(document.getElementById('name_step6').value);
    status.innerText = document.createTextNode('').textContent;

    fetch(`/api/lists/create/${name}`)
    .then(res => res.json()
        .then(data => {
            status.innerText = document.createTextNode(data).textContent;
    }));
}

document.getElementById('step9').addEventListener('click', step9);
function step9(){
    const status = document.getElementById('step69Status');
    const name = strip(document.getElementById('name_step6').value);
    status.innerText = document.createTextNode('').textContent;

    fetch(`/api/lists/delete/${name}`)
    .then(res => res.json()
        .then(data => {
            status.innerText = document.createTextNode(data).textContent;
    }));
}


document.getElementById('step7').addEventListener('click', step7);
function step7(){
    const status = document.getElementById('step7Status');
    const name = strip(document.getElementById('name_step7').value);
    const id = parseInt(document.getElementById('id_step7').value);
    status.innerText = document.createTextNode('').textContent;

    fetch(`/api/lists/write/${name}/${id}`)
    .then(res => res.json()
        .then(data => {
            status.innerText = document.createTextNode(data).textContent;
    }));
}


document.getElementById('step8_alt').addEventListener('click', step8Clear);
function step8Clear(){
    const ul = document.getElementById('step8Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step8Status').innerText = document.createTextNode('List Cleared Successfully').textContent;
}
document.getElementById('step8').addEventListener('click', step8);
function step8(){
    const status = document.getElementById('step8Status');
    const name = strip(document.getElementById('name_step8').value);
    const ul = document.getElementById('step8Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    
    fetch(`/api/lists/read/${name}`)
    .then(res => res.json()
        .then(data => {        
            if(res.status === 404 || res.status === 500) return status.innerText = document.createTextNode(data).textContent;
            data.forEach(d => {
                const li = document.createElement('li');
                li.appendChild(document.createTextNode(`Track ID: ${d.track_id}: Album ID: ${d.album_id} Album Title: ${d.album_title} 
                Artist ID: ${d.artist_id} Artist Name: ${d.artist_name} Tags: ${d.tags} 
                Date Created: ${d.track_date_created} Date Recorded: ${d.track_date_recorded} 
                Duration: ${d.track_duration} Genres: ${d.track_genres} Track#: ${d.track_number} 
                Track Title: ${d.track_title}`));
                ul.appendChild(li);
                status.innerText = document.createTextNode('Ids In List Displayed Successfully').textContent;
            });
        })
        .catch(err => status.innerText = document.createTextNode(`List Data Not Found`).textContent)
    )
    .catch(err => status.innerText = document.createTextNode(`List Could Not Be Found`).textContent);
}



document.getElementById('step10_alt').addEventListener('click', step10Clear);
function step10Clear(){
    const ul = document.getElementById('step10Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    document.getElementById('step10Status').innerText = document.createTextNode('Lists Cleared Successfully').textContent;
}
document.getElementById('step10').addEventListener('click', step10);
function step10(){
    const status = document.getElementById('step10Status');
    const ul = document.getElementById('step10Result');
    while(ul.firstChild) ul.removeChild(ul.firstChild);
    status.innerText = document.createTextNode('').textContent;

    fetch('/api/lists/list')
    .then(res => res.json()
        .then(data => {
            if(res.status === 200){
            data.forEach(d => {
                const li = document.createElement('li');
                li.appendChild(document.createTextNode(`Name: ${d.name} ID Count: ${d.length} Duration: ${d.duration}`))
                ul.appendChild(li);
            });
            status.innerText = document.createTextNode('Lists Displayed Successfully').textContent;
        }
        else if(res.status === 404 || res.status === 500)
            status.innerText = document.createTextNode(data).textContent;
        })
        .catch(err => status.innerText = document.createTextNode(`Lists Data Not Found`))
    )
    .catch(err => status.innerText = document.createTextNode(`Lists Could Not Be Found`).textContent);
}