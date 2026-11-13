const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ هنا هنحط الرابط بتاعك (شوفي الخطوة اللي تحت)
const MONGODB_URI = 'mongodb+srv://<sh1maaashour08_db_user>:<ZYy1pwrufobHoDyw>@cluster0.45onjik.mongodb.net/';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

const bookingSchema = new mongoose.Schema({
    name: String,
    phone: String,
    route: String,
    tripType: String,
    vehicleType: String,
    date: String,
    time: String,
    createdAt: { type: Date, default: Date.now }
});

const Booking = mongoose.model('Booking', bookingSchema);

app.post('/api/book', async (req, res) => {
    try {
        const newBooking = new Booking(req.body);
        await newBooking.save();
        res.status(201).json({ message: 'تم تسجيل الحجز بنجاح في قاعدة البيانات!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'حدث خطأ أثناء الحفظ' });
    }
});

app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في جلب البيانات' });
    }
});

app.listen(PORT, () => {
    console.log(`السيرفر شغال على http://localhost:${PORT}`);
});