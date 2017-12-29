const express = require('express');
const router = express.Router();
const hash = require('pbkdf2-password')();
const moment = require('moment');
const S = require('../settings');
const UserModel = require('../dao/userSchema');

router.get('/', function (req, res) {
    res.redirect(S.PROJECT_NAME + '/login');
});

router.get('/login', function (req, res) {
    res.render('login', {title: '登录'});
});

router.post('/login', function (req, res) {

    let username = req.body.username,
        password = req.body.password;

    if (!module.parent)
        console.log('authenticating %s:%s', name, pass);

    let userFindPromise = UserModel.findOne({ userId: username});
    userFindPromise.then(function (user) {
        if (!user) {
            req.session.error = '用户不存在';
            res.redirect(S.PROJECT_NAME + '/login');
        } else {
            hash({password: password, salt: user.salt}, function (err, pass, salt, hash) {
                if (err) {
                    req.session.error = '服务器HASH错误！';
                    res.redirect(S.PROJECT_NAME + '/login');
                }
                if (hash === user.password) {
                    req.session.regenerate(function () {
                        req.session.user = user;
                        res.redirect(S.PROJECT_NAME + '/file/list');
                    });
                } else {
                    req.session.error = '认证失败，请检查用户名或密码';
                    res.redirect(S.PROJECT_NAME + '/login');
                }
            });
        }
    }, function (err) {
        // render the error page
        res.status(err.status || 500);
        res.render('error', {title: '错误'});
    });
});

router.get('/logout', function (req, res) {
    // destroy the user's session to log them out
    // will be re-created next request
    req.session.destroy(function () {
        res.redirect(S.PROJECT_NAME + '/');
    });
});

router.get('/register', function (req, res) {
    res.render('register', {title: '用户注册'});
});

router.post('/register', function (req, res) {

    let username = req.body.username,
        password = req.body.password,
        repeatPassword = req.body.repeatPassword,
        token = req.body.token;

    if(token !== 'guest88' && token !== 'cmcm88' ){
        req.session.error = '请输入正确的口令！';
        res.redirect(S.PROJECT_NAME + '/register');
        return;
    }

    if (password !== repeatPassword) {
        req.session.error = '两次输入密码不一致';
        res.redirect(S.PROJECT_NAME + '/register');
        return;
    }

    let userFindPromise = UserModel.findOne({userId: username});

    userFindPromise.then(function (user) {
        if (user) {
            req.session.error = '已经存在该用户';
            res.redirect(S.PROJECT_NAME + '/register');
        }
    }, function (err) {
        req.session.error = '用户名校验出错！';
        res.redirect(S.PROJECT_NAME + '/register');
    }).then(function () {
        let salt = Math.random().toString(36).substring(7);
        hash({password: password, salt: salt}, function (err, pass, salt, hash) {
            if (err) {
                req.session.error = '服务器HASH错误！';
                res.redirect(S.PROJECT_NAME + '/register');
            }

            let userSavePromise = new UserModel({
                userId: username,
                password: hash,
                salt: salt,
                token: token,
                createAt: moment(new Date(), "YYYY-MM-DD HH:mm:ss")
            }).save();

            userSavePromise.then(re => {
                if (re.errors) {
                    req.session.error = '注册失败，数据库写入错误！';
                    res.redirect(S.PROJECT_NAME + '/register');
                } else {
                    res.redirect(S.PROJECT_NAME + '/login');
                }
            });
        });
    });
});

module.exports = router;
