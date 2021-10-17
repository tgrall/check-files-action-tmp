const core = require('@actions/core');
const fs = require("fs");


/** Check if file exists **/
async function checkFileExistence(path) {
    return fs.promises.access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
  }



module.exports = { checkFileExistence };