<script context="module">
  import Overlay from 'ol/Overlay';
  import {transform} from 'ol/proj';
  import { mapProj, currentRadar, map, storms, stormSettings } from '../store'
  import { get } from 'svelte/store'

  let overlays

  export function createStromsOverlay(){
    const _map = get(map)
    overlays = []
    get(storms).forEach(function (storm, index){
      const storm_ol = new Overlay({
          'id':storm.id,
          element: document.getElementById(`storm-${storm.id}`),
          positioning: 'center-center'
      });
      storm_ol.setPosition(transform([storm.Ipos,storm.Jpos], get(currentRadar).id, mapProj));
      _map.addOverlay(storm_ol);
      overlays.push(storm_ol)
    })
  }

  export function removeStromsOverlay(){
    const _map = get(map)
    overlays.forEach(function (storm_ol){
      _map.removeOverlay(storm_ol)
    })
  }
</script>

<script>
  import { Tooltip } from 'sveltestrap';

  export let show_label
  export let StormData
  
  function toggle(storm){
    StormData.show = true
    StormData.storm = storm
  }

  function getIconSize(storm) {
    const size = 12+Math.floor(storm.vil.slice(-1)[0]/3)
    return `width:${size}px; height:${size}px`
  }
</script>
{#if $stormSettings}
  {#each $storms as storm}
    <div id={"storm-"+storm.id} style={$stormSettings[storm.id].visible?'visibility:visible':'visibility:hidden'}>
      <button class="storm" id={"btn-"+storm.id} 
              style={getIconSize(storm)}
              on:click={toggle(storm)}>
      </button>
      {#if show_label}
        <div class="storm-label">{storm.id}</div>
      {:else}
        <Tooltip target={"btn-"+storm.id} placement='top'>{storm.id}</Tooltip>
      {/if}
    </div>
  {/each}
{/if}

<style>
  .storm {
    background: rgba(47, 224, 255, 0.425);
    border-radius:50%;
    padding: 0;
    }
  .storm-label{
    color: white;
    background-color:rgba(0,60,136,0.5);
    border-radius:20%;
  }  
</style>

