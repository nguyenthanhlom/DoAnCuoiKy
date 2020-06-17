module.exports = function enSureLoggedIn(req, res, next){
    if(req.curentUser){
        next();
    }else{
        res.redirect('/');
    }
};