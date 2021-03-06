const User=require('../services/users');
const asyncHandler = require('express-async-handler');
const {Router}= require('express');

const router=new Router();

router.get ('/', function getprofile(req, res, next){
    res.render('changeDisplayname');
});
router.post ('/', asyncHandler(async function postProfile(req, res, next){
    const user= await User.findUserByEMAIL(req.curentUser.email);
    console.log(user);
    console.log(req.body.displayName);
    await user.changeDisplayName(req.body.displayName);
    res.redirect('/profile');
}));

module.exports=router;