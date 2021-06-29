import Chart from 'chart.js/auto'
import annotationPlugin from 'chartjs-plugin-annotation';
Chart.register(annotationPlugin);

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
        converted.push(value*.3048)
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
    
export function getHeightsChart(canvasID, storm, labels){
    // Convert from ft to km
    const centroids = convertArrKft2Km(storm.centroids)
    const max_ref_hgts = convertArrKft2Km(storm.max_ref_hgts)

    
    const base_hgts = convertBaseAndTopKft2Km(storm.bases)
    const top_hgts = convertBaseAndTopKft2Km(storm.tops)

    // Create arrows from base to top

    let bt_annotations = {}
    for (var i = 0; i < base_hgts.length; i++){
        bt_annotations['line' + i] = {
                        type: 'line',
                        yMin: base_hgts[i],
                        yMax: top_hgts[i],
                        xMin: i,
                        xMax: i,
                        borderColor: 'black',
                        borderWidth: 2,
                    }
    }

    // Data for the Centroid and the height of the máximum reflectivity
    const data_hgts = {
        labels: labels,
        datasets: [{
            label: 'CENT',
            backgroundColor: 'purple',
            borderColor: 'purple',
            data: centroids,
        },
        {
            label: 'DBZM',
            backgroundColor: 'red',
            borderColor: 'red',
            data: max_ref_hgts,
        }
    ]};
    const options_hgts ={
        plugins: {
            annotation: {
                annotations: bt_annotations
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "Km"
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