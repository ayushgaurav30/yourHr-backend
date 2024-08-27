const express = require('express');
const multer = require('multer');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const app = express();
const upload = multer({ dest: 'uploads/' });

let db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the database.');
        db.run(`CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            qualifications TEXT NOT NULL,
            preferred_role TEXT NOT NULL,
            resume_path TEXT NOT NULL
        )`);
    }
});

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/signup', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'signup.html'));
});

app.post('/signup', upload.single('resume'), (req, res) => {
    const { name, email, phone, qualifications, preferred_role } = req.body;
    const resume_path = req.file.path;

    db.run(`INSERT INTO users (name, email, phone, qualifications, preferred_role, resume_path)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [name, email, phone, qualifications, preferred_role, resume_path],
            (err) => {
        if (err) {
            console.error(err.message);
            res.status(500).send('Error saving data.');
        } else {
            res.redirect('/');
        }
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
