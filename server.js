const express = require('express');
const path = require('path');
const fs = require('fs')

const PORT = process.env.PORT || 3001;
const app = express();
const writeNote = (txtDest, txtBody) =>
  fs.writeFile(txtDest, JSON.stringify(txtBody, null, 4), (err) =>
    err ? console.error(err) : console.info(`${txtDest}`)
  );

const createNote = (txtBody, file) => {
    fs.readFile(file, 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const pData = JSON.parse(data); //move this
        pData.push(txtBody);
        writeNote(file, pData);
      }
    });
  };

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//ROUTES

//index
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/pages/notes.html'));
});

//homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

//notes mock db
app.get('/api/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './db/db.json')); 
});

//POST new note
app.post('/api/notes', (req, res) => {
    const { title, text } = req.body
    if (req.body) {
        const note = {
            title,
            text,
            id: uuid(),
        }; 
        createNote(note, './db/db.json');
        console.log(note)
    } else {
        res.error('Error.  Please try again')
    }    
})

//listener w/ log
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});