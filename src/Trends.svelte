<script context="module">
  import { Vector as VectorSource } from "ol/source";
  import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
  import Feature from "ol/Feature";
  import Circle from "ol/geom/Circle";
  import MultiPoint from "ol/geom/MultiPoint";
  import Point from "ol/geom/Point";
  import Polygon from "ol/geom/Polygon";
  import { transform } from "ol/proj";

  import { storms, currentRadar, mapProj } from "./store";
  import { get } from "svelte/store";

  const storm_list = get(storms);
  const radar = get(currentRadar);
  const map_proj = get(mapProj);

  export let stormSettings

  let features = {};
  var fill = new Fill({
    color: "rgba(255,255,255,1)",
  });
  var stroke = new Stroke({
    color: "#3399CC",
    width: 1.25,
  });
  var styles = [
    new Style({
      image: new CircleStyle({
        fill: fill,
        stroke: stroke,
        radius: 5,
      }),
      fill: fill,
      stroke: stroke,
    }),
  ];

  function getPointsFromStr(line) {
    let points = [];
    const str_array = line.split(",");
    str_array.forEach(function (dot, index) {
        // TODO se descarta el primer punto pues coincide con la posición actual
        // hay que evitar almacenar este valor desde el vesta-postgis
      if (index > 0) {
        const coords = dot.split(" ");
        points.push(
          transform(
            [parseInt(coords[0]), parseInt(coords[1])],
            radar.id,
            map_proj
          )
        );
      }
    });
    return points;
  }

  export function createTrendsSource(stormSettings) {
    const trendsSource = new VectorSource({ wrapX: false });
    storm_list.forEach(function (storm, index) {
      // Create past features
      const points = getPointsFromStr(storm.past);
      const geom = new MultiPoint(points);
      features[storm.id] = { past: new Feature(geom) };
      if (stormSettings[storm.id].past){
        features[storm.id].past.setStyle(styles)
      } else {
        features[storm.id].past.setStyle(new Style({}))
      }
      trendsSource.addFeature(features[storm.id].past);
    });
    return trendsSource;
  }
</script>

<div></div>