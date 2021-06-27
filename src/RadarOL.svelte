<script>
  import { Popover } from 'sveltestrap';

  export let radar;
</script>

<button class="radar" id={"radar-"+radar.id}></button>

<div class="mt-3">
<Popover 
  trigger="focus" 
  target={"radar-"+radar.id}
  placement = 'top' 
  title={radar.name}>
    Esta es una berve descripción del radar de {radar.name}.
    <a href="https://www.merriam-webster.com/dictionary/modal">Leer más...</a>
</Popover>
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

