// NODE MULTI-PROCESSING WITH WORKER
// *********************************

// It is important to keep in mind that spawned Node.js child processes are 
// independent of the parent with exception of the IPC communication channel 
// that is established between the two. Each process has its own memory, with 
// their own V8 instances. Because of the additional resource allocations required, 
// spawning a large number of child Node.js processes is not recommended.

// This is a non-scalable solution for High simultaneous calls: 
// The parent process would consumed around 14MiB of memory and each child process 
// (while running) consumed around 7MiB of memory. 
// With a machine showing around 2GiB of memory, around 250~300
// simultaneous calls to the CPU intensive endpoint would crash it.

// DEPENDENCIES
// ************

const { sleep } = require('sleep')

// WORKER
// ******

process.on('message', ({ letter }) => {
  sleep(7) // Simulate ARTIFICIAL CPU INTENSIVE: This is the blocking work
  let fruit = null
  switch (letter) {
    case 'A':
      fruit = 'apple'
      break;
    default:
      fruit = 'unknown'
  }
  // Return back the message to the caller
  process.send(fruit)
})
