// NODE MULTI-PROCESSING WITH CLUSTER
// **********************************
// This is a non-scalable solution: 
// The parent process consumed around 14MiB of memory and each child process (while running) 
// consumed around 14MiB of memory. With a machine showing around 2GiB of free memory, 
// around 250-300 simultaneous calls to the CPU intensive endpoint would crash it.
// Also, Process cluster count is set as constant

// NOTE: In production, it is better to use a dedicated library such as PM2 to handle cluster
// management. This example is for development and demo purpose only.

// DEPENDENCIES
// ************

const cluster = require('cluster')
const express = require('express')
const numCPUs = require('os').cpus().length
const { pbkdf2 } = require('crypto')

// SERVER CONFIG
// *************

const server = express()
const port = process.env.PORT || 8000
const poolSize = numCPUs
process.env.UV_THREADPOOL_SIZE = numCPUs // For libuv

// MULTI-PROCESSING USING CLUSTERED PROCESSES
// ******************************************

if (cluster.isMaster) {

  console.log(`Master is running: PID ${process.pid}`)
  // Fork workers: Limit to 1 per CPU count
  for (let i = 0; i < poolSize; i++) cluster.fork()
  // Worker event listener
  cluster.on('exit', (worker, code, signal) => console.log(`worker PID ${worker.process.pid} is gone`))

} else {

  // Workers can share any TCP connection
  // In this case it is an HTTP server through Express
  
  // SERVER ROUTES HANDLERS
  // **********************

  server.get('/', (req, res) => {
    res.send({ message: 'It works!' })
  })

  server.get('/blocking', (req, res) => {
    // Heavy work: ** Simulate "Event Loop" Blocking here ** Some CPU Intensive task **
    // pbkdf2 is a hashing algorithm that is part of the Standard lib of Node
    pbkdf2('a', 'b', 1000000000, 512, 'SHA512', () => {
      res.send({ message: 'Hash calculation finished' })
    })
  })
  
  // SERVER START LISTENING
  // **********************
  
  // console.log(`Worker PID ${process.pid} started`)
  server.listen(port, () => console.log(`Express server is up on port ${port}...`))

}
