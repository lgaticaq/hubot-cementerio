// Description
//   Un hubot-script para contabilizar los días sin nuevos despidos
//
// Dependencies:
//   "moment": "^2.15.1",
//   "pug": "^2.0.0-beta6"
//
// Configuration:
//   HUBOT_URL
//
// Commands:
//   hubot cementerio dias - Ver la cantidad de días sin caídos
//   hubot cementerio (qepd|q.e.p.d.|rip|r.i.p.) nombre del difunto - Agregar un nuevo caído
//   hubot cementerio (caidos|sacrificados|martires) - Ver enlace con listado de caídos
//
// Author:
//   lgaticaq
'use strict'

const express = require('express')
const path = require('path')
const moment = require('moment')

module.exports = robot => {
  moment.locale('es')

  robot.respond(/cementerio d[ií]as/, res => {
    const cementerio = robot.brain.get('cementerio') || []
    if (cementerio.length === 0) {
      return res.send('Desde el inicio de los tiempos no hay perdidas')
    }
    const data = cementerio[cementerio.length - 1]
    const last = moment(data.date)
    const today = moment()
    const duration = moment.duration(today.diff(last)).humanize()
    res.send(`Van ${duration} sin nuevas perdidas`)
  })

  robot.respond(/cementerio (q\.*e\.*p\.*d\.*|r\.*i\.*p\.*) (.*)/i, res => {
    const name = res.match[2]
    const cementerio = robot.brain.get('cementerio') || []
    cementerio.push({ name, date: new Date().toISOString() })
    robot.brain.set('cementerio', cementerio)
    res.send(`Q.E.P.D ${name}`)
  })

  robot.respond(/cementerio (ca[ií]dos|sacrificados|m[aá]rtires)/i, res => {
    const url = process.env.HUBOT_URL || `http://${robot.name}.herokuapp.com`
    const name = res.match[1]
    res.send(`Los ${name} estan inmortalizados en ${url}/cementerio`)
  })

  robot.router.use(express.static(path.join(__dirname, '..', 'public')))
  robot.router.set('views', path.join(__dirname, '..', 'views'))
  robot.router.set('view engine', 'pug')

  robot.router.get('/cementerio', (req, res) => {
    const cementerio = robot.brain.get('cementerio') || []
    const format = 'YYYY-MM-DD HH:mm:ss'
    const data = cementerio.map(
      x => `Q.E.P.D. ${x.name} (${moment(x.date).format(format)})`
    )
    res.render('index', { data })
  })
}
