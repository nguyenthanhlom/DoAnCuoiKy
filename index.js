const Article = require('../services/article');
const asyncHandler = require('express-async-handler');
module.exports = asyncHandler ( async function index(req, res) {
    req.session.views = (req.session.views || 0) + 1;
    const load = await Article.finfdAllArticle();
    res.render('index', { views: req.session.views,load });
});