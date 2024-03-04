# ChainFuse API

API endpoints that handle customer websites provisioning.

- **[`sites`](./routes/sites.ts)** ([tests](./routes/sites.test.ts)) — Customer websites
- **[`users`](./routes/users.ts)** ([tests](./routes/users.test.ts)) — Firebase user accounts

### Customer Websites

#### `POST /api/sites/<id>` — Create a New Customer Website

```ts
const siteId = "roblox";
const idToken = await fbUser.getIdToken();
const res = await fetch(`/api/sites/${siteId}`, {
  method: "POST",
  headers: {
    [`Authorization`]: `Bearer ${idToken}`,
    [`Content-Type`]: `application/json`,
  },
  body: JSON.stringify({
    template: "marketplace",
    version: "latest",
    env: {
      TAGLINE: "Roblox NFT Marketplace",
    },
  }),
});

if (res.ok) {
  const site = await res.json();
  // TODO: Show success message
} else {
  const err = await res.json();
  // TODO: Show error message
}
```

#### `PATCH /api/sites/<id>` — Update a Customer Website

```ts
const siteId = "roblox";
const idToken = await fbUser.getIdToken();
const res = await fetch(`/api/sites/${siteId}`, {
  method: "PATCH",
  headers: {
    [`Authorization`]: `Bearer ${idToken}`,
    [`Content-Type`]: `application/json`,
  },
  body: JSON.stringify({
    hostname: `roblox.koistya.com`,
  }),
});

if (res.ok) {
  const site = await res.json();
  // TODO: Show success message
} else {
  const err = await res.json();
  // TODO: Show error message
}
```

#### `DELETE /api/sites/<id>` — Delete a Customer Website

```ts
const siteId = "roblox";
const idToken = await fbUser.getIdToken();
const res = await fetch(`/api/sites/${siteId}`, {
  method: "DELETE",
  headers: { [`Authorization`]: `Bearer ${idToken}` },
});

if (res.ok) {
  // TODO: Show success message
} else {
  // TODO: Show error message
}
```

#### `GET /api/sites` — Fetch the List of Customer Websites

```ts
const idToken = await fbUser.getIdToken();
const res = await fetch(`/api/sites/`, {
  headers: { [`Authorization`]: `Bearer ${idToken}` },
});

if (res.ok) {
  const sites = await res.json();
} else {
  // TODO: Show error message
}
```

#### `GET /api/sites/<id>/hostname` — Fetch the Custom Hostname Details

```ts
const siteId = "roblox";
const idToken = await fbUser.getIdToken();
const res = await fetch(`/api/sites/${siteId}/hostname`, {
  headers: { [`Authorization`]: `Bearer ${idToken}` },
});

if (res.ok) {
  const hostname = await res.json();
} else {
  // TODO: Show error message
  const err = await res.json();
}
```

Find the list of customer websites in Firestore:

- https://console.cloud.google.com/firestore/data/sites/?project=chainfuse (production)
- https://console.cloud.google.com/firestore/data/sites/?project=chainfuse-test (test/QA)

### How to Test

```bash
$ yarn test -t api
# Start the cloud functions locally
$ yarn api:start script
```

### How to Deploy

```bash
# To deploy the api, first make sure that you have set the project to `chainfuse`.
$ gcloud config set project chainfuse

# Deploy to staging/QA environment
$ yarn api:deploy --env=test

# Deploy to production environment
$ yarn api:deploy --env=prod
```
