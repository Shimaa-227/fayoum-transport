const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️ استبدلي الرابط اللي تحت ده بالرابط بتاعك من MongoDB
// (الرابط ده هو اللي إنتي عملتيه في الخطوات اللي فاتت)
const MONGODB_URI = 'mongodb+srv://<sh1maaashour08_db_user>:<ZYy1pwrufobHoDyw>@cluster0.45onjik.mongodb.net/';

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// الاتصال بقاعدة البيانات
mongoose.connect(MONGODB_URI)
    .then(() => console.log('✅ Connected to MongoDB Atlas'))
    .catch(err => console.error('❌ MongoDB Connection Error:', err));

// تعريف شكل البيانات
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

// API: استقبال حجز جديد
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

// API: عرض الحجوزات
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في جلب البيانات' });
    }
});

// ⚠️ أهم سطر عشان Railway يشتغل: ضفنا '0.0.0.0'
app.listen(PORT, '0.0.0.0', () => {
    console.log(`السيرفر شغال على بورت ${PORT}`);
});