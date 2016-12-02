
import './favicon.ico'

import App from './components/App.svelte'

global.hotify = (instance, target, Component) => {
  const data = instance.get()
  instance.teardown()
  return new Component({ target, data })
}


const target = global.document.getElementById('main')
const data = { user: { name: 'everybody' } }
let app = new App({ data, target })

if (module.hot) {
  module.hot.accept('./components/App.svelte', () => {
    app = global.hotify(app, target, require('./components/App.svelte')) // eslint-disable-line global-require
  })
}

app.set({ user: { name: 'Svelte' } })

// app.teardown()
