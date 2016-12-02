const path = require('path');
const svelte = require('svelte');
// const debug = require('debug')('svelte-loader');

function hotTemplate(libPath, name, options) {
  return `
    if (module.hot) {
      (function (opts) {
        console.log('register for hot', ${libPath}, ${name}, opts);
        module.hot.accept(
          ${libPath},
          () => {
            ${name} = global.hotify(${name}, opts, require(${libPath}));
          }
        );
      })(${options});
    }
  `;
}

// Finds the component name used when importing the library, as it could have
// been mapped to something else in the `components` property
function findComponentName(code, name) {
  const mappingRegexp = new RegExp(
    `components: {[\\s\\S]+?${name}:\\s*(\\w+)[\\s\\S]+?}`,
    'm'
  );
  const mapping = code.match(mappingRegexp);
  if (mapping) return mapping[1];
  return name;
}

// Finds the path to the component source
function findLibPath(code, componentName) {
  const name = findComponentName(code, componentName);
  const libRegexp = new RegExp(`var ${name} = require\\( ([\\.\\/'"\\w]+) \\)`);
  const matches = code.match(libRegexp);
  if (!matches) return matches;
  return matches[1];
}

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
    /var\s+(\w+)\s*=\s*new\s+template\.components\.(\w+)\(([\s\S]+?)\);/gm,
    (match, p1, p2, p3) => {
      const libPath = findLibPath(code, p2);
      if (!libPath) return match;

      const prefix = hotTemplate(libPath, p1, p3.replace(/[\n\t]/g, ''));
      return `${match}\n${prefix}`;
    }
  );

  callback(null, code, result.map);
};
