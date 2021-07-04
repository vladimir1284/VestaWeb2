<script>
    import { onMount } from 'svelte';
    import { Col, Container, Row } from 'sveltestrap';
    import {getHeightsChart} from './heights.js'
    import {getHailChart} from './hail.js'
    import {getVilChart} from './vil_dbzm.js'
    import {drawAzran} from './azran.js'
    var { DateTime } = require('luxon');
    import { _ } from '../../services/i18n';

    export let storm


    function init() {
        let labels = [null]
        const times = storm.time.slice(-storm.centroids.length)
        times.forEach(function (min, index){
            const time = DateTime.fromSeconds(min*60)
            labels.push(time.toFormat("HH:mm"))
        })
        labels.push(null)
        let text = {
            centroid: $_('StormModal.height.centroid'),
            dbzm: $_('StormModal.height.dbzm'),
            unit: $_('StormModal.height.unit'),
        }
        var hgtsChart = getHeightsChart('alturas', storm, labels, text)
        text = {
            poh: $_('StormModal.hail.poh'),
            posh: $_('StormModal.hail.posh'),
        }
        var hailChart = getHailChart('hail', storm, labels, text)
        text = {
            vil: $_('StormModal.vil.vil'),
            dbzm: $_('StormModal.vil.dbzm'),
            unit: $_('StormModal.vil.unit'),
        }
        var vil_dbzmChart = getVilChart('vil_dbzm', storm, labels, text)
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