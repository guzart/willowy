<h3>Slinkies</h3>

<NewForm />

<List />

<script>
  import Form from './Form.svelte'
  import List from './List.svelte'

  export default {
    components: {
      List,
      NewForm: Form,
    },
  }
</script>
