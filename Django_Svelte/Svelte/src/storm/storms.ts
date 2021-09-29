
  import { storms } from '../store';
  import {get} from "svelte/store";
  import type {Storm}  from '../store';

/**
 * Simultaneously updates the given property's value for all storms
 * @param key 
 * @param value 
 */
export function updateStormSettings(key: string, value: boolean) {
    const _storms = get(storms)
    if (Object.keys(_storms[0]).length !== 0){
      _storms.forEach(function (storm: Storm) {
        storm.settings[key] = value
      })
      storms.set(_storms)
    }
  }
