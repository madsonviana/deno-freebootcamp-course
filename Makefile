.DEFAULT_GOAL := dev

dev:
	@RUST_BACKTRACE=1 denon run --allow-net --allow-write --allow-read --allow-plugin --allow-env --unstable --importmap deps.json server.ts

start:
	@deno run --allow-net --allow-write --allow-read --allow-plugin --allow-env --unstable --importmap deps.json server.ts

test:
	@deno test --unstable --importmap=deps.json

dev-test:
	@denon test --unstable --importmap=deps.json

dev-install:
	@deno install --allow-read --allow-run --allow-write --allow-net -f -q --unstable https://deno.land/x/denon@v2.3.1/denon.ts