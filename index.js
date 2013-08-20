var request = require('request')
var split   = require('split')
var EventEmitter = require('events').EventEmitter

//read from couch until you havn't heard anything in a while.
function connect (url, since) {
  var splitter = split(null, JSON.parse)
  var timer
  console.log(url + '/_changes?since=' + since + '&include_docs=true&feed=continuous')
  var first = true
  return request(url + '/_changes?since=' + since + '&include_docs=true&feed=continuous')
    .on('error', function (err) { splitter.emit('error', err) })
    .on('data', function (d) {
      if(first)
        first = false, splitter.emit('connect')      

      clearTimeout(timer)
      var self = this
      timer = setTimeout(function () {
        self.emit('end')
        self.destroy()
      }, 60e3)
    })
    .pipe(splitter)
}

function CouchFeed (url, getSince) {

  var emitter = new EventEmitter()
  emitter.queued = false

  emitter.start = function (since) {
    emitter.queued = false
    console.log('connect')

    if(since)
      emitter.since = since

    console.log({url: url, json: true})
    request({url: url, json: true}, function (err, _, body) {
      if(err) return retry()
      emitter.maxSeq = body.update_seq
      console.log(body)
    })

    var first = true, timeout

    var stream = emitter.currentStream = 
      connect(url, emitter.since)
        .on('data', function (data) {
          console.log(data.id, data.seq)

          first = false
          emitter.latestSeq = data.seq || emitter.latestSeq

          emitter.emit('data', data)
          emitter.emit('progress', emitter.latestSeq / emitter.maxSeq, emitter.latestSeq, emitter.maxSeq)
          emitter.since = Math.max(emitter.since, emitter.latestSeq)
        })
        .on('error', retry)
        .on('end',   retry)
        .on('close', retry)

    stream.on('connect', function () {
      emitter.emit('connection', stream)
    })

    function retry () {
      if(emitter.queued) return
      emitter.queued = true
      setTimeout(emitter.start, 10e3)
    }
    return emitter
  }
  return emitter
}

if(!module.parent) {
  var feed = 
  CouchFeed('http://isaacs.iriscouch.com/registry')
    .start(522412)
    .on('connection', function (stream) {
      stream.on('data', function (data) {
        console.log(data.id)
      })
    })
  feed.on('progress', function (ratio) {
    console.log(Math.round(ratio * 10000) / 100)
  })
}
