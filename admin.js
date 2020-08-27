var express = require('express');
var router = express.Router();
const admin = require('./../model/admin');
const user = require('./../model/user');
const asyncHandler = require('express-async-handler');
const authadmin = require('./../middlewares/authadmin');
const noLg = require('./../middlewares/noLogin');

/* GET users listing. */
router.get('/', noLg, function (req, res, next) {
  res.render('adminlogin');
});

router.get('/index', authadmin, asyncHandler(async (req, res, next) => {
  const listuser = await user.findUserWaiting(-1);
  res.render('adminindex', { count: listuser.length, p: null });
}));

router.get('/waiting', authadmin, asyncHandler(async (req, res, next) => {
  const listuser = await user.findUserWaiting(-1);
  res.render('waiting', { listuser });
}));

router.get('/profile/:id', authadmin, asyncHandler(async (req, res, next) => {
  let { id } = req.params;
  var finduser = null;
  try {
    id = parseInt(id);
    finduser = await user.findByPk(id);
  } catch (error) {
    console.log(error);
  }
  console.log(finduser);
  res.render('profile', { finduser });
}));

router.post('/profile', authadmin, asyncHandler(async (req, res, next) => {
  let { name, email, cmnd, password, limit, status, id } = req.body;
  var finduser = await user.findByPk(id);
  if (!finduser) return res.redirect('error');
  if (password.length <= 0) {
    await user.updateUsernotPassword(id, name, email, cmnd, limit, status);
  }
  else {
    await user.updateUser(id, name, email, cmnd, limit, status, password);
  }
  res.redirect(`/admin/profile/${id}`);
}));


router.post('/seach', authadmin, asyncHandler(async (req, res, next) => {
  let { value } = req.body;
  const p = await user.findUserbyidorcmnd(value);
  const listuser = await user.findUserWaiting(-1);
  if (!p) {
    return res.redirect("/admin/index");
  }
  res.render('adminindex', { count: listuser.length, p });
}));

router.post('/payin', authadmin, asyncHandler(async (req, res, next) => {
  let { id, money } = req.body;
  money = parseInt(money);
  var finduser = await user.findByPk(id);
  console.log(money);
  console.log(parseInt(finduser.acblan));
  if (!finduser) return res.redirect('error');
  if (parseInt(money) <= 0) return res.redirect('error');
  money = money + parseInt(finduser.acblan);

  await user.updateMoney(id, money)
  res.redirect(`/admin/profile/${id}`);
}));

router.post('/', asyncHandler(async (req, res, next) => {
  let { username, password } = req.body;
  const find = await admin.findAdmin(username);
  if (!find || !admin.comparePassword(password, find.password)) {
    return res.redirect('/admin');
  }
  req.session.useradmin = find;
  res.redirect('/admin/index');
}));

router.get('/logout', authadmin, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/admin');
  })
})

module.exports = router;
