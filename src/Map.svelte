<script>
    import 'ol/ol.css';
    import Map from 'ol/Map';
    import View from 'ol/View';
    import proj4 from 'proj4';
    import {getCenter} from 'ol/extent';
    import {register} from 'ol/proj/proj4';
    import {MousePosition, defaults, Control} from 'ol/control'
    import {createStringXY} from 'ol/coordinate';
    import Overlay from 'ol/Overlay';
    import {transform} from 'ol/proj';

    import { onMount } from 'svelte';
    import RadarPopup from './RadarPopup.svelte';
    import { Icon } from 'sveltestrap';
    import LayerSwitch, {layerController} from './LayerSwitch.svelte'
    import { getLayers } from './Layers.svelte'

    let layers;

    proj4.defs("EPSG:2085",
            "+proj=lcc +lat_1=22.35 +lat_0=22.35 +lon_0=-81"+
            " +k_0=0.99993602 +x_0=500000 +y_0=280296.016"+
            " +ellps=clrk66 +units=m +datum=NAD27 +no_defs");
    proj4.defs("CCNR:1000",
            "+proj=aeqd +lat_0=21.4233 +lon_0=-77.8487" +
            "+x_0=0 +y_0=0 +datum=WGS84 +units=m +no_defs");
    register(proj4);

    function createMap(){
        const baseExtent = [-802183, -659851, 1997816, 1040148];

        const mousePositionControl = new MousePosition({
            coordinateFormat: createStringXY(4),
            projection: 'EPSG:4326',
            undefinedHTML: '',
        });
        
        // Layer switcher object
        let LayerSwitchControl = layerController();

        // Layers
        layers = getLayers();
        let map_layers = Object.keys(layers).map(function(key){
            return layers[key];
        });

        const map = new Map({
            controls: defaults().extend([mousePositionControl, LayerSwitchControl]),
            view: new View({
            projection: 'EPSG:2085',
            center:getCenter(baseExtent),
            zoom: 7
            }),
            layers: map_layers,
            target: 'map'
        });

        // Overlay en la ubicación del radar
        var radar = new Overlay({
            element: document.getElementById('radar'),
            positioning: 'center-center'
        });
        radar.setPosition(transform([0,0],'CCNR:1000','EPSG:2085'));
        map.addOverlay(radar);
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
<RadarPopup/>
<LayerSwitch layers={layers}/>

<style>
	.map {
		width: 100%;
		height:100%;
        position: fixed;
        top: 0;
    }
</style>