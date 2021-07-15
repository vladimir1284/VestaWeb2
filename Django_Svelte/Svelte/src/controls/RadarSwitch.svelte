<script>
    import {
        Button,
        Input,
        Popover,
        Tooltip,
    } from "sveltestrap";
    import {currentRadar, radars } from "../store"
    import { _ } from "../services/i18n";
    let isOpen = false

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
        currentRadar.set($radars[document.getElementById("radar_sel").value])
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
