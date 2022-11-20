import { defineConfig } from "cypress";
import { createServer } from 'http';
import next from 'next';
import nock from 'nock';
import { parse } from "url";

type NockType = {
  hostname: string,
  method: "get" | "post" | "put" | "patch" | "delete"
  path: string
  statusCode: number
  body: any
}

export default defineConfig({
  e2e: {
    async setupNodeEvents(on, config) {
      const dev = process.env.NODE_ENV !== 'production'
      const hostname = 'localhost'
      const port = 3000
      const app = next({ dev, hostname, port })
      const handle = app.getRequestHandler()

      app.prepare().then(() => {
        createServer(async (req, res) => {
          try {
            const parsedUrl = parse(req.url!, true)
            await handle(req, res, parsedUrl)

          } catch (err) {
            console.error('Error occurred handling', req.url, err)
            res.statusCode = 500
            res.end('internal server error')
          }
        }).listen(port, () => {
          console.log(`> Ready on https://${hostname}:${port}`)
        })
      })

      // register handlers for cy.task command
      // https://on.cypress.io/task
      on('task', {
        clearNock() {
          nock.restore()
          nock.cleanAll()

          return null
        },
        async nock({ hostname, method, path, statusCode, body }: NockType) {
          nock.activate()

          console.log('Nock will: %s %s%s respond with %d %o', method, hostname, path, statusCode, body)

          nock(hostname, { allowUnmocked: true })[method](path).reply(statusCode, body)

          return null
        },
      })

      return config
    },
  },
  viewportWidth: 1920,
  viewportHeight: 1080,
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
  env: {
    BASE_URL: 'http://localhost:3000'
  }
})

