const codeCoverageTask = require("@bahmutov/cypress-code-coverage/plugin") // Does not have ts support
import { defineConfig } from "cypress"
import { createServer } from "http"
import next from "next"
import nock from "nock"
import { parse } from "url"

type NockType = {
	hostname: string
	method: "get" | "post" | "put" | "patch" | "delete"
	path: string
	statusCode: number
	body: any
}

export default defineConfig({
	e2e: {
		async setupNodeEvents(on, config) {
			const dev = process.env.NODE_ENV !== "production"
			const hostname = "localhost"
			const port = 3010
			const app = next({ dev, hostname, port })
			const handle = app.getRequestHandler()

			await app.prepare().then(() => {
				createServer(async (req, res) => {
					try {
						const parsedUrl = parse(req.url!, true)
						await handle(req, res, parsedUrl)
					} catch (err) {
						console.error("Error occurred handling", req.url, err)
						res.statusCode = 500
						res.end("internal server error")
					}
				}).listen(port, () => {
					console.log(`> Ready on https://${hostname}:${port}`)
				})
			})

			on("task", {
				/**
				 * Clears HTTP interceptor and the interceptor list.
				 * Goes into unmocked state.
				 */
				resetNock() {
					nock.restore()
					nock.cleanAll()

					// After nock restore is called we need to activate nock again because it removes http interceptor: https://github.com/nock/nock#restoring
					if (!nock.isActive()) nock.activate()

					// Need to return null or a value in task otherwise it will fail test: https://docs.cypress.io/api/commands/task#Usage
					return null
				},
				/**
				 * Mocks server side requests
				 * @param object with mock meta information and body
				 */
				async nock({ hostname, method, path, statusCode, body }: NockType) {
					console.log(
						`Backend Mock: ${method.toUpperCase()} ${hostname}${path} respond with`,
						statusCode,
						`${body ? JSON.stringify(body).substring(0, 50) : "No body"}...`
					)

					nock(hostname).persist()[method](path).query(true).reply(statusCode, body)

					return null
				},
			})

			// Handles code coverage
			require("@cypress/code-coverage/task")(on, config)

			return config
		},
	},
	viewportWidth: 1920,
	viewportHeight: 1080,
	component: {
		setupNodeEvents(on, config) {
			return Object.assign({}, config, codeCoverageTask(on, config))
		},
		specPattern: "**/*.{cy,unit}.{js,jsx,ts,tsx}",
		devServer: {
			framework: "next",
			bundler: "webpack",
			webpackConfig: {
				mode: "development",
				devtool: false,
				module: {
					rules: [
						{
							test: /\.tsx?$/,
							exclude: [/node_modules/],
							use: {
								loader: "babel-loader",
								options: {
									presets: ["next/babel"],
									plugins: ["istanbul"],
								},
							},
						},
					],
				},
			},
		},
	},
	env: {
		CLIENT_BASE_URL: "http://localhost:3010",
		PUBLIC_API_BASE_URL_QUERY_SERVER: "http://localhost:3004/queries/v1",
		PUBLIC_API_BASE_URL_QUERY_CLIENT: "http://localhost:3004/queries/v1",
		PUBLIC_API_BASE_URL_COMMAND: "http://localhost:3002/commands/v1",
		PUBLIC_API_BASE_URL_AUTH_CLIENT: "http://localhost:3001",
		PUBLIC_API_BASE_URL_AUTH_SERVER: "http://localhost:3001",
		PUBLIC_API_BASE_URL_IMAGE_SERVER: "http://localhost:3003",
		PUBLIC_API_BASE_URL_IMAGE_CLIENT: "http://localhost:3003",
	},
})
