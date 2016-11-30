
import './favicon.ico'

import App from './components/App.svelte'

const app = new App({
  target: global.document.getElementById('main'),
  data: { name: 'everybody' },
})

app.set({ name: 'nobody' })

// app.teardown()
