import Chart from 'chart.js/auto'

export function getVilChart(canvasID, storm, labels){
    // Data for the cell based VIL and the maximum reflectivity         
    const maxZ = [null].concat(storm.maxZ)          
    const vil = [null].concat(storm.vil)   
    const data_vil_dbzm = {
        labels: labels,
        datasets: [{
            label: 'DBZM',
            backgroundColor: 'red',
            borderColor: 'red',
            data: maxZ,
        },
        {
            label: 'CB VIL',
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
                    text: "DBZ-KG/M^2"
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