var express = require('express');
var router = express.Router();
const user = require('./../model/user');
const transac = require('./../model/transac');
const save = require('./../model/save');
const asyncHandler = require('express-async-handler');
const multer = require('multer');
const { sendMail } = require('./../services/sendMail');
const random = require('random');
const authuser = require('./../middlewares/authuser');
const noLg = require('./../middlewares/noLogin');

router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/register', noLg, function (req, res, next) {
  res.render('register', { title: 'Express' });
});

router.get('/login', noLg, function (req, res, next) {
  res.render('login', { title: 'Express' });
});

router.post('/login', noLg, asyncHandler(async (req, res, next) => {
  let { email, password } = req.body;
  const emailExist = await user.findUserbyEmail(email);
  console.log(emailExist);
  if (!emailExist || !user.comparePassword(password, emailExist.password)) return res.redirect('/login');
  req.session.user = emailExist;
  res.redirect('/');
}));

router.post('/register', noLg, asyncHandler(async (req, res, next) => {
  let { username, email, password, cmnd } = req.body;
  const emailExist = await user.findUserbyEmail(email);
  if (emailExist) return res.redirect('/register');
  const cmndExist = await user.findUserbyCMND(cmnd);
  if (cmndExist) return res.redirect('/register');
  await user.createUser(username, email, password, cmnd).then((res) => {
    req.session.user = res;
  });
  res.redirect('/');
}));


//router.use(authuser);

router.get('/verify', authuser, function (req, res, next) {
  res.render('verify', { title: 'Express' });
});



var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  }
})

var upload = multer({ storage: storage });

var cpUpload = upload.fields([{ name: 'image1', maxCount: 1 }, { name: 'image2', maxCount: 8 }]);

router.post('/verify', authuser, cpUpload, asyncHandler(async (req, res, next) => {
  let img1 = req.files['image1'][0];
  let img2 = req.files['image2'][0];
  let { id } = res.locals.user;
  await user.updateVerify(id, img1.filename, img2.filename);
  res.locals.user.status = -1;
  res.redirect('/');
}));

router.get('/transfermoney', authuser, (req, res) => {
  res.render('transfermoney', { error: null });
});


const axios = require('axios');
router.get('/transferinter', authuser, asyncHandler(async (req, res) => {
  var findBankInter = [], error = null;

  findBankInter = await axios({
    method: 'post',
    url: 'https://apiweb243.herokuapp.com/getAllbank',
    headers: {
      "bankname": "SIMPLE",
      "password": "123456"
    }
  });
  if (findBankInter.status !== 200) {
    error = "Cannot quest bank!";
    findBankInter = [];
  }
  else {
    if (findBankInter.data.statusCode !== 200) {
      error = findBankInter.data.error;
      findBankInter = [];
    }
    else {
      findBankInter = findBankInter.data.arrbank;
    }
  }
  error = req.flash("error");
  res.render('transferinter', { error, findBankInter });
}));

router.post('/transferinter', authuser, asyncHandler(async (req, res) => {
  //code behind here
  let { id, money, selectbank, content } = req.body;
  if (!id || !money || !selectbank) {
    req.flash("error", "Thông tin nhập chưa đầy đủ!");
    return res.redirect("/transferinter");
  }

  if (parseInt(money) < 1000) {
    req.flash("error", "Số tiền nhập vào phải lớn hơn 1000 VND!");
    return res.redirect("/transferinter");
  }
  if (parseInt(money) > res.locals.user.acblan) {
    req.flash("error", "Số dư trong tài khoản bạn không đủ!");
    return res.redirect("/transferinter");
  }
  var findUser = null;
  findUser = await axios({
    method: 'post',
    url: 'https://apiweb243.herokuapp.com/finduserinbank',
    data: {
      bankuser: "SIMPLE",
      password: "123456"
    },
    headers: {
      bankname: selectbank,
      iduser: id

    }
  });
  if (findUser.status !== 200) {
    req.flash("error", "Có lỗi xảy ra khi lấy thông tin!");
    return res.redirect("/transferinter");
  }
  else {
    if (findUser.data.statusCode !== 200) {
      req.flash("error", findUser.data.error);
      return res.redirect("/transferinter");
    }
    else {
      var gettoken = null;
      gettoken = await axios({
        method: 'post',
        url: 'https://apiweb243.herokuapp.com/sign',
        data: {
          bankname: "SIMPLE",
          password: "123456"
        },
        headers: {
          bankselect: selectbank,
          idselect: id
        }
      });
      if (gettoken.status !== 200) {
        req.flash("error", "Có lỗi xảy ra khi lấy thông tin!");
        return res.redirect("/transferinter");
      }

      if (gettoken.data.statusCode !== 200) {
        req.flash("error", gettoken.data.error);
        return res.redirect("/transferinter");
      }

      const token = random.int(min = 1000, max = 100000);
      const createtran = await transac.createTransacInter(res.locals.user.id, findUser.data.us.stk, 0, money, token, selectbank);
      await sendMail(res.locals.user.email, 'Xác thực chuyển tiền', ` Mã xác nhận cho giao dịch chuyển tiền là ${token}`);
      res.render('verifytransac', { createtran, error: null, infoverify: gettoken.data });
    }
  }

}));


