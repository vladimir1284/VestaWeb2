import { writable } from 'svelte/store'
import { availableProducts } from './db/products.js';
import { radars } from './db/radars.js';
var { DateTime } = require('luxon');

export const product_base_url = 'imgs/'

export const current_datetime = writable(DateTime.utc(1993, 3, 13, 10, 33))


export const currentRadar = writable(radars[0])


export const currentProduct = writable(availableProducts[0])

export const defaultProductOpacity = writable(0.5)

export const mapProj = 'EPSG:2085'

export const mapExtend = [-302183.53173887, -409851.12978591, 
                            1497816.46826113, 790148.87021409]



