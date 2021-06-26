import { writable, readable } from 'svelte/store'

export const product_base_url = readable('http://localhost/testol/')

export const current_datetime = writable('2021-06-03_16-18-00')

const ccnr = {
    'id': 'CCNR',
    'proj': 'CCNR:1000',
    'name': 'Radar de Camagüey'
}


export const currentRadar = writable(ccnr)

const cre_97 = {
    'id': "CRE_97",
    'range':232000
}
const et_41 = {
    'id': "ET_41",
    'range':232000
}

export const availableProducts = writable([
    cre_97,
    et_41
])

export const currentProduct = writable(cre_97)

export const defaultProductOpacity = writable(0.5)

export const mapProj = readable('EPSG:2085')

export const mapExtend = readable([-302183.53173887, -409851.12978591, 1497816.46826113, 790148.87021409])