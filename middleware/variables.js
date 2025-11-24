module.exports = function(req, res, next) {
    // Встановлюємо isAuthenticated для всіх шаблонів
    res.locals.isAuthenticated = req.session.isAuthenticated;
    
    // Встановлюємо змінну, щоб приховати navbar на сторінках входу/реєстрації
    // Ми використовуємо її в routes/auth.js: res.render('auth/login', { isAuthPage: true });
    res.locals.isAuthPage = req.url === '/login' || req.url === '/register';
    
    // Якщо користувач авторизований, зберігаємо його email
    if (req.session.user) {
        res.locals.userEmail = req.session.user.email;
    }
    
    next();
};