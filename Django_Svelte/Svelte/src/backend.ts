import {current_datetime, radars, currentRadar, currentProduct, 
        baseAPI, availableProducts, storms, storm_times} from './store'
import type {Storm} from './store'
import {get} from 'svelte/store'
import { DateTime } from 'luxon';

async function init(){
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
    return currentRadar.set(items.radars["CPSJ"]) // TODO this will be MOSAIC     
}

async function getLastProduct(){
    const apiURL = baseAPI + get(currentRadar).id +  '/last'
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    return current_datetime.set(DateTime.fromISO(items.datetime))
}

async function getVWParray(nframes = 8, dt = get(current_datetime), step = 1){
    const apiURL = baseAPI + get(currentRadar).id +  '/vwp_array/'+ 
                    dt.setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'") +
                    '/'+ nframes +'/' + step
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json() 
    return items.vwp
}

async function getVWP(dt = get(current_datetime)){
    const apiURL = baseAPI + get(currentRadar).id +  '/vwp/'+ 
                    dt.setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'")
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json() 
    return items.vwp
}

async function getStorms(){
    const apiURL = baseAPI + get(currentRadar).id +  '/storm_cells/20/'+ 
                    get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'")
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    const storm_list = items.storm_cells
    storm_list.forEach(storm => {
        // Initialize storm settings
        storm.settings = {'future': false,
                            'past': false,
                            'visible': true}        
    });
    storm_times.set(items.times)
    return storms.set(storm_list)
}

async function getConsecutiveProduct(fcode){
    // Request the closest product 
    const apiURL = baseAPI + get(currentRadar).id + '/' + 
    get(currentProduct).id + '/' + fcode + '/' + 
    get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'")
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    return items.product.datetime
}

async function getClosestProduct(dt){
    // Request the closest product 
    const apiURL = baseAPI + get(currentRadar).id + '/' + 
    get(currentProduct).id + '/closest/' + 
    dt.setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'")
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    if (typeof(items.product)!="undefined"){
        return items.product.datetime
    } else {
        return "1970-01-01T00:00:00Z"
    }
}

async function getDatetimeList(nframes){    
    // Request the list of datetimes 
    const apiURL = baseAPI + get(currentRadar).id + '/' + 
                    get(currentProduct).id + '/' + 
                    get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'") +
                    '/' + nframes
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    return items.product_array
}

export { getDatetimeList, getClosestProduct, getConsecutiveProduct, getStorms, init, getVWP, getVWParray }

// export { _getDatetimeList as getDatetimeList, 
//         _getClosestProduct as getClosestProduct, 
//         _getConsecutiveProduct as getConsecutiveProduct, 
//         _getStorms as getStorms, 
//         _init as init }

// ====================================== For DEMO =============================================

// import {availableProducts as _availableProducts} from "./db/products"
// import {radars as _radars} from "./db/radars"
// import {ss} from "./db/storms"

// const product_array = ["1993-03-13T10:48:00Z",
//                         "1993-03-13T10:43:00Z",
//                         "1993-03-13T10:38:00Z",
//                         "1993-03-13T10:33:00Z",
//                         "1993-03-13T10:28:00Z",
//                         "1993-03-13T10:22:00Z",
//                         "1993-03-13T10:17:00Z",
//                         "1993-03-13T10:12:00Z",
//                         "1993-03-13T10:07:00Z",
//                         "1993-03-13T10:02:00Z",
//                         "1993-03-13T09:36:00Z",
//                         "1993-03-13T09:31:00Z",
//                         "1993-03-13T09:26:00Z"]

// function getDatetime(dt){
//     let index = -1
//     product_array.forEach(function(datetime, i){
//         if (dt === datetime){
//             index = i
//         }
//     })
//     return index
// }

// function _init(){
//     _getRadars()
//     _getLastProduct()

//     availableProducts.set(_availableProducts)
//     currentProduct.set(_availableProducts[0])

//     _getStorms()
//     return true
// }


// function _getRadars(){
//     radars.set(_radars)
//     return currentRadar.set(_radars["CCMW"]) // TODO this will be MOSAIC     
// }

// function _getLastProduct(){
//     return current_datetime.set(DateTime.fromISO("1993-03-13T10:48:00Z"))
// }

// function _getStorms(){
//     const storm_list = Object.values(
//         ss[get(current_datetime).setZone('UTC')
//         .toFormat("y-MM-dd'T'HH:mm:ss'Z'")].storm_cells)

//     storm_list.forEach((storm: Storm) => {
//         // Initialize storm settings
//         storm.settings = {'future': false,
//                             'past': false,
//                             'visible': true}        
//     });
//     return storms.set(storm_list)
// }

// function _getConsecutiveProduct(fcode){
// // Request the closest product 
// const index = getDatetime(get(current_datetime).setZone('UTC')
//             .toFormat("y-MM-dd'T'HH:mm:ss'Z'"))
// const delta = (fcode != 'next')? 1:-1
// return product_array[index + delta]
// }

// function _getClosestProduct(dt){
//     let delta = 1e18 // Large number
//     let index = -1
//     // Find the shortest difference in seconds
//     product_array.forEach(function(datetime, i){
//         const dt_i = DateTime.fromISO(datetime)
//         const delta_i = Math.abs(dt_i.toSeconds() - dt.toSeconds())
//         if (delta_i < delta){
//             index = i
//             delta = delta_i
//         }
//     })
//     return product_array[index]
// }

// function _getDatetimeList(nframes){    
//     let tl = []
//     let index = getDatetime(get(current_datetime).setZone('UTC')
//                 .toFormat("y-MM-dd'T'HH:mm:ss'Z'"))
                
//     for(let i = 0; i < nframes; i++){
//         if (index > product_array.length - 1){
//             break
//         }
//         tl.push({"datetime": product_array[index++]})
//     }
//     return tl
// }