<script lang="ts">
    import Run from "svelte-material-icons/Run.svelte";
    import RunFast from "svelte-material-icons/RunFast.svelte";
    import BikeFast from "svelte-material-icons/BikeFast.svelte";
    import { Tooltip } from "sveltestrap";
    import PlayCircle from "svelte-material-icons/PlayCircle.svelte";
    import PauseCircle from "svelte-material-icons/PauseCircle.svelte";
    import { get } from "svelte/store";
    import { current_datetime, layers, finalTime } from "../store";
    import { createProductSource } from "../Layers";
    import { updateStormSettings } from "../storm/storms";
    import { getStorms, getDatetimeList, getClosestProduct, getConsecutiveProduct } from "../backend";
    import { DateTime } from "luxon";
    import { _ } from "../services/i18n";
    import { onMount } from "svelte";

    const TIMELINEWIDTH = 400;

    // Animation handle
    let playing = false;
    let stopped = true;
    let play_interval;
    let datetime_array;
    let initial_datetime;
    let source_array;
    let current_frame;

    // Frames configuration
    const defaultNframes = 6;
    let nframes: string | number = defaultNframes;

    // Update datetime while playing
    function animate() {
        current_datetime.set(datetime_array[current_frame]);
        // Store sources to save network trafic
        if (source_array.length < current_frame + 1) {
            source_array.push(createProductSource());
        }
        get(layers).product.setSource(source_array[current_frame]);
        current_frame = (current_frame + 1) % datetime_array.length; // rotate
    }

    function play_pause() {
        if (stopped) {
            // prepare animation
            startAnimation();
        } else {
            if (playing) {
                // pause animation
                stop();
            } else {
                // restart animation
                play();
            }
        }
    }

    function stop() {
        clearInterval(play_interval);
        playing = false;
        if (initial_datetime !== get(current_datetime)) {
            getStorms();
        } else {
            updateStormSettings("visible", true);
        }
    }

    // Setup the animation
    async function startAnimation() {
        current_frame = 0;
        const product_array = await getDatetimeList(nframes);
        if (product_array.length > 1) {
            datetime_array = []; // init
            source_array = [];
            product_array
                .slice()
                .reverse()
                .forEach(function (item) {
                    datetime_array.push(DateTime.fromISO(item.datetime));
                });
            // Start animation
            stopped = false;
            play();
        } else {
            alert("No existen suficientes prodcutos para la animación!");
        }
    }

    /**
     * Stop the animation.
     * Next start requires setup.
     */
    function terminateAnimation() {
        stopped = true;
        stop();
        source_array = [];
    }

    function play() {
        initial_datetime = get(current_datetime);
        updateStormSettings("visible", false);
        play_interval = setInterval(animate, speed);
        playing = true;
    }

    // Configuration and display
    let position: number = 100;
    let ghost_opacity = 0;
    let ghost_margin = 0;
    let timelabel: string = "";

    interface DurationStr {
        str: string;
        past: boolean;
    }

    /**
     * Returns the time duration in a natural language string
     * @param {DateTime}  datetime - Datetime to compute difference.
     * @return {DurationStr} Duration string and a boolean indicating
     *                       whether datetime is  in the past or the future.
     */
    function timeDeltaStr(datetime: DateTime): DurationStr {
        // Compute difference
        const timeDelta = DateTime.now()
            .diff(datetime, ["years", "months", "days", "hours", "minutes"])
            .toObject();
        let durationStr: string;
        let val: number;
        val = Math.abs(timeDelta.years);
        if (val !== 0) {
            durationStr = $_({ id: "DatePicker.years", values: { n: val } });
        } else {
            val = Math.abs(timeDelta.months);
            if (val !== 0) {
                durationStr = $_({
                    id: "DatePicker.months",
                    values: { n: val },
                });
            } else {
                val = Math.abs(timeDelta.days);
                if (val !== 0) {
                    durationStr = $_({
                        id: "DatePicker.days",
                        values: { n: val },
                    });
                } else {
                    val = Math.abs(timeDelta.hours);
                    if (val !== 0) {
                        durationStr = $_({
                            id: "DatePicker.hours",
                            values: { n: val },
                        });
                    } else {
                        val = Math.abs(timeDelta.minutes);
                        if (val !== 0) {
                            durationStr = $_({
                                id: "DatePicker.minutes",
                                values: { n: val },
                            });
                        } else {
                        }
                    }
                }
            }
        }
        return {
            str: durationStr,
            past: true,
        };
    }

    $: {
        if (typeof $current_datetime !== "undefined") {
            timelabel = get(current_datetime)
                .setZone("local")
                .toFormat("hh:mma");
            try {
                if (!playing) {
                    const delta = timeDeltaStr(get(current_datetime));
                    timelabel +=
                        " - " + (delta.past ? " hace " : " en ") + delta.str;
                }
                // Update position
                currentTimePosition =
                    TIMELINEWIDTH *
                    (1 -
                        get(finalTime).diff($current_datetime, ["hours"])
                            .hours /
                            interval);
            } catch {}
        }
    }

    let currentTimePosition: number = TIMELINEWIDTH;

    const animationSpeed = [1500, 1000, 500];
    let speed: number = animationSpeed[1];

    const animationIntervals = [1, 6, 12];
    let interval: number = animationIntervals[0];

    let ghostTime: DateTime;

    function enableGhost() {
        ghost_opacity = 1;
    }

    function disableGhost() {
        ghost_opacity = 0;
    }

    function getObsTime(e) {
        const rect = e.target.getBoundingClientRect();
        position = e.clientX - rect.left;
        ghostTime = get(finalTime).minus({
            hours: interval * (1 - position / TIMELINEWIDTH),
        });
    }

    /**
     * Change current product on user click
     */
    async function timePick(){
        let newDatetime: DateTime = DateTime.fromISO(await getClosestProduct(ghostTime));
        current_datetime.set(newDatetime);
        // Pick the next obs if the closest is below the timeline range
        if (newDatetime.diff(get(finalTime).minus({hours: interval})) < 0){
            newDatetime = DateTime.fromISO(await getConsecutiveProduct("next"));
            current_datetime.set(newDatetime);
        }
        getStorms();
        get(layers).product.setSource(createProductSource());
    }

    let currentDisplay = "table-cell";

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
        <div on:mouseover={()=>{currentDisplay = "none";}} 
            on:mouseleave={()=>{setTimeout(function(){currentDisplay = "table-cell";}, 500)}} 
        class="current" 
        style="left: {currentTimePosition}px; display: {currentDisplay};">
            <div class="box">
                {#if $current_datetime}
                    {timelabel}
                {/if}
            </div>
        </div>
        <div
            id="progress_line_container"
            on:mousemove={getObsTime}
            on:mouseenter={enableGhost}
            on:mouseleave={disableGhost}
            on:click={timePick}
        >
            <div id="progress_line" class="progress-line" />
            <div
                class="ghost-timecode"
                style="opacity: {ghost_opacity}; left: {position}px; margin-top: {ghost_margin}px;"
            >
                <div class="box">
                    {#if ghostTime}
                        {ghostTime.setZone("local").toFormat("hh:mma")}
                    {/if}
                </div>
            </div>
        </div>
        <div class="animation-config">
            <div class="speed">
                <label class="container">
                    <input
                        name="speed"
                        type="radio"
                        bind:group={speed}
                        value={animationSpeed[0]}
                    />
                    <spam><Run /></spam>
                </label>
                <label class="container">
                    <input
                        name="speed"
                        type="radio"
                        bind:group={speed}
                        value={animationSpeed[1]}
                    />
                    <spam><RunFast /></spam>
                </label>
                <label class="container">
                    <input
                        name="speed"
                        type="radio"
                        bind:group={speed}
                        value={animationSpeed[2]}
                    />
                    <spam><BikeFast /></spam>
                </label>
            </div>
            <div class="interval">
                {#each animationIntervals as ai}
                    <label class="container">
                        <input
                            name="interval"
                            type="radio"
                            bind:group={interval}
                            value={ai}
                        />
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
        top: 10px;
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
    .animation-config {
        margin-top: 0.3em;
        display: flex;
    }
    .animation-config label {
        display: contents;
    }
    .container input {
        position: absolute;
        opacity: 0;
        cursor: pointer;
        height: 0;
        width: 0;
    }
    .animation-config label spam {
        margin-top: 1em;
        font-size: 0.6em;
        padding: 0 0.75em 0 0.75em;
        text-shadow: 0 0 4px #fff3e1;
    }
    .animation-config input:checked ~ spam {
        background-color: #fff3e1 !important;
        border-radius: 1em;
    }
    .interval {
        margin-left: auto;
    }
    .speed spam {
        font-size: 0.75em !important;
        padding-bottom: 0.2em !important;
        background: radial-gradient(#fff3e1, transparent 70%) !important;
    }
    /* ------------------------------*/

    /* --------- Tooltips ------------*/
    .time-control .box {
        cursor: -webkit-grab;
        cursor: -moz-grab;
        cursor: grab;
        position: relative;
        box-sizing: border-box;
        padding: 0 0.8em;
        white-space: nowrap;
        text-align: center;
        display: table-cell;
        vertical-align: middle;
        border-radius: 0.5em;
    }
    .time-control .box::before {
        border: solid transparent;
        content: "";
        height: 0;
        width: 0;
        position: absolute;
        border-width: 0.5em;
    }
    .current .box {
        background-color: #fff3e1;
        color: black;
        height: 1.5em;
        box-shadow: 0 0 4px 0 black;
        transition: 3s display;
        top: -0.5em;
        z-index: 20;
        left: 2.3em;
    }
    .current .box::before {
        top: 1.3em;
        border-top-color: #fff3e1;
    }
    .current .box::after {
        content: "";
        background: #7c7c7c;
        height: 6px;
        width: 4px;
        position: absolute;
        top: 100%;
        left: 1.2em;
        margin-left: 0;
        margin-right: 0;
        margin-top: 0.3em;
    }
    .current {
        position: absolute;
    }
    .ghost-timecode {
        transition: 0.3s opacity 0s;
        -webkit-transition: 0.3s opacity 0s;
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
        z-index: 30;
    }
    .ghost-timecode {
        position: absolute;
    }
    /* ------------------------------*/
</style>
