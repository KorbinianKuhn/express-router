# Express router

[![Travis](https://img.shields.io/travis/KorbinianKuhn/express-router.svg)](https://travis-ci.org/KorbinianKuhn/express-router/builds)
[![Coverage Status](https://coveralls.io/repos/github/KorbinianKuhn/express-router/badge.svg?branch=master)](https://coveralls.io/github/KorbinianKuhn/express-router?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/KorbinianKuhn/express-router/badge.svg)](https://snyk.io/test/github/KorbinianKuhn/express-router) 
[![dependencies](https://david-dm.org/KorbinianKuhn/express-router.svg)]()
[![npm](https://img.shields.io/npm/dt/@korbiniankuhn/express-router.svg)](https://www.npmjs.com/package/@korbiniankuhn/express-router)
[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

This package helps to add routes dynamically to an express REST API and send automated 404 responses with endpoint suggestions. The routes and controllers can easily be described with an object. It also validates the given object against duplicate endpoints and missing controller functions.

## Installation

For installation use the [Node Package Manager](https://github.com/npm/npm):

```
$ npm install --save @korbiniankuhn/express-router
```

or clone the repository:

```
$ git clone https://github.com/KorbinianKuhn/express-router
```

## Getting started

Define your api endpoints / app routing.

``` javascript
const controller = require('./path/to/controller');
const routes = {
  '/users': {
    get: controller.getUsers,
    post: controller.addUser,
    '/:id': {
      get: controller.getUserById,
      delete: controller.deleteUserById,
      patch: controller.changeUser,
      '/photos/:id/thumbnail': {
        get: controller.getThumbnailByPhotoId
      }
    }
  }
}
```

Create the endpoints

``` javascript
const router = require('@korbiniankuhn/express-router');
const express = require('express');
const app = express();

router.create(app, routes);
```

Add the 404 middleware

``` javascript
app.use(router.middleware(routes));
```

## Settings

### `create(app, routes, middleware, options)`

- `app` The express app instance.
- `routes` The routes object.
- `middleware` A middleware that should be used for all routes.

options

- `asyncWrapper (boolean)`: Wraps an async middleware around the controller function that catches exceptions and nexts them. Default true.
- `verbose (function)`: Set a function e.g. console.log to see outputs for all created routes. Default null.
- `strict (boolean)`: Only allow routes that contain lowercase letters, numbers or dashes. Default true.

### `middleware(routes, options)`

- `routes` The routes object.

options

- `next (boolean)`: Next a NotFoundError after sending response. Default false.
- `message (string)`: Set a custom message. Default 'Not found.'
- `strict (boolean)`: Only allow routes that contain lowercase letters, numbers or dashes. Default true.

## Testing

First you have to install all dependencies:

```
$ npm install
```

To execute all unit tests once, use:

```
$ npm test
```

To get information about the test coverage, use:

```
$ npm run coverage
```

## Contribution

express-router is an open source project and your contribution is very much appreciated. Fork this repository and push in your ideas.

Do not forget to add corresponding tests to keep up 100% test coverage.

## License

The MIT License

Copyright (c) 2018 Korbinian Kuhn

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.