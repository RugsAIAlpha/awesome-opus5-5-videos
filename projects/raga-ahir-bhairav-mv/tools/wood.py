import sys, numpy as np
from PIL import Image
W, H = 1080, 1920
rng = np.random.default_rng(11)
def aniso(sy, sx):
    g = rng.random((max(2, H // sy), max(2, W // sx))).astype(np.float32)
    return np.asarray(Image.fromarray((g * 255).astype(np.uint8)).resize((W, H), Image.BICUBIC), np.float32) / 255
x = np.linspace(0, 1, W)[None, :]
warp = aniso(480, 90) * 0.9 + aniso(160, 40) * 0.25
grain = np.sin((x * 70 + warp * 3.0) * np.pi)
streak = aniso(300, 2)  # long fibres
fine = aniso(2, 2)
v = 0.78 + 0.08 * grain + 0.12 * streak + 0.05 * fine
wood = np.array([152, 103, 62], np.float32) * v[..., None]
for i in range(1, 4):
    c = int(W * i / 4); wood[:, c - 3:c + 1] *= 0.55; wood[:, c + 1:c + 3] *= 1.06
Image.fromarray(np.clip(wood, 0, 255).astype(np.uint8)).save(sys.argv[1], quality=90)
