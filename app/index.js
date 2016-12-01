
import './favicon.ico'

import App from './components/App.svelte'

const target = global.document.getElementById('main')
const data = { user: { name: 'everybody' } }
let app = new App({ target, data })

if (module.hot) {
  module.hot.accept('./components/App.svelte', () => {
    const state = app.get()
    app.teardown()

    const NextApp = require('./components/App.svelte')
    app = new NextApp({ target, data: state })
  })
}

app.set({ user: { name: 'Svelte' } })

// app.teardown()
