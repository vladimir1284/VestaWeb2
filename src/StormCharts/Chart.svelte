<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto'
    import { Col, Container, Row } from 'sveltestrap';
    import {getHeightsChart} from './heights.js'
    import {getHailChart} from './hail.js'
    import {getVilChart} from './vil_dbzm.js'
    import {drawAzran} from './azran.js'

    export let storm


    function init() {
        let labels = [ ]
        storm.time.forEach(function (min, index){
            if (storm.centroids[index]){
                let hrs = Math.floor(min/60)
                const mins = min-60*hrs
                // const ampm = (hrs > 11)?'pm':'am'
                // hrs = (hrs > 12)?hrs-12:hrs
                labels.push(`${("0"+hrs).slice(-2)}:${("0"+mins).slice(-2)}`)
            }
        })

        var hgtsChart = getHeightsChart('alturas', storm, labels)
        var hailChart = getHailChart('hail', storm, labels)
        var vil_dbzmChart = getVilChart('vil_dbzm', storm, labels)
        var azranChart = drawAzran('azran', storm)
        return {
            destroy: () => {
                hgtsChart.remove();
                vil_dbzmChart.remove();
                hailChart.remove();
                azranChart.remove();
            },
        };
    }

    // Do the job once the DOM was generated
    onMount(init);
</script>

<Container>
    <Row>
      <Col xs="6"><canvas id="azran" height=200px></canvas></Col>
      <Col xs="6"><canvas id="alturas" height=200px></canvas></Col>
    </Row>
    <Row>
      <Col xs="6"><canvas id="hail" height=200px></canvas></Col>
      <Col xs="6"><canvas id="vil_dbzm" height=200px></canvas></Col>
    </Row>
</Container>

<style>
	#azran {
		width: 100%;
    }
</style>