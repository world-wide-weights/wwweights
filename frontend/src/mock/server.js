// See https://github.com/typicode/json-server#module 
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
router.db._.id = 'slug'
const middlewares = jsonServer.defaults()

const routes = require('./routes.json')

server.use(middlewares)

// Add this before server.use(router) 
server.use(jsonServer.rewriter(routes))

server.use(router)
server.listen(3004, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server