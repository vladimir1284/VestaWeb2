<script>
    import Chart from './StormCharts/Chart.svelte';
    import {
      Button,
      Modal,
      ModalBody,
      ModalFooter,
      ModalHeader
    } from 'sveltestrap';


    export let StormData
    
    const toggle = () => (StormData.show = false); 
   
  </script>

  <div>
    <Modal isOpen={StormData.show} {toggle} backdrop={false} size = 'lg'>
      <ModalHeader {toggle}>Celda de tormenta {StormData.storm.id}</ModalHeader>
      <ModalBody>
        <Chart storm={StormData.storm}/>
      </ModalBody>
    </Modal>
  </div>