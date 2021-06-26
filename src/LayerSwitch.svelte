<script>
  import {ImageStatic as Static} from 'ol/source';
  import { Form, FormGroup, Button, Popover, Input, Label, DropdownItem } from 'sveltestrap';

  let selectedProduct = "CRE_97";
  let productOpacity = 0.5;
  let showCover = true;

  export let layers;

  
    // update product on radio button switch
    $: {
      if (layers){
        const url = `http://localhost/testol/CCNR/${selectedProduct}_2021-06-03_16-18-00.png`
        
          layers.product.setSource(new Static({
                      url:url,
                      projection: 'CCNR:1000',
                      imageSmoothing: false,
                      imageExtent: [-232000, -232000, 232000, 232000],
                  }));
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

    <Input id="r1" type="radio" bind:group={selectedProduct} value="CRE_97" label="Máximos"/>
    <Input id="r2" type="radio" bind:group={selectedProduct} value="ET_41" label="Topes" />

    <Input
      type="range"
      name="productOpacity"
      id="productOpacity"
      min={0}
      max={1}
      step={0.1}
      bind:value={productOpacity}
      placeholder="Opacidad" />    
  </FormGroup>
  <DropdownItem divider />
  <FormGroup>
    <Input id="c1" type="checkbox" bind:checked={showCover} label="Covertura" />
  </FormGroup>
</Popover>

<Popover
  trigger="hover"
  placement="left"
  target="layer_switch_btn"
  title="Seleccionar Productos">
  Haz click en este botón para cambiar de producto.
</Popover>