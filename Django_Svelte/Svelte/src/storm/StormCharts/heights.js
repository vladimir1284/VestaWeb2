import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(annotationPlugin);


let maxH = 0

/*  Figure 3-15. Cell Trend Data Packet - Packet Code 21 (Sheet 1)
page 3-117. Document Number 2620001L
If the value is over 700, then 1000 has been added to denote that 
the CELL TOP (BASE) was detected on the highest (lowest) elevation scan.
*/
function convertBaseAndTopKft2Km(data){
    let converted = []
    data.forEach(function (value, index){
        if (value > 70){
            // TODO somehow indicate that lowest elevation 
            // was used for obtainig this value
            value-= 100 
        }
        const kms = value*.3048
        maxH = (kms>maxH)?kms:maxH
        converted.push(kms)
    })
    return converted
}


function convertArrKft2Km(data) {
    let converted = []
    data.forEach(function (value, index){
        converted.push(value*.3048)
    })
    return converted
}
    
export function getHeightsChart(canvasID, storm, labels, text){

    // Convert from ft to km
    let centroids = convertArrKft2Km(storm.centroids)
    centroids = [null].concat(centroids)
    let max_ref_hgts = convertArrKft2Km(storm.max_ref_hgts)
    max_ref_hgts = [null].concat(max_ref_hgts)

    
    const base_hgts = convertBaseAndTopKft2Km(storm.bases)
    const top_hgts = convertBaseAndTopKft2Km(storm.tops)

    // Create arrows from base to top

    let bt_annotations = {}
    const xspace = 0.02*base_hgts.length
    const yspace = 0.08*maxH
    maxH = 0 // Restore for the other cells
    for (var k = 0; k < base_hgts.length; k++){
        const i = k +1
        bt_annotations['line' + i] = {
                        type: 'line',
                        yMin: base_hgts[k],
                        yMax: top_hgts[k],
                        xMin: i,
                        xMax: i,
                        borderColor: 'black',
                        borderWidth: 1,
                    }
        bt_annotations['top' + i] = {
                        type: 'line',
                        yMin: top_hgts[k],
                        yMax: top_hgts[k],
                        xMin: i-xspace,
                        xMax: i+xspace
                    }
        bt_annotations['bot_r' + i] = {
                        type: 'line',
                        yMin: base_hgts[k],
                        yMax: base_hgts[k]+yspace,
                        xMin: i,
                        xMax: i+xspace
                    }
        bt_annotations['bot_l' + i] = {
                        type: 'line',
                        yMin: base_hgts[k]+yspace,
                        yMax: base_hgts[k],
                        xMin: i-xspace,
                        xMax: i
                    }
    }
    

    // Data for the Centroid and the height of the máximum reflectivity
    const data_hgts = {
        labels: labels,
        datasets: [{
            label: text.centroid,
            backgroundColor: 'purple',
            borderColor: 'purple',
            data: centroids,
        },
        {
            label: text.dbzm,
            backgroundColor: 'red',
            borderColor: 'red',
            data: max_ref_hgts,
        }
    ]};
    const options_hgts ={
        plugins: {
            annotation: {
                annotations: bt_annotations
            },
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: text.unit
                },
                min: 0
            }
        }
    }
    const config_hgts = {
        type: 'line',
        data: data_hgts,
        options: options_hgts
    };
    return new Chart(document.getElementById(canvasID), config_hgts);
}