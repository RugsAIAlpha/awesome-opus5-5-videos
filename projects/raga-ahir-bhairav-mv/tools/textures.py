import sys, numpy as np
from PIL import Image, ImageFilter
out = sys.argv[1]
W, H = 1080, 1920
rng = np.random.default_rng(7)

def noise(h, w, scale):
    # Smooth value noise: random grid upsampled bicubically
    g = rng.random((max(2, h // scale), max(2, w // scale))).astype(np.float32)
    return np.asarray(Image.fromarray((g * 255).astype(np.uint8)).resize((w, h), Image.BICUBIC), dtype=np.float32) / 255

def fbm(h, w, scales, weights):
    acc = sum(noise(h, w, s) * wt for s, wt in zip(scales, weights))
    return acc / sum(weights)

def save(name, rgb):
    Image.fromarray(np.clip(rgb, 0, 255).astype(np.uint8)).save(f"{out}/{name}.jpg", quality=90)

# Cork: warm brown with dense speckle and darker granules
n = fbm(H, W, [3, 9, 40], [0.5, 0.3, 0.2])
spk = (rng.random((H, W)) > 0.82) * rng.random((H, W)) * 0.5
base = np.array([168, 118, 72], np.float32)
cork = base * (0.72 + 0.45 * n[..., None]) - spk[..., None] * 70
save("cork", cork)

# Desk: wood grain from stretched noise and ring bands
y = np.linspace(0, 1, H)[:, None]; x = np.linspace(0, 1, W)[None, :]
warp = fbm(H, W, [60, 200], [0.6, 0.4])
grain = np.sin((x * 38 + warp * 6.0 + fbm(H, W, [8, 30], [0.5, 0.5]) * 0.9) * np.pi)
fine = fbm(H, W, [2, 4], [0.5, 0.5])
wood = np.array([150, 102, 62], np.float32) * (0.82 + 0.12 * grain[..., None] + 0.18 * fine[..., None])
for i in range(1, 4):  # plank seams
    wood[:, int(W * i / 4) - 2:int(W * i / 4) + 1] *= 0.6
save("desk", wood)

# Graph paper: off-white fibres with a blue-grey grid
paper = np.array([238, 233, 222], np.float32) * (0.93 + 0.07 * fbm(H, W, [2, 6, 80], [0.4, 0.3, 0.3])[..., None])
gp = paper.copy()
for k in range(0, W, 36): gp[:, k:k + 2] *= np.array([0.86, 0.9, 0.95])
for k in range(0, H, 36): gp[k:k + 2, :] *= np.array([0.86, 0.9, 0.95])
for k in range(0, W, 180): gp[:, k:k + 3] *= np.array([0.8, 0.86, 0.94])
for k in range(0, H, 180): gp[k:k + 3, :] *= np.array([0.8, 0.86, 0.94])
save("graph", gp)

# Plain paper (for prints and newspaper)
save("paper", paper)
news = np.array([226, 216, 192], np.float32) * (0.9 + 0.1 * fbm(H, W, [2, 5, 60], [0.4, 0.3, 0.3])[..., None])
save("newsprint", news)

# Office wall: cream painted brick
wall = np.array([226, 220, 204], np.float32) * (0.9 + 0.1 * fbm(H, W, [2, 8, 50], [0.4, 0.3, 0.3])[..., None])
bh, bw = 64, 150
for row in range(0, H, bh):
    wall[row:row + 5, :] *= 0.82
    off = (row // bh % 2) * bw // 2
    for c in range(-off, W, bw):
        if 0 <= c < W: wall[row:row + bh, c:c + 5] *= 0.84
save("wall", wall)

# Animated grain plates (grey, used with overlay blend)
for i in range(6):
    g = rng.normal(128, 38, (H // 2, W // 2)).clip(0, 255).astype(np.uint8)
    Image.fromarray(g).filter(ImageFilter.GaussianBlur(0.6)).save(f"{out}/grain{i}.png")
print("ok")
