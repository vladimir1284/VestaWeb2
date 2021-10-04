import Chart from 'chart.js/auto';
import type {ChartConfiguration} from 'chart.js/types/index.esm';


export interface StormData {
    poh: number[];
    posh: number[];
    centroids: number[];
    max_ref_hgts: number[];
    bases: number[];
    tops: number[];
    maxZ: number[];
    vil: number[];
}


export function getVilChart(canvasID, storm: StormData, labels, text){
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