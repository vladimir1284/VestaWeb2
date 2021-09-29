
import { get } from "svelte/store";
import { current_datetime, layers } from "../store";
import {createProductSource} from "../Layers";
import {updateStormSettings} from "../storm/storms";
import { getStorms, getConsecutiveProduct, getDatetimeList } from "../backend";
import { DateTime } from 'luxon';

// Animation handle
let playing = false;
let stopped = true;
let play_interval;
let datetime_array;
let initial_datetime;
let source_array;
let current_frame;
const delay = 1000; // ms

// Frames configuration
const defaultNframes = 6;
let nframes: string | number = defaultNframes;

// Update datetime while playing
function animate(){
    current_datetime.set(datetime_array[current_frame]);
    // Store sources to save network trafic
    if (source_array.length < (current_frame + 1)){
        source_array.push(createProductSource());
    }
    get(layers).product.setSource(source_array[current_frame]);
    current_frame = (current_frame + 1) % datetime_array.length; // rotate
}

function play_pause(){
    if (stopped){ // prepare animation
        startAnimation();
    } else {
        if (playing){ // pause animation
            stop();
        } else { // restart animation
            play();
        }
    }
}

function stop(){
    clearInterval(play_interval);
    playing = false;
    if (initial_datetime !== get(current_datetime)){
        getStorms();
    } else {
        updateStormSettings('visible', true);
    }
}

// Setup the animation 
async function startAnimation(){
    current_frame = 0
    const product_array = await getDatetimeList(nframes)
    if (product_array.length > 1) {
        datetime_array = []; // init
        source_array = [];
        product_array.slice().reverse()
            .forEach(function (item) {
            datetime_array.push(DateTime.fromISO(item.datetime));
        })
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
function terminateAnimation(){
    stopped = true;
    stop();
    source_array = [];
}

function play(){
    initial_datetime = get(current_datetime);
    updateStormSettings('visible', false);
    play_interval = setInterval(animate, delay);
    playing = true;
}

export{play_pause, playing}