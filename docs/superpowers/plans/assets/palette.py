import json, sys
from PIL import Image

MIN_SHARE = 0.015

def clusters(path, n=8):
    img = Image.open(path).convert('RGB')
    q = img.quantize(colors=n, method=Image.MEDIANCUT)
    pal = q.getpalette()
    total = q.width * q.height
    out = []
    for count, idx in q.getcolors(n * 4):
        r, g, b = pal[idx*3:idx*3+3]
        out.append({
            'hex': '#%02X%02X%02X' % (r, g, b),
            'rgb': [r, g, b],
            'share': round(count / total, 4),
            'source': path.split('/')[-1],
        })
    return sorted(out, key=lambda c: -c['share'])

def report(path):
    cs = clusters(path)
    kept = [c for c in cs if c['share'] >= MIN_SHARE]
    dropped = [c for c in cs if c['share'] < MIN_SHARE]
    print(f"\n== {path}")
    for c in kept:
        print(f"  keep  {c['hex']}  {c['share']*100:6.2f}%")
    for c in dropped:
        print(f"  drop  {c['hex']}  {c['share']*100:6.2f}%  (< {MIN_SHARE*100}%)")
    return kept

if __name__ == '__main__':
    all_kept = []
    for p in sys.argv[1:]:
        all_kept.extend(report(p))
    print('\nJSON:')
    print(json.dumps(all_kept, indent=2))

def ink_clusters(path, n=6, white_cut=235):
    """Quantize only the non-white ink pixels, so the white ground stops
    eating cluster slots. Returns shares relative to the ink, not the page."""
    img = Image.open(path).convert('RGB')
    ink = [p for p in img.getdata() if min(p) <= white_cut]
    strip = Image.new('RGB', (len(ink), 1))
    strip.putdata(ink)
    q = strip.quantize(colors=n, method=Image.MEDIANCUT)
    pal = q.getpalette()
    out = []
    for count, idx in q.getcolors(n * 4):
        r, g, b = pal[idx*3:idx*3+3]
        out.append({'hex': '#%02X%02X%02X' % (r, g, b), 'rgb': [r, g, b],
                    'ink_share': round(count / len(ink), 4),
                    'source': path.split('/')[-1]})
    return sorted(out, key=lambda c: -c['ink_share'])
