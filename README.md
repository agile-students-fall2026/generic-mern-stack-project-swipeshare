# SwipeShare

## Local Development

```bash
npm install
```

```bash
cd front-end && npm install
```

```bash
cp .env.example .env
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

To view API documentation:

```bash
cd "$(git rev-parse --show-toplevel)" && npm run docs
```

## Mock Backend

Add your route in `front-end/src/mocks/handlers.js`, then `fetch` from front end as usual. Mocking is off by default; set `VITE_ENABLE_MOCKS=true` in `front-end/.env` to enable it.

Please design your API according to OpenAPI standard, and write the API doc in `docs/openapi.yaml`

## Resources

[Dining Hall List](https://apiv4.dineoncampus.com/sites/5cab70a48e45bf099f4a9970/locations-public?for_map=true&locale=en)
