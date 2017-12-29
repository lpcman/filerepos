const express = require('express');
const router = express.Router();
const multiparty = require('multiparty');
const checksum = require('nodestream-transform-checksum');
const moment = require('moment');
const S = require('../settings');
const nodestream = new (require('../factory/nodestream'))();
const FileModel = require('../dao/fileSchema');

nodestream.registerTransform('checksum');
nodestream.registerTransform(checksum);
const pipeline = nodestream.pipeline();
pipeline.use('checksum', {algorithm: 'md5'});

// json response
router.post('/upload', function (req, res, next) {
    let form = new multiparty.Form();
    let uploadFile = {
        userId: req.session.user.userId,
        desc: '',
        tag: '',
        checksum: '',
        location: '',
        filename: '',
        createAt: moment(new Date(), "YYYY-MM-DD HH:mm:ss")
    };

    form.on('error', function (err) {
        console.log('Error parsing form: ' + err.stack);
        res.send({code: err.statusCode, msg: err.statusCode});
    });
    form.on('field', function (field, value) {
        console.log('got field named ' + field + ": ", value);
        uploadFile[field] = value;
    });
    // Parts are emitted when parsing the form
    form.on('part', function (part) {
        if (part.filename) {
            // filename is defined when this is a file
            console.log('got file named ' + part.name);
            let writeFilePromise = pipeline.upload(part);
            writeFilePromise.then(results => {
                uploadFile.filename = part.filename;
                uploadFile.checksum = results.checksum.value;
                uploadFile.location = results.location;

                let fileSavePromise = new FileModel(uploadFile).save();
                fileSavePromise.then(re => {
                    if (re.errors) {
                        console.log(err);
                        res.send({code: re.errors, msg: re.errors});
                    } else {
                        console.log(results);
                        res.send({
                            code: '200',
                            msg: '',
                            data: uploadFile
                        });
                    }
                });
            }).catch(err => {
                res.send({code: err.statusCode, msg: err.statusCode});
            });
        }
        part.on('error', function (err) {
            console.log('Upload fail!');
            res.send({code: err.statusCode, msg: err.statusCode});
        });
    });
    // Close emitted after form parsed
    form.on('close', function () {
        console.log('Upload completed!');
    });
    form.parse(req);
});

module.exports = router;