import test from 'ava';
import fn from '../';

test('stringify', t => {
	t.same(fn.stringify({foo: 'bar'}), 'foo=bar');
	t.same(fn.stringify({foo: 'bar', bar: 'baz'}), 'bar=baz&foo=bar');
});

test('different types', t => {
	t.same(fn.stringify(), '');
	t.same(fn.stringify(0), '');
});

test('URI encode', t => {
	t.same(fn.stringify({'foo bar': 'baz faz'}), 'foo%20bar=baz%20faz');
	t.same(fn.stringify({'foo bar': 'baz\'faz'}), 'foo%20bar=baz%27faz');
});

test('handle array value', t => {
	t.same(fn.stringify({abc: 'abc', foo: ['bar', 'baz']}), 'abc=abc&foo%5B%5D=bar&foo%5B%5D=baz');
});

test('handle empty array value', t => {
	t.same(fn.stringify({abc: 'abc', foo: []}), 'abc=abc');
});

test('should not encode undefined values', t => {
	t.same(fn.stringify({abc: undefined, foo: 'baz'}), 'foo=baz');
});

test('should encode null values as just a key', t => {
	t.same(fn.stringify({xyz: null, abc: null, foo: 'baz'}), 'abc&foo=baz&xyz');
});

test('handle object notation', t => {
	t.same(fn.stringify({foo: {bar: 'quz'}}), 'foo%5Bbar%5D=quz');
	t.same(fn.stringify({foo: {bar: 'quz', baz: 'aze'}}), 'foo%5Bbar%5D=quz&foo%5Bbaz%5D=aze');
	t.same(fn.stringify({foo: {bar: 'quz', baz: 'aze', qwe: ['bla']}}), 'foo%5Bbar%5D=quz&foo%5Bbaz%5D=aze&foo%5Bqwe%5D%5B%5D=bla');
});

test('handle empty object value', t => {
	t.same(fn.stringify({foo: 'quz', bar: {}}), 'foo=quz');
});
