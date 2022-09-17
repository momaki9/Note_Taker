# Note Taker

In this application, you will find a simple note taker built with Express JS. When the user loads the application, a home page is displayed with a `Get Started` button. When the button is clicked, the user is taking to the note taking page. On the note taking page, a user can view previously added notes, add new notes, or delete older notes.

The notes in this application are stored as objects in a JSON file, with each note entry assigned a random id. The notes are accessed/viewed when the user visits the notes page. This is accomplished by initiating a `GET` request when the user clicks the Get Started button. If the user add a new note and clicks the save button, a `POST` request is initiated and the new note is added to the JSON file. If the user deletes a note by clicking the red trash button, then a `DELETE` request is initiated and the note is removed from the JSON.
The JSON data can be viewed with in the  `/api/notes` path.

----
## [Link to Depolyed Application on Heroku](#)
----
----
## [Link to Code on GitHub](https://github.com/momaki9/Note_Taker)
----
----
## ![Screenshot](/assets/images/ss_homePage.png)
## ![Screenshot](/assets/images/ss_notesPage.png)
----
----
