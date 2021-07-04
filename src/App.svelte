<script>
	import Map from "./Map.svelte";
  import { product_base_url} from './store.js'  
</script>

<svelte:head>
  <link rel="stylesheet" href={product_base_url+"bootstrap.min.css"}>
</svelte:head>

<main>
	<Map/>
</main>


