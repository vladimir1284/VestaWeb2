<script lang="ts">
    import { currentProduct } from "../store";
    import type {Palette} from "../store";

    let colors: string;
    let palette: Palette;
    let tick_width: number = 12.5;
    $: palette = $currentProduct.palette;

    $: {
        if (palette) {
            colors = palette.colors.join(",");
            colors = palette.colors[0] + "," + 
                     colors + "," + palette.colors.slice(-1);
        }
    }
</script>

<div
    id="legend_control"
    data-ref="legend"
    class="metric-legend noselect"
    data-tooltipsrc="CLICK_ON_LEGEND"
    data-tooltip="Pulsa para cambiar las unidades"
    data-overlay="wind"
    style="background: linear-gradient(to right, 
    {colors}
    );"
>
    {#if palette}            
        <span style="width: {tick_width}%">{palette.unit}</span>
        {#each palette.tickValues as value}                
            <span style="width: {tick_width}%">{value}</span>
        {/each}
    {/if}
</div>

<style>
    #legend_control {
        color: black;
        width: 100%;
        background-color: #7c7c7c;
        white-space: nowrap;
        font-size: 12px;
        box-shadow: 0 0 4px 0 #fff3e1;
        cursor: pointer;
        -webkit-tap-highlight-color: initial;
        transition: 0.3s opacity;
        margin-bottom: 1px;
        border-radius: 20px;
    }
    .metric-legend span {
        display: inline-block;
        line-height: 1.5;
        text-align: center;
        vertical-align: middle;
    }
</style>
