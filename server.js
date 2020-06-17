const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const db = require('./services/db');
const bodyParser = require('body-parser');

const cookieSession = require('cookie-session')


app.use(cookieSession({
    name: 'session',
    keys: ['123456'],
    maxAge: 24 * 60 * 60 * 1000,
}));

app.use(require('./middlewares/auth'));
app.set('views', './views');
app.set('view engine', 'ejs');



app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));



app.get('/', require('./routes/index'));
app.use('/login', require('./routes/login'));
app.use('/register', require('./routes/register'));
app.get('/logout', require('./routes/logout'));
app.get('/profile', require('./routes/profile'));
app.use('/changeDisplayname', require('./routes/changeDisplayname'));
app.use('/changePassword', require('./routes/changePassword'));
app.use('/questions', require('./routes/questions'));


db.sync().then(function() {
    app.listen(port, () => console.log(`Example app listening on port ${port}!`));
}).catch(function(err) {
    console.error(err);
});