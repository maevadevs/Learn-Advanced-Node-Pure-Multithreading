// DEPENDENCIES
// ************

let napa = require('napajs')

// Create a Napa zone with 8 workers
// Use Napa zone for heavy-lifting work
// Note: Napa zone support partial Node.JS APIs
// Note: You cannot ask a zone to execute code on a specific worker. It is auto-managed

let zone1 = napa.zone.create('zone1', { workers: 8 })

// A virtual Node zone is also accessible to expose Node APIs

let nodeZone = napa.zone.node 

// 2 Operations can be done on zones:
//  - Broadcast: 
//    run code that changes worker state on all workers, 
//    returning a promise for pending operation
//    Usually for bootstrap application, pre-cache objects, or change application settings
//
//  - Execute:
//    run code that doesn't change worker state on an arbitrary worker, 
//    returning a promise of getting the result. 
//    Execute is designed for doing the real work

// Zone operations are on a basis of first-come-first-serve
// 'broadcast' takes higher priority over 'execute'

// Broadcast code to all workers in 'zone1'
// Setups function definition of heavyFunc in all workers in the zone

zone1.broadcast(heavyFunc.toString())

// Execute an heavyFunc in any worker thread in 'zone1'

zone1.execute(heavyFunc, ['this is arg to func']).then(result => {
  console.log(result.value.length)
})

console.log('Hello World!')

// The heavy function
function heavyFunc (text) {
  let arr = []
  for (let x = 0; x < 99999; x++) {
    arr.push(text)
  }
  return arr
}
