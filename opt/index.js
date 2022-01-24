#!/usr/bin/env node

var fs = require('fs')
var http = require('http')
log = null
ip = ''

// Get port of ngrok from ngrok.log
function check() {
  var log = fs.readFileSync('ngrok.log', { encoding: 'utf-8' })
  return log.split('\n')[1] !== undefined;
}

function start() {
  const listener = http.createServer(function (request, response) {
    response.writeHead(200, { 'Content-Type': 'application/json' })
    response.end('Server Address: ' + ip)
  }).listen(process.env.PORT || 8080, () => {
    console.log(`Listening on port: ${listener.address().port}`)
  })
}

start();
// const inter = setInterval(function () {
//   console.log("Checking for ngrok.log")
//   if (check()) {
//     log = fs.readFileSync('ngrok.log', { encoding: 'utf-8' })
//     if (!log.includes('Warning: remote port forwarding failed for listen port')) {
//       if (!log.split('\n')[log.split('\n').length - 1].includes("connect_to localhost port")) {
//         for (i in log) {
//           if (log.split('\n')[i].includes('Forwarding TCP')) {
//             ip = log.split('\n')[i].split(' ')[4]
//             break;
//           }
//         }
//       } else {
//         console.log('Ngrok port retry')
//       }
//     } else {

//       ip = 'Ngrok failed, port specified is already taken.'
//     }
//     start()
//     clearInterval(inter)
//   }
// }, 1000)



