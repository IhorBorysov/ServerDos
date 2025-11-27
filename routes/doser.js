const {Router} = require('express')
const RadCoord = require('../models/models')
const router = Router()
const auth = require('../middleware/auth');
const authGuard = require('../middleware/auth-guard');

router.get('/api/doser-data', async (req, res) => {
    try {
        const dataFromDB = await RadCoord.find({})
            .select('longitude latitude radiation timestamp')
            .lean();

        const transformedData = dataFromDB.map(item => ({
            id: item._id,
            lat: item.latitude,
            lon: item.longitude,
            radiationLevel: item.radiation,
            title: `Рівень: ${item.radiation} мкЗв/год`,
            timestamp: item.timestamp,
        }));

        res.status(200).json(transformedData);

    } catch (e) {
        console.error('Помилка отримання даних:', e);
        res.status(500).json({ message: 'Помилка сервера', error: e.message });
    }
});

router.get('/', auth, authGuard, async (req, res) => { 
    const radCoord = await RadCoord.find({}).sort({ timestamp: -1 }).lean();
    res.render('index',{
        title: 'radCoord list',
        isIndex: true,
        radCoord
    });
});

router.get('/create', authGuard, auth, (req, res) => {
    res.render('create',{
        title: 'create radCoord',
        isCreate: true
    })
})

router.post('/create', authGuard, auth, async (req,res) =>{
    const { longitude, latitude, radiation, timestamp } = req.body;

    console.log('Отримані дані:', req.body);
    
    const radCoord = new RadCoord({
        longitude, 
        latitude, 
        radiation,
        timestamp: new Date(timestamp) 
    });
    
    await radCoord.save();
    res.redirect('/');
});

router.post('/delete', authGuard, auth, async (req, res) => {
    try {
        const radCoordId = req.body.id;
        await RadCoord.findByIdAndDelete(radCoordId);
        res.redirect('/');
    } catch (e) {
        console.error('Помилка при видаленні RadCoord:', e);
        res.redirect('/');
    }
});

router.post('/api/sim800', async (req, res) => {
    try {
        const { longitude, latitude, radiation } = req.body;

        console.log('Отримано дані від SIM800:', req.body);

        if (!longitude || !latitude || !radiation) {
            return res.status(400).json({ message: 'Некоректні дані' });
        }

        const radCoord = new RadCoord({
            longitude,
            latitude,
            radiation,
            timestamp: new Date()
        });

        await radCoord.save();

        res.status(200).send('OK');
    } catch (e) {
        console.error('Помилка SIM800:', e);
        res.status(500).send('ERROR');
    }
});

module.exports = router