<script>    
    export let selectedProduct

    let unit = ""

    const d3 = require("d3");

    function legend({
        color,
        title,
        tickSize = 3,
        width = 480,
        height = 24 + tickSize,
        marginTop = 0,
        marginRight = -20,
        marginBottom = 10 + tickSize,
        marginLeft = -20,
        ticks = width / 64,
        tickFormat,
        tickValues
        } = {}) {
        const svg = d3.select("#legend_svg")
            .attr("width", width)
            .attr("height", height)
            .attr("viewBox", [0, 0, width, height])
            .style("overflow", "visible")
            .style("display", "block");

        let tickAdjust = g => g.selectAll(".tick line").attr("y1", marginTop + marginBottom - height);
        let x;

        // Continuous
        if (color.interpolate) {
            const n = Math.min(color.domain().length, color.range().length);

            x = color.copy().rangeRound(d3.quantize(d3.interpolate(marginLeft, width - marginRight), n));

            svg.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), n))).toDataURL());
        }

        // Sequential
        else if (color.interpolator) {
            x = Object.assign(color.copy()
            .interpolator(d3.interpolateRound(marginLeft, width - marginRight)), {
                range() {
                return [marginLeft, width - marginRight];
                }
            });

            svg.append("image")
            .attr("x", marginLeft)
            .attr("y", marginTop)
            .attr("width", width - marginLeft - marginRight)
            .attr("height", height - marginTop - marginBottom)
            .attr("preserveAspectRatio", "none")
            .attr("xlink:href", ramp(color.interpolator()).toDataURL());

            // scaleSequentialQuantile doesn’t implement ticks or tickFormat.
            if (!x.ticks) {
            if (tickValues === undefined) {
                const n = Math.round(ticks + 1);
                tickValues = d3.range(n).map(i => d3.quantile(color.domain(), i / (n - 1)));
            }
            if (typeof tickFormat !== "function") {
                tickFormat = d3.format(tickFormat === undefined ? ",f" : tickFormat);
            }
            }
        }

        // Threshold
        else if (color.invertExtent) {
            const thresholds = color.thresholds ? color.thresholds() // scaleQuantize
            :
            color.quantiles ? color.quantiles() // scaleQuantile
            :
            color.domain(); // scaleThreshold

            const thresholdFormat = tickFormat === undefined ? d => d :
            typeof tickFormat === "string" ? d3.format(tickFormat) :
            tickFormat;

            x = d3.scaleLinear()
            .domain([-1, color.range().length - 1])
            .rangeRound([marginLeft, width - marginRight]);

            svg.append("g")
            .selectAll("rect")
            .data(color.range())
            .join("rect")
            .attr("x", (d, i) => x(i - 1))
            .attr("y", marginTop)
            .attr("width", (d, i) => x(i) - x(i - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", d => d);

            tickValues = d3.range(thresholds.length);
            tickFormat = i => thresholdFormat(thresholds[i], i);
        }

        // Ordinal
        else {
            x = d3.scaleBand()
            .domain(color.domain())
            .rangeRound([marginLeft, width - marginRight]);

            svg.append("g")
            .selectAll("rect")
            .data(color.domain())
            .join("rect")
            .attr("x", x)
            .attr("y", marginTop)
            .attr("width", Math.max(0, x.bandwidth() - 1))
            .attr("height", height - marginTop - marginBottom)
            .attr("fill", color);

            tickAdjust = () => {};
        }

        svg.append("g")
            .attr("transform", `translate(0,${height - marginBottom})`)
            .call(d3.axisBottom(x)
            .ticks(ticks, typeof tickFormat === "string" ? tickFormat : undefined)
            .tickFormat(typeof tickFormat === "function" ? tickFormat : undefined)
            .tickSize(tickSize)
            .tickValues(tickValues))
            .attr("font-size", 14)
            // .call(tickAdjust)
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
            .attr("x", marginLeft)
            .attr("y", marginTop + marginBottom - height - 6)
            .attr("fill", "currentColor")
            .attr("text-anchor", "start")
            .attr("font-weight", "bold")
            .text(title));

        return svg.node();
    }

    function ramp(color, n = 256) {
        var canvas = document.createElement('canvas');
        canvas.width = n;
        canvas.height = 1;
        const context = canvas.getContext("2d");
        for (let i = 0; i < n; ++i) {
            context.fillStyle = color(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }
        return canvas;
    }

    function interpolatePalette(palette){
        const domain = [0];
        for (let i = 1, l = palette.length - 1; i <= l; i++){
            domain[i] = i / l;
        }
        
        const scale = d3.scaleLinear(domain, palette)
            .interpolate(d3.interpolateLab)
            .clamp(true);
        
        return t => scale(t);
    }

    function generateLegend(palette){
        // Clear previous image if needed
        const leg = document.getElementById("legend_svg")
        if (leg){
            leg.innerHTML = ''
        }
        unit = palette.unit
        const interpolator = interpolatePalette(palette.colors)
        legend({
            color: d3.scaleSequential([palette.min, palette.max], interpolator),
            tickValues: palette.tickValues
        })
    }

    $:{
        if(selectedProduct){
            generateLegend(selectedProduct.palette)
        }
    }

</script>

<script context="module">
    import {Control} from 'ol/control'
    let element
    let left = 0;
	let bottom = 0;
	
	let moving = false;
	
	function onMouseDown() {
		moving = true;
	}
	
	function onMouseMove(e) {
		if (moving) {
			left += e.movementX;
			bottom -= e.movementY;
		}
        element.style.left = left
        element.style.bottom = bottom
	}
	
	function onMouseUp() {
		moving = false;
	}
  
    export function legendController(){
        const container = document.getElementById('legend_control_container');
        
        element = document.createElement('div');
        element.className = 'legend_control ol-unselectable ol-control';
        element.id="legend"
        element.appendChild(container);
  
      return new Control({element: element});
    }
</script>

<svelte:window on:mouseup={onMouseUp} on:mousemove={onMouseMove} />

<div id="legend_control_container" on:mousedown={onMouseDown}>
    <div><svg id="legend_svg"></svg></div>    
    <div id="unit">{unit}</div>
</div>

<style>
	#legend_control_container {
	    background-color:rgba(0,60,136,0.5);
        padding: 1px;
    }
	#legend_control_container div {
	    background-color:rgba(0,60,136,0.5);      
        float: left;
        clear: none;
    }
	#legend_svg {
        color: white;
        font-size: 14;
        padding-bottom: 4px;
        padding-top: 1px;
        margin-left: -20px;
        margin-right: -20px;
    }	
	#unit {
        color: white;
        font-size: 14;
        padding-top: 11;
        padding-right: 2;
    }	
</style>