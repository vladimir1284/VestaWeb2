
  import { storms } from '../store';
  import {get} from "svelte/store";
  import type {Storm}  from '../store';

export function updateStormSettings(key, value) {
    const _storms = get(storms)
    if (Object.keys(_storms[0]).length !== 0){
      _storms.forEach(function (storm: Storm) {
        storm.settings[key] = value
      })
      storms.set(_storms)
    }
  }
