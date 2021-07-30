<script>
    import {
        Button,
        Tooltip,
    } from "sveltestrap";
    import {currentRadar, radars } from "../store"
    import WeatherWindy from "svelte-material-icons/WeatherWindy.svelte"
    import { _ } from "../services/i18n";
    import VwPmodal from "../wind/VWPmodal.svelte";
    let isOpen = false
    // ($currentRadar.vwp != "undefined")}

  function showVWP(){
    isOpen = true
  }
</script>

<Button on:click={showVWP} id="vpw_btn" style="width: auto; padding-left: .2em; padding-right: .2em;">
    <WeatherWindy color="white" size="1em" />
</Button>

<VwPmodal bind:isOpen={isOpen}/>

<Tooltip placement="bottom" target="vpw_btn">
    {$_("vwp.tooltip")}
</Tooltip>
