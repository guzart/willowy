
import './favicon.ico'

import App from './components/App.svt'

const app = new App({
  target: global.document.getElementById('main'),
  data: { name: 'world' },
})

app.set({ name: 'everybody' })

// app.teardown()
