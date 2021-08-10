 import { writable as writable_local } from 'svelte-local-storage-store'
import { getCenter } from 'ol/extent';
import { writable } from 'svelte/store';

var { DateTime } = require('luxon');

export const base_url = 'imgs/'

export const baseAPI = "http://localhost:8000/vestaweb/"

export const current_datetime = writable(DateTime.utc())

export const storms = writable()
export const storm_times = writable()

export const map = writable()

export const radars = writable({})

export const currentRadar = writable({})

export const layers = writable({})

export const currentProduct = writable({})

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

