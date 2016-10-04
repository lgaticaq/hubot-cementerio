# hubot-cementerio

[![npm version](https://img.shields.io/npm/v/hubot-cementerio.svg?style=flat-square)](https://www.npmjs.com/package/hubot-cementerio)
[![npm downloads](https://img.shields.io/npm/dm/hubot-cementerio.svg?style=flat-square)](https://www.npmjs.com/package/hubot-cementerio)
[![Build Status](https://img.shields.io/travis/lgaticaq/hubot-cementerio.svg?style=flat-square)](https://travis-ci.org/lgaticaq/hubot-cementerio)
[![Coverage Status](https://img.shields.io/coveralls/lgaticaq/hubot-cementerio/master.svg?style=flat-square)](https://coveralls.io/github/lgaticaq/hubot-cementerio?branch=master)
[![Code Climate](https://img.shields.io/codeclimate/github/lgaticaq/hubot-cementerio.svg?style=flat-square)](https://codeclimate.com/github/lgaticaq/hubot-cementerio)
[![dependency Status](https://img.shields.io/david/lgaticaq/hubot-cementerio.svg?style=flat-square)](https://david-dm.org/lgaticaq/hubot-cementerio#info=dependencies)
[![devDependency Status](https://img.shields.io/david/dev/lgaticaq/hubot-cementerio.svg?style=flat-square)](https://david-dm.org/lgaticaq/hubot-cementerio#info=devDependencies)

> Un hubot-script para contabilizar los días sin nuevos despidos

## Instalación
```bash
npm i -S hubot-cementerio
```

agregar `["hubot-cementerio"]` a `external-scripts.json`.

Es necesario establecer la url del acceso web de hubot en una variable de entorno.

```bash
export HUBOT_URL=http://myawesomehubot.com
```

## Ejemplo

`hubot cementerio días` -> `Ver la cantidad de días sin caídos`

`hubot cementerio qepd <nombre>` -> `Agregar un nuevo caído`

`hubot cementerio caídos` -> `Ver enlace con listado de caídos`

## Licencia

[MIT](https://tldrlegal.com/license/mit-license)
