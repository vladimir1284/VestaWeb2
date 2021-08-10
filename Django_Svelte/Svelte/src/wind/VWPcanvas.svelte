<script>
  import { drawBarb } from "./barb";
  import { getVWParray } from "../backend"
  import { _ } from '../services/i18n'
    var { DateTime } = require('luxon')

  const alturas = [0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5, 5.5, 6, 8, 10, 12, 14] // km

  export let isOpen

  let vwp = [[]]
  let hdata

  function ft2km(value) {
    return (value * 0.3048) / 1000
  }

  function ft2kmSTR(value) {
    let str_value = "0"
    str_value += ((value * 0.3048) / 1000).toFixed(2) //FT to KM
    return str_value.slice(-5)
  }
  $: {
    if (isOpen) {
      loadVWP()
    }
  }

  async function loadVWP() {
    vwp = await getVWParray()
    drawBarbs()
  }

  function drawBarbs() {
    var canvas = document.getElementById("vwp_barbs")
    if (canvas.getContext) {
      var ctx = canvas.getContext("2d")
      const legend_w = 50
      const hspace = 20
      const L = 0.98 * (canvas.width - 2*legend_w)
      const H = 0.98 * canvas.height
      const x0 = legend_w //+ (canvas.width - 2*legend_w - L) / 2
      const y0 = (canvas.height - H)/2
      ctx.beginPath()

      // Legend
      var grd = ctx.createLinearGradient(0, 0, 0, H)
      grd.addColorStop(0, "green")
      grd.addColorStop(0.2, "green")
      grd.addColorStop(0.4, "#ffc107")
      grd.addColorStop(0.6, "red")
      grd.addColorStop(0.8, "#00E0FF")
      grd.addColorStop(0.9, "#FF70FF")
      grd.addColorStop(1, "#FF70FF")
      ctx.fillStyle = grd
      ctx.fillRect(x0-legend_w/2-2, y0, legend_w/2, H)
      ctx.fillStyle = "black"
      ctx.fillText("km/h", 0, y0 + H)
      ctx.fillText("ERR", 0, y0 + 10)
      ctx.fillText("    0", 0, y0 + 22)
      ctx.fillText("7.5", 0, y0 + 0.25*H)
      ctx.fillText(" 15", 0, y0 + 0.5*H)
      ctx.fillText("22.5", 0, y0 + 0.75*H)
      ctx.fillText(" 30", 0, y0 + 0.9*H)

      // Fixed template
      ctx.strokeStyle = "black"
      ctx.rect(x0, y0, L, H)
      // Left margin
      ctx.moveTo(x0+40, y0)
      ctx.lineTo(x0+40, y0 + H)
      ctx.fillText($_('vwp.time'), x0 + 3, y0 + H -5)
      ctx.fillText("km", x0 + 8, y0 + 12)
      // Bottom margin
      ctx.moveTo(x0, y0 + H - hspace)
      ctx.lineTo(x0+L, y0 + H - hspace)
      ctx.stroke()
      // Height ticks
      const hdelta = prepareHeights(ctx, L-40, H - hspace, x0+40, y0 + H - hspace)
      
      // Barb values
      const bsize = 30
      const nvalues = 23
      const x_bvalues = x0 + L + 1.3*bsize
      for (let i = 0; i < nvalues; i++){
        const data = {vel: i*5/1.943844,
                rms: -1}
        let y =  y0 + hspace + i*(H - hspace)/nvalues
        drawBarb(ctx, data, x_bvalues, y, bsize)
        y = (i === 0)? (y + 5): y
        ctx.fillText(Math.round(i*9.26), x_bvalues + 8, y)
      }
      ctx.fillText("km/h", x_bvalues + 2, y0 + H -6)

      // Plot data
      const xspace = (L-40)/vwp.length
      for (let i = 0; i < vwp.length; i++){
        drawColumn(ctx, vwp[i], x0 + L - (i+0.5)*xspace, y0 + H - hspace, hdelta)
      }
      ctx.stroke()
      // console.log(hdata)
    }
  }

  function drawColumn(ctx, vwp, x0, y0, hdelta){
    console.log(vwp)
    // Draw ticks
    ctx.beginPath()
    ctx.strokeStyle = "black"
    ctx.moveTo(x0, y0)
    ctx.lineTo(x0, y0-5)
    ctx.stroke()

    // Time labels
    ctx.fillStyle = "black"
    ctx.fillText(DateTime.fromISO(vwp.datetime).setZone('local').toFormat("HH:mm"),
                x0 - 12, y0 +15)

    // Draw barbs
    let i = 0
    alturas.forEach((ht, k) => {
      let index = -1
      let rms = 1000 // Large value

      // Compute values closer to the nominal height
      if (i < vwp.data.length){          
        let delta = ft2km(vwp.data[i].ht)-ht
        
        const range = (k === 0)? 0.5 : (ht - alturas[k-1])/2 // km          
        while(Math.abs(delta) < range){
          // Select the value with the lower rms error
          if (rms > vwp.data[i].rms){
            rms = vwp.data[i].rms
            index = i
          }
          i++
          if (i < vwp.data.length){
            delta = ft2km(vwp.data[i].ht)-ht
          } else {
            break
          }
        }
        if (index > -1){
          drawBarb(ctx, vwp.data[index], x0, y0 - (2 + k)*hdelta, hdelta*1.2)
        }
      } 
    })
  }

  function prepareHeights(ctx, l, h, x0, y0){
    // Vertical spacing
    let hspace = h/(alturas.length + 3)
    // Draw horizontal lines
    ctx.beginPath()
    ctx.strokeStyle = "#D0D0D0"
    alturas.forEach((ht, i) => {
      const y = y0 - (2 + i)*hspace
      ctx.moveTo(x0, y)
      ctx.lineTo(x0+l, y)
      ctx.fillText(ht.toFixed(1), x0 - 32, y + 5)
    })
    ctx.stroke()
    return hspace
  }

  // function parseVWP(vwp){
  //   const arr = []
  //   vwp.forEach((element, i) => {
  //       if (i === 0 || (element.ht > vwp[i-1].ht)){
  //         arr.push({
  //           'index': i,
  //           'ht': ft2kmSTR(element.ht)
  //         })
  //       }
  //     });
  //   return arr
  // }
</script>

<canvas id="vwp_barbs" width="760px" height="640px" />
