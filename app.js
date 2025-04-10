// Import modules
const express = require('express');
const fs = require('fs');
const path = require('path');
// Create an express app

const api = require('./api.js');

const app = express();
// Set the port
const PORT = 3000;

// Middleware to parse the incoming request object as JSON
app.use(express.json());
// Middleware to serve static files in the 'public' folder
 app.use(express.static('public'));
// Start the server


// Check if 'tasks.json' exists. If it doesn't, then create it with an empty array [].
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

if (!fs.existsSync(tasksFilePath)) {
    fs.writeFileSync(tasksFilePath, JSON.stringify([], null, 2), 'utf8');
    console.log('Created an empty tasks.json file.');
}

app.use('/api/tasks', api);

app.listen(PORT, (error) => {
    if (!error) {
    console.log("Server is running and app is listening on port " + PORT);
    } else {
    console.log("ERROR: server cannot start.", error);
    }
});