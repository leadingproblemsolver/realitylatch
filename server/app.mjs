import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

import { mapStudioFields } from '../src/adapters/nutrient-studio-fields.mjs';
import { evaluateCase } from '../src/application/evaluate-case.mjs';

const __dirname = dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 8080);
const BODY_LIMIT = 20 * 1024 * 1024;

function send(res, status, payload, contentType = 'application/json; charset=utf-8') {
  const body = typeof payload === 'string' ? payload : JSON.stringify(payload, null, 2);
  res.writeHead(status, {
    'content-type': contentType,
    'content-length': Buffer.byteLength(body),
    'cache-control': 'no-store'
  });
  res.end(body);
}

async function readJson(req) {
  const chunks = [];
  let size = 0;
  for await (const chunk of req) {
    size += chunk.length;
    if (size > BODY_LIMIT) throw new Error('request body too large');
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}');
}

function hashJson(value) {
  return createHash('sha256').update(JSON.stringify(value)).digest('hex');
}

function evaluateStudioCase(body) {
  const docs = ['invoice', 'shipping_document', 'certificate'];
  for (const d of docs) if (!body[d]) throw new Error(`missing ${d}`);

  const claims = docs.flatMap((documentType) =>
    mapStudioFields(documentType, body[documentType], {
      inputSha256: hashJson(body[documentType])
    })
  );

  const result = evaluateCase({ caseId: body.case_id || 'runtime-case', claims }, { minConfidence: 0 });
  return {
    contract: {
      hardFields: ['shipment_id', 'buyer_name', 'quantity'],
      claimBoundary: 'Studio fields JSON is provider evidence; RealityLatch applies the approved reconciliation gate. This does not prove downstream execution or production reliability.'
    },
    claims,
    result
  };
}

async function nutrientBuildKvp({ filename, pdfBase64 }) {
  const apiKey = process.env.NUTRIENT_API_KEY;
  if (!apiKey) {
    const err = new Error('NUTRIENT_API_KEY is not configured on the server');
    err.code = 'NUTRIENT_KEY_MISSING';
    throw err;
  }
  if (!pdfBase64) throw new Error('pdfBase64 is required');

  const buffer = Buffer.from(pdfBase64, 'base64');
  const form = new FormData();
  form.append('document', new Blob([buffer], { type: 'application/pdf' }), filename || 'document.pdf');
  form.append('instructions', JSON.stringify({
    parts: [{ file: 'document' }],
    output: { type: 'json-content', keyValuePairs: true }
  }));

  const response = await fetch('https://api.nutrient.io/build', {
    method: 'POST',
    headers: { authorization: `Bearer ${apiKey}` },
    body: form
  });

  const text = await response.text();
  let raw;
  try { raw = JSON.parse(text); } catch { raw = { rawText: text }; }

  return {
    provider: 'nutrient',
    endpoint: 'https://api.nutrient.io/build',
    httpStatus: response.status,
    ok: response.ok,
    inputSha256: createHash('sha256').update(buffer).digest('hex'),
    raw
  };
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.method === 'GET' && req.url === '/health') {
      return send(res, 200, {
        ok: true,
        service: 'realitylatch',
        nutrientKeyConfigured: Boolean(process.env.NUTRIENT_API_KEY),
        version: process.env.APP_VERSION || 'dev'
      });
    }

    if (req.method === 'GET' && req.url === '/') {
      const html = await readFile(join(__dirname, 'public', 'index.html'), 'utf8');
      return send(res, 200, html, 'text/html; charset=utf-8');
    }

    if (req.method === 'POST' && req.url === '/api/evaluate-studio-json') {
      return send(res, 200, evaluateStudioCase(await readJson(req)));
    }

    if (req.method === 'POST' && req.url === '/api/nutrient/build-kvp') {
      const result = await nutrientBuildKvp(await readJson(req));
      return send(res, result.ok ? 200 : 502, result);
    }

    return send(res, 404, { error: 'not_found' });
  } catch (error) {
    const status = error.code === 'NUTRIENT_KEY_MISSING' ? 503 : 400;
    return send(res, status, { error: error.code || 'request_error', message: error.message });
  }
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`RealityLatch listening on 0.0.0.0:${PORT}`);
});
