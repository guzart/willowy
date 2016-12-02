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
    format: 'cjs',
    name,
    onerror: function onErrorCallback(err) {
      this.emitError(err.message);
    }.bind(this),
    onwarning: function onWarningCallback(warn) {
      this.emitWarn(warn.message);
    }.bind(this)
  });

  let code = result.code;
  code = code.replace(
    /var\s+(\w+)\s*=\s*new\s+template\.components\.(\w+)\([\s\S]+?\);/gm,
    (match, p1, p2) => {
      // const libRegex = new RegExp(`import ${p2} from ([\\.\\/'"\\w]+)`);
      const libRegex = new RegExp(`var ${p2} = require\\( ([\\.\\/'"\\w]+) \\)`);
      let libPath = code.match(libRegex);
      if (!libPath) return match;
      libPath = libPath[1];
      const prefix = `if (module.hot) module.hot.accept(${libPath}, () => { ${p1} = global.hotify(${p1}, target, require(${libPath})) });`;
      return `${match}\n${prefix}`;
    }
  );

  callback(null, code, result.map);
};
