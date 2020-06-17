const User = require('../services/users');
const asyncHandler = require('express-async-handler');
const { Router } = require('express');

const router = new Router();

router.get('/', function getprofile(req, res, next) {
    res.render('changePassword');
});
router.post('/', asyncHandler(async function postProfile(req, res, next) {
    const user = await User.findUserByEMAIL(req.curentUser.email);
    const pass = User.hashPassword(req.body.password);
    await user.changePassword(pass);
    res.redirect('/profile');

}));

module.exports = router;