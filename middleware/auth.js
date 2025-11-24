module.exports = function(req, res, next) {
    // 💡 Це значення має бути 'true' після успішного входу
    res.locals.isAuth = req.session.isAuthenticated; 
    
    // (Необов'язково, але корисно)
    res.locals.user = req.session.user; 

    next();
};