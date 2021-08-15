<script>
  import { Tooltip } from 'sveltestrap';
  import { _ } from './services/i18n';
  var { DateTime } = require('luxon');
  import {switchRadar} from './controls/RadarSwitch.svelte'

  export let radar;
</script>

<button on:click={switchRadar(radar.id)} class="radar" id={"radar-"+radar.id}></button>

<div class="mt-3">
<Tooltip 
  trigger="focus" 
  target={"radar-"+radar.id}
  placement = 'top'>
  {$_('StormModal.radar')} {radar.id} <br>
  {$_('Radar.status')} {radar.status}<br>
  {$_('Radar.last_scan')} {(DateTime.now().diff(DateTime.fromISO(radar.last))/60000).toFixed()}{$_('Radar.min')}
</Tooltip>
</div>

<style>
  .radar {
    width: 12px;
    height:12px;
    background: rgba(92, 91, 87, 0.568);
    border-style: solid;
    border-color: rgb(0, 0, 0);
    border-radius:50%;
    padding: 0;
    }
    
</style>

