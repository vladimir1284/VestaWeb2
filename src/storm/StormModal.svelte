<script>
  import Chart from './StormCharts/Chart.svelte';
  import {Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { current_datetime, currentRadar,  } from '../store';
  import {adata} from '../db/storms'
  import TableLarge from 'svelte-material-icons/TableLarge.svelte'
  import Image from 'svelte-material-icons/Image.svelte'
  import { _ } from '../services/i18n';

  export let StormData

  let data = true

  function showData(){
    data = true
  }
  function showAdata(){
    data = false
  }
  
  function toggle(){
    StormData.show = false
    data = true
  }
   
</script>

<Modal isOpen={StormData.show} {toggle} backdrop={false} size = 'lg'>
  <ModalHeader {toggle}>
    {$_('StormModal.radar')}: <b>{currentRadar.id}</b> {$_('StormModal.cell')} <b>{StormData.storm.id}</b>
    <span class='date'>&emsp {current_datetime.setZone('local').toFormat('dd/MMM/y HH:mma')}</span> 
    <button class="adata" on:click={data?showAdata:showData}>
      {#if data} 
        <TableLarge color="gray" size="1.2em"/>
      {:else}
        <Image color="gray" size="1.2em"/>
      {/if}
    </button>
  </ModalHeader>
  <ModalBody>
    {#if data} 
      <Chart storm={StormData.storm}/>
    {:else}
      <textarea class="text" rows=27 cols=80>{adata}</textarea>    
    {/if}    
  </ModalBody>
</Modal>

<style>
	.date {
		text-align: right;
    }
  .adata {
    padding-left: 2px;
    padding-right: 0;
    background: transparent;
		margin-bottom: 4px;
    border: 0;
    }	
  .adata:active {
    background: #ebecee;
    }
  .text{
    width:100%;
    align-content: 'right';
  }
</style>