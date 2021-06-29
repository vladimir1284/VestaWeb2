<script>
  import {ImageStatic as Static} from 'ol/source';
  import { FormGroup, Button, Popover, Input, Label, DropdownItem, 
           Tooltip, InputGroup, InputGroupText, Icon } from 'sveltestrap';
  import { product_base_url, currentRadar, currentProduct, 
           current_datetime, availableProducts} from './store.js'
  import { get } from 'svelte/store'
  import {createProductSource, createCoverSource} from './Layers.svelte'
  import Settings from 'svelte-material-icons/Settings.svelte'

  const baseUrl = get(product_base_url)
  const radar = get(currentRadar)
  const product = get(currentProduct)
  const datetime = get(current_datetime)
  const raster_products = get(availableProducts)

  let selectedProduct = raster_products[0];
  let range = selectedProduct.range
  let productOpacity = 0.5;
  let showCover = true;

  export let layers;
  export let show_storms
  
  // update product on radio button switch
  $: {
    if (layers){      
      layers.product.setSource(createProductSource(selectedProduct))   
      if (selectedProduct.range != range){
        // Update cover when needed
        layers.cover.setSource(createCoverSource(selectedProduct))
        range = selectedProduct.range
      }
    }
  }

  // Modify cover layer visibility
  $: {
    if (layers){
      layers.cover.setVisible(showCover);
      // console.log(`Cover: ${showCover}`)
    }
  }

  // Control Porduct layer opacity
  $: {
    if (layers){
      layers.product.setOpacity(productOpacity);
    }
  }

</script>


<script context="module">
  import {Control} from 'ol/control'

  export function layerController(){
    let button = document.getElementById('layer_switch_btn');

    let element = document.createElement('div');
    element.className = 'layer-switch ol-unselectable ol-control';
    element.appendChild(button);

    return new Control({element: element});
  }
</script>


<Button id="layer_switch_btn" class="layer-btn"></Button>

<Popover placement="bottom" target="layer_switch_btn">
  <div slot="title">
    Gestionar capas 
  </div>
  <FormGroup>
    <Label for="productOpacity" class="layer-header"><h6>Producto:</h6></Label>
    {#each raster_products as product}
      <Input id={product.id} type="radio" bind:group={selectedProduct} value={product} label={product.name}/>
    {/each}
    <Input
      type="range"
      name="productOpacity"
      id="productOpacity"
      min={0}
      max={1}
      step={0.1}
      bind:value={productOpacity}
      placeholder="Opacidad" />    

    <InputGroup>
      <Input id="show-storm" type="checkbox" bind:checked={show_storms} label="Celdas de tormenta"/>
      <button class="edit-storm"><Settings color={show_storms?"#0d6efd":"#ced4da"} size="1.5em"/></button>   
    </InputGroup>
  </FormGroup>

  <DropdownItem divider />
  <FormGroup>
    <Input id="c1" type="checkbox" bind:checked={showCover} label="Covertura" />
  </FormGroup>
</Popover>

<Tooltip
  placement="left"
  target="layer_switch_btn">
  Gestionar capas
</Tooltip>


<style>
	.edit-storm {
    padding-left: 2px;
    padding-right: 0;
    background: transparent;
		margin-bottom: 4px;
    border: 0;
    }	
    .edit-storm:active {
    background: #ced4da;
    }
</style>