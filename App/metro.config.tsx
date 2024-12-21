const path = require('path');

module.exports = {
  projectRoot: __dirname + '/App/src',
  resolver: {
    blacklistRE: /node_modules\/.*/,  // Exclude node_modules from being watched
  },
  watchFolders: [
    path.resolve(__dirname),  // Watch only the 'app' directory or other critical folders
  ],
};