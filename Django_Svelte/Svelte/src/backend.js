import {current_datetime, radars, currentRadar, currentProduct, baseAPI} from './store'
import {get} from 'svelte/store'

var { DateTime } = require('luxon');

// Set to true for online demo
const DEBUG = false

export async function init(){
    await getRadars()
    console.log(get(radars))
    await getLastProduct()
    return true
}

async function getRadars(){
    const apiURL = baseAPI + 'get_radars'
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    radars.set(items["radars"])
    return currentRadar.set(items["radars"]["CCNR"]) // TODO this will be MOSAIC     
}

async function getLastProduct(){
    const apiURL = baseAPI + get(currentRadar).id + '/' + get(currentProduct).id + '/last'
    const res = await fetch(apiURL)
    if (!res.ok) throw new Error('Bad response from: ' + apiURL)
    const items = await res.json()
    return current_datetime.set(DateTime.fromISO(items.product.datetime))
}