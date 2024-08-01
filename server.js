const express = require('express');
const { read } = require('fs');
const { readFile, writeFile } = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/notes', (req,res)=>{
    readFile('db/db.json', 'utf-8')
    .then((notes)=>{
        res.send(notes);    
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

app.post('/api/notes', (req,res)=>{
    const newNote = req.body;
    newNote.id = crypto.randomUUID();

    readFile('db/db.json', 'utf-8')
    .then((notes)=>{
        const db = JSON.parse(notes)
        db.push(newNote)

        const dbJson = JSON.stringify(db)
       return writeFile('db/db.json', dbJson)
    })
    .then(()=>{
        res.json('File written')
    })
    .catch(err => {
        res.status(500).json(err);
    });
});

app.get('/notes', (req,res)=>{
    res.sendFile(path.join(__dirname, './public/notes.html'))
})

app.listen(PORT, ()=>{
    console.log(`Running on port ${PORT}`);
});
