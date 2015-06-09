function log(...args) {
    let concatedArgs = ['MUSIC MINE', ...args];

    console.log(...concatedArgs)
}

log.dir = function dir(...args) {
    let concatedArgs = ['MUSIC MINE', ...args];

    console.dir(...concatedArgs)
};


module.exports = log;

