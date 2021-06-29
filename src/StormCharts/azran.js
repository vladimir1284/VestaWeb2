export function drawAzran(canvasID, storm) {
    var canvas = document.getElementById(canvasID)
    if (canvas.getContext) {
        var ctx = canvas.getContext('2d')
        const xc = 0.5 * canvas.width
        const yc = 0.5 * canvas.height
        const maxRange = 0.65*xc
        // Fixed template
        ctx.beginPath()
        ctx.strokeStyle = 'blue';
        ctx.arc(xc, yc, maxRange, 0, 2 * Math.PI, 0)
        ctx.stroke()
        ctx.beginPath()
        ctx.strokeStyle = 'black';
        ctx.arc(xc, yc, 3, 0, 2 * Math.PI, 0)
        ctx.stroke()
        ctx.beginPath()
        // Cell location
        const storm_range_pxls = maxRange/460*storm.range*1.852
        const x = xc+storm_range_pxls*Math.sin(storm.azimut*Math.PI/180)
        const y = yc-storm_range_pxls*Math.cos(storm.azimut*Math.PI/180)
        ctx.translate(x, y)
        // Circle
        const sr = 5
        ctx.arc(0, 0, sr+2, 0, 2 * Math.PI, 0)
        // X
        ctx.moveTo(sr, sr)
        ctx.lineTo(-sr, -sr)
        ctx.moveTo(-sr, sr)
        ctx.lineTo(sr, -sr)
        ctx.stroke()
        // Text cel ID
        const x_id = (x>0)?sr:-sr
        ctx.fillText(storm.id, x_id, 3*sr);
    }
    return canvas
  }