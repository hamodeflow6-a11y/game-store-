const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 10000;

let orders = [];

app.use(express.json());
app.use(express.static('public'));

app.post('/api/order', (req, res) => {
    const { game, playerId, amount, whatsapp } = req.body;
    
    const newOrder = {
        id: orders.length + 1,
        game,
        player_id: playerId,
        amount,
        whatsapp,
        created_at: new Date()
    };
    
    orders.unshift(newOrder);
    res.json({ success: true, message: 'تم استلام الطلب' });
});

app.get('/api/orders', (req, res) => {
    res.json(orders);
});

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
});
