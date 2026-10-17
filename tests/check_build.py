"""Verify the split is reversible: no game code, data or image bytes were lost."""
from pathlib import Path
import base64
import gzip
import hashlib
import json
import re

root = Path(__file__).resolve().parents[1]
out = root/'dist'
r = json.loads((out/'build-report.json').read_text())
original = b''.join(p.read_bytes() for p in sorted((root/'game-v27').glob('part-*.html'))).decode()
source_script = re.search(r'<script>(.*?)</script>', original, re.S).group(1)
restored = (root/'.build/audit-game.js').read_text()
for name, spec in r['datasets'].items():
    raw = (out/spec['plain']).read_bytes()
    assert gzip.decompress((out/spec['packed']).read_bytes()) == raw
    restored = restored.replace(f'const {name}=window.__EOS_DATA.{name}', f'const {name}='+raw.decode(), 1)
pattern = re.compile(r'''(["'])(data:image/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+/=\r\n]+))\1''')
for m in pattern.finditer(source_script):
    data = base64.b64decode(m.group(4))
    suffix = 'jpg' if m.group(3) in ('jpeg','jpg') else m.group(3)
    path = f'assets/images/image.{hashlib.sha256(data).hexdigest()[:16]}.{suffix}'
    assert (out/path).read_bytes() == data
    restored = restored.replace(m.group(1)+path+m.group(1), m.group(0))
assert restored == source_script, 'Game script did not round-trip'
assert (out/r['css']).read_text() == '\n'.join(re.findall(r'<style>(.*?)</style>', original,re.S))
for path, size in r['assets'].items():
    assert (out/path).stat().st_size == size
assert r['html_bytes'] < 20000
print('PASS: archived JavaScript reconstruction, CSS, geography and image bytes')
print('Compressed map bytes:', sum((out/x['packed']).stat().st_size for x in r['datasets'].values()))
print('All assets excluding JSON fallbacks:', sum(size for path,size in r['assets'].items() if not path.endswith('.json')))

# Published scripts must exactly match the editable source manifest, in order.
assert len(r['modules']) == len(r['source_modules'])
assert r['source_modules'][-1] == 'src/game/boot.js'
for src, built in zip(r['source_modules'], r['modules']):
    assert (root/src).read_bytes() == (out/built).read_bytes(), src
    for path in re.findall(r'assets/images/[A-Za-z0-9_.-]+', (root/src).read_text()):
        assert (out/path).is_file(), path
assert r['modules'] != []
print('PASS: source module order, published bytes and image references')
