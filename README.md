# linkd
A small URL shortener written in TypeScript

## Documentation

#### `POST /url`

*Create a new shortlink*

Example body:

```json
{
  "url": "https://google.com"
}
```

Example output:

```json
{
  "message": "Short URL created.",
  "data": {
    "alias": "wda82",
    "url": "https://google.com",
    "accessKey": "pXA8N3Nlb9vFutS5"
  },
  "url": "https://linkd.pw/wda82
```

##### Input

| variable  | example              | description                                  |
| ========= | ==================== | ============================================ |
| alias     | `wda82`              | The (optional) alias to create the link with |
| url       | `https://google.com` | The URL to create a short URL for            |

##### Output

- `message`: A short description of the action taken.
- `data`: See below.
- `url`: A Linkd URL with its alias set, ready to be shared.

| variable  | example              | description                                         |
| ========= | ==================== | =================================================== |
| alias     | `wda82`              | The alias (or ID) to navigate to                    |
| url       | `https://google.com` | The URL to the alias/ID will redirect to            |
| accessKey | `pXA8N3Nlb9vFutS5`   | The token you can use to modify the given short url |
