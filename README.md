# SwipeShare

## Local Development

```bash
npm install
```

```bash
cd front-end && npm install
```

```bash
npm run dev
```

To run linter:

```bash
npm run lint
```

To run formatter:

```bash
cd "$(git rev-parse --show-toplevel)" && npm run format
```

## Mock Backend

Add your route in `front-end/src/mocks/handlers.js`, then `fetch` from front end as usual.
