<script context="module">
  import { Vector as VectorSource } from "ol/source";
  import { Circle as CircleStyle, Fill, Stroke, Style, Icon } from "ol/style";
  import Feature from "ol/Feature";
  import MultiPoint from "ol/geom/MultiPoint";
  import MultiLineString from 'ol/geom/MultiLineString';
  import { transform } from "ol/proj";

  import { storms, currentRadar, mapProj } from "./store";
  import { get } from "svelte/store";

  const storm_list = get(storms);
  const radar = get(currentRadar);
  const map_proj = get(mapProj);

  let features = {};
  const fill_past = new Fill({
    color: "rgba(255,255,255,1)",
  });
  const stroke_past = new Stroke({
    color: "#3399CC",
    width: 1.25,
  });
  const stroke_line = new Stroke({
    color: "white",
    width: 3,
  });

  const style_line = new Style({
      stroke: stroke_line,
    })

  const style_past = new Style({
      image: new CircleStyle({
        fill: fill_past,
        stroke: stroke_past,
        radius: 5,
      }),
      fill: fill_past,
      stroke: stroke_past,
    })
  const iconStyle = new Style({
    image: new Icon({
      anchor: [7, 7],
      anchorXUnits: 'pixels',
      anchorYUnits: 'pixels',
      src: 'imgs/ss.png',
    }),
  });
  const style_hidden = new Style({})

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

  // Generate arrow braces
  function arrow(lastSegment){
    const L = 5000 // m

    const start = lastSegment[0]
    const end = lastSegment[1]
    const dx = end[0] - start[0];
    const dy = end[1] - start[1];
    let alpha = Math.atan2(dy, dx)
    alpha += (dx < 0 && dy > 0)?Math.PI/2:0
    const beta = alpha - Math.PI/4
    // console.log(beta)

    const x1 = end[0]-L*Math.cos(beta)
    const y1 = end[1]-L*Math.sin(beta)
    const x2 = end[0]+L*Math.sin(beta)
    const y2 = end[1]-L*Math.cos(beta)

    return [[end, [x1, y1]], [end, [x2, y2]]]
  }

  // Generate trend features
  function insertFeatures(stormSettings, source, is_past){
    storm_list.forEach(function (storm, index) {
      // Create past features
      const points_list = is_past?storm.past:storm.forecast
      const points = getPointsFromStr(points_list);
      const pfeat = new Feature(new MultiPoint(points))

      // Should they be shown
      const visible = is_past?stormSettings[storm.id].past:stormSettings[storm.id].forecast
      const show_trend = visible && stormSettings[storm.id].visible
      const style = is_past?style_past:iconStyle
      
      pfeat.setStyle(show_trend?style:style_hidden)

      let trend_features = [pfeat]

      // Create lines between points if possible
      if (points.length > 0) {
        let lines = []
        for (var i = 0; i < (points.length-1); i++){
          lines.push([points[i], points[i+1]])
        }
        const lastSegment = [points[0], transform([storm.Ipos, storm.Jpos], radar.id, map_proj)]
        lines.push(lastSegment)
        if (is_past){
          lines = lines.concat(arrow(lastSegment))
        }   
        const lfeat = new Feature(new MultiLineString(lines))
        lfeat.setStyle(show_trend?style_line:style_hidden)
        
        trend_features.push(lfeat)
      }
      if (is_past){
        if (features[storm.id]){
          features[storm.id].past = trend_features
        } else {
          features[storm.id] = { past: trend_features} 
        }
      } else {
        if (features[storm.id]){
          features[storm.id].forecast = trend_features
        } else {          
          features[storm.id] = { forecast: trend_features}
        } 
      }              

      source.addFeatures(trend_features);
    });
  }

  export function createTrendsSource(stormSettings) {
    const trendsSource = new VectorSource({ wrapX: false });

    insertFeatures(stormSettings, trendsSource, true)
    insertFeatures(stormSettings, trendsSource, false)
      
    return trendsSource;
  }
</script>

<script>
  export let stormSettings

  $:{
      try{
        if(Object.keys(features).length != 0){
          // Esta función solo es reactiva ante cambios en stormSettings
          storm_list.forEach(function (storm, index) {
            const show_past = stormSettings[storm.id].past && stormSettings[storm.id].visible
            features[storm.id].past[0].setStyle(show_past?style_past:style_hidden)
            if (features[storm.id].past[1]){
              features[storm.id].past[1].setStyle(show_past?style_line:style_hidden)
            }            
            const show_forecast = stormSettings[storm.id].future && stormSettings[storm.id].visible
            features[storm.id].forecast[0].setStyle(show_forecast?iconStyle:style_hidden)
            if (features[storm.id].forecast[1]){
              features[storm.id].forecast[1].setStyle(show_forecast?style_line:style_hidden)
            }
          })
        }
      } catch (error) {
        console.error(error);
      }
    }
</script>