<script context="module">
    import {ImageStatic as Static, Vector as VectorSource} from 'ol/source';
    import {Image as ImageLayer, Vector as VectorLayer} from 'ol/layer';
    import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
    import Feature from 'ol/Feature';
    import Circle from 'ol/geom/Circle';
    import {fromCircle, fromExtent} from 'ol/geom/Polygon';
    import Polygon from 'ol/geom/Polygon';
    import {transform} from 'ol/proj';

    // Import globals from store.js
    import { mapExtend, product_base_url, currentRadar, currentProduct, current_datetime, mapProj} from './store.js'
    import { get } from 'svelte/store'
    const baseExtend = get(mapExtend)
    const baseUrl = get(product_base_url)
    const radar = get(currentRadar)
    const product = get(currentProduct)
    const datetime = get(current_datetime)
    const map_proj = get(mapProj)

    export function getLayers(){
        console.log(`Extend: ${baseExtend}`)    
        //A Raster base layer	
        const baseLayer = new ImageLayer({
            source:new Static({
                url: baseUrl +'Mosaico-Cuba-Norte-1km.gif',
                projection: map_proj,
                imageExtent: baseExtend,
            })
        });

        // Layer with the desired product
        let productLayer = new ImageLayer({
            source:new Static({
                url: baseUrl + radar.id + '/' + product.id + '_' + datetime + '.png',
                projection: radar.proj,
                imageSmoothing: false,
                imageExtent: [-product.range, -product.range, product.range, product.range],
            }),
            opacity: 0.5
        });

        // ------------ Cover -----------------
        var fill = new Fill({
        color: 'rgba(255,255,255,0.1)'
        });
        
        var coverSource = new VectorSource({wrapX: false});

        let coverLayer = new VectorLayer({
            source: coverSource,
        });
        var circleCoords = fromCircle(new Circle(
            transform([0,0],radar.proj,map_proj), product.range)).getCoordinates();

        var polygonCords = fromExtent(baseExtend).getCoordinates();
        var coords = [polygonCords[0], circleCoords[0]];

        var inversePolygon = new Feature(new Polygon(coords));
        inversePolygon.setStyle(new Style({
            fill: fill
        }));

    
        coverSource.addFeature(inversePolygon);
        
        // ------------------------------------

        return ({'base': baseLayer,
                'product': productLayer,
                'cover': coverLayer});
    }
</script>