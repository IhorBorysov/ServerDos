module.exports = function(req, res, next) {
    // Робить статус авторизації доступним для Handlebars як {{isAuth}}
    res.locals.isAuth = req.session.isAuthenticated;
    
    // Робить об'єкт користувача доступним як {{user}} (для відображення імені тощо)
    res.locals.user = req.session.user; 

    next();
};