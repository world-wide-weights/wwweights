

### Start the frontend
```sh
git clone git@github.com:world-wide-weights/wwweights.git
cd frontend
npm i # Install deps
npm run dev # Run in watch
```

### Build

```sh
npm run build
npm run start # Starts that build
```
### Testing

```sh
# Open Cypress Client
npm run test 

# Run e2e tests in cli (without client)
npm run test:cli

# Run component + unit tests in cli (without client)
npm run test-components:cli
```

### Code Coverage

Next v13 Compiler SWC has no stable solution to instrument code. Thereforce use the "old" babel method. [Source](https://github.com/vercel/next.js/discussions/30529)

```sh
cp .babelrc.example .babelrc # Replace SWC with babelrc config
```
Now run the tests normal. 

### Build Docker image

Build Docker image from Dockerfile 

```sh
docker build -t wwweights-frontend .
```

Run Docker image 

```sh
docker run -p 3000:3000 --name wwweights-frontend wwweights-frontend
```

### Tools

#### Javascript/Typescript

- [next](https://nextjs.org/) is used as frontend framework.
- [cypress](https://www.cypress.io/) is used as testing framework.
- [formik](https://formik.org/) is used to handle forms.
- [yup](https://www.npmjs.com/package/yup) is used to handle form validation.

#### CSS
- [TailwindCSS](https://tailwindcss.com/) is used as CSS Utility Framework
