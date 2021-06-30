<script>
  import Chart from './StormCharts/Chart.svelte';
  import {Modal, ModalBody, ModalHeader
          } from 'sveltestrap';
  import { current_datetime, currentRadar, adata } from './store';
  import { get } from 'svelte/store'
  var { DateTime } = require('luxon');
  import TableLarge from 'svelte-material-icons/TableLarge.svelte'
  import Image from 'svelte-material-icons/Image.svelte'

  const datetime = get(current_datetime)
  const radar = get(currentRadar)
  const adata_text = get(adata)

  export let StormData

  let data = true

  function showData(){
    data = true
  }
  function showAdata(){
    data = false
  }
  
  const toggle = () => (StormData.show = false); 
   
</script>

<Modal isOpen={StormData.show} {toggle} backdrop={false} size = 'lg'>
  <ModalHeader {toggle}>
    Radar: <b>{radar.id}</b> Celda: <b>{StormData.storm.id}</b>
    <span class='date'>&emsp {datetime.setZone('local').toFormat('dd/MMM/y HH:mma')}</span> 
    <button class="adata" on:click={data?showAdata:showData}>
      {#if data} 
        <TableLarge color="gray"} size="1.2em"/>
      {:else}
        <Image color="gray"} size="1.2em"/>
      {/if}
    </button>
  </ModalHeader>
  <ModalBody>
    {#if data} 
      <Chart storm={StormData.storm}/>
    {:else}
      <textarea class="text" rows=27 cols=80>{adata_text}</textarea>    
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