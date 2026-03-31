const fs = require('fs');
const path = require('path');
const p = path.join(process.cwd(), 'Test.json');
const text = fs.readFileSync(p, 'utf8');
let parsed = null;
try { parsed = JSON.parse(text); } catch (e) { console.error('parse error', e); process.exit(1); }
const findings = [];
if (parsed.software_layer_results && Array.isArray(parsed.software_layer_results.findings)) {
  for (const f of parsed.software_layer_results.findings) {
    const sev = (f.severity || '').toString().toLowerCase();
    const type = sev === 'critical' || sev === 'high' ? 'Critical' : sev === 'medium' ? 'Medium' : 'Low';
    const lib = f.library || f.package || 'package';
    const msg = `${lib} ${f.version || ''} — ${f.cve_id || ''} ${f.description || ''}`.trim();
    findings.push({ type, message: msg, location: 'SBOM' });
  }
}
if (parsed.ai_layer_results && (parsed.ai_layer_results.security_status || parsed.ai_layer_results.threats_detected)) {
  const sec = (parsed.ai_layer_results.security_status || '').toString().toLowerCase();
  if (sec === 'dangerous' || sec === 'malicious') {
    findings.push({ type: 'Critical', message: `AI layer reported security_status=${parsed.ai_layer_results.security_status}`, location: 'ai_layer' });
  }
  const threats = parsed.ai_layer_results.threats_detected || [];
  if (Array.isArray(threats)) {
    for (const t of threats) {
      if (typeof t === 'string') {
        findings.push({ type: 'High', message: String(t), location: 'ai_layer' });
      } else if (t && typeof t === 'object') {
        const parts = [];
        if (t.type) parts.push(t.type);
        if (t.impact) parts.push(`impact: ${t.impact}`);
        if (t.detected_calls) parts.push(`calls: ${(Array.isArray(t.detected_calls) ? t.detected_calls.join(', ') : t.detected_calls)}`);
        if (t.detected_opcodes) parts.push(`opcodes: ${(Array.isArray(t.detected_opcodes) ? t.detected_opcodes.join(', ') : t.detected_opcodes)}`);
        const severityType = (t.type && t.type.toLowerCase().includes('pickle')) ? 'Critical' : 'High';
        findings.push({ type: severityType, message: parts.join(' — '), location: 'ai_layer' });
      }
    }
  }
}
console.log(JSON.stringify({ parsedKeys: Object.keys(parsed), findings }, null, 2));
