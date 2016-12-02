const path = require('path');
const svelte = require('svelte');
// const debug = require('debug')('svelte-loader');

module.exports = function svelteLoader(source) {
  if (this.cacheable) this.cacheable();

  const callback = this.async();
  const filename = this.resourcePath;
  const name = path.basename(filename).replace(path.extname(filename), '');

  const result = svelte.compile(source, {
    // filename,
    format: 'es',
    name,
    onerror: function onErrorCallback(err) {
      this.emitError(err.message);
    }.bind(this),
    onwarning: function onWarningCallback(warn) {
      this.emitWarn(warn.message);
    }.bind(this)
  });

  const code = result.code.replace(/var mainFragment =/, 'console.log(options); var mainFragment =');
  callback(null, code, result.map);
};
