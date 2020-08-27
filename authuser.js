function authencationAmin(req, res, next) {
    const { user } = res.locals;
    if (!user) return res.redirect('/');
    next();
}

module.exports = authencationAmin;