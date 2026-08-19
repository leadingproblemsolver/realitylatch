# Deploy RealityLatch to Cloud Run

## Target
RealityLatch is a stateless Node 20 service listening on `$PORT`.

Endpoints:
- `GET /health`
- `POST /api/evaluate-studio-json`
- `POST /api/nutrient/build-kvp`

The Nutrient API key is read only from the server environment as `NUTRIENT_API_KEY`.

## Recommended secret setup
Use Google Secret Manager, then expose the secret to Cloud Run as the environment variable `NUTRIENT_API_KEY`.

Console path for an existing Cloud Run service:
1. Google Cloud Console → Cloud Run.
2. Open the RealityLatch service.
3. Click **Edit and deploy new revision**.
4. Open **Container(s)**.
5. Open **Variables & Secrets**.
6. Click **Reference a secret**.
7. Environment variable name: `NUTRIENT_API_KEY`.
8. Select the Secret Manager secret/version containing the Nutrient API key.
9. Deploy the revision.
10. Open `/health` and confirm `"nutrientKeyConfigured": true`.

Do not put the key into source code, Dockerfile, browser JavaScript, or a public screenshot.

## Local Docker proof
```bash
docker build -t realitylatch .
docker run --rm -p 8080:8080 \
  -e NUTRIENT_API_KEY="$NUTRIENT_API_KEY" \
  realitylatch
```

Then:
```bash
curl http://localhost:8080/health
```

## Claim boundary
A healthy deployment + configured key proves the backend is ready to authenticate a Nutrient request. It does not prove extraction correctness, reconciliation correctness, or downstream consequence until those are executed and receipts are preserved.
