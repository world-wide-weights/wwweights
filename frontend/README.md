# wwweights frontend

## Install

    $ git clone git@github.com:world-wide-weights/wwweights.git
    $ cd frontend
    $ npm install

## Start & watch

    $ npm run dev

## Simple build for production

    $ npm run build
    $ npm run start # Starts that build

## Testing with Cypress
### Note
Cypress Components tests currently not supporting Next v13.0.0.

### Open launcher
Be sure that frontend is running or start it.

    $ npm run dev
    $ npm run test

### Run cli

    $ npm run test:cli
---

## Tools

### Javascript/Typescript

- [next](https://nextjs.org/) is used as frontend framework.
- [cypress](https://www.cypress.io/) is used as testing framework.
- [formik](https://formik.org/) is used to handle forms.
- [yup](https://www.npmjs.com/package/yup) is used to handle form validation.

### CSS
- [TailwindCSS](https://tailwindcss.com/) is used as CSS Utility Framework