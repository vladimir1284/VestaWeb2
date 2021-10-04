import {
    current_datetime, radars, currentRadar, currentProduct,
    baseAPI, availableProducts, storms, storm_times, finalTime
} from './store';
import type { Storm, Palette } from './store';
import { get } from 'svelte/store';
import { DateTime } from 'luxon';

/**
 * Initialization function retreiving all the necessary data from backend
 * on page loading.
 */
async function init() {
    await getRadars();

    // Get the most recent product
    await getLastProduct();

    /**
     * Get the available products for the datetime of the 
     * most recent product in the initial radar (Should 
     * be MOSAIC)
     */
    const ap = await getAvailableProducts();
    const ap_promises = [];

    // Get the description of available products
    for (let i = 0; i < ap.length; i++) {
        const product = await getProductDescription(ap[i]);
        ap_promises.push(product);
    }
    const ap_array = await Promise.all(ap_promises);
    availableProducts.set(ap_array);

    // Set the initial current product
    currentProduct.set(ap_array[0]);

    await getStorms();
    return true;
}

/**
 * Get avaliable products for the current radar and datetime.
 * Products not older than 15min are considered 
 * (time window handled in the backend).
 */
async function getAvailableProducts() {
    const apiURL = baseAPI + get(currentRadar).id + '/available/' +
        get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'");
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    return items.available_products;
}


/**
 * Product description type
 */ 
export interface Description {
    id: string;
    range: number;
    palette: Palette
}
/**
 * Retrieve the product description form the backend
 * @param {string}  pcode - product id as defined in CODE.
 * @return {Description} Product description
 */
async function getProductDescription(pcode) {
    const apiURL = baseAPI + 'description/' + pcode;
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    return items.description;
}

/**
 * Get radars from the database and set the default radar for 
 * the initial page loading
 */
async function getRadars() {
    const apiURL = baseAPI + 'get_radars';
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    radars.set(items.radars);
    return currentRadar.set(items.radars["CPSJ"]); // TODO this will be MOSAIC     
}

/**
 * Get the latest product for current radar. 
 * It also sets the current datetime as the datetime of the selected product.
 */
async function getLastProduct() {
    const apiURL = baseAPI + get(currentRadar).id + '/last';
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    const cdt = DateTime.fromISO(items.datetime);
    finalTime.set(cdt);
    return current_datetime.set(cdt);
}

// VWP graphic data for one observation
export interface VWPelement {
    datetime: string;
    data: {
        ht: number;
        vel: number;
        dir: number;
        rms: number;
    }[]
}

/**
 * Retrieve graphic data from several VWP products.
 *  @param {number}     nframes - Number of products to be retrieved (8 by default)
 *  @param {DateTime}   dt      - Datetime of the most recent desired product 
 *                                (current_datetime by default).
 *  @param {number}     step    - Number of observations between two consecutive VPW 
 *                                products to be retrieved. 
 *                                (Default should be 6h approximately).
 *  @return {VWPelement[]} Array of VWP data.
 */
async function getVWParray(nframes = 8, dt = get(current_datetime), step = 1) { //TODO step = 24
    const apiURL = baseAPI + get(currentRadar).id + '/vwp_array/' +
        dt.setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'") +
        '/' + nframes + '/' + step;
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    return <VWPelement[]>items.vwp;
}

// VWP tabular data for one observation
export interface VWPdata {
    ht: number[];
    u: number[];
    v: number[];
    w: number[];
    dir: number[];
    rms: number[];
    div: number[];
    srng: number[];
    elev: number[];
}

/**
 * Retrieve the tabular data from a VWP product.
 *  @param {DateTime}   dt      - Datetime of the most recent desired product 
 *                                (current_datetime by default).
 *  @return {VWPdata} VWP tabular data.
 */
async function getVWP(dt = get(current_datetime)) {
    const apiURL = baseAPI + get(currentRadar).id + '/vwp/' +
        dt.setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'");
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    return items.vwp;
}

/**
 * Retrieve storm cells for the given radar and datetime.
 *  @param {number} nstorms - Maximum number of cells to be retrieved (20 by default)
 */
async function getStorms(nstorms: number = 20) {
    const apiURL = baseAPI + get(currentRadar).id + '/storm_cells/'+ nstorms +'/' +
        get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'");
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    const storm_list = items.storm_cells;
    storm_list.forEach((storm: Storm) => {
        // Initialize storm settings
        storm.settings = {
            'future': false,
            'past': false,
            'visible': true
        }
    });
    storm_times.set(items.times);
    return storms.set(storm_list);
}

/**
 * Retrieve the next or the previous product from the current datetime.
 *  @param {"next"|"previous"} fcode - Whether next or previous observation.
 *  @return {DateTime} Datetime of the retrieved product.
 */
async function getConsecutiveProduct(fcode: "next"|"previous") {
    // Request the closest product 
    const apiURL = baseAPI + get(currentRadar).id + '/' +
        get(currentProduct).id + '/' + fcode + '/' +
        get(current_datetime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'");
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    return items.product.datetime;
}

/**
 * Retrieve the next or the previous product from the current datetime.
 *  @param {DateTime} dt - Datetime selected by the user.
 *  @return {DateTime} Datetime of the retrieved product.
 */
async function getClosestProduct(dt) {
    // Request the closest product 
    const apiURL = baseAPI + get(currentRadar).id + '/' +
        get(currentProduct).id + '/closest/' +
        dt.setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'");
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    if (typeof (items.product) !== "undefined") {
        return items.product.datetime;
    } else {
        return "1970-01-01T00:00:00Z";
    }
}

// Product datetime object
export interface ProductDateTime {
    datetime: string;
}
/**
 * Retrieve datetimes for the observations used in animation
 * @param {number} nframes - number of frames to be retrived
 * @returns {ProductDateTime[]} product_array - List with the product datetimes
 */
async function getDatetimeList(nframes) {
    // Request the list of datetimes 
    const apiURL = baseAPI + get(currentRadar).id + '/' +
        get(currentProduct).id + '/' +
        get(finalTime).setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'") +
        '/' + nframes;
    const res = await fetch(apiURL);
    if (!res.ok) throw new Error('Bad response from: ' + apiURL);
    const items = await res.json();
    return items.product_array;
}

export { getDatetimeList, getClosestProduct, getConsecutiveProduct, getStorms, init, 
        getVWP, getVWParray, getAvailableProducts, getProductDescription}