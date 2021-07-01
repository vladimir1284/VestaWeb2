<script>
  import Chart from './StormCharts/Chart.svelte';
  import {Modal, ModalBody, ModalHeader,
          Table, Input, InputGroup, Tooltip} from 'sveltestrap';
  import { current_datetime, currentRadar, storms } from './store';
  import { get } from 'svelte/store'
  var { DateTime } = require('luxon');
  import TableLarge from 'svelte-material-icons/TableLarge.svelte'
  import Image from 'svelte-material-icons/Image.svelte'

  const datetime = get(current_datetime)
  const radar = get(currentRadar)
  const storm_list = get(storms)

  export let showStormTable
  export let show_label
  export let stormSettings

  let past = false
  let future = false

  // Update globally past and future
  $:{
    updateTrend(past, future)
  }
  function updateTrend(past, future){
    for (const [key, value] of Object.entries(stormSettings)) {
      stormSettings[key].past = past
      stormSettings[key].future = future
    }
  }

  function toggle(){
    // reaisign for recognizing state change
    stormSettings = stormSettings
    // Close modal
    showStormTable = false
  } 

  function nm2kmSTR(value){
    let str_value = "0"
    str_value += Math.round(value*1.852) //NM to KM
    return str_value.slice(-3)
  }

  function kft2kmSTR_t(value){
    return kft2kmSTR(value, ">")
  }

  function kft2kmSTR_b(value){
    return kft2kmSTR(value, "<")
  }

  function kft2kmSTR(value, gl){
    let str_value=""
    if (value > 70){
      // TODO somehow indicate that lowest elevation 
      // was used for obtainig this value
      value-= 100 
      str_value += gl
    }
    return str_value + (value*0.3048).toFixed(1) //KFT to KM
  }
   
</script>

<Modal isOpen={showStormTable} {toggle} backdrop={false} size = 'lg'>
  <ModalHeader {toggle}>
    Radar: <b>{radar.id}</b> Celdas: <b>{storm_list.length}</b>
    <span class='date'>&emsp {datetime.setZone('local').toFormat('dd/MMM/y HH:mma')}</span> 
  </ModalHeader>
  <ModalBody>
    <InputGroup>
      Mostrar:&emsp
      <Input id="labels" type="checkbox" bind:checked={show_label} label="Etiquetas" /> 
      <div>&emsp</div>      
      <Input id="futuro" type="checkbox" bind:checked={future} label="Pronóstico"/> 
      <div>&emsp</div>      
      <Input id="pasado" type="checkbox" bind:checked={past} label="Histórico"/> 
    </InputGroup>
    <Table striped responsive class="tableFixHead">
      <thead class="text-center">
        <tr>
          <th class="text-start">ID</th>
          <th id="visible">V</th>
          <th id="past">P</th>
          <th id="future">H</th>
          <th>AZ(&deg;) DIS(km)</th>
          <th>BASE (km)</th>
          <th>TOPE (km)</th>
          <th>VIL (kg/m<sup>2</sup>)</th>
          <th>MAX Z (dbZ)</th>
          <th>CENT (km)</th>
        </tr>
      </thead>
      <tbody>
        {#each storm_list as storm}
          <tr>
            <th scope="row">{storm.id}</th>
            <th>
              <Input id={"visible_"+storm.id} type="checkbox"
                  bind:checked={stormSettings[storm.id].visible} label=""/> 
            </th>
            <th>
              <Input id={"future_"+storm.id} type="checkbox" 
                  bind:checked={stormSettings[storm.id].future} label=""/> 
            </th>
            <th>
              <Input id={"past_"+storm.id} type="checkbox" 
                  bind:checked={stormSettings[storm.id].past} label=""/> 
            </th>
            <td class="text-center">{("0"+storm.azimut).slice(-3)} / {nm2kmSTR(storm.range)}</td>
            <td class="text-center">{kft2kmSTR_b(storm.bases.slice(-1))}</td>
            <td class="text-center">{kft2kmSTR_t(storm.tops.slice(-1))}</td>
            <td class="text-center">{storm.vil.slice(-1)}</td>
            <td class="text-center">{storm.maxZ.slice(-1)}</td>
            <td class="text-center">{kft2kmSTR(storm.centroids.slice(-1),"")}</td>
          </tr>
        {/each}

      </tbody>
    </Table>
  </ModalBody>
  <Tooltip target={"visible"} placement='top'>Mostrar Celda</Tooltip>
  <Tooltip target={"past"} placement='top'>Mostrar Histórico</Tooltip>
  <Tooltip target={"future"} placement='top'>Mostrar Pronóstico</Tooltip>
</Modal>

<style>

</style>