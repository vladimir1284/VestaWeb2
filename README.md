# VestaWeb2

Esta es la aplicación VestaWeb2 del Centro Nacional de Radares del Instituto de Meteorología. Reside en https://github.com/vladimir1284/VestaWeb2.

To create a new project based on this template using [degit](https://github.com/Rich-Harris/degit):

```bash
npx degit sveltejs/template-webpack svelte-app
cd svelte-app
```

*Necesita tener instalado [Node.js](https://nodejs.org).*


## Comenzar

Instalar las dependencias...

```bash
cd svelte-app
npm install
```

...iniciar webpack:

```bash
npm run dev
```

Navega en [localhost:8080](http://localhost:8080). Debe verse la aplicación corriendo. Edita cualquier fichero en `src`, guardálo, y la página debe recargar con tus cambios.


## Desplegando en la red

### Con [now](https://zeit.co/now)

Instalar `now` se no lo tiene instalado:

```bash
npm install -g now
```

Entonces, desde dentro de la carpeta del proyecto:

```bash
now
```

Alternativamente, use el [cliente desktop de Now](https://zeit.co/download) y simplemente arrastre el proyecto descomprimido hacia el ícono de la barra de tareas.

### Con [surge](https://surge.sh/)

Instalar `surge` se no lo tiene instalado:

```bash
npm install -g surge
```

Entonces, desde dentro de la carpeta del proyecto:

```bash
npm run build
surge public
```

