module.exports=function logout(req,res){
    delete req.session.userId;
    delete req.session.todos;
    res.redirect('/');
}