import './global.css';

import App from './App.svelte';

interface IComponentOptions<Props extends Record<string, any> = Record<string, any>> {
    target: Element;
    anchor?: Element;
    props?: Props;
    context?: Map<any, any>;
    hydrate?: boolean;
    intro?: boolean;
    $$inline?: boolean;
}
const app = new App(<IComponentOptions>{
	target: document.body,
	name: 'vesta-web'
});

export default app;
