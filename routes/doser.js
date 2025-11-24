const {Router} = require('express')
const RadCoord = require('../models/models')
const router = Router()
const auth = require('../middleware/auth');
const authGuard = require('../middleware/auth-guard');


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

module.exports = router