<script>
  import { Tooltip } from 'sveltestrap';
  import { _ } from './services/i18n';
var { DateTime } = require('luxon');

  export let radar;
</script>

<button class="radar" id={"radar-"+radar.id}></button>

<div class="mt-3">
<Tooltip 
  trigger="focus" 
  target={"radar-"+radar.id}
  placement = 'top'>
  {$_('StormModal.radar')} {radar.id} <br>
  {$_('Radar.status')} {radar.status}<br>
  {$_('Radar.last_scan')} {(DateTime.now().diff(radar.last)/60000).toFixed()}{$_('Radar.min')}
</Tooltip>
</div>

<style>
  .radar {
    width: 12px;
    height:12px;
    background: rgba(154, 245, 159, 0.678);
    border-style: solid;
    border-color: rgba(51, 182, 11, 0.692);
    border-radius:50%;
    padding: 0;
    }
    
</style>

