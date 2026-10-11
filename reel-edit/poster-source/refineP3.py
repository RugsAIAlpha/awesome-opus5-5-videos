import os
os.environ['OMP_NUM_THREADS']='1'
import numpy as np, cv2
from PIL import Image
from multiprocessing import Pool
cv2.setNumThreads(1)
B='/tmp/P_refined2'; OUT='reel/public/seq/P2'
def A(i): 
    i=min(656,max(1,i)); return np.array(Image.open(f'{B}/{i:04d}.webp').convert('RGBA'))[...,3]
def work(i):
    o=np.array(Image.open(f'/tmp/mt/P/{i:04d}.png').convert('RGB'))
    a=np.median(np.stack([A(i-1),A(i),A(i+1)]),axis=0).astype(np.uint8)   # temporal median = kill single-frame flutter
    a=cv2.GaussianBlur(a,(0,0),1.0)
    k=cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(17,17))                 # ~8px white outline
    d=cv2.GaussianBlur(cv2.dilate((a>40).astype(np.uint8)*255,k),(0,0),1.1)
    fa=np.maximum(a,d).astype(np.uint8)
    af=(a.astype(np.float32)/255.0)[...,None]
    rgb=(af*o+(1-af)*255.0).clip(0,255).astype(np.uint8)
    Image.fromarray(np.dstack([rgb,fa])).save(f'{OUT}/{i:04d}.webp','WEBP',quality=92,method=4,exact=True)
    return i
if __name__=='__main__':
    with Pool(4) as p:
        for k,_ in enumerate(p.imap_unordered(work,range(1,657),chunksize=8)):
            if k%200==0: print(k,flush=True)
    print('P3 DONE',flush=True)
