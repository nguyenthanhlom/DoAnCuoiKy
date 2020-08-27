const usermodel = require('./../model/user');
async function authencationUser(req, res, next) {
    res.locals.user = null;
    res.locals.useradmin = null;

    let { user, useradmin } = req.session;
    if (user) {
        user = await usermodel.findByPk(user.id);
        res.locals.user = user;
    }
    console.log(useradmin);
    if (useradmin) {
        res.locals.useradmin = useradmin;
    }
    next();
}

module.exports = authencationUser;