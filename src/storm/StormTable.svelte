<script>
  import {Modal, ModalBody, ModalHeader,
          Table, Input, InputGroup, Tooltip} from 'sveltestrap';
  import { current_datetime, currentRadar  } from '../store';
  import {storms} from '../db/storms'
  import { _ } from '../services/i18n';

  export let showStormTable
  export let show_label
  export let stormSettings

  let past = false
  let future = false

  // Update globally past and future
  $:{
    updatePast(past)
  }
  $:{
    updateFuture(future)
  }
  function updateFuture(future){
    for (const [key, value] of Object.entries(stormSettings)) {
      stormSettings[key].future = future
    }
  }

  function updatePast(past){
    for (const [key, value] of Object.entries(stormSettings)) {
      stormSettings[key].past = past
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
      value-= 100 
      str_value += gl
    }
    return str_value + (value*0.3048).toFixed(1) //KFT to KM
  }
   
</script>

<Modal isOpen={showStormTable} {toggle} backdrop={false} size = 'lg'>
  <ModalHeader {toggle}>
    {$_('StormTable.radar')}: <b>{currentRadar.id}</b> {$_('StormTable.cells')} <b>{storms.length}</b>
    <span class='date'>&emsp {current_datetime.setZone('local').toFormat('dd/MMM/y HH:mma')}</span> 
  </ModalHeader>
  <ModalBody>
    <InputGroup>
      Mostrar:&emsp
      <Input id="labels" type="checkbox" bind:checked={show_label} label={$_('StormTable.label')} /> 
      <div>&emsp</div>      
      <Input id="futuro" type="checkbox" bind:checked={future} label={$_('StormTable.forecast')}/> 
      <div>&emsp</div>      
      <Input id="pasado" type="checkbox" bind:checked={past} label={$_('StormTable.past')}/> 
    </InputGroup>
    <Table striped responsive class="tableFixHead">
      <thead class="text-center">
        <tr>
          <th class="text-start">{$_('StormTable.id')}</th>
          <th id="visible">{$_('StormTable.visibility')}</th>
          <th id="future">{$_('StormTable.check.forecast')}</th>
          <th id="past">{$_('StormTable.check.past')}</th>
          <th>AZ(&deg;) {$_('StormTable.azran')}</th>
          <th>{$_('StormTable.base')}</th>
          <th>{$_('StormTable.top')}</th>
          <th>{$_('StormTable.vil')} (kg/m<sup>2</sup>)</th>
          <th>{$_('StormTable.maxz')}</th>
          <th>{$_('StormTable.centroid')}</th>
        </tr>
      </thead>
      <tbody>
        {#each storms as storm}
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
  <Tooltip target={"visible"} placement='top'>{$_('StormTable.tooltip.visibility')}</Tooltip>
  <Tooltip target={"past"} placement='top'>{$_('StormTable.tooltip.past')}</Tooltip>
  <Tooltip target={"future"} placement='top'>{$_('StormTable.tooltip.forecast')}</Tooltip>
</Modal>

<style>

</style>