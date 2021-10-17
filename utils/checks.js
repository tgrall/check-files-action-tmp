const core = require('@actions/core');
const fs = require("fs");


/** 
 * Check if file exists 
 * @todo: make this case insensitive.
 * **/
async function checkFileExistence(path) {
    return fs.promises.access(path, fs.constants.F_OK)
    .then(() => true)
    .catch(() => false)
  }


// create function that check the first line of a file
async function checkFirstLine(path, line) {
    return fs.promises.readFile(path, 'utf8')
    .then(data => {     
         return (data.startsWith("#"))    
    })
    .catch(err => {
        console.log(err);
        return false;
    });
}



module.exports = { checkFileExistence };