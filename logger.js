const util = require("util");
const Logger = require("@ptkdev/logger");
const options = {
  language: "en",
  colors: true,
  debug: true,
  info: true,
  warning: true,
  error: true,
  sponsor: true,
  write: true,
  type: "log",
  rotate: {
    size: "10M",
    encoding: "utf8",
  },
  path: {
    // remember: add string *.log to .gitignore
    debug_log: "./debug.log",
    error_log: "./errors.log",
  },
};
const logger = new Logger(options);
const DebugObject = (obj, depth = null) => {
  logger.debug("Debug object");
  console.log(util.inspect(obj, { showHidden: false, depth: depth, colors: true }));
}

module.exports = {
    DebugObject,
    logger
}