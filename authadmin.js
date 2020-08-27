function authencationAmin(req, res, next) {
    const { useradmin } = res.locals;
    if (!useradmin) return res.redirect('/');
    next();
}

module.exports = authencationAmin;