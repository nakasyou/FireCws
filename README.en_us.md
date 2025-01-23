<div align="center">

  ![image](./old/assets/firecrx.svg)
  ### FireCws
</div>

FireCws compiles web extensions written for Chrome (.crx) into ones usable in Firefox (.xpi).

## Why?
One of the Firefox's weak points is that extensions in the world's largest browser extension marketplace, namely the Chrome Web Store, cannot be used. This is the solution.

## How?
### Install it
```shell
npm i firecws #npm
yarn add firecws #yarn
pnpm add firecws #pnpm
bun add firecws #bun
```
### Import it
```ts
import * as firecws from 'firecws' // Node/Bun
import * as firecws from 'npm:firecws' // Deno

import * as firecws from 'jsr:@ns/firecws' // JSR(wip)
```

### Use it
Download a .crx extension from the Chrome Web Store:
```ts
const extensionId = 'ophjlpahpchlmihnnnihgmmeilfjmjjc' // LINE
const crxExt = await firecws.fromWebStore(extensionId)
```

Then, compile it to .xpi:
```ts
const { xpi } = await firecws.compile(crxExt, {
  // Options
}, progress => {
  // Progress callback
})

xpi // Uint8Array
```

## Extension support table
- 💯 - Proven to work completely
- ✅ - No problems
- ⭕ - Problems, but mostly usable
- 🤔 - Errors occur, inconvenient to use
- ❌ - Can't install

| Name | Extension version checked | FireCws version checked | Status |
| --- | --- | --- | --- |
| [LINE](https://chromewebstore.google.com/detail/line/ophjlpahpchlmihnnnihgmmeilfjmjjc?hl=en-US) | 3.1.2 | 0.2.0 | 🤔 |

## Problems
The compilation code is a little bloated and is slow.

## Special Thanks
- @EdamAme-x
  - Information on how LINE uses the origin and advice on how to fix it

## License
Unless otherwise specified, all files are licensed under the MIT License.
## Contributing
Please read [CONTRIBUTING.md](CONTRIBUTING.md)!
