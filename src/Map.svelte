<script>
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import proj4 from 'proj4';
    import {getCenter} from 'ol/extent';
    import {register} from 'ol/proj/proj4';
    import {MousePosition, defaults} from 'ol/control'
    import {createStringXY} from 'ol/coordinate';
    import Overlay from 'ol/Overlay';
    import {transform} from 'ol/proj';

    import { onMount } from 'svelte';
    import RadarOL from './RadarOL.svelte';
    import StormOL from './storm/StormOL.svelte';
    import StormModal from './storm/StormModal.svelte'
    import StormTable from './storm/StormTable.svelte'
    import Trends from './storm/Trends.svelte'
    import LayerSwitch, {layerController} from './controls/LayerSwitch.svelte'
    import { getLayers } from './Layers'
    import Legend, {legendController} from './controls/Legend'
    import Logo, {logoController} from './controls/Logo'

    import { currentRadar, mapExtend, mapProj } from './store'
    import { radars } from './db/radars';
    import {availableProducts} from './db/products'
    import {storms} from './db/storms'

    // State variables
    let layers
    let map_layers
    // let show_storms = true
    let StormData = {'show':false, 'storm':null}
    let showStormTable = false
    let show_label = false
    let stormSettings = {}
    let selectedProduct = availableProducts[0];

    // Initialize storm settings
    storms.forEach(function (storm, index){
        stormSettings[storm.id] = {
            'future': true,
            'past': true,
            'visible': true
        }
    })
    // reaisign for recognizing state change
    stormSettings = stormSettings 

    // Create projections
    // TODO select a non deprecated EPSG proyection for the map
    proj4.defs("EPSG:2085",
            "+proj=lcc +lat_1=22.35 +lat_0=22.35 +lon_0=-81"+
            " +k_0=0.99993602 +x_0=500000 +y_0=280296.016"+
            " +ellps=clrk66 +units=m +datum=NAD27 +no_defs");
    
    radars.forEach(function (radar, index){
        proj4.defs(radar.id,
            `+proj=aeqd +lat_0=${radar.location.lat} +lon_0=${radar.location.lon}` +
            "+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    });
    register(proj4);

    function createMap(){
        const mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326',
            undefinedHTML: '',
        });
        
        // Legend object
        let legendControl = legendController();

        // Logo
        let logoControl = logoController();

        // Layer switcher object
        let LayerSwitchControl = layerController();

        // Layers
        layers = getLayers(stormSettings);
        map_layers = [layers['orography'],
                        layers['osm'],
                        layers['product'],
                        layers['cover'],
                        layers['trends']]
        const map = new Map({
            controls: defaults().extend([mousePositionControl, 
                                        LayerSwitchControl, 
                                        legendControl,
                                        logoControl]),
            view: new View({
            projection: mapProj,
            center:getCenter(mapExtend),
            zoom: 7
            }),
            layers: map_layers,
            target: 'map'
        });

        // Overlay en la ubicación de los radares
        radars.forEach(function (radar, index){
            const radar_ol = new Overlay({
                element: document.getElementById(`radar-${radar.id}`),
                positioning: 'center-center'
            });
            radar_ol.setPosition(transform([0,0], radar.id, mapProj));
            map.addOverlay(radar_ol);
        });        
        
        // Overlay de las tormentas
        storms.forEach(function (storm, index){
            const storm_ol = new Overlay({
                'id':storm.id,
                element: document.getElementById(`storm-${storm.id}`),
                positioning: 'center-center'
            });
            storm_ol.setPosition(transform([storm.Ipos,storm.Jpos], currentRadar.id, mapProj));
            map.addOverlay(storm_ol);
        });
     return map   
    }

    function mapAction() {
        let map = createMap();
        return {
            destroy: () => {
                map.remove();
            },
        };
    }

    // Do the job once the DOM was generated
    onMount(mapAction);
</script>

<div id="map" class="map"></div>
<div id="mouse-position"></div>

<!-- Mostrar las celdas de tormenta -->
<StormOL 
    storm_list={storms} 
    stormSettings={stormSettings} 
    bind:StormData={StormData}
    show_label={show_label}
/>

<!-- Mostrar los emplazamientos de currentRadar -->
{#each radars as radar}
    <RadarOL radar={radar}/>
{/each}

<!-- Mostrar los datos de la celda seleccionada -->
<StormModal bind:StormData={StormData}/>

<!-- Mostrar la tabla de las celdas de tormenta -->
<StormTable 
    bind:showStormTable={showStormTable}
    bind:show_label={show_label}
    bind:stormSettings={stormSettings}
/>

<LayerSwitch 
    layers={layers} 
    bind:stormSettings={stormSettings}
    bind:showStormTable={showStormTable}
    bind:selectedProduct={selectedProduct}
/>

<Legend selectedProduct={selectedProduct}/>
<Logo/>

<Trends stormSettings={stormSettings}/>

<style>
	.map {
		width: 100%;
		height:100%;
        position: fixed;
        top: 0;
    }
</style>