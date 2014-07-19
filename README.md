# map-communities example frontend

![A screenshot of map-communities example frontend in action](https://raw.github.com/map-communities/example-frontend/master/doc/screenshot.png)

Take a look at [our roadmap](https://github.com/map-communities/meta) for more information.

## Running

Dependencies:

- **node.js** - http://nodejs.org/
- **mongodb** - http://www.mongodb.org/

```
git clone https://github.com/map-communities/example-frontend
./bin/setup.sh
npm start
```

## Tests

They run with testling. Right now `package.json` is configured to assume you're in OS X, which is a bit of a bummer, but easy to fix: Just remove `-x open` from the `scripts.test` command in `package.json` and you should be good to go in Linux, I think.

```
npm test
```
