// See https://github.com/typicode/json-server#module 
const jsonServer = require("json-server")
const server = jsonServer.create()
const router = jsonServer.router("db.json")
const auth = require("json-server-auth")
const middlewares = jsonServer.defaults()

const routes = require("./routes.json")

server.db = router.db
router.db._.id = "slug"

server.use(middlewares)

server.use(auth.rewriter(routes))
server.use(auth)
server.use(router)
server.listen(3008, () => {
    console.log("JSON Server is running")
})

// Export the Server API
module.exports = server