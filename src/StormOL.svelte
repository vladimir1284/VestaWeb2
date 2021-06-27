<script>
  import { Popover, Tooltip } from 'sveltestrap';

  export let storm_list;
</script>

{#each storm_list as storm}
  <div id={"storm-"+storm.id}>
    <button class="storm" id={"btn-"+storm.id}></button>
    <div class="storm-label">{storm.id}</div>
    <Tooltip target={"btn-"+storm.id} placement='top'>{storm.id}</Tooltip>
  </div>
{/each}


<style>
  .storm {
    width: 20px;
    height:20px;
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

