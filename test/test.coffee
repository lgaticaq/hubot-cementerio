Helper = require("hubot-test-helper")
expect = require("chai").expect
moment = require("moment")
http = require("http")

helper = new Helper("./../src/index.coffee")

process.env.EXPRESS_PORT = 8080

describe "hubot-cementerio", ->

  beforeEach ->
    @room = helper.createRoom()

  afterEach ->
    @room.destroy()

  context "without empty", ->
    beforeEach (done) ->
      @room.user.say("user", "hubot cementerio dias")
      setTimeout(done, 100)

    it "should reply empty", ->
      expect(@room.messages).to.eql([
        ["user", "hubot cementerio dias"]
        ["hubot", "Desde el inicio de los tiempos no hay perdidas"]
      ])

  context "with days", ->
    beforeEach (done) ->
      last = moment().subtract(2, "days").toISOString()
      @room.robot.brain.data._private["cementerio"] = [
        {name: "user", date: last}
      ]
      @room.user.say("user", "hubot cementerio dias")
      setTimeout(done, 100)

    it "should reply empty", ->
      expect(@room.messages).to.eql([
        ["user", "hubot cementerio dias"]
        ["hubot", "Van 2 días sin nuevas perdidas"]
      ])

  context "rip", ->
    beforeEach (done) ->
      @room.user.say("user", "hubot cementerio rip some user")
      setTimeout(done, 100)

    it "should reply empty", ->
      expect(@room.messages).to.eql([
        ["user", "hubot cementerio rip some user"]
        ["hubot", "Q.E.P.D some user"]
      ])
      collections = @room.robot.brain.data._private["cementerio"]
      data = collections[collections.length - 1]
      date = moment(data.date)
      expect(data.name).to.eql("some user")
      expect(date.isValid()).to.be.true

  context "list default url", ->
    beforeEach (done) ->
      @room.user.say("user", "hubot cementerio caidos")
      setTimeout(done, 100)

    it "should reply empty", ->
      url = "http://hubot.herokuapp.com/cementerio"
      expect(@room.messages).to.eql([
        ["user", "hubot cementerio caidos"]
        ["hubot", "Los caidos estan inmortalizados en #{url}"]
      ])

  context "list with url", ->
    beforeEach (done) ->
      process.env.HUBOT_URL = "http://myawesomebot.com"
      @room.user.say("user", "hubot cementerio caidos")
      setTimeout(done, 100)

    it "should reply empty", ->
      url = "http://myawesomebot.com/cementerio"
      expect(@room.messages).to.eql([
        ["user", "hubot cementerio caidos"]
        ["hubot", "Los caidos estan inmortalizados en #{url}"]
      ])

  context "GET /cementerio empty", ->
    beforeEach (done) ->
      http.get "http://localhost:8080/cementerio", (@response) => done()
      .on "error", done

    it "responds with status 200", ->
      @response.on "data", (chunk) ->
        expect(chunk.toString()).to.eql("<h1>Cementerio</h1><ul></ul>")
      expect(@response.statusCode).to.eql(200)

  context "GET /cementerio with data", ->
    beforeEach (done) ->
      @room.robot.brain.data._private["cementerio"] = [
        {name: "user", date: "2016-10-02T22:46:22.522Z"}
      ]
      http.get "http://localhost:8080/cementerio", (@response) => done()
      .on "error", done

    it "responds with status 200", ->
      user = "Q.E.P.D. user (2016-10-02 22:46:22)"
      body = "<h1>Cementerio</h1><ul><li>#{user}</li></ul>"
      @response.on "data", (chunk) ->
        expect(chunk.toString()).to.eql(body)
      expect(@response.statusCode).to.eql(200)
