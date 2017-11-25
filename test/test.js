'use strict'

require('coffee-script/register')
const Helper = require('hubot-test-helper')
const { describe, it, beforeEach, afterEach } = require('mocha')
const { expect } = require('chai')
const moment = require('moment')
const http = require('http')

const helper = new Helper('../src/index.js')

process.env.EXPRESS_PORT = 8080

describe('hubot-cementerio', () => {
  beforeEach(() => {
    this.room = helper.createRoom()
  })

  afterEach(() => {
    this.room.destroy()
  })

  describe('without empty', () => {
    beforeEach(done => {
      this.room.user.say('user', 'hubot cementerio dias')
      setTimeout(done, 100)
    })

    it('should reply empty', () => {
      expect(this.room.messages).to.eql([
        ['user', 'hubot cementerio dias'],
        ['hubot', 'Desde el inicio de los tiempos no hay perdidas']
      ])
    })
  })

  describe('with days', () => {
    beforeEach(done => {
      const last = moment()
        .subtract(2, 'days')
        .toISOString()
      this.room.robot.brain.data._private.cementerio = [
        { name: 'user', date: last }
      ]
      this.room.user.say('user', 'hubot cementerio dias')
      setTimeout(done, 100)
    })

    it('should reply empty', () => {
      expect(this.room.messages).to.eql([
        ['user', 'hubot cementerio dias'],
        ['hubot', 'Van 2 días sin nuevas perdidas']
      ])
    })
  })

  describe('rip', () => {
    beforeEach(done => {
      this.room.user.say('user', 'hubot cementerio rip some user')
      setTimeout(done, 100)
    })

    it('should reply empty', () => {
      expect(this.room.messages).to.eql([
        ['user', 'hubot cementerio rip some user'],
        ['hubot', 'Q.E.P.D some user']
      ])
      const collections = this.room.robot.brain.data._private.cementerio
      const data = collections[collections.length - 1]
      const date = moment(data.date)
      expect(data.name).to.eql('some user')
      expect(date.isValid()).to.equal(true)
    })
  })

  describe('list default url', () => {
    beforeEach(done => {
      this.room.user.say('user', 'hubot cementerio caidos')
      setTimeout(done, 100)
    })

    it('should reply empty', () => {
      const url = 'http://hubot.herokuapp.com/cementerio'
      expect(this.room.messages).to.eql([
        ['user', 'hubot cementerio caidos'],
        ['hubot', `Los caidos estan inmortalizados en ${url}`]
      ])
    })
  })

  describe('list with url', () => {
    beforeEach(done => {
      process.env.HUBOT_URL = 'http://myawesomebot.com'
      this.room.user.say('user', 'hubot cementerio caidos')
      setTimeout(done, 100)
    })

    it('should reply empty', () => {
      const url = 'http://myawesomebot.com/cementerio'
      expect(this.room.messages).to.eql([
        ['user', 'hubot cementerio caidos'],
        ['hubot', `Los caidos estan inmortalizados en ${url}`]
      ])
    })
  })

  describe('GET /cementerio empty', () => {
    beforeEach(done => {
      http
        .get('http://localhost:8080/cementerio', response => {
          this.response = response
          done()
        })
        .on('error', done)
    })

    it('responds with status 200', done => {
      this.response.on('data', chunk => {
        expect(chunk.toString()).to.eql('<h1>Cementerio</h1><ul></ul>')
        done()
      })
      expect(this.response.statusCode).to.eql(200)
    })
  })

  describe('GET /cementerio with data', () => {
    beforeEach(done => {
      this.room.robot.brain.data._private.cementerio = [
        { name: 'user', date: '2016-10-02T22:46:22.522Z' }
      ]
      http
        .get('http://localhost:8080/cementerio', response => {
          this.response = response
          done()
        })
        .on('error', done)
    })

    it('responds with status 200', done => {
      this.response.on('data', chunk => {
        expect(chunk.toString()).to.match(
          /^<h1>Cementerio<\/h1><ul><li>Q.E.P.D. user \(2016-10-02 \d{2}:46:22\)<\/li><\/ul>$/
        )
        done()
      })
      expect(this.response.statusCode).to.eql(200)
    })
  })
})