router.post('/transfermoney', authuser, asyncHandler(async (req, res) => {
  let { id, money } = req.body;
  let idsend = res.locals.user.id;
  let email = res.locals.user.email;
  let acblan = res.locals.user.acblan;
  let error;
  id = parseInt(id);
  const finduser = await user.findByPk(id);
  console.log(finduser);
  if (!finduser) {
    error = 'Không tìm thấy tài khoản này!!';
    return res.render('transfermoney', { error });
  }
  if (finduser.id === idsend) {
    error = 'Bạn không thể tự chuyển tiền cho bạn!';
    return res.render('transfermoney', { error });
  }
  if (parseInt(money) < 1000) {
    error = 'Số tiền nhập vào phải lớn hơn 1000 VND!';
    return res.render('transfermoney', { error });
  }
  if (parseInt(money) > acblan) {
    error = 'Số dư trong tài khoản bạn không đủ!';
    return res.render('transfermoney', { error });
  }
  const token = random.int(min = 1000, max = 100000);
  const createtran = await transac.createTransac(idsend, finduser.id, 0, money, token);
  await sendMail(email, 'Xác thực chuyển tiền', ` Mã xác nhận cho giao dịch chuyển tiền là ${token}`);
  res.render('verifytransac', { createtran, error: null });
}));

router.post("/transfermoney/verify", authuser, asyncHandler(async (req, res) => {
  let { id, token, tokenauth, privateKey } = req.body;
  console.log(req.body);
  let { acblan } = res.locals.user;
  let iduser = res.locals.user.id;
  const find = await transac.findByPk(id);
  if (!find) return res.redirect('/error');
  if (find.idsend != iduser) return res.redirect('/error');
  if (parseInt(token) !== parseInt(find.token)) {
    return res.render('verifytransac', { createtran: find, error: 'Mã xác nhận không đúng vui lòng kiểm tra lại!' });
  }
  if (find.bank != "SIMPLE") {
    let verifytoken = await axios({
      method: 'post',
      url: 'https://apiweb243.herokuapp.com/verify',
      data: {
        "money": find.money,
        "content": "Chuyển tiền từ ngân hàng SIMPLE",
        "idsend": iduser,
        "idrecive": find.idrecive,
        "bankselect": find.bank,
        "privateKey": privateKey,
        "bankname": "SIMPLE"
      },
      headers: {
        token: tokenauth
      }
    });

    console.log(verifytoken);

    if (verifytoken.status !== 200) {
      return res.redirect("/error");
    }
    if (verifytoken.data.statusCode !== 200) {
      return res.redirect("/error");
    }
    await transac.updateToken(id);
    let mnsend = parseInt(acblan) - parseInt(find.money);
    await user.updateMoney(iduser, mnsend);
    res.locals.user.money = mnsend;
    return res.redirect(`/bill/${id}`);
  }
  await transac.updateToken(id);
  let mnsend = parseInt(acblan) - parseInt(find.money);
  await user.updateMoney(iduser, mnsend);
  res.locals.user.money = mnsend;
  const findrv = await user.findByPk(find.idrecive);
  if (!findrv) return res.redirect('/error');
  let mnrecive = parseInt(findrv.acblan) + parseInt(find.money);
  await user.updateMoney(findrv.id, mnrecive);
  return res.redirect(`/bill/${id}`);
}));

router.get('/bill/:id', authuser, asyncHandler(async (req, res) => {
  let { id } = req.params;
  let { user } = res.locals;
  console.log(id);
  console.log(user.id);
  const find = await transac.findTran(id, user.id);
  console.log(find);
  res.render('bill', { find });
}));

router.get('/listtransfermoney', authuser, asyncHandler(async (req, res) => {
  let { user } = res.locals;
  const getallTran = await transac.getAllTran(user.id);
  res.render('listtransfermoney', { getallTran });
}));

router.get('/save', asyncHandler(async (req, res) => {

  res.render('save', { error: null });
}));

router.post('/save', authuser, asyncHandler(async (req, res) => {
  let { moneysend, month } = req.body;
  let { acblan, id } = res.locals.user;
  month = parseInt(month);
  let error = null;
  if (month != 1 && month != 3 && month != 6 && month != 12) {
    return res.redirect('/error');
  }
  try {
    moneysend = parseInt(moneysend);
  }
  catch (e) {
    return res.redirect('/error');
  }
  if (moneysend > acblan) {
    error = 'Tài khoản bạn không đủ tiền!';
    return res.render('save', { error });
  }
  if (5000 > moneysend) {
    error = 'Tài khoản tiết kiệm phải ít nhất 5000VND!';
    return res.render('save', { error });
  }
  let percent = 0;
  switch (month) {
    case 1:
      percent = 3
      break;
    case 3:
      percent = 3.15
      break;
    case 6:
      percent = 6
      break;
    case 12:
      percent = 6.15
      break;
    default: break
  }
  var date = new Date();
  var dayend = new Date(date.setMonth(date.getMonth() + month));

  const saving = await save.createSave(id, moneysend, month, percent, dayend);
  let submn = parseInt(acblan) - moneysend;
  await user.updateMoney(id, submn);
  res.locals.user.money = submn;
  res.redirect(`/detailsave/${saving.id}`);
}));


router.get('/listsave', authuser, asyncHandler(async (req, res) => {
  let { user } = res.locals;
  const list = await save.getAllSave(user.id);
  console.log(list);
  res.render('listsave', { list });
}));

router.get('/detailsave/:id', authuser, asyncHandler(async (req, res) => {
  let { id } = req.params;
  let { user } = res.locals;
  let totalmn = null;
  var find = await save.findSave(id);
  if (!find || find.idsend !== user.id) {
    find = null;
  }
  else {
    totalmn = parseInt(find.moneysend) + parseInt(find.moneysend * find.percent / 100);
  }
  res.render('detailsave', { find, totalmn });
}));


router.get('/logout', authuser, (req, res) => {
  req.session.destroy(() => {
    res.redirect('/');
  });
})

module.exports = router;
