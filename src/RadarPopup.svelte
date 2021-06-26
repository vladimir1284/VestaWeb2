<script>
  import { Popover } from 'sveltestrap';
</script>

<button id="radar"></button>

<div class="mt-3">
<Popover 
  trigger="focus" 
  target="radar" 
  placement = 'top' 
  title={"Radar de Camagüey"}>
    Esta es una berve descripción del radar de Camaguey.
    <a href="https://www.merriam-webster.com/dictionary/modal">Leer más...</a>
</Popover>
</div>

<style>
  #radar {
    width: 10px;
    height:10px;
    background: white;
    border-style: solid;
    border-color: black;
    border-radius:50%;
    padding: 0;
    }
    
</style>

