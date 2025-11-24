module.exports = function(req, res, next) {
    // Якщо користувач НЕ авторизований, перенаправляємо його на сторінку входу
    if (!req.session.isAuthenticated) {
        // Додайте перенаправлення
        return res.redirect('/login'); 
    }
    
    // Якщо користувач авторизований, дозволяємо йому продовжити
    next();
}