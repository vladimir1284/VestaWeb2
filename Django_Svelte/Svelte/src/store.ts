import { writable as writable_local } from 'svelte-local-storage-store'
import { getCenter } from 'ol/extent';
import { writable } from 'svelte/store';
import type {Layer} from 'ol/layer';
import { DateTime } from 'luxon';

export const base_url = 'imgs/'

export const baseAPI = "http://localhost:8000/vestaweb/"

export const current_datetime = writable(DateTime.utc())

export interface Storm {id: string;
                        azimut: number;
                        range: number;
                        tops: number[];
                        bases: number[];
                        max_ref_hgts: number[];
                        centroids: number[];
                        poh: number[];
                        posh: number[];
                        vil: number[];
                        maxZ: number[];
                        lst_vol_data_ptr: number;
                        Ipos: number;
                        Jpos: number;
                        past_Ipos: number[];
                        past_Jpos: number[];
                        forecast_Ipos: number[];
                        forecast_Jpos: number[];
                        settings:  {future: boolean;
                                    past: boolean;
                                    visible: boolean}}

export const storms = writable([<Storm>{}])
export const storm_times = writable()

export const map = writable()

export interface Radar {id: string;
                        name: string; 
                        location: {lat: number; lon: number};
                        status: string;
                        last: string}
export const currentRadar = writable(<Radar>{})

export const radars = writable([<Radar>{}])

export interface LayerDict {orography: Layer;
                            osm: Layer;
                            product: Layer;
                            cover: Layer;
                            trends: Layer}
export const layers = writable(<LayerDict>{})

export interface Product   {datetime: string;
                            palette: string;
                            id: string;
                            range: number}
export const currentProduct = writable(<Product>{})

export const availableProducts = writable([])

export const defaultProductOpacity = 0.5

export const mapProj = 'EPSG:2085'

export const mapExtend = [-302183.53173887, -409851.12978591,
    1497816.46826113, 790148.87021409]

export const defaultBaseLayer = writable_local('baseLayer', 'osm');

const defaultCenter = getCenter(mapExtend)
export const view = writable_local('view', {
    zoom: 7,
    center: defaultCenter
})

