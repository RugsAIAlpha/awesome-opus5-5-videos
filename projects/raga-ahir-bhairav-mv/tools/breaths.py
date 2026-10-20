import sys, json, numpy as np
x = np.fromfile(sys.argv[1], dtype=np.float32); sr = 22050; fps = 30
N = 1024; hop = sr // fps
win = np.hanning(N); freqs = np.fft.rfftfreq(N, 1 / sr)
band = (freqs > 180) & (freqs < 1400)
n = len(x) // hop
E = np.zeros(n)
for f in range(n):
    seg = x[f * hop: f * hop + N]
    if len(seg) < N: seg = np.pad(seg, (0, N - len(seg)))
    E[f] = 20 * np.log10(np.abs(np.fft.rfft(seg * win))[band].sum() + 1e-9)
# Breath gap = energy at least `drop` dB under the local (±2 s) median
k = 60
med = np.array([np.median(E[max(0, i - k):i + k]) for i in range(n)])
d = med - E
lo, hi = int(sys.argv[3]) * fps, int(sys.argv[4]) * fps
gaps = []
i = lo
while i < hi:
    if d[i] > 7:
        j = i
        while j < hi and d[j] > 4: j += 1
        if j - i >= 3: gaps.append((i, j))
        i = j + 1
    else: i += 1
# Phrases between gaps, merging pieces shorter than 1.2 s into the previous phrase
bounds = [lo] + [g[1] for g in gaps] 
ends = [g[0] for g in gaps] + [hi]
ph = []
for a, b in zip(bounds, ends):
    if b - a < 12: continue
    if ph and a - ph[-1][1] < 6 and (b - a) < 36: ph[-1][1] = b
    else: ph.append([a, b])
json.dump(ph, open(sys.argv[2], "w"))
print(len(ph)); print(" | ".join(f"{a/30:.1f}-{b/30:.1f}" for a, b in ph))
