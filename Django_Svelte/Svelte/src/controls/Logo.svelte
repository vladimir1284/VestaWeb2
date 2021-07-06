<script context="module">
    import {Control} from 'ol/control'
  
    export function logoController(){
        const container = document.getElementById('logo');
        
        let element = document.createElement('div');
        element.className = 'ol-unselectable ol-control logo_control';
        element.appendChild(container);
  
      return new Control({element: element});
    }
</script>


<div id="logo" >
</div>

<style>
    #logo{
	    background: no-repeat url('http://localhost:8000/example/imgs/logo.png');
        width: 116px;
	    height: 46px;
    }
</style>