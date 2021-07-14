<script>
  import { FormGroup, Button, Popover, Input, DropdownItem, 
           Tooltip, InputGroup } from 'sveltestrap';
  import { currentProduct, defaultBaseLayer, layers, availableProducts } from '../store'
  import { get } from 'svelte/store'
  import {createProductSource, createCoverSource} from '../Layers'
  import Settings from 'svelte-material-icons/Settings.svelte'
  import LayersOutline from 'svelte-material-icons/LayersOutline.svelte'
  import { _ } from '../services/i18n';


  let range = 0
  let productOpacity = 0.5;
  let showCover = true
  let show_storms = true
  let isOpen = false
  let pLabel = ""
  
  export let showStormTable
  export let stormSettings
  let selectedProduct
  let baseLayer = get(defaultBaseLayer)

  function updateSelectedProduct(x){
    selectedProduct = x
  }
  $: updateSelectedProduct($currentProduct)

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
    const layers_array = $layers
    if (typeof(layers_array.product)!="undefined"){      
      // Update Label
      try {        
      pLabel = $_('LayerSwitch.pname')[selectedProduct.id]
      } catch (error) {
        
      }
      currentProduct.set(selectedProduct)
      layers_array.product.setSource(createProductSource())   
      if (selectedProduct.range != range){
        // Update cover when needed
        layers_array.cover.setSource(createCoverSource(selectedProduct))
        range = selectedProduct.range
      }
    }
  }

  // Modify cover layer visibility
  $: {
    const layers_array = get(layers)
    if (typeof(layers_array.cover)!="undefined"){
      layers_array.cover.setVisible(showCover);
      // console.log(`Cover: ${showCover}`)
    }
  }

  // Control base layer
  $: {
    const layers_array = get(layers)
    if (typeof(layers_array.orography)!="undefined"){
      layers_array.orography.setVisible(false)
      layers_array.osm.setVisible(false)
      layers_array[baseLayer].setVisible(true)
      defaultBaseLayer.set(baseLayer) // Persist
    }
  }


  // Control Porduct layer opacity
  $: {
    const layers_array = get(layers)
    if (typeof(layers_array.product)!="undefined"){
      layers_array.product.setOpacity(productOpacity);
    }
  }

  function toggle(){
    showStormTable = true
    isOpen = false
  }
</script>


<Button id="layer_switch_btn" style="width: auto; padding-right: .2em;">
  <LayersOutline color="white" size="1.2em"/>
  {pLabel}
  </Button>

<Popover placement="bottom" target="layer_switch_btn" bind:isOpen>
  <div slot="title">
    {$_('LayerSwitch.title')}
  </div>
  <FormGroup>
    {#each $availableProducts as product}
      <Input id={product.id} type="radio" bind:group={selectedProduct} value={product} label={$_('LayerSwitch.pname')[product.id]}/>
    {/each}
    <Input
      type="range"
      name="productOpacity"
      id="productOpacity"
      min={0}
      max={1}
      step={0.1}
      bind:value={productOpacity}
      placeholder= {$_('LayerSwitch.opacity')}/>    

    <InputGroup>
      <Input id="show-storm" type="checkbox" bind:checked={show_storms} label={$_('LayerSwitch.storm_cell')}/>
      <button class="edit-storm" on:click={toggle}>
        <Settings color="#0d6efd" size="1.5em"/>
      </button>   
    </InputGroup>
  </FormGroup>

  <FormGroup>
    <Input id="c1" type="checkbox" bind:checked={showCover} label="{$_('LayerSwitch.cover')}" />
  </FormGroup>

  <DropdownItem divider />

  <Input type="select" name="baseLayer" id="baseLayer" bind:value={baseLayer}>
    <option value='orography'>{$_('LayerSwitch.map.orography')}</option>
    <option value='osm'>{$_('LayerSwitch.map.osm')}</option>
  </Input>

  <Tooltip
    placement="left"
    target="baseLayer">
    {$_('LayerSwitch.map_too1tip')}
  </Tooltip>
</Popover>

<Tooltip
  placement="bottom"
  target="layer_switch_btn">
  {$_('LayerSwitch.btn_too1tip')}
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