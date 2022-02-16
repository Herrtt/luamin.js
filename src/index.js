const luamin = require('./luamin')

exports.Beautify = (Src, Options) => {
  const Minified = luamin.Minify(Src, Options)
  return luamin.Beautify(Minified, Options)
}
exports.Minify = luamin.Minify
exports.Uglify = luamin.Uglify