import Chart from 'chart.js/auto';
import type {ChartConfiguration} from 'chart.js/types/index.esm';
import type {Storm} from '../../store'

export function getVilChart(canvasID, storm: Storm, labels, text){
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
        plugins: {
            legend: {
                display: false
            }
        },
        scales: {
            y: {
                title: {
                    display: true,
                    text: text.unit
                }
            }
        }
    }
    const config_vil_dbzm: ChartConfiguration = {
    type: 'line',
    data: data_vil_dbzm,
    options: options_vil_dbzm
    };
    return new Chart(<HTMLCanvasElement> document.getElementById(canvasID), config_vil_dbzm)
}