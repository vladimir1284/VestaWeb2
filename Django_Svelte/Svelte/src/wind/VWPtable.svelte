<script>
  import {Table} from 'sveltestrap';
  import { _ } from '../services/i18n';
  import { getVWP } from '../backend';

  export let isOpen

  let vwp = []

  function nm2kmSTR(value){
    return Math.round(value*1.852) //NM to KM
  }

  function getVelSTR(u, v){
    return Math.round(((u**2+v**2)**0.5)*3.6)
  }

  function filterNAstr(value, n){
    return (value === 1000)?"NA":value.toFixed(n)
  }

  function ft2kmSTR(value){
    return (value*0.3048/1000).toFixed(2) //FT to KM
  }

  $:{
    if (isOpen){
      loadVWP()
    }
  }

  async function loadVWP() {   
    vwp = await getVWP()
  }

// -.3, -.2
</script>


<Table striped responsive class="tableFixHead">
  <thead class="text-center">
    <tr>
      <th>{$_('vwp.ALT')}</th>         
      <th>{$_('vwp.U')}</th>
      <th>{$_('vwp.V')}</th>
      <th>{$_('vwp.W')}</th>
      <th>{$_('vwp.DIR')}</th>
      <th>{$_('vwp.SPD')}</th>
      <th>{$_('vwp.RMS')}</th>
      <th>{$_('vwp.DIV')}</th>
      <th>{$_('vwp.SRNG')}</th>
      <th>{$_('vwp.ELEV')}</th>
    </tr>
  </thead>
  <tbody>
    {#each vwp as elem}
        <tr>
          <td class="text-center">{ft2kmSTR(elem.ht)}</td>
          <td class="text-center">{elem.u.toFixed(1)}</td>
          <td class="text-center">{elem.v.toFixed(1)}</td>
          <td class="text-center">{filterNAstr(elem.w, 1)}</td>
          <td class="text-center">{elem.dir}</td>
          <td class="text-center">{getVelSTR(elem.u, elem.v)}</td>
          <td class="text-center">{getVelSTR(elem.rms, 0)}</td>
          <td class="text-center">{filterNAstr(elem.div, 4)}</td>
          <td class="text-center">{nm2kmSTR(elem.srng)}</td>
          <td class="text-center">{elem.elev}</td>
        </tr>
    {/each}

  </tbody>
</Table>

<style>
</style>