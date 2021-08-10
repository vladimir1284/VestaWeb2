<script>
    import { onMount } from 'svelte';
    import { Col, Container, Row } from 'sveltestrap';
    import {getHeightsChart} from './heights.js'
    import {getHailChart} from './hail.js'
    import {getVilChart} from './vil_dbzm.js'
    import {drawAzran} from './azran.js'
    var { DateTime } = require('luxon');
    import { _ } from '../../services/i18n';
    import {storm_times, current_datetime} from '../../store'
    import {get} from 'svelte/store'

    export let storm


    function init() {
        let labels = [null]
        const ndata = storm.centroids.length

        // Prepare time labels
        const times = get(storm_times).slice(-ndata)
        const date = get(current_datetime).ts/1000 - times.slice(-1)*60
        times.forEach(function (min, index){
            const time = DateTime.fromSeconds(min*60 + date)
            labels.push(time.toFormat("HH:mm"))
        })
        labels.push(null)
        let text = {
            centroid: $_('StormModal.height.centroid'),
            dbzm: $_('StormModal.height.dbzm'),
            unit: $_('StormModal.height.unit'),
        }

        // Arrange data
        let arranged_storm = {}
        arranged_storm.poh = []
        arranged_storm.posh = []
        arranged_storm.centroids = []
        arranged_storm.max_ref_hgts = []
        arranged_storm.bases = []
        arranged_storm.tops = []
        arranged_storm.maxZ = []
        arranged_storm.vil = []
        
        for(let i = 0; i < ndata; i++){
            const idx = (storm.lst_vol_data_ptr + i) % ndata
            arranged_storm.poh.push(storm.poh[idx])
            arranged_storm.posh.push(storm.posh[idx])
            arranged_storm.centroids.push(storm.centroids[idx])
            arranged_storm.max_ref_hgts.push(storm.max_ref_hgts[idx])
            arranged_storm.bases.push(storm.bases[idx])
            arranged_storm.tops.push(storm.tops[idx])
            arranged_storm.maxZ.push(storm.maxZ[idx])
            arranged_storm.vil.push(storm.vil[idx])
        }

        // Create charts
        var hgtsChart = getHeightsChart('alturas', arranged_storm, labels, text)
        text = {
            poh: $_('StormModal.hail.poh'),
            posh: $_('StormModal.hail.posh'),
        }
        var hailChart = getHailChart('hail', arranged_storm, labels, text)
        text = {
            vil: $_('StormModal.vil.vil'),
            dbzm: $_('StormModal.vil.dbzm'),
            unit: $_('StormModal.vil.unit'),
        }
        var vil_dbzmChart = getVilChart('vil_dbzm', arranged_storm, labels, text)
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
        <div>
            <div class="title">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {$_('StormModal.height.title')} <spam style="color: red;">{$_('StormModal.height.dbzm')}</spam>
                {$_('StormModal.height.connector')} <spam style="color: purple;">{$_('StormModal.height.centroid')}</spam>.
            </div>
            <Col xs="auto"><canvas id="alturas" height=180px></canvas></Col>
        </div>
    </Row>
    <Row cols={{ lg: 2}}>
        <div>
            <div class="title">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {$_('StormModal.hail.title')} <spam style="color: black;">{$_('StormModal.hail.poh')}</spam>
                {$_('StormModal.hail.connector')} <spam style="color: green;">{$_('StormModal.hail.posh')}</spam>.
            </div>            
            <Col xs="auto"><canvas id="hail" height=180px></canvas></Col>
        </div>
        <div>
            <div class="title">
                &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                {$_('StormModal.vil.title')}<spam style="color: red;">{$_('StormModal.vil.dbzm')}</spam>
                {$_('StormModal.vil.connector')} <spam style="color: blue;">{$_('StormModal.vil.vil')}</spam>.
            </div>            
            <Col xs="auto"><canvas id="vil_dbzm" height=180px></canvas></Col>
        </div>
    </Row>
</Container>

<style>
	#azran {
		width: 100%;
    }
    .title {
        text-align: center;
        color: gray;
    }
</style>