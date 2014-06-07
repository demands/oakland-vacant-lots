# map-communities example frontend

Take a look at [our roadmap](https://github.com/map-communities/meta) for more information.

## Running

```
npm start # production
npm run dev # development, continuously compiling & uglifying for you
```

## Tests

They run with testling. Right now `package.json` is configured to assume you're in OS X, which is a bit of a bummer, but easy to fix: Just remove `-x open` from the `scripts.test` command in `package.json` and you should be good to go in Linux, I think.

```
npm test
```
