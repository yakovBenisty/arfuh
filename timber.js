const { Timber } = require("@timberio/node");

const timber = new Timber("without Token by purpose", "22115", {ignoreExceptions: true});
timber.pipe(process.stdout);


exports.timber = timber;