<script context="module">
    import { Control } from "ol/control";

    export function animationController() {
        const container = document.getElementById("animation");

        let element = document.createElement("div");
        element.id = "animation_ctrl  ";
        element.className = "ol-unselectable ol-control animation_control";
        element.appendChild(container);

        return new Control({ element: element });
    }
</script>

<script>
    import {
        Button,
        Input,
        Popover,
        Tooltip,
    } from "sveltestrap";
    import SkipNextCircleOutline from "svelte-material-icons/SkipNextCircleOutline.svelte";
    import SkipPreviousCircleOutline from "svelte-material-icons/SkipPreviousCircleOutline.svelte";
    import PlayCircleOutline from "svelte-material-icons/PlayCircleOutline.svelte";
    import PauseCircleOutline from "svelte-material-icons/PauseCircleOutline.svelte";
    import StopCircleOutline from "svelte-material-icons/StopCircleOutline.svelte";
    import { _ } from "../services/i18n";

    let playing = false;

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

<div id="animation">
    <div>
        <Button id="previous_btn"
            ><SkipPreviousCircleOutline color="white" size="1.5em" />
        </Button>
    </div>
    <div>
        <Button id="stop_btn"
            ><StopCircleOutline color="white" size="1.5em" />
            </Button>
    </div>

    <div>
        <Button id="play_pause_btn">
            {#if playing}
                <PauseCircleOutline color="white" size="1.5em" />
            {:else}
                <PlayCircleOutline color="white" size="1.5em" />
            {/if}
        </Button>
    </div>

    <div>
        <Button id="interval" class="frames">
            {nframes}
        </Button>        
    </div>

    <div>
        <Button id="next_btn">
            <SkipNextCircleOutline color="white" size="1.5em" />
        </Button>
    </div>
</div>

<Tooltip placement="bottom" target="previous_btn">
    {$_("Animation.previous")}
</Tooltip>

<Tooltip placement="bottom" target="stop_btn">
    {$_("Animation.stop")}
</Tooltip>

<Tooltip placement="bottom" target="play_pause_btn">
    {#if playing}
        {$_("Animation.pause")}
    {:else}
        {$_("Animation.play")}
    {/if}
</Tooltip>

<Tooltip placement="bottom" target="next_btn">
    {$_("Animation.next")}
</Tooltip>

<Tooltip placement="bottom" target="interval">
    {$_("Animation.interval")}
</Tooltip>

<Popover placement="bottom" target="interval">
    <Input
    bind:value={nframes}
    type="number"
    name="interval"
    id="frames"
    size="40px"
    min=4
    max=20
    placeholder={nframes} />
</Popover>

<style>
    #animation div {
        float: left;
        clear: none;
    }
</style>
