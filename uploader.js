require('dotenv').config()

const fs = require('fs')
const request = require('request')
const Pusher = require('pusher')

const pusher = new Pusher({
  appId:     process.env.PUSHER_APP_ID,
  key:       process.env.PUSHER_KEY,
  secret:    process.env.PUSHER_SECRET,
  cluster:   process.env.PUSHER_CLUSTER,
  encrypted: true
})

fs.watch('root', (event, filename) => {

  console.log(`event is: ${event} - filename: ${filename}`)

  // TODO - escaping
  // TODO - handle deletes/moves
  fs.createReadStream('root/' + filename)
    .on('error', function(){
      console.log("handled")
    })
    .pipe(request.post(process.env.UPLOAD_URI + filename))
    .on('end', function(){
      console.log("finish")
      pusher.trigger('live_load', 'uploaded', {
        "file": filename
      })
    })

  // todo emit contents
})
