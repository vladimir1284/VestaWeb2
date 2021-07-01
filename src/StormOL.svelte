<script>
  import { Popover, Tooltip } from 'sveltestrap';

  export let storm_list
  export let show_label
  export let stormSettings
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

{#each storm_list as storm}
  <div id={"storm-"+storm.id} style={stormSettings[storm.id].visible?'visibility:visible':'visibility:hidden'}>
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

