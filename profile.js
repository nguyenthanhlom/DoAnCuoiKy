module.exports = function profile(req, res){
    if(req.curentUser){
         res.render('profile');
    }else{
        res.redirect('/login');
    }
}