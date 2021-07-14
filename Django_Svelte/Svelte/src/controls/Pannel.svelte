<script context="module">
    import { Control } from "ol/control";

    export function pannelController() {
        const container = document.getElementById("pannel");

        let element = document.createElement("div");
        element.id = "pannel_ctrl  ";
        element.className = "ol-unselectable ol-control pannel_control";
        element.appendChild(container);

        return new Control({ element: element });
    }
</script>

<script>
    import { _ } from "../services/i18n";
    import LayerSwitch from './LayerSwitch.svelte'
    import Animation from "./Animation.svelte";
    import DatePicker from "./DatePicker.svelte";
    import RadarSwitch from "./RadarSwitch.svelte";

    export let showStormTable
    export let stormSettings


    // Frames configuration
    const minNframes = 4
    const maxNframes = 20
    const defaultNframes = 6
    let nframes = defaultNframes

    $:{
        nframes = (nframes < minNframes)?minNframes:nframes
        nframes = (nframes > maxNframes)?maxNframes:nframes
    }
</script>

<div id="pannel">
    <div>
        <DatePicker/>
    </div>

    <div>
        <Animation/>
    </div>

    <div>
        <RadarSwitch/>
    </div>

    <div>
        <LayerSwitch 
            bind:stormSettings={stormSettings}
            bind:showStormTable={showStormTable}
        />
    </div>

</div>


<style>
    #pannel div {
        float: left;
        clear: none;
    }
</style>
