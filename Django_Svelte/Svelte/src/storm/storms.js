
  import { storms } from '../store';
  import {get} from "svelte/store"

export function updateStormSettings(key, value) {
    const _storms = get(storms)
    if (typeof(_storms) != "undefined"){
      _storms.forEach(function (storm, index) {
        storm.settings[key] = value
      })
      storms.set(_storms)
    }
  }
