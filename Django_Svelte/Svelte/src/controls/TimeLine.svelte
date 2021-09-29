<script lang="ts">
    import Run from "svelte-material-icons/Run.svelte";
    import RunFast from "svelte-material-icons/RunFast.svelte";
    import BikeFast from "svelte-material-icons/BikeFast.svelte";
    import { Tooltip } from "sveltestrap";
    import PlayCircle from "svelte-material-icons/PlayCircle.svelte";
    import PauseCircle from "svelte-material-icons/PauseCircle.svelte";
    import { _ } from "../services/i18n";
    import {play_pause, playing} from './animate';
    import {onMount} from 'svelte';

    let position: number = 100;
    let ghost_opacity = 0;
    let ghost_margin = 0;

    const animationSpeed = [1,2,3];
    let speed:number = animationSpeed[0];

    const animationIntervals = [1,6,12];
    let interval:number = animationIntervals[0];


    
    function enableGhost(){
        ghost_opacity = 1;
    }

    function disableGhost(){
        ghost_opacity = 0;
    }

    function getObsTime(e) {
            const rect = e.target.getBoundingClientRect();
            position = e.clientX - rect.left; 
    }

</script>

<div class="time-control-container">
    <div>
        <button id="play_pause_btn" on:click={play_pause}>
            {#if playing}
                <PauseCircle color="#fff3e1" size="3em" />
            {:else}
                <PlayCircle color="#fff3e1" size="3em" />
            {/if}
        </button>
    </div>
    
    <Tooltip placement="bottom" target="play_pause_btn">
        {#if playing}
            {$_("Animation.pause")}
        {:else}
            {$_("Animation.play")}
        {/if}
    </Tooltip>
    <div class="time-control">
        <div id="progress_line_container" 
            on:mousemove={getObsTime} 
            on:mouseenter={enableGhost}
            on:mouseleave={disableGhost} >
            <div id="progress_line" class="progress-line">
            </div>
            <div class="ghost-timecode" style="opacity: {ghost_opacity}; left: {position}px; margin-top: {ghost_margin}px;">
                <div class="box">
                    {Math.round(position)}
                </div>
            </div>
        </div>
        <div class="animation-config">
            <div class="speed">
                <label class="container">
                    <input name="speed" type="radio" bind:group={speed} value={animationSpeed[0]}> 
                    <spam><Run/></spam>
                </label>
                <label class="container">
                    <input name="speed" type="radio" bind:group={speed} value={animationSpeed[1]}> 
                    <spam><RunFast/></spam>
                </label>
                <label class="container">
                    <input name="speed" type="radio" bind:group={speed} value={animationSpeed[2]}> 
                    <spam><BikeFast/></spam>
                </label>    
            </div>
            <div class="interval">
                {#each animationIntervals as ai}
                    <label class="container">
                        <input name="interval" type="radio" bind:group={interval} value={ai}> 
                        <spam>{ai}h</spam>
                    </label>
                {/each}
            </div>
        </div>
    </div>
</div>

<style>
    
    /* --------- Play/Pause ------------*/
    #play_pause_btn {
        background: radial-gradient(black, transparent 70%);
        border: 0;
        margin-top: -0.25em;
    }
    /* ------------------------------*/

    /* --------- TimeLine ------------*/
    .time-control-container {
        right: 50%;
        top: 5px;
        display: flex;
        position: absolute;
        transform: translate(50%, 0);
        z-index: 10;
    }
    .progress-line {
        width: 400px;
        height: 5px;
        background-color: #fff3e1;
        box-shadow: 0 0 4px 0 #7c7c7c;
        cursor: pointer;
        -webkit-tap-highlight-color: initial;
        transition: 0.3s opacity;
        border-radius: 20px;
    }
    #progress_line_container {
        width: 100%;
        height: 20px;
        padding-top: 10px;
        top: 10px;
        position: relative;
    }
    /* ------------------------------*/

    /* --------- Configs ------------*/
    .animation-config{
        margin-top: 0.3em;
        display: flex;
    }
    .animation-config label{  
        display: contents;
    }
    .container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }
    .animation-config label spam{
        margin-top: 1em;
        font-size: 0.6em;
        padding: 0 0.75em 0 0.75em;
	    text-shadow: 0 0 4px #fff3e1;
    }
    .animation-config input:checked ~ spam{
        background-color: #fff3e1 !important;
        border-radius: 1em;
    }
    .interval{
        margin-left: auto;
    }
    .speed spam{
        font-size: 0.75em !important;
        padding-bottom: 0.2em !important;
        background: radial-gradient(#fff3e1, transparent 70%) !important;
    }
    /* ------------------------------*/

    /* --------- Tooltips ------------*/
    .time-control .box{
        cursor: -webkit-grab;
        cursor: -moz-grab;
        cursor: grab;
        position: relative;
        box-sizing: border-box;
        padding: 0 .8em;
        white-space: nowrap;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        border-radius: .5em;
    }
    .time-control .box::before {
        border: solid transparent;
        content: '';
        height: 0;
        width: 0;
        position: absolute;
        border-width: .5em;
    }
    .timecode .box {
        background-color: #fff3e1;
        color: black;
        height: 1.8em;
        box-shadow: 0 0 4px 0 black;
        top: 0.5em;
    }
    .timecode .box::before {
        top: -1em;
        left: 0.5em;
        border-top-color: #fff3e1;
        transform: rotate(180deg);
    }
    .current .box::after {
        content: '';
        background: #7c7c7c;
        height: 6px;
        width: 4px;
        position: absolute;
        top: 100%;
        left: 0em;
        margin-left: -2px;
        margin-top: -2.6em;
    }
    .ghost-timecode {
        transition: .3s opacity 0s;
        -webkit-transition: .3s opacity 0s;
        opacity: 0;
        pointer-events: none;
    }
    .ghost-timecode .box::before {
        top: 1.4em;
        border-top-color: #7c7c7c;
    }
    .ghost-timecode .box {
        background-color: #7c7c7c;
        color: #fff3e1;
        height: 1em;
        font-size: 0.75em;
        top: -2.3em;
        left: -1.3em;
    }
    .ghost-timecode{
        position: absolute;
    }
    /* ------------------------------*/
</style>
