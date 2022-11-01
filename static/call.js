document.getElementById('step1').addEventListener('click', step1);

function step1(){
    fetch('/api/genres')
    .then(res => res.json()
        .then(data => {
            console.log(data);
            const ul = document.getElementById('step1Result');
            data.forEach(d => {
                const li = document.createElement('li');
                li.appendChild(document.createTextNode(`Name: ${d.title} ID: ${d.genre_id} Parent: ${d.parent}`))
                ul.appendChild(li);
            });
    }));
}