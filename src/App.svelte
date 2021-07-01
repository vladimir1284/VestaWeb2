<script>
	import Map from "./Map.svelte";
  import { product_base_url} from './store.js'
  import { get } from 'svelte/store'
  
  const baseUrl = get(product_base_url)
</script>

<svelte:head>
  <link rel="stylesheet" href={baseUrl+"bootstrap.min.css"}>
</svelte:head>

<main>
	<Map/>
</main>


