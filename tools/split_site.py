#!/usr/bin/env python3
"""Build cacheable assets from the verified game without changing its mechanics."""
from pathlib import Path
import base64
import gzip
import hashlib
import json
import re
import subprocess
import sys

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'dist'
subprocess.run([sys.executable, str(ROOT/'tools/build.py'), '--output', str(OUT/'original.html')], check=True)
source = (OUT/'original.html').read_text(encoding='utf-8')
manifest = {}
def asset(folder, stem, suffix, data):
    digest = hashlib.sha256(data).hexdigest()[:16]
    relative = f'{folder}/{stem}.{digest}.{suffix}'
    path = OUT/relative
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_bytes(data)
    manifest[relative] = len(data)
    return relative

styles = re.findall(r'<style>(.*?)</style>', source, re.S)
css = asset('styles', 'game', 'css', '\n'.join(styles).encode())
html = re.sub(r'<style>.*?</style>', '', source, flags=re.S)
match = re.search(r'<script>(.*?)</script>', html, re.S)
if not match:
    raise SystemExit('Expected the original game script')
script = match.group(1)
datasets = {}
for name in ['GEO', 'V25_GEO']:
    marker = f'const {name}='
    start = script.index(marker) + len(marker)
    value, length = json.JSONDecoder().raw_decode(script[start:])
    raw = script[start:start+length].encode()
    plain = asset('data', name.lower(), 'json', raw)
    packed = asset('data', name.lower(), 'json.gz', gzip.compress(raw, compresslevel=9, mtime=0))
    assert gzip.decompress((OUT/packed).read_bytes()) == raw
    datasets[name] = {'plain': plain, 'packed': packed, 'bytes': len(raw)}
    script = script[:start] + f'window.__EOS_DATA.{name}' + script[start+length:]

# Only complete quoted base64 data URLs are extracted; dynamic SVG generators stay intact.
pattern = re.compile(r'''(["'])(data:image/(png|jpeg|jpg|webp|gif);base64,([A-Za-z0-9+/=\r\n]+))\1''')
images = {}
def extract_image(m):
    url, kind, encoded = m.group(2,3,4)
    if url not in images:
        data = base64.b64decode(encoded, validate=False)
        images[url] = asset('assets/images', 'image', 'jpg' if kind in ('jpeg','jpg') else kind, data)
    return m.group(1) + images[url] + m.group(1)
script = pattern.sub(extract_image, script)
game = asset('scripts', 'game', 'js', script.encode())
loader = '''(async () => {
  const status = document.getElementById('eos-loading-status');
  try {
    const specs = DATASETS;
    window.__EOS_DATA = {};
    async function read(spec) {
      if ('DecompressionStream' in window) {
        try {
          const response = await fetch(spec.packed);
          if (!response.ok) throw new Error('HTTP ' + response.status);
          const stream = response.body.pipeThrough(new DecompressionStream('gzip'));
          return await new Response(stream).json();
        } catch (error) { console.warn('Compressed data fallback:', error.message); }
      }
      const response = await fetch(spec.plain);
      if (!response.ok) throw new Error('HTTP ' + response.status);
      return response.json();
    }
    await Promise.all(Object.entries(specs).map(async ([name, spec]) => {
      window.__EOS_DATA[name] = await read(spec);
    }));
    status.textContent = 'Запускаем игру…';
    const script = document.createElement('script');
    script.src = GAME;
    script.onload = () => document.getElementById('eos-loading').remove();
    script.onerror = () => { status.textContent = 'Не удалось загрузить игру. Обновите страницу.'; };
    document.body.appendChild(script);
  } catch (error) {
    status.textContent = 'Не удалось загрузить карту. Проверьте соединение и обновите страницу.';
    console.error(error);
  }
})();'''.replace('DATASETS', json.dumps(datasets)).replace('GAME', json.dumps(game))
loader_path = asset('scripts', 'loader', 'js', loader.encode())
html = html.replace(match.group(0), f'<script src="{loader_path}" defer></script>')
html = html.replace('</head>', f'<link rel="stylesheet" href="{css}"></head>')
loading = '<div id="eos-loading" role="status" style="position:fixed;inset:0;z-index:999999;background:#102532;color:#ead4a5;display:grid;place-content:center;text-align:center;font:18px Georgia,serif"><h1>Империи парусов</h1><p id="eos-loading-status">Загружаем карту…</p><noscript>Для игры необходимо включить JavaScript.</noscript></div>'
html = html.replace('<body>', '<body>'+loading, 1)
assert 'id="eos-loading"' in html
(OUT/'index.html').write_text(html, encoding='utf-8')
(OUT/'original.html').unlink()
(OUT/'.nojekyll').touch()
report = {'original_bytes': len(source.encode()), 'html_bytes': len(html.encode()), 'image_count':len(images), 'assets':manifest, 'datasets':datasets, 'game':game, 'loader':loader_path, 'css':css}
(OUT/'build-report.json').write_text(json.dumps(report, indent=2))
print(json.dumps({k:v for k,v in report.items() if k not in ('assets','datasets')}, indent=2))
