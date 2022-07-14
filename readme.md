<br />
<div align="center">
  <img src="logo.png" alt="Logo" width="120" height="120">
  <h1 align="center">yaintl</h3>
  <p align="center">Yet another i18n library with ICU message syntax</p>
  <p align="center">
    <img src="https://img.shields.io/npm/v/@tuplo/yaintl">
    <img src="https://img.shields.io/bundlephobia/minzip/@tuplo/yaintl">
  	 <a href="https://codeclimate.com/github/tuplo/yaintl/test_coverage">
  	   <img src="https://api.codeclimate.com/v1/badges/0437dcc3178212230976/test_coverage" /></a>
  	 <img src="https://github.com/tuplo/yaintl/actions/workflows/build.yml/badge.svg">
  </p>
</div>

## Why

Other i18n solutions supporting ICU syntax were too heavy to bundle with our apps where every kb in size counts. So we wrote this stripped down to the basics solution while still supporting complex ICU syntax and a familiar API.

## Install

```bash
$ npm install @tuplo/yaintl

# or with yarn
$ yarn add @tuplo/yaintl
```

## Usage

```typescript
import I18n from '@tuplo/yaintl';

const i18n = new I18n({ 
  locale: "en-GB", 
  messages: { simple: { message: "Hi {name}!" } }
})

const t = i18n.build('simple')

t('message', { name: "Alice" }) // ⇒ "Hi Alice!"
```

## Message syntax

We use the ICU syntax to declare i18n messages. Here's a brief description of how to use this syntax.

### Plain string

```typescript
const messages = {
  hello: "Hi stranger!"
}

t('hello'); // ⇒ "Hi stranger!"
```

### Interpolation

Where placeholders in the message are replaced by given values.

#### Placeholder

```typescript
const messages = {
  desc: "{name} lives in {city}."
}

t('desc', { name: "Alice", city: "London" } ); // ⇒ "Alice lives in London."
```

#### Plural

```typescript
const messages = {
  photos: "You have {count, plural, one {# photo} other {# photos}}."
}

t('photos', { count: 1 }) // ⇒ "You have 1 photo."
t('photos', { count: 12 }) // ⇒ "You have 12 photos."
```

#### Plural with offset
```typescript
const messages = {
  adds: "{adds, plural, offset:1 =0 {No-one has added this} =1 {You added this} one {You and one other person added this} other {You and # others added this}}."
}

t('adds', { adds: 0 }); // ⇒ "No-one has added this."
t('adds', { adds: 1 }); // ⇒ "You added this."
t('adds', { adds: 2 }); // ⇒ "You and one other person added this."
t('adds', { adds: 12 }); // ⇒ "You and 11 others added this."

```

#### Ordinal
```typescript
const messages = {
  queue: "You are the {pos, selectordinal, one {#st} two {#nd} few {#rd} other {#th}}.",
}

t('queue', { pos: 1 }); // ⇒ "You are the 1st."
t('queue', { pos: 2 }); // ⇒ "You are the 2nd."
t('queue', { pos: 3 }); // ⇒ "You are the 3rd."
t('queue', { pos: 12 }); // ⇒ "You are the 12th."
```

#### Select

```typescript
const messages = {
  liked: "{gender, select, male {He} female {She} other {They}} liked this."
}

t('liked', { gender: 'male' }); // ⇒ "He liked this."
t('liked', { gender: 'female' }); // ⇒ "She liked this."
t('liked', { gender: undefined }); // ⇒ "They liked this."
```

### Formatting

Values can also be formatted based on their type by using the syntax `{variable, type, format}`. Example: `"The default value is {count, number, decimal}."`

- `variable` is the variable we pass
- `type` is how to interpret the value
- `format` is optional, and is a further refinement on how to display that type of data

#### Number

```typescript
const messages = {
  num: "The default value is {count, number}.",
  perc: "The tank is at {count, number, percent} capacity."
}

t('num', { count: 1_499 }); // ⇒ "The default value is 1,499."
t('perc', { count: 0.76 }); // ⇒ "The tank is at 76% capacity."
```

#### Date

TODO

#### Time

TODO

#### List

TODO

### Custom formatters

#### Number

TODO

#### Date

TODO

#### Time

TODO

## License

MIT