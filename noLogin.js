function noLogin(req, res, next) {
    const { useradmin, user } = res.locals;
    if (useradmin || user) return res.redirect('/');
    next();
}

module.exports = noLogin;