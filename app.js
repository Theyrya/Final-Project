const express = require('express');
const fs = require('fs');
const path = require('path');
const api = require('./api');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static('public'));

// API routes
app.use('/api', api);
process.on('SIGINT', () => {
    console.log('\nServer shutting down gracefully');
    process.exit();
});
// Serve HTML files
app.get('/', (req, res) => {
    const filePath = path.join(__dirname, 'public', req.path);
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Page not found');
    }
});

// Start server
app.listen(PORT, (error) => {
    if (!error) {
        console.log("Server is running and app is listening on port " + PORT);
    } else {
        console.log("ERROR: server cannot start.", error);
    }
});