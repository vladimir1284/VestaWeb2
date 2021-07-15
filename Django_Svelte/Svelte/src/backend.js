import {current_datetime, radars, currentRadar, currentProduct, 
        baseAPI, availableProducts, storms, stormSettings} from './store'
import {get} from 'svelte/store'

var { DateTime } = require('luxon');

// Set to true for online demo
const DEBUG = false

export async function init(){
    await getRadars()
    await getLastProduct()

    const ap = await getAvailableProducts()
    const ap_promises = []
    for(let i = 0; i < ap.length; i++){
        const product = await getProductDescription(ap[i])
        ap_promises.push(product)
    }
    const ap_array = await Promise.all(ap_promises)
    availableProducts.set(ap_array)
    currentProduct.set(ap_array[0])

    await getStorms()
    return true
}

async function getAvailableProducts(){
    const apiURL = baseAPI + get(currentRadar).id + '/available/' + 
                    get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'")
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    return items.available_products
}

async function getProductDescription(pcode){
    const apiURL = baseAPI + 'description/' + pcode
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    return items.description
}

async function getRadars(){
    const apiURL = baseAPI + 'get_radars'
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    radars.set(items.radars)
    return currentRadar.set(items.radars["CCNR"]) // TODO this will be MOSAIC     
}

async function getLastProduct(){
    const apiURL = baseAPI + get(currentRadar).id +  '/last'
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    return current_datetime.set(DateTime.fromISO(items.datetime))
}

async function getStorms(){
    const apiURL = baseAPI + get(currentRadar).id +  '/storm_cells/'+ 
                    get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'")
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    const storm_list = items.storm_cells
    const settings = {}
    storm_list.forEach(storm => {
        // Initialize storm settings
        settings[storm.id] = {'future': false,
                            'past': false,
                            'visible': true}        
    });
    stormSettings.set(settings)
    return storms.set(storm_list)
}