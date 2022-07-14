<br />
<div align="center">
  <img src="logo.png" alt="Logo" width="120" height="120">
  <h1 align="center">yaintl</h3>
  <p align="center">Yet another i18n library with ICU message syntax</p>
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

t('message', { name: "Jane" }) // ⇒ "Hi Jane!"
```

## License

MIT