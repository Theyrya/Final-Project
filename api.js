// Import modules
const express = require('express');
const fs = require('fs');
const path = require('path');

// Create an express router
const router = express.Router();

// Path to tasks.json
const tasksFilePath = path.join(__dirname, 'data', 'tasks.json');

// Function to read tasks from the JSON file
const readTasksFromFile = () => {
    const tasksData = fs.readFileSync(tasksFilePath, 'utf8');
    return JSON.parse(tasksData);
};

// Function to write tasks to the JSON file
const writeTasksToFile = (tasks) => {
    fs.writeFileSync(tasksFilePath, JSON.stringify(tasks, null, 2), 'utf8');
};

// Routes will go here...

// Export our router
module.exports = router;