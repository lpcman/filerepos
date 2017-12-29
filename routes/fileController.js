const path = require('path');
const express = require('express');
const router = express.Router();

const S = require('../settings');
const FileModel = require('../dao/fileSchema');

router.get('/upload', function (req, res, next) {
    if(req.session.user.token === 'master88'){
        res.render('upload', { title: '文件上传' });
    } else {
        res.redirect(S.PROJECT_NAME + '/file/list');
    }
});

router.get('/list', function(req, res, next) {
    FileModel.find({}, function (err, files) {
        if (err) {
            res.status(err.status || 500);
            res.render('error');
        } else {
            res.render('filesList', {title: '文件列表', fileList: files});
        }
    }).sort( { createAt: -1 } );
});

router.get('/download/:file(*)', function(req, res, next){
    FileModel.findOne({ location: req.params.file }, function (err, file) {
        if (err) {
            // render the error page
            res.status(err.status || 500);
            res.render('error');
        } else {
            res.download(path.join(S.UPLOAD_DIR, req.params.file), file.filename,function (err) {
                if (!err) return; // file sent
                if (err && err.status !== 404) return next(err); // non-404 error
                // file for download not found
                res.statusCode = 404;
                res.send('Cant find that file, sorry!');
            });
        }
    });
});

module.exports = router;
