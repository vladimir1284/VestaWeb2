import Chart from 'chart.js/auto'

export function getVilChart(canvasID, storm, labels, text){
    // Data for the cell based VIL and the maximum reflectivity         
    const maxZ = [null].concat(storm.maxZ)          
    const vil = [null].concat(storm.vil)   
    const data_vil_dbzm = {
        labels: labels,
        datasets: [{
            label: text.dbzm,
            backgroundColor: 'red',
            borderColor: 'red',
            data: maxZ,
        },
        {
            label: text.vil,
            backgroundColor: 'blue',
            borderColor: 'blue',
            data: vil,
        }
    ]};
    const options_vil_dbzm ={
        scales: {
            y: {
                title: {
                    display: true,
                    text: text.unit
                }
            }
        }
    }
    const config_vil_dbzm = {
    type: 'line',
    data: data_vil_dbzm,
    options: options_vil_dbzm
    };
    return new Chart(document.getElementById(canvasID), config_vil_dbzm)
}