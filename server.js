//Calling and defining the required methods, files, and port
const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3001;
const util = require('util');
const uuid = require('./helpers/uuid');
const readFromFile = util.promisify(fs.readFile);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//Setting up the home page of the application
app.get('/', (req, res) => res.send('Navigate to /notes'));

//Setting up a page to view the raw data from the JSON file
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//Setting up the note taking page that is pulled from the html file specified
app.get('/notes/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// POST request for when the user adds a new note
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a new note`);

  // Assigning the variables title and text to the data from the user input
  const { title, text } = req.body;

  if (title && text ) {
    const newNote = {
      title,
      text,
      id: uuid(),
    };
    //Reads the current JSON file and pushes the newly added note to the file
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedNote = JSON.parse(data);
        parsedNote.push(newNote);
        //Updates the JSON file by writing the newly added note
        fs.writeFile(
          './db/db.json',
          JSON.stringify(parsedNote, null, 4),
          (writeErr) =>
            writeErr
              ? console.error(writeErr)
              : console.info('Successfully updated Notes!')
        );
      }
    });

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting notes');
  }
});

// Delete request that is triggered by the note's unique id
app.delete('/api/notes/:id', (req, res) => {
  let result = fs.readFileSync("./db/db.json", "utf8");
  const resultJSON = JSON.parse(result);
  const updatedNotes = resultJSON.filter((note) => {
    return note.id !== req.params.id;
  });
  // Updates the JSON file with the removed note
  fs.writeFile("./db/db.json", JSON.stringify(updatedNotes), (err, text) => {
    if (err) {
      console.error(err);
      return;
    }
  });
  res.json(updatedNotes);
})

//Setting up a path for when the user supplies an undefined URL; This will take the user to the home page
app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);
//Starting up the server with the defined PORT
app.listen(PORT, () =>
  console.log(`Your App has launched at http://localhost:${PORT}`)
);