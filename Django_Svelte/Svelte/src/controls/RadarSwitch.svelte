<script context="module">
    import {getClosestProduct} from "../backend"
    import {current_datetime } from "../store"
    var { DateTime } = require('luxon');

    export async function switchRadar(radar_id){
        currentRadar.set(get(radars)[radar_id])

        // Try to get the closest product for the new radar
        const datetime = await getClosestProduct(get(current_datetime))
        const cls = DateTime.fromISO(datetime)
        const timeDelta = get(current_datetime).diff(cls, ['minutes'])
        if(Math.abs(timeDelta.minutes) > 15){
            alert("No encotramos el producto actual para el radar y la hora seleccionada")
        }

        getStorms()
        get(layers).product.setSource(createProductSource())
        get(layers).cover.setSource(createCoverSource(get(currentProduct)))
    }
</script>

<script>
    import {
        Button,
        Input,
        Popover,
        Tooltip,
    } from "sveltestrap";
    import {currentRadar, radars, layers, currentProduct } from "../store"
    import { _ } from "../services/i18n";
    let isOpen = false
    import { get } from 'svelte/store'
    import {getStorms} from "../backend"
    import {createProductSource, createCoverSource} from "../Layers"

    let radar
    let radar_list

    // Initial setop after data fetch from server
    $: radar_list = Object.values($radars)
    $: {
        if (!radar){
            radar = $currentRadar.id
        }
    }

    // Update current radar
    function updateRadar(){        
        switchRadar(document.getElementById("radar_sel").value)
        isOpen = false
    }
</script>

{#if (typeof($currentRadar) != "undefined")}
    <Button id="radar" style="width: auto; padding-left: .2em; padding-right: .2em;">
        {$currentRadar.id}
    </Button>

    <Popover placement="bottom" target="radar" bind:isOpen>
        <Input
        bind:value={radar}
        on:change={updateRadar}          
        type="select"
        name="radar"
        id="radar_sel">
            {#each radar_list as radar}
                <option>{radar.id}</option>
            {/each}
        </Input>
    </Popover>
{/if}

<Tooltip placement="bottom" target="radar">
    {$_("RadarSwitch.radar")}
</Tooltip>
