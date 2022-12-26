// See https://github.com/typicode/json-server#module
const jsonServer = require('json-server')
const server = jsonServer.create()
const router = jsonServer.router('db.json')
const middlewares = jsonServer.defaults()

server.use(middlewares)
// Add this before server.use(router)
server.use(jsonServer.rewriter({
    "/api/query/v1/items/list": "/items",
    "/api/query/v1/items/list?page=:page&limit=:limit&query=:query": "/items?_page=:page&_limit=:limit&q=:query",
    "/api/query/v1/items/list?page=:page&limit=:limit": "/items?_page=:page&_limit=:limit",
    "/api/query/v1/items/list?page=:page": "/items?_page=:page",
    "/api/query/v1/items/list?limit=:limit": "/items?_limit=:limit",
    "/api/query/v1/items/list?search=:query": "/items?q=:query",
    "/api/query/v1/items/list?slug=:slug": "/items/:slug",
    "/api/query/v1/items/statistics": "/statistics_items",
    "/api/query/v1/tags/list": "/tags",
    "/api/query/v1/tags/list?page=:page&limit=:limit": "/tags?_page=:page&_limit=:limit",
    "/api/query/v1/tags/list?page=:page": "/tags?_page=:page",
    "/api/query/v1/tags/related": "/related_tags"
}))
server.use(router)
server.listen(3004, () => {
    console.log('JSON Server is running')
})

// Export the Server API
module.exports = server