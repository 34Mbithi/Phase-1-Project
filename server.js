const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors'); // Import CORS middleware
const app = express();
const PORT = 3000;

app.use(cors()); // Enable CORS
app.use(express.json());
app.use(express.static('public'));

// Serve index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to get schedule data
app.get('/scheduleData', (req, res) => {
  fs.readFile('index.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to read data' });
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData.schedule);
  });
});

// API endpoint to get membership data
app.get('/membershipData', (req, res) => {
  fs.readFile('index.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to read data' });
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData.membership);
  });
});

// API endpoint to get workout data
app.get('/workoutData', (req, res) => {
  fs.readFile('index.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to read data' });
      return;
    }
    const jsonData = JSON.parse(data);
    res.json(jsonData.workout);
  });
});

// API endpoint to add a new session
app.post('/new_sessions', (req, res) => {
  const newSession = req.body;

  fs.readFile('index.json', (err, data) => {
    if (err) {
      res.status(500).json({ error: 'Unable to read data' });
      return;
    }
    const jsonData = JSON.parse(data);
    newSession.id = jsonData.schedule.length + 1; // Assign a new ID
    jsonData.schedule.push(newSession);

    fs.writeFile('index.json', JSON.stringify(jsonData, null, 2), (err) => {
      if (err) {
        res.status(500).json({ error: 'Unable to save data' });
        return;
      }
      res.status(201).json(newSession);
    });
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
