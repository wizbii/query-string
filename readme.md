# query-string [![Build Status](https://travis-ci.org/sindresorhus/query-string.svg?branch=master)](https://travis-ci.org/sindresorhus/query-string)

> Parse and stringify URL [query strings](http://en.wikipedia.org/wiki/Query_string)


## Divergences

This fork of [sindresorhus](https://github.com/sindresorhus)/[query-string](https://github.com/sindresorhus/query-string) introduces a couple of changes.

1. **UMD**: there's now a bundled and UMD compatible version available along with the CommonJS one (the file is named `umd.js`)
2. **Array Notation**: the original array notation was `?foo=bar&foo=baz` and is now `?foo[]=bar&foo[]=baz`
3. **Nesting**: this implementation supports nesting but please, be aware of the [edge cases](https://github.com/visionmedia/node-querystring/issues).


## Install

```
$ npm install --save wizbii/query-string
```


## Usage

```js
const queryString = require('query-string');

console.log(location.search);
//=> '?foo=bar'

const parsed = queryString.parse(location.search);
console.log(parsed);
//=> {foo: 'bar'}

console.log(location.hash);
//=> '#token=bada55cafe'

const parsedHash = queryString.parse(location.hash);
console.log(parsedHash);
//=> {token: 'bada55cafe'}

parsed.foo = 'unicorn';
parsed.ilike = 'pizza';

location.search = queryString.stringify(parsed);

console.log(location.search);
//=> '?foo=unicorn&ilike=pizza'
```


## API

### .parse(*string*)

Parse a query string into an object. Leading `?` or `#` are ignored, so you can pass `location.search` or `location.hash` directly.

### .stringify(*object*)

Stringify an object into a query string, sorting the keys.

### .extract(*string*)

Extract a query string from a URL that can be passed into `.parse()`.


## License

MIT © [Sindre Sorhus](http://sindresorhus.com)
