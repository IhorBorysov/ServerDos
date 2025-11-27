const { Router } = require('express');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

const authGuard = require('../middleware/auth-guard');
const guestGuard = require('../middleware/guest-guard');
const router = Router();


const jwt = require('jsonwebtoken');
const JWT_SECRET = '123456'; 

router.post('/api/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Невірний email або пароль' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Невірний email або пароль' });
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1d' });

        res.status(200).json({
            token,
            userId: user._id,
            email: user.email
        });
    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

router.post('/api/register', async (req, res) => {
    try {
        const { email, password, confirm } = req.body;

        if (password !== confirm) {
            return res.status(400).json({ message: 'Паролі не збігаються' });
        }

        const exists = await User.findOne({ email });
        if (exists) {
            return res.status(400).json({ message: 'Email вже зайнятий' });
        }

        const hashed = await bcrypt.hash(password, 10);

        const user = new User({ email, password: hashed });
        await user.save();

        res.status(201).json({ message: 'Користувач створений' });

    } catch (e) {
        console.error(e);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});


router.get('/register', guestGuard, (req, res) => {
    res.render('auth/register', {
        title: 'Реєстрація',
        isRegister: true,
        isAuthPage: true
    });
});

router.get('/login', guestGuard, (req, res) => {
    res.render('auth/login', {
        title: 'Авторизація',
        isLogin: true,
        isAuthPage: true
    });
});


router.post('/register', guestGuard, async (req, res) => {
    try {
        const { email, password, confirm } = req.body;
        
        if (password !== confirm) {
            console.log('Помилка реєстрації: Паролі не збігаються');
            return res.redirect('/register'); 
        }

        const candidate = await User.findOne({ email });

        if (candidate) {
            console.log('Помилка реєстрації: Користувач з таким email вже існує');
            return res.redirect('/login'); 
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword });
        await user.save();
        res.redirect('/login');

    } catch (e) {
        console.error('Помилка реєстрації:', e);
        res.redirect('/register');
    }
});


router.post('/login', guestGuard, async (req, res) => {
    try {
        const { email } = req.body;
        
        console.log('--- Спроба входу (СПРОЩЕНО) ---');
        console.log('Введений Email:', email)
        const user = await User.findOne({ email }).lean()
        
        if (!user) {
            console.log('Користувача не знайдено');
            return res.redirect('/login');
        }

        console.log('Користувача знайдено. АВТОРИЗАЦІЯ УСПІШНА');
        
        req.session.isAuthenticated = true
        req.session.user = user
        req.session.save(err => {
            if (err) throw err;
            res.redirect('/');
        });

    } catch (e) {
        console.error('КРИТИЧНА ПОМИЛКА ПРИ ВХОДІ (СПРОЩЕНО):', e);
        res.redirect('/login');
    }
});


router.post('/logout', (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login');
    });
});

module.exports = router;