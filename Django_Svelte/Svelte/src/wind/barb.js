
  let u

  export function drawBarb(ctx, data, x0, y0, barbLength){
    u = barbLength/20    
    ctx.beginPath()
    ctx.translate(x0, y0)
    ctx.strokeStyle = getColor(data.rms)
    ctx.fillStyle = getColor(data.rms)
    ctx.rotate(Math.PI*(data.dir/180 - 1.5))    
    let spd = getVelkts_x5(data.vel) // Speed as multiples of 5kts
    if (spd === 0){
        ctx.arc(0, 0, 3*u, 0, 2 * Math.PI)
    } else {
        // barb body
        ctx.moveTo(0,0)
        ctx.lineTo(-barbLength, 0)
        if (spd === 1){ // Special case for 5kts
            add5kts(ctx, 2*u - barbLength)
        } else {
          let x = - barbLength
          let last10 = false
          while (spd > 0){
            if (spd >= 10){
              if (last10){
                x -= 2*u
              }
              x = add50kts(ctx, x)
              spd -= 10
              last10 = true
            } else {
              last10 = false
              if (spd >= 2){
                x = add10kts(ctx, x)
                spd -= 2
              } else {
                add5kts(ctx, x)
                spd -= 1
              }
            }
          }
        }
    }
    ctx.setTransform(1, 0, 0, 1, 0, 0)
    ctx.stroke()
  }

  function add5kts(ctx, x){
    ctx.moveTo(x,0)
    ctx.lineTo(x-u, -3*u)
  }

  function add10kts(ctx, x){
    ctx.moveTo(x,0)
    ctx.lineTo(x-2*u, -6*u)
    return x + 2*u
  }

  function add50kts(ctx, x){
    ctx.moveTo(x,0)
    ctx.lineTo(x+2*u, -6*u)
    ctx.lineTo(x+4*u, 0)
    ctx.fill()
    return x + 6*u
  }

  function getVelkts_x5(vel) {
    return Math.round(vel * 1.943844 / 5)
  }

  function getColor(rms){
    const index = Math.floor(rms/4)
    let color = ""
    switch(index) {
        case -1:
          color = "black"
          break;
        case 0:
            color = "green"
          break;
        case 1:
            color = "#ffc107"
          break;
        case 2:
            color = "red"
          break;
        case 3:
            color = "#00E0FF"
        break;
        default:
            color = "#FF70FF"
      }
      return color
  }