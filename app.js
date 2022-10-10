const express = require('express');
const app = express();

app.get('/', (req, res) =>{
    res.send('Hello World');
});

app.listen(5684, () => console.log('Listening To 5684'))