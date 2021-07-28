<script>
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import proj4 from 'proj4';
    import {register} from 'ol/proj/proj4';
    import {MousePosition, defaults} from 'ol/control'
    import Overlay from 'ol/Overlay';
    import {transform} from 'ol/proj';

    import { onMount, afterUpdate } from 'svelte';
    import RadarOL from './RadarOL.svelte';
    import StormOL, {createStromsOverlay} from './storm/StormOL.svelte';
    import StormModal from './storm/StormModal.svelte'
    import StormTable from './storm/StormTable.svelte'
    import Trends from './storm/Trends.svelte'
    import { createLayers } from './Layers'
    import Legend, {legendController} from './controls/Legend'
    import Logo, {logoController} from './controls/Logo'
    import Pannel, {pannelController} from './controls/Pannel'
    import { get } from 'svelte/store'

    import { mapProj, view, layers, map, radars } from './store'
    import { init } from './backend';

    // Settings
    let zoom = get(view).zoom
    let center = get(view).center

    // State variables
    let map_layers
    let StormData = {'show':false, 'storm':null}
    let showStormTable = false
    let show_label = false
    let radars_array


    function createMap(){
        // Create projections
        // TODO select a non deprecated EPSG proyection for the map
        proj4.defs("EPSG:2085",
                "+proj=lcc +lat_1=22.35 +lat_0=22.35 +lon_0=-81"+
                " +k_0=0.99993602 +x_0=500000 +y_0=280296.016"+
                " +ellps=clrk66 +units=m +datum=NAD27 +no_defs");
        
            radars_array.forEach(function (radar, index){
            proj4.defs(radar.id,
                `+proj=aeqd +lat_0=${radar.location.lat} +lon_0=${radar.location.lon}` +
                "+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
        });
        register(proj4);


        // Mouse position control
        const mousePositionControl = new MousePosition({
            coordinateFormat: (function createStringXY(coordinate) { 
                                    const lon_sign =  (coordinate[0]<0)?'W':'E'  
                                    const lat_sign =  (coordinate[1]<0)?'S':'N'                                   
                                    return (Math.abs(coordinate[1]).toFixed(4)+
                                            "&deg"+lat_sign + " " + 
                                            Math.abs(coordinate[0]).toFixed(4)+
                                            "&deg"+lon_sign)
                                }),
            projection: 'EPSG:4326',
            undefinedHTML: '',
        });
        
        // Legend object
        let legendControl = legendController();

        // Legend object
        let pannelControl = pannelController();

        // Logo
        let logoControl = logoController();


        // Layers
        createLayers();
        map_layers = [get(layers)['orography'],
                        get(layers)['osm'],
                        get(layers)['product'],
                        get(layers)['cover'],
                        get(layers)['trends']]

        const mapView = new View({
            projection: mapProj,
            center: center,
            zoom: zoom
            })
            mapView.on('change:center', function(){
                center = mapView.getCenter()
                view.set({zoom: zoom, center: center}) // Persist
        });

        const map = new Map({
            controls: defaults().extend([mousePositionControl, 
                                        // LayerSwitchControl, 
                                        legendControl,
                                        logoControl,
                                        pannelControl]),
            view: mapView,
            layers: map_layers,
            target: 'map'
        });

        map.on('moveend', function() {
            zoom = map.getView().getZoom()
            view.set({zoom: zoom, center: center}) // Persist    
        
        });     
        
        
     return map   
    }

    async function mapAction() {   
        await init()  
        radars_array = Object.values(get(radars))
        map.set(createMap())
        // Overlay de las tormentas
        try {
            createStromsOverlay()            
        } catch (error) {
            console.log(error)
        }
    }

    // Do the job once the DOM was generated
    onMount(mapAction);

    function radarOverlays(){
    if (radars_array){          
        // Overlay en la ubicación de los radares
        radars_array.forEach(function (radar, index){
            const radar_ol = new Overlay({
                element: document.getElementById(`radar-${radar.id}`),
                positioning: 'center-center'
            });
            radar_ol.setPosition(transform([0,0], radar.id, mapProj));
            get(map).addOverlay(radar_ol);
        });   
    }
  }

  afterUpdate(radarOverlays)
</script>


<div id="map" class="map"></div>
<div id="mouse-position"></div>

<!-- Mostrar las celdas de tormenta -->
<StormOL 
    bind:StormData={StormData}
    show_label={show_label}
/>

<!-- Mostrar los emplazamientos de currentRadar -->
{#if radars_array}
    {#each radars_array as radar}
        <RadarOL radar={radar}/>
    {/each}
{/if}

<!-- Mostrar los datos de la celda seleccionada -->
<StormModal bind:StormData={StormData}/>

<!-- Mostrar la tabla de las celdas de tormenta -->
<StormTable 
    bind:showStormTable={showStormTable}
    bind:show_label={show_label}
/>


<Pannel 
    bind:showStormTable={showStormTable}
/>

<Legend/>
<Logo/>

<Trends/>


<style>
	.map {
		width: 100%;
		height:100%;
        position: fixed;
        top: 0;
    }
</style>