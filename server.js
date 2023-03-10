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
      const pData = JSON.parse(data);
      if (err) {
        console.error(err);
      } else {
        pData.push(txtBody);
        writeNote(file, pData);
      }
    });
  };

  //generates AlphaNumeric ID for each note
function idGen() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  }

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

//ROUTES

//index
app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, '/public/notes.html'));
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
            id: idGen(),
        }; 
        createNote(note, './db/db.json');
        // res.send(`Note with ID ${id} has been deleted.`)
    } else {
        res.error('Error.  Please try again')
    }    
})

//BONUS Delete
app.delete('/api/notes/:id', (req, res) => {
    const id = req.params.id;
    fs.readFile('./db/db.json', (err, data) => {
      if (err) throw err;
      const notes = JSON.parse(data);
      const updatedNotes = notes.filter(note => note.id !== id);
      fs.writeFile('./db/db.json', JSON.stringify(updatedNotes), err => {
        if (err) throw err;
        res.send(`Note with ID ${id} has been deleted.`);
      });
    });
  });

//listener w/ log
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
});