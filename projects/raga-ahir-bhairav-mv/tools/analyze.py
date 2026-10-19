import sys, json, numpy as np
src, out = sys.argv[1], sys.argv[2]
sr, fps, nb = 22050, 30, 16
x = np.fromfile(src, dtype=np.float32)
n = int(len(x) / sr * fps)
N = 2048
win = np.hanning(N)
freqs = np.fft.rfftfreq(N, 1 / sr)
edges = np.geomspace(60, 8000, nb + 1)
idx = [np.where((freqs >= edges[i]) & (freqs < edges[i + 1]))[0] for i in range(nb)]
rms, bands = [], []
for f in range(n):
    c = int((f + 0.5) / fps * sr)
    seg = x[max(0, c - N // 2):c + N // 2]
    seg = np.pad(seg, (0, N - len(seg)))
    rms.append(float(np.sqrt(np.mean(seg ** 2))))
    mag = np.abs(np.fft.rfft(seg * win))
    bands.append([float(np.log1p(mag[i].mean() * 10)) for i in idx])
rms = np.array(rms); B = np.array(bands)
def norm(a):
    lo, hi = np.percentile(a, 5), np.percentile(a, 98)
    return np.clip((a - lo) / (hi - lo + 1e-9), 0, 1)
def smooth(a, k):
    out = a.copy()
    for i in range(1, len(a)):
        out[i] = out[i - 1] + (a[i] - out[i - 1]) * (k if a[i] > out[i - 1] else k / 3)
    return out
r = smooth(norm(rms), 0.5)
Bn = np.stack([smooth(norm(B[:, i]), 0.6) for i in range(nb)], axis=1)
json.dump({"fps": fps, "rms": [round(v, 3) for v in r], "bands": [[round(v, 2) for v in row] for row in Bn]}, open(out, "w"), separators=(",", ":"))
print(n, "frames", r.mean())
