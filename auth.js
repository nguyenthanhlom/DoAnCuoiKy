const User=require('../services/users');
const asyncHandler = require('express-async-handler');

module.exports =asyncHandler( async function auth(req, res, next) {
    const userId= req.session.userId;
    res.locals.curentUser=null; 
    if(!userId){
        return next();
    }
    const user = await User.findUserById(userId);
    if(!user){
        return next();
    }
    console.log(user);
    req.curentUser=user;
    res.locals.curentUser = user;
    next();
});