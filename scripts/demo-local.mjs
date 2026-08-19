import { readFile } from 'node:fs/promises';
import { evaluateCase } from '../src/application/evaluate-case.mjs';

for (const name of ['happy', 'mismatch', 'missing']) {
  const data = JSON.parse(await readFile(new URL(`../fixtures/${name}.json`, import.meta.url), 'utf8'));
  const result = evaluateCase(data);
  console.log(JSON.stringify({
    caseId: result.caseId,
    state: result.state,
    canonical: result.canonical,
    failedGates: result.failures.map((f) => f.invariant),
    permittedActions: result.permittedActions,
    blockedActions: result.blockedActions
  }, null, 2));
}
