const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dataFile = path.join(__dirname, 'bookings.json');

const readBookings = () => {
    if (!fs.existsSync(dataFile)) return [];
    const data = fs.readFileSync(dataFile);
    return JSON.parse(data);
};

const saveBookings = (bookings) => {
    fs.writeFileSync(dataFile, JSON.stringify(bookings, null, 2));
};

app.post('/api/book', (req, res) => {
    const newBooking = req.body;
    const bookings = readBookings();
    newBooking.id = Date.now();
    bookings.push(newBooking);
    saveBookings(bookings);
    res.status(201).json({ message: 'تم تسجيل الحجز بنجاح!' });
});

app.get('/api/bookings', (req, res) => {
    res.json(readBookings());
});

app.listen(PORT, () => {
    console.log(`السيرفر شغال على http://localhost:${PORT}`);
});