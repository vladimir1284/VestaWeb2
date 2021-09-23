<script context="module">
  import Overlay from 'ol/Overlay';
  import {transform} from 'ol/proj';
  import { mapProj, currentRadar, map, storms, current_datetime } from '../store'
  import { get } from 'svelte/store'

  let overlays = []
  let created_deatetime = 0

  export function createStromsOverlay(){
    const _map = get(map)
    const new_overlays = []
    created_deatetime = get(current_datetime)
    get(storms).forEach(function (storm, index){
      const storm_ol = new Overlay({
          'id':storm.id + created_deatetime.ts,
          element: document.getElementById("storm-" + storm.id + created_deatetime.ts),
          positioning: 'center-center'
      });
      storm_ol.setPosition(transform([storm.Ipos,storm.Jpos], get(currentRadar).id, mapProj));
      _map.addOverlay(storm_ol);
      new_overlays.push(storm_ol)
    })
    // Delete old overlays if any
    removeStromsOverlay()
    overlays = new_overlays
    return overlays
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
	import { afterUpdate } from 'svelte';

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

  function refreshOverlays(){
    if (created_deatetime != get(current_datetime) &&
        created_deatetime != 0){
          // Overlays needs to be recreated
          createStromsOverlay()
    }
  }

  afterUpdate(refreshOverlays)
</script>


{#each $storms as storm}
  {#if storm.id}
    <div id={"storm-" + storm.id + get(current_datetime).ts} style={storm.settings.visible?'visibility:visible':'visibility:hidden'}>
      <button class="storm" id={"btn-" + storm.id + get(current_datetime).ts} 
              style={getIconSize(storm)}
              on:click={toggle(storm)}>
      </button>
      {#if show_label}
        <div class="storm-label">{storm.id}</div>
      {:else}
        <Tooltip target={"btn-" + storm.id + get(current_datetime).ts} placement='top'>{storm.id}</Tooltip>
      {/if}
    </div>
  {/if}
{/each}


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

