const express = require('express');
const path = require('path');
const app = express();
app.use(express.json());
app.use(express.static('public'));

// نخزن الحجوزات هنا مؤقتاً
let bookings = [];
// الأيام المحجوزة
let bookedDates = ['2026-05-10', '2026-05-15']; // أمثلة

// الباقات والأسعار بالجنيه
const packages = {
    economic: { name: 'اقتصادية', price: 1200000 },
    medium: { name: 'متوسطة', price: 3000000 },
    vip: { name: 'VIP', price: 6000000 }
};

// الخدمات الإضافية
const addons = {
    kosha: { name: 'كوشة وورد', price: 400000 },
    photo: { name: 'تصوير فوتو + فيديو', price: 350000 },
    buffet: { name: 'بوفيه مفتوح 100 شخص', price: 800000 },
    zaffa: { name: 'زفة + DJ', price: 250000 }
};

// API: يجيب الأيام المحجوزة للتقويم
app.get('/api/booked-dates', (req, res) => {
    res.json(bookedDates);
});

// API: يحسب الفاتورة
app.post('/api/calculate', (req, res) => {
    const { packageType, selectedAddons } = req.body;
    let total = packages[packageType].price;
    let details = [packages[packageType].name];

    selectedAddons.forEach(addon => {
        if (addons[addon]) {
            total += addons[addon].price;
            details.push(addons[addon].name);
        }
    });

    const deposit = total * 0.5; // 50% عربون
    res.json({ total, deposit, details });
});

// API: يستقبل الحجز الجديد
app.post('/api/book', (req, res) => {
    const { date, name, phone, packageType, selectedAddons, total, deposit } = req.body;

    // نتأكد اليوم ما محجوز
    if (bookedDates.includes(date)) {
        return res.status(400).send('اليوم دا محجوز للأسف');
    }

    const newBooking = {
        id: Date.now(),
        date, name, phone, packageType,
        selectedAddons, total, deposit,
        status: 'بانتظار العربون'
    };

    bookings.push(newBooking);
    bookedDates.push(date); // نقفل اليوم

    console.log('حجز جديد:', newBooking);
    res.status(201).send('تم استلام الحجز. ادفع العربون للتأكيد');
});

// API: لوحة التحكم - تشوف كل الحجوزات
app.get('/api/admin/bookings', (req, res) => {
    res.json(bookings);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`نظام الصالة شغال على ${PORT}`));
