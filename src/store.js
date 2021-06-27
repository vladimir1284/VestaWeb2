import { writable, readable } from 'svelte/store'

export const product_base_url = readable('http://localhost/testol/')

export const current_datetime = writable('2021-06-03_16-18-00')

const ccnr = {
    'id': 'CCNR',
    'name': 'Centro Nacional de Radares',
    'location': {'lat': 21.4233, 'lon':-77.8487}
}

const ccsb = {
    'id': 'CCSB',
    'name': 'Casa Blanca',
    'location': {'lat': 23.1495, 'lon':-82.3500}
}

export const radars = readable([ccnr, ccsb])

export const currentRadar = writable(ccnr)

const cre_97 = {
    'id': "CRE_97",
    'range':232000,
    'name': "Máximos 230km"
}
const cre_98 = {
    'id': "CRE_98",
    'range':464000,
    'name': "Máximos 460km"
}
const et_41 = {
    'id': "ET_41",
    'range':232000,
    'name': "Topes"
}

export const availableProducts = writable([
    cre_97,
    cre_98,
    et_41
])

export const currentProduct = writable(cre_97)

export const defaultProductOpacity = writable(0.5)

export const mapProj = readable('EPSG:2085')

export const mapExtend = readable([-302183.53173887, -409851.12978591, 
                                    1497816.46826113, 790148.87021409])

let a0 = {'id': 'A0', 'lon': -76.0243, 'lat': 21.3411}
let b0 = {'id': 'B0', 'lon': -77.9044, 'lat': 22.0803}
let c0 = {'id': 'C0', 'lon': -77.8414, 'lat': 22.0397}
let d0 = {'id': 'D0', 'lon': -78.2311, 'lat': 21.9715}
let e0 = {'id': 'E0', 'lon': -77.5922, 'lat': 21.9492}
let f0 = {'id': 'F0', 'lon': -78.1532, 'lat': 21.7594}
let g0 = {'id': 'G0', 'lon': -77.3144, 'lat': 21.1492}
let h0 = {'id': 'H0', 'lon': -75.9063, 'lat': 21.3308}
let i0 = {'id': 'I0', 'lon': -77.8945, 'lat': 21.2833}

export const storms = writable([a0, b0, c0, d0, e0, f0, g0, h0, i0])