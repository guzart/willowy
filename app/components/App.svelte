<h1>Willowy</h1>

<h2>Hello {{user.name}}!!</h2>

<Slinkies />

<script>
  import Slinkies from './slinkies/Index.svelte'

  export default {
    data() {
      return {
        user: { name: 'Anonymous' },
      }
    },

    components: {
      Slinkies,
    },
  }
</script>
