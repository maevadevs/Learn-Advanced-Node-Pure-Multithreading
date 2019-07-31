// NODE MULTI-PROCESSING WITH WORKER
// **********************************
// NOTE: Worker Thread is only experimental in Node 10 and 12
// The great thing about Worker Thread is that we can spawn worker only when needed
// dynamically, and we can also kill a worker when its job is done

const express = require('express')
const { fork } = require('child_process')
const worker = './workers/findFruit' // Note: We are not requiring. Just the path

// SERVER CONFIG
// *************

const server = express()
const port = process.env.PORT || 8000 // Using Port 80 will needs sudo
  
// SERVER ROUTES
// *************
  
server.get('/', (req, res) => {
  res.send({ message: 'It works!' })
})

server.get('/blocking', (req, res) => {
  // Get the worker by forking it
  // The heavy work is delegated to the worker in its definition
  const findFruitWorker = fork(worker)

  // Then, send a message data to initiate the worker's job
  // The 'onmessage' listener of the worker will handle this in the worker
  findFruitWorker.send({ letter: 'A' })

  // The worker will later reply back the result with a message when it is done
  // This is where we handle it then, using `onmessage`
  findFruitWorker.on('message', fruit => {
    res.send({ message: `Hard work is done: The fruit is ${fruit}!` })
    // We are done, so we can kill the worker and save resources
    findFruitWorker.kill()
  })
})
  
// START LISTENING
// ***************

server.listen(port, () => console.log(`Express server is up on port ${port}...`))
