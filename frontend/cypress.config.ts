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
      const port = 3002
      const app = next({ dev, hostname, port })
      const handle = app.getRequestHandler()

      // TODO: Move this to async and await syntax
      await app.prepare().then(() => {
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

      on('task', {
        clearNock() {
          nock.restore()
          nock.cleanAll()

          return null
        },
        async nock({ hostname, method, path, statusCode, body }: NockType) {
          nock.activate()

          console.log(`Backend Mock: ${method.toUpperCase()} ${hostname}${path} respond with`, statusCode, `${JSON.stringify(body).substring(0, 50)}...`)

          nock(hostname).persist()[method](path).query(true).reply(statusCode, body)

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
    specPattern: '**/*.{cy,unit}.{js,jsx,ts,tsx}'
  },
  env: {
    BASE_URL: 'http://localhost:3002'
  }
})

