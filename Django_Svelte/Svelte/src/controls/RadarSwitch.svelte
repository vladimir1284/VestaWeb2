<script context="module" lang="ts">
    import {
        getClosestProduct,
        getAvailableProducts,
        getProductDescription,
        getStorms,
    } from "../backend";
    import {
        current_datetime,
        availableProducts,
Product,
    } from "../store";
    import type {Radar} from "../store";
    import { DateTime } from "luxon";
    import { get } from "svelte/store";

    export async function switchRadar(radar_id: string) {
        currentRadar.set(get(radars)[radar_id]);

        // Try to get the closest product for the new radar
        const datetime = await getClosestProduct(get(current_datetime));
        const cls = DateTime.fromISO(datetime);
        const timeDelta = get(current_datetime).diff(cls, ["minutes"]);
        if (Math.abs(timeDelta.minutes) > 15) {
            const result = window.confirm(
                `No encontramos el producto actual para el radar y la hora seleccionada.
                ¿Desea cambiar de radar aún así?`
            );
            if (!result){
                return false;
            }
        }

        const ap = await getAvailableProducts();
        const ap_promises = [];
        for (let i = 0; i < ap.length; i++) {
            const product = await getProductDescription(ap[i]);
            ap_promises.push(product);
        }
        const ap_array = await Promise.all(ap_promises);
        availableProducts.set(ap_array);        
        if (ap.indexOf(get(currentProduct).id) < 0) {
            currentProduct.set(ap_array[0]);
        } else {
            // Synchronize with the product menu (reactively)
            ap_array.forEach((product: Product) => {
                if(product.id === get(currentProduct).id){
                    currentProduct.set(product);
                }
            });
            
        }

        await getStorms();
        get(layers).product.setSource(createProductSource());
        get(layers).cover.setSource(createCoverSource(get(currentProduct)));
    }
</script>

<script lang="ts">
    import { Button, Input, Popover, Tooltip } from "sveltestrap";
    import { currentRadar, radars, layers, currentProduct } from "../store";
    import { _ } from "../services/i18n";
    let isOpen = false;
    // import { get } from 'svelte/store';
    // import {getStorms} from "../backend";
    import { createProductSource, createCoverSource } from "../Layers";

    // let radar: string;
    let radar_list: Radar[];

    // Initial setup after data fetch from server
    $: radar_list = Object.values($radars);

    // Update current radar
    function updateRadar() {
        switchRadar(
            (<HTMLInputElement>document.getElementById("radar_sel"))
                .value as string
        );
        isOpen = false;
    }
</script>

{#if typeof $currentRadar !== "undefined"}
    <Button
        id="radar"
        style="width: auto; padding-left: .2em; padding-right: .2em;"
    >
        {$currentRadar.id}
    </Button>

    <Popover placement="bottom" target="radar" bind:isOpen>
        <Input
            bind:value={$currentRadar.id}
            on:change={updateRadar}
            type="select"
            name="radar"
            id="radar_sel"
        >
            {#each radar_list as radar}
                <option>{radar.id}</option>
            {/each}
        </Input>
    </Popover>
{/if}

<Tooltip placement="bottom" target="radar">
    {$_("RadarSwitch.radar")}
</Tooltip>
