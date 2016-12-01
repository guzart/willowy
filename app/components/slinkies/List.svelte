<ul>
  {{#each slinkies as slinky}}
    <ListItem slinky="{{slinky}}" />
  {{/each}}
</ul>

{{#if slinkies.length === 0}}
  <p>No slinkies... :(</p>
{{/if}}

<script>
  import ListItem from './ListItem.svelte'
  export default {
    data() {
      return {
        slinkies: [
          { title: 'Svelte' },
          { title: 'Svelte Loader' },
        ],
      }
    },

    components: {
      ListItem,
    },
  }
</script>
