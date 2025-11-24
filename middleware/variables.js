module.exports = function(req, res, next) {
    res.locals.isAuthenticated = req.session.isAuthenticated;
    res.locals.isAuthPage = req.url === '/login' || req.url === '/register';
    if (req.session.user) {
        res.locals.userEmail = req.session.user.email;
    }
    
    next();
};