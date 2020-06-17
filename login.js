const { Router } = require('express');
const User = require('../services/user');
const asyncHandler = require('express-async-handler');

const router = new Router();

router.get('/',function getLogin(req, res){
    res.render('login');
});

router.post('/', asyncHandler( async function postLogin(req, res){
    const user = await User.findByEmail(req.body.email);
    // ko tim thay user hoac mk sai thi hien tai trang login
    if (!user || !User.verifyPassword(req.body.password, user.password)){
        return res.render('login');
    }
    req.session.userId = user.id;
    res.redirect('/');
    
}));

router.get('/:id/:token',asyncHandler(async function (req,res){
    const { id, token}=req.params;
    const user =await User.findById(id);
    if(user && user.token===token){
        user.token=null;
        user.save();
        req.session.userId=user.id;
    }
    res.redirect('/');
}))
module.exports = router;