<script lang="ts">
	import Map from "./Map.svelte";
  import { base_url} from './store'  
  import { setupI18n } from './services/i18n';

  setupI18n({ withLocale: 'es' });
</script>

<svelte:head>
  <link rel="stylesheet" href={base_url+"bootstrap.min.css"}>
</svelte:head>

<main>
	<Map/>
</main>


