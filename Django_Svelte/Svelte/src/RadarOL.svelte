<script lang=ts>
  import { Tooltip } from 'sveltestrap';
  import { _ } from './services/i18n';
  import {DateTime} from 'luxon';
  import {switchRadar} from './controls/RadarSwitch.svelte';
  import RadarIcon from './RadarIcon.svelte';

  export let radar;
</script>

<button on:click={switchRadar(radar.id)} class="radar" id={"radar-"+radar.id}><RadarIcon color="black"/></button>

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
    background-color: transparent;
    border:0;
    padding: 0;
    }
    
</style>

