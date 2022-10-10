const express = require('express');
const app = express();

app.get('/', (req, res) =>{
    res.send('Hello World');
});


const port = process.env.PORT || 5684;
app.listen(port, () => console.log(`Listening To ${port}`))