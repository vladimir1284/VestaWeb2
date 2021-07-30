<script>
  import {Modal, ModalBody, ModalHeader } from 'sveltestrap';
  import { current_datetime, currentRadar  } from '../store';
  import TableLarge from 'svelte-material-icons/TableLarge.svelte'
  import Image from 'svelte-material-icons/Image.svelte'
  import { _ } from '../services/i18n';
  import {get} from 'svelte/store'
  import VWPtable from "./VWPtable.svelte"
  import VWPcanvas from "./VWPcanvas.svelte"

  export let isOpen = false

  let data = true

  function showBarbs(){
    data = true
  }
  function showTable(){
    data = false
  }
  
  function toggle(){
    isOpen = false
  }
   
</script>

<Modal isOpen={isOpen} {toggle} backdrop={false} size = 'lg'>
  <ModalHeader {toggle}>
    {$_('vwp.title')}: <b>{get(currentRadar).id}</b> 
    <span class='date'>&emsp {get(current_datetime).setZone('local').toFormat('dd/MMM/y HH:mma')}</span> 
    <button class="adata" on:click={data?showTable:showBarbs}>
      {#if data} 
        <TableLarge color="gray" size="1.2em"/>
      {:else}
        <Image color="gray" size="1.2em"/>
      {/if}
    </button>
  </ModalHeader>
  <ModalBody>
    {#if isOpen}
      {#if data} 
        <VWPcanvas isOpen={isOpen}/>
      {:else}        
        <VWPtable isOpen={isOpen}/>
      {/if}    
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
</style>