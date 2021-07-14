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
    import { get } from "svelte/store";
    import { current_datetime, baseAPI, currentRadar, currentProduct, layers } from "../store"
    import {createProductSource} from "../Layers"

    var { DateTime } = require('luxon');

    // Animation handle
    let playing = false
    let stopped = true
    let play_interval
    let datetime_array
    let source_array
    let current_frame
    const delay = 1000 // ms

    // Frames configuration
    const minNframes = 4
    const maxNframes = 20
    const defaultNframes = 6
    let nframes = defaultNframes

    // Setup the animation 
    async function startAnimation(){
        current_frame = 0
        // Request the list of datetimes 
        const apiURL = baseAPI + get(currentRadar).id + '/' + 
                        get(currentProduct).id + '/' + 
                        get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'") +
                        '/' + nframes
        const res = await fetch(apiURL)
        if (!res.ok) throw new Error('Bad response from: ' + apiURL)
        const items = await res.json()

        if (items.product_array.length > 1) {
            datetime_array = [] // init
            source_array = []
            items.product_array.slice().reverse()
                .forEach(function (item, index) {
                datetime_array.push(DateTime.fromISO(item.datetime))
            })
            // Start animation
            stopped = false
            play_interval = setInterval(animate, delay)
            playing = true
        } else {
            alert("No hay productos suficientes para la animación!")
        }
    }

    // Stop the animation. Next start requires setup.
    function terminateAnimation(){
        stopped = true
        playing = false
        clearInterval(play_interval)
    }

    // Update datetime while playing
    function animate(){
        current_datetime.set(datetime_array[current_frame])
        // Store sources to save network trafic
        if (source_array.length < (current_frame + 1)){
            source_array.push(createProductSource())
        }
        get(layers).product.setSource(source_array[current_frame])
        current_frame = (current_frame + 1) % datetime_array.length // rotate
    }

    function play_pause(){
        if (stopped){ // prepare animation
            startAnimation()
        } else {
            if (playing){ // pause animation
                clearInterval(play_interval)
                playing = false
            } else { // start animation
                play_interval = setInterval(animate, delay)
                playing = true
            }
        }
    }

    function next(){
        changeObservation('next')
    }

    function previous(){
        changeObservation('previous')
    }

    async function changeObservation(fcode){
        // Request the closest product 
        const apiURL = baseAPI + get(currentRadar).id + '/' + 
                        get(currentProduct).id + '/' + fcode + '/' + 
                        get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'")
        const res = await fetch(apiURL)
        if (!res.ok) throw new Error('Bad response from: ' + apiURL)
        const items = await res.json()
        const product = items.product
        if (typeof(product)!="undefined"){
            current_datetime.set(DateTime.fromISO(product.datetime))
            get(layers).product.setSource(createProductSource())
        } else {
            const np = (fcode == "next")?'posterior':'anterior'
            alert("No hay un producto " + np + " a " + 
                    get(current_datetime).setZone('local').toFormat('dd/MMM/y HH:mma'))
        }
    }

    $:{
        nframes = (nframes < minNframes)?minNframes:nframes
        nframes = (nframes > maxNframes)?maxNframes:nframes
    }

</script>

<div id="animation">

    <div>
        <Button id="previous_btn" on:click={previous}
            ><SkipPreviousCircleOutline color="white" size="1.5em" />
        </Button>
    </div>
    <div>
        <Button id="stop_btn" on:click={terminateAnimation}
            ><StopCircleOutline color="white" size="1.5em" />
            </Button>
    </div>

    <div>
        <Button id="play_pause_btn" on:click={play_pause}>
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
        <Button id="next_btn" on:click={next}>
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
