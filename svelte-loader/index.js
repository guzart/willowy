const path = require('path');
const svelte = require('svelte');
const debug = require('debug')('svelte-loader');

function getFormat(target) {
  if (target === 'web') {
    return 'cjs'; // amd umd
  }

  return 'cjs';
}

module.exports = function svelteLoader(source) {
  if (this.cacheable) this.cacheable();

  const callback = this.async();
  const filename = this.resourcePath;
  const name = path.basename(filename).replace(path.extname(filename), '');

  const format = getFormat(this.target);
  const result = svelte.compile(source, {
    // filename,
    format,
    name,
    onerror: function(err) {
      this.emitError(err.string);
    }.bind(this),
    onwarning: function(warn) {
      this.emitWarn(warn.string);
    }.bind(this),
  });

  callback(null, result.code, result.map);
};
