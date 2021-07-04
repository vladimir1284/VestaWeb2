<script>
	import Map from "./Map.svelte";
  import { base_url} from './store.js'  
</script>

<svelte:head>
  <link rel="stylesheet" href={base_url+"bootstrap.min.css"}>
</svelte:head>

<main>
	<Map/>
</main>


