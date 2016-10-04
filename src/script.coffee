# Description
#   Un hubot-script para contabilizar los días sin nuevos despidos
#
# Dependencies:
#   "moment": "^2.15.1",
#   "pug": "^2.0.0-beta6"
#
# Configuration:
#   HUBOT_URL
#
# Commands:
#   hubot cementerio dias - Ver la cantidad de días sin caídos
#   hubot cementerio (qepd|q.e.p.d.|rip|r.i.p.) nombre del difunto -
#     Agregar un nuevo caído
#   hubot cementerio (caidos|sacrificados|martires) -
#     Ver enlace con listado de caídos
#
# Author:
#   lgaticaq

express = require "express"
path = require "path"
moment = require "moment"

module.exports = (robot) ->
  moment.locale("es")

  robot.respond /cementerio d[ií]as/, (res) ->
    cementerio = robot.brain.get("cementerio") or []
    if cementerio.length > 0
      data = cementerio[cementerio.length - 1]
      last = moment(data.date)
      today = moment()
      duration = moment.duration(today.diff(last)).humanize()
      res.send "Van #{duration} sin nuevas perdidas"
    else
      res.send "Desde el inicio de los tiempos no hay perdidas"

  robot.respond /cementerio (q\.*e\.*p\.*d\.*|r\.*i\.*p\.*) (.*)/i, (res) ->
    name = res.match[2]
    cementerio = robot.brain.get("cementerio") or []
    cementerio.push({name: name, date: (new Date()).toISOString()})
    robot.brain.set("cementerio", cementerio)
    res.send("Q.E.P.D #{name}")

  robot.respond /cementerio (ca[ií]dos|sacrificados|m[aá]rtires)/i, (res) ->
    url = process.env.HUBOT_URL or "http://#{robot.name}.herokuapp.com"
    name = res.match[1]
    res.send "Los #{name} estan inmortalizados en #{url}/cementerio"

  robot.router.use(express.static(path.join(__dirname, "..", "public")))
  robot.router.set("views", path.join(__dirname, "..", "views"))
  robot.router.set("view engine", "pug")

  robot.router.get '/cementerio', (req, res) ->
    cementerio = robot.brain.get("cementerio") or []
    format = "YYYY-MM-DD HH:mm:ss"
    data = cementerio.map (x) ->
      "Q.E.P.D. #{x.name} (#{moment(x.date).format(format)})"
    res.render("index", {data: data})

