const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = 3001;
const util = require('util');
const notes = require('./db/db.json')

// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static('public'));

//route path (i.e. home page)
app.get('/', (req, res) => res.send('Navigate to /notes'));

//create new route path
// app.get('/api/notes', (req, res) =>
//     res.json(notes)
// );

// ---- CHANGED TO ----
// Promise version of fs.readFile
const readFromFile = util.promisify(fs.readFile);
// --------------
app.get('/api/notes', (req, res) => {
  console.info(`${req.method} request received for tips`);
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});

//create new route path
app.get('/notes/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

// app.get('/routes', (req, res) =>
//   res.sendFile(path.join(__dirname, 'public/routes.html'))
// );

//------------- POST REQUEST -----------------

// POST request to add a review
app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a new note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text ) {
    // Variable for the object we will save
    const newNote = {
      title,
      text,
      id: uuid(),

    };

    // Obtain existing reviews
    fs.readFile('./db/db.json', 'utf8', (err, data) => {
      if (err) {
        console.error(err);
      } else {
        // Convert string into JSON object
        const parsedNote = JSON.parse(data);

        // Add a new review
        parsedNote.push(newNote);

        // Write updated reviews back to the file
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

//----------   END  --- POST REQUEST -----   END   ------------

// Fallback route for when a user attempts to visit routes that don't exist
// app.get('*', (req, res) =>
//   res.send(
//     `Page not found! Return to <a href="http://localhost:${PORT}/" >http://localhost:${PORT}/</a>`
//   )
// );

app.get('*', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html'))
);

app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
);