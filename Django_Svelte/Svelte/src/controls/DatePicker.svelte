<script>
    import {
        Button,
        Input,
        InputGroup,
        Popover,
        Tooltip,
    } from "sveltestrap";
    import { current_datetime, baseAPI, currentRadar, currentProduct, layers } from "../store"
    import { _ } from "../services/i18n";
    import { get } from 'svelte/store'
    import Close from 'svelte-material-icons/Close.svelte'
    import {createProductSource} from "../Layers"

    var { DateTime } = require('luxon');


    let isOpen = false
	
    let internal
    function input(x){
        // console.log(x.setZone('local').toFormat("y-MM-dd'T'HH:mm"))
        internal = x.setZone('local').toFormat("y-MM-dd'T'HH:mm")
    }
    
    async function close(){
        const dt = DateTime.fromISO(internal)
        // Request the closest product 
        const apiURL = baseAPI + get(currentRadar).id + '/' + 
                        get(currentProduct).id + '/closest/' + 
                        dt.setZone('UTC').toFormat("y-MM-dd'T'HH:mm:ss'Z'")
        const res = await fetch(apiURL)
        if (!res.ok) throw new Error('Bad response from: ' + apiURL)
        const items = await res.json()
        if (isOpen){
            const cls = DateTime.fromISO(items.product.datetime)
            alert(cls.setZone('local').toFormat('dd/MMM/y HH:mma'))
            isOpen = false
            current_datetime.set(cls)
            get(layers).product.setSource(createProductSource())
        }
    }

    $: input($current_datetime)
    // $: output(internal)

</script>

<Button 
id="datetime" 
style="width: auto; padding-left: .2em; padding-right: .2em;">
    {$current_datetime.setZone('local').toFormat('dd/MMM/y HH:mma')}
</Button>

<Popover placement="bottom" target="datetime" bind:isOpen>
    <InputGroup>
        <Input
        bind:value={internal}
        type="datetime-local"
        name="datetime"
        id="pickDatetime"
        on:blur={close}
        placeholder="datetime placeholder" />
    <Button on:click={close}><Close color="white" size="1.2em"/></Button>
    </InputGroup>
</Popover>

<Tooltip placement="bottom" target="datetime">
    {$_("Animation.datetime")}
</Tooltip>
