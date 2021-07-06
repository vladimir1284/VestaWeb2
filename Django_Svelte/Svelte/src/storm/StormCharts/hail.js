import Chart from 'chart.js/auto'

/* Filtering probability of hail data
A value of -999 indicates that these cells are beyond the maximum range for algorithm
processing. Figure 3-14. Special Graphic Symbol Packet. */
function filterProbability(data) {
    let filtered = []
    data.forEach(function (value, index){
        value = (value > 100)?null:value
        filtered.push(value)
    })
    return filtered
}

export function getHailChart(canvasID, storm, labels, text){
    // Data for the Centroid and the height of the máximum reflectivity
    let poh = filterProbability(storm.poh)
    poh = [null].concat(poh)
    let posh = filterProbability(storm.posh)
    posh = [null].concat(posh)
    
    const data_hail = {
        labels: labels,
        datasets: [{
            label: text.poh,
            backgroundColor: 'black',
            borderColor: 'black',
            data: poh,
        },
        {
            label: text.posh,
            backgroundColor: 'green',
            borderColor: 'green',
            data: posh,
        }
    ]};
    const options_hail ={
        layout:{
            
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: "%"
                },
                min: 0
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