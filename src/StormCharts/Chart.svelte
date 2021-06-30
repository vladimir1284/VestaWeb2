<script>
    import { onMount } from 'svelte';
    import Chart from 'chart.js/auto'
    import { Col, Container, Row } from 'sveltestrap';
    import {getHeightsChart} from './heights.js'
    import {getHailChart} from './hail.js'
    import {getVilChart} from './vil_dbzm.js'
    import {drawAzran} from './azran.js'
    var { DateTime } = require('luxon');

    export let storm


    function init() {
        let labels = [null]
        const times = storm.time.slice(-storm.centroids.length)
        times.forEach(function (min, index){
            const time = DateTime.fromSeconds(min*60)
            labels.push(time.toFormat("HH:mm"))
        })
        labels.push(null)

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

<Container >
    <Row cols={{ lg: 2}}>
      <Col xs="auto"><canvas id="azran" height=180px></canvas></Col>
      <Col xs="auto"><canvas id="alturas" height=180px></canvas></Col>
    </Row>
    <Row cols={{ lg: 2}}>
      <Col xs="auto"><canvas id="hail" height=180px></canvas></Col>
      <Col xs="auto"><canvas id="vil_dbzm" height=180px></canvas></Col>
    </Row>
</Container>

<style>
	#azran {
		width: 100%;
    }
</style>