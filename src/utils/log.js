const fs = require('fs')
const path = require('path')

function writeLog(writeStream, log) {
    writeStream.write(log+'\n')
}

function createWriteStream(filename) {
    const fullFileName = path.resolve(__dirname,'../','../','logs',filename)
    return fs.createWriteStream(fullFileName,{
        flags:'a'
    })
}
const accessWriteStream  = createWriteStream('access.log')

const access = (log) => {
    writeLog(accessWriteStream, log)
}

module.exports = {
    access
}