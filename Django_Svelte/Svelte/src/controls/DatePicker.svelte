<script>
    import {
        Button,
        Input,
        InputGroup,
        Popover,
        Tooltip,
    } from "sveltestrap";
    import { current_datetime, layers } from "../store"
    import { _ } from "../services/i18n";
    import { get } from 'svelte/store'
    import Close from 'svelte-material-icons/Close.svelte'
    import History from 'svelte-material-icons/History.svelte'
    import {createProductSource} from "../Layers"
    import {getClosestProduct, getStorms} from "../backend"

    var { DateTime } = require('luxon');


    let isOpen = false
	
    let internal
    function input(x){
        internal = x.setZone('local').toFormat("y-MM-dd'T'HH:mm")
    }
    
    async function close(){
        const dt = DateTime.fromISO(internal)        
        const datetime = await getClosestProduct(dt)
        if (isOpen){
            const cls = DateTime.fromISO(datetime)
            // Check for different datetime 
            const timeDelta = dt.diff(cls, ['years', 'months', 'days', 'hours', 'minutes']).toObject()
            let str_alert = $_("DatePicker.alert.header")
            const init_length = str_alert.length
            str_alert += $_({ id: "DatePicker.years", values: { n: Math.abs(timeDelta.years) }})
            str_alert += $_({ id: "DatePicker.months", values: { n: Math.abs(timeDelta.months) }})
            str_alert += $_({ id: "DatePicker.days", values: { n: Math.abs(timeDelta.days) }})
            str_alert += $_({ id: "DatePicker.hours", values: { n: Math.abs(timeDelta.hours) }})
            str_alert += $_({ id: "DatePicker.minutes", values: { n: Math.abs(timeDelta.minutes) }})

            if (str_alert.length > init_length){                
                str_alert += (dt.toMillis() > cls.toMillis())?$_("DatePicker.alert.before") :$_("DatePicker.alert.after") 
                str_alert += $_("DatePicker.alert.footer") 
                alert(str_alert)
            }
            isOpen = false
            current_datetime.set(cls)
            getStorms()
            get(layers).product.setSource(createProductSource())
        }
    }

    $: input($current_datetime)

    // {$current_datetime.setZone('local').toFormat('dd/MMM/y HH:mma')}

</script>

<Button 
id="datetime" 
style="width: auto; padding-left: .2em; padding-right: .2em;">
    <History color="black" size="1em"/>
</Button>

<div class="control-label">{$current_datetime.setZone('local').toFormat('dd/MMM/y')}</div>

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
    {$_("DatePicker.datetime")}
</Tooltip>
