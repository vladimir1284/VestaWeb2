<script>
  import { FormGroup, Button, Popover, Input, Label, DropdownItem, 
           Tooltip, InputGroup } from 'sveltestrap';
  import { currentProduct } from '../store.js'
  import { get } from 'svelte/store'
  import {createProductSource, createCoverSource} from '../Layers'
  import {availableProducts} from '../db/products'
  import Settings from 'svelte-material-icons/Settings.svelte'
  import LayersOutline from 'svelte-material-icons/LayersOutline.svelte'


  let range = 0
  let productOpacity = 0.5;
  let showCover = true
  let show_storms = true
  
  export let showStormTable
  export let layers
  export let stormSettings
  export let selectedProduct = get(currentProduct)
  let baseLayer = 'osm'

  // Modify strom cells visibility
  $:{
    updateStormSettings(show_storms)
  }
  function updateStormSettings(visible) {
    for (const [key, value] of Object.entries(stormSettings)) {
      stormSettings[key].visible = visible
    }
    stormSettings  = stormSettings
  }
  
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

  // Control base layer
  $: {
    if (layers){
      layers.orography.setVisible(false)
      layers.osm.setVisible(false)
      layers[baseLayer].setVisible(true)
    }
  }


  // Control Porduct layer opacity
  $: {
    if (layers){
      layers.product.setOpacity(productOpacity);
    }
  }

  const toggle = () => (showStormTable = true);
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


<Button id="layer_switch_btn" ><LayersOutline color="white" size="1.2em"/></Button>

<Popover placement="bottom" target="layer_switch_btn">
  <div slot="title">
    Gestionar capas 
  </div>
  <FormGroup>
    <Label for="productOpacity" class="layer-header"><h6>Producto:</h6></Label>
    {#each availableProducts as product}
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
      <button class="edit-storm" on:click={toggle}>
        <Settings color="#0d6efd" size="1.5em"/>
      </button>   
    </InputGroup>
  </FormGroup>

  <FormGroup>
    <Input id="c1" type="checkbox" bind:checked={showCover} label="Cobertura" />
  </FormGroup>

  <DropdownItem divider />

  <Input type="select" name="baseLayer" id="baseLayer" bind:value={baseLayer}>
    <option value='orography'>Orografía</option>
    <option value='osm'>Político</option>
  </Input>

  <Tooltip
    placement="left"
    target="baseLayer">
    Mapa de fondo
  </Tooltip>
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