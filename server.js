
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// ⚠️⚠️ هنا هنحط الرابط الجديد (اللي بيبدأ بـ mongodb:// وليس mongodb+srv://)
const MONGODB_URI = 'mongodb://shimaaashour08_db_user:shimaa123@ac-jgi0ffc-shard-00-00.45onjik.mongodb.net:27017,ac-jgi0ffc-shard-00-01.45onjik.mongodb.net:27017,ac-jgi0ffc-shard-00-02.45onjik.mongodb.net:27017/?ssl=true&replicaSet=atlas-8djpzn-shard-0&authSource=admin';

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

// استقبال حجز جديد
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

// عرض الحجوزات
app.get('/api/bookings', async (req, res) => {
    try {
        const bookings = await Booking.find().sort({ createdAt: -1 });
        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: 'حدث خطأ في جلب البيانات' });
    }
});

// التشغيل على Railway
app.listen(PORT, '0.0.0.0', () => {
    console.log(`السيرفر شغال على بورت ${PORT}`);
});