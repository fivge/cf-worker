# Worker

## 0x01 worker

<https://xxxx.xxxx.workers.dev/>

## 0x02 kv

```bash
yarn wrangler kv:namespace create cf01

yarn wrangler kv:key put --binding=cf01 "fooo" "bar"
yarn wrangler kv:key put --namespace-id=XXXXID "foo2" "bar2"

yarn wrangler kv:key get --binding=cf01 "fooo"
yarn wrangler kv:key get --namespace-id=XXXXID "fooo"
```

```bash
wrangler dev --remote
```

---

Ref

- <https://developers.cloudflare.com/workers/get-started/quickstarts/>
