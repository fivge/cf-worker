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
# 本地使用远程kv
yarn wrangler dev --remote
```

## 0x03 runtime-apis

### 1. scheduled

```bash
yarn wrangler dev --test-scheduled

curl "http://localhost:8787/__scheduled?cron=*+*+*+*+*"
```

---

Ref

- <https://developers.cloudflare.com/workers/get-started/quickstarts/>
