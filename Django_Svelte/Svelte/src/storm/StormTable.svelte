<script>
  import {Modal, ModalBody, ModalHeader,
          Table, Input, InputGroup, Tooltip} from 'sveltestrap';
  import { current_datetime, currentRadar, storms } from '../store';
  import {updateStormSettings} from "./storms"
  import { _ } from '../services/i18n';

  export let showStormTable
  export let show_label

  let past = false
  let future = false

  // Update globally past and future
  $:{
    updateStormSettings('past', past)
  }
  $:{
    updateStormSettings('future', future)
  }

  function toggle(){
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
    {$_('StormTable.radar')}: <b>{$currentRadar.id}</b> {$_('StormTable.cells')} <b>{$storms.length}</b>
    <span class='date'>&emsp {$current_datetime.setZone('local').toFormat('dd/MMM/y HH:mma')}</span> 
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
          <th>{$_('StormTable.azran')}</th>
          <th>{$_('StormTable.base')}</th>
          <th>{$_('StormTable.top')}</th>
          <th>{$_('StormTable.vil')} (kg/m<sup>2</sup>)</th>
          <th>{$_('StormTable.maxz')}</th>
          <th>{$_('StormTable.centroid')}</th>
        </tr>
      </thead>
      <tbody>
        {#each $storms as storm}
          <tr>
            <th scope="row">{storm.id}</th>
            <th>
              <Input id={"visible_"+storm.id} type="checkbox"
                  bind:checked={storm.settings.visible} label=""/> 
            </th>
            <th>
              <Input id={"future_"+storm.id} type="checkbox" 
                  bind:checked={storm.settings.future} label=""/> 
            </th>
            <th>
              <Input id={"past_"+storm.id} type="checkbox" 
                  bind:checked={storm.settings.past} label=""/> 
            </th>
            <td class="text-center">{("0"+storm.azimut).slice(-3)} / {nm2kmSTR(storm.range)}</td>
            <td class="text-center">{kft2kmSTR_b(storm.bases[storm.lst_vol_data_ptr-1])}</td>
            <td class="text-center">{kft2kmSTR_t(storm.tops[storm.lst_vol_data_ptr-1])}</td>
            <td class="text-center">{storm.vil[storm.lst_vol_data_ptr-1]}</td>
            <td class="text-center">{storm.maxZ[storm.lst_vol_data_ptr-1]}</td>
            <td class="text-center">{kft2kmSTR(storm.centroids[storm.lst_vol_data_ptr-1],"")}</td>
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