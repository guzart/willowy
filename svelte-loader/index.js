const path = require('path');
const svelte = require('svelte');
// const debug = require('debug')('svelte-loader');

// TODO: Some elements depend on the order in which they are bound,
// so reinitializing the instance only will append to the parent and lose their position
//
// A better approach might be to:
// 1. module.hot.accept all dependencies listed in { components: ... }
// 2. patch template.components.Component = require('...') and
// 3. teardown only the mainFragment
// 4. trigger a mainFragment = renderMainFragment(root, component, target)
//
// but we still need a way to store/restore the children state that are created inside
// renderMainFragment
//
// after each component instance initialization we could:
// 1. call an init method that uses the variable name as the id
//    _hmr_.init(component, 'eachBlock_0', index, 'newForm', newForm)
// 2. when tearing down mainFragment, set a var on template._hmr_teardown_ = true
// 3. call a save method when attempting to teardown and template._hmr_teardown_ == true
//    _hmr_.save(component, 'eachBlock_0', index, 'newForm', newForm.get())

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
