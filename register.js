const { Router } = require('express');
const User = require('../services/users');
const { body, validationResult } = require('express-validator');
const asyncHandler = require('express-async-handler');
const Email = require('../services/email');
const crypto = require('crypto');

const router = new Router();

router.get('/', function getRefister(req, res, next) {
    res.render('register');
});

router.post('/', [
    body('email')
    .isEmail()
    .normalizeEmail()
    .custom(async function(email) {
        const found = await User.findUserByEMAIL(email);
        if (found) {
            throw Error('User exists');
        } else {
            return true;
        }
    }),
    body('displayName')
    .trim()
    .notEmpty(),
    body('password').isLength({ min: 6 })
], asyncHandler(async function(req, res, next) {

    const errors = validationResult(req);
    console.log(errors);
    if (!errors.isEmpty()) {
        return res.status(442).render('register', { errors })
    }

    const user = await User.create({
        email: req.body.email,
        displayName: req.body.displayName,
        password: User.hashPassword(req.body.password),
        token: crypto.randomBytes(3).toString('Hex').toUpperCase(),
    });
    await Email.send(user.email, 'Mã kích hoạt tài khoản', `http://localhost:3000/login/${user.id}/${user.token}`);
    res.redirect('/');
}));


module.exports = router;