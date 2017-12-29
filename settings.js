module.exports = {
    PROJECT_DIR : __dirname,
    PORT: 3002,
    UPLOAD_MAX_FILE_SIZE: 40, //MB
    // UPLOAD_DIR: 'd:/nodejs/storage', //MB
    UPLOAD_DIR: '/usr/local/storage', //MB
    PROJECT_NAME: '/pluginstorage',
    // PROJECT_NAME: '',
    // STATIC_PREFIX: '/staticfile',
    STATIC_PREFIX: '',
    DB_PATH: 'mongodb://localhost:27017/filestorage'
};
