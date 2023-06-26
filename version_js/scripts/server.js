const http = require('http');
const path = require('path');
const fs = require('fs');
const PORT = 3000;
const dataFilePath = '../jsons/players.json';

const server = http.createServer((req, res) => {
    if (req.method === 'POST') {
        if (req.url === '/login') {
            // Handle login request
            const username = req.body.username;
            const users = readDataFile();

            const userExists = users.some(user => user.username === username);

            if (userExists) {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Login successful' }));
            } else {
                res.statusCode = 404;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Invalid username' }));
            }
        } else if (req.url === '/signup') {
            // Handle signup request
            const username = req.body.username;
            const users = readDataFile();

            const userExists = users.some(user => user.username === username);

            if (userExists) {
                res.statusCode = 409;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ error: 'Username already taken' }));
            } else {
                users.push({ username });
                writeDataFile(users);
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.end(JSON.stringify({ message: 'Account created successfully' }));
            }
        }
    }
});

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Read the JSON data from the file
function readDataFile() {
    try {
        const jsonData = fs.readFileSync(dataFilePath, 'utf8');
        return JSON.parse(jsonData);
    } catch (err) {
        console.error('Error reading data file:', err);
        return [];
    }
}

// Write the JSON data to the file
function writeDataFile(data) {
    try {
        fs.writeFileSync(dataFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Error writing data file:', err);
    }
}
