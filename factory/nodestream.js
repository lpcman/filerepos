// Require the main Nodestream class
const Settings = require('../settings');
const Nodestream = require('nodestream');

module.exports = function getNodestreamInstance() {
    return new Nodestream({
        // This tells nodestream which storage mechanism it should interact with
        // Under the hood, it will try to require `nodestream-filesystem` module
        adapter: 'filesystem',
        // This object is always specific to your adapter of choice - always check
        // the documentation for that adapter for available options
        config: {
            // The `filesystem` adapter requires a `root` configuration option, so let's provide one
            root: [Settings.UPLOAD_DIR],
            flag: 'wx'
        }
    });
}