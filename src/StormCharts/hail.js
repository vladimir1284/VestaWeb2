import Chart from 'chart.js/auto'

/* Filtering probability of hail data
A value of -999 indicates that these cells are beyond the maximum range for algorithm
processing. Figure 3-14. Special Graphic Symbol Packet. */
function filterProbability(data) {
    let filtered = []
    data.forEach(function (value, index){
        value = (value > 100)?0:value
        filtered.push(value)
    })
    return filtered
}

export function getHailChart(canvasID, storm, labels){
    // Data for the Centroid and the height of the máximum reflectivity
    const poh = filterProbability(storm.poh)
    const posh = filterProbability(storm.posh)
    
    const data_hail = {
        labels: labels,
        datasets: [{
            label: 'POH',
            backgroundColor: 'black',
            borderColor: 'black',
            data: poh,
        },
        {
            label: 'POSH',
            backgroundColor: 'green',
            borderColor: 'green',
            data: posh,
        }
    ]};
    const options_hail ={
        scales: {
            y: {
                title: {
                    display: true,
                    text: "%"
                }
            }
        }
    }
    const config_hail = {
    type: 'line',
    data: data_hail,
    options: options_hail
    };
    return new Chart(document.getElementById(canvasID), config_hail)
}