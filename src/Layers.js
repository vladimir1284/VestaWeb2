import {ImageStatic as Static, Vector as VectorSource} from 'ol/source';
import {Image as ImageLayer, Vector as VectorLayer} from 'ol/layer';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import {Fill, Style} from 'ol/style';
import Feature from 'ol/Feature';
import Circle from 'ol/geom/Circle';
import {fromCircle, fromExtent} from 'ol/geom/Polygon';
import Polygon from 'ol/geom/Polygon';
import {transform} from 'ol/proj';

import {createTrendsSource} from './storm/Trends.svelte'
import { mapExtend, product_base_url, currentRadar, currentProduct, current_datetime, mapProj} from './store.js'
import { get } from 'svelte/store'

const radar = get(currentRadar)
const product = get(currentProduct)
const datetime = get(current_datetime)

const fill = new Fill({
    color: 'rgba(255,255,255,0.1)'
    });
const polygonCords = fromExtent(mapExtend).getCoordinates();

export function createCoverSource(product){
    const coverSource = new VectorSource({wrapX: false});

    const circleCoords = fromCircle(new Circle(
                transform([0,0],radar.id,mapProj), product.range)).getCoordinates();
    const coords = [polygonCords[0], circleCoords[0]];
    const inversePolygon = new Feature(new Polygon(coords));
    inversePolygon.setStyle(new Style({fill: fill}));

    coverSource.addFeature(inversePolygon);
    return coverSource;
}

export function createProductSource(product){
    return new Static({
        url: product_base_url + radar.id + '/' + product.id + '_' + datetime.toFormat('yyyy-MM-dd_hh-mm-ss') + '.png',
        projection: radar.id,
        imageSmoothing: false,
        imageExtent: [-product.range, -product.range, 
                        product.range, product.range],
    });
}

export function getLayers(stormSettings){  
    //A Raster base layer	
    const orographyLayer = new ImageLayer({
        source:new Static({
            url: product_base_url +'Mosaico-Cuba-Norte-1km.gif',
            projection: mapProj,
            imageExtent: mapExtend,
        })
    });
    
    //A Raster base layer	
    const osmLayer = new TileLayer({
        source: new OSM(),
        visible: false
    })

    // Layer with the desired product
    let productLayer = new ImageLayer('product',{
        source: createProductSource(product),
        opacity: 0.5
    });

    // ------------ Cover -----------------
    let coverLayer = new VectorLayer({source: createCoverSource(product)});

    // ------------ Trends -----------------
    let trendsLayer = new VectorLayer({source: createTrendsSource(stormSettings)});
    
    // ------------------------------------
    return ({'orography': orographyLayer,
            'osm':osmLayer,
            'product': productLayer,
            'cover': coverLayer,
            'trends': trendsLayer});
}