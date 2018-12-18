const Main = require('./libs/main');

// INPUT
const options = Main.DEFAULT_OPTIONS;

let seed = process.argv[2];
if (seed) {
  options.seed = parseInt(seed);
}

Main.run(options);
