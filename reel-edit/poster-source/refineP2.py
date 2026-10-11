import os
os.environ['OMP_NUM_THREADS']='1'
import numpy as np, cv2
from PIL import Image
from multiprocessing import Pool
cv2.setNumThreads(1)
D='reel/public/seq/P'
B='/tmp/P_refined1'
def alpha(i): return np.array(Image.open(f'{B}/{i:04d}.webp').convert('RGBA'))[...,3]
def half(i): return cv2.resize(alpha(i),(540,960),interpolation=cv2.INTER_AREA)
def work(args):
    i,core,region=args
    o=np.array(Image.open(f'/tmp/mt/P/{i:04d}.png').convert('RGB'))
    a=alpha(i).astype(np.float32)
    im=np.dstack([o,np.zeros(a.shape,np.uint8)])
    a=a*region
    a=np.maximum(a,core)
    im[...,3]=a.clip(0,255).astype(np.uint8)
    Image.fromarray(im).save(f'{D}/{i:04d}.webp','WEBP',quality=92,method=4,exact=True)
    return i
if __name__=='__main__':
    with Pool(4) as p: hs=p.map(half,range(1,657),chunksize=8)
    st=np.stack(hs)>128
    freq=st.mean(axis=0)
    core=(freq>0.55).astype(np.uint8)*255
    core=cv2.morphologyEx(core,cv2.MORPH_CLOSE,np.ones((15,15),np.uint8))
    core=cv2.erode(core,np.ones((5,5),np.uint8),iterations=1)
    core=cv2.GaussianBlur(core,(0,0),2.0)
    region=cv2.dilate(((freq>0.03)*255).astype(np.uint8),np.ones((21,21),np.uint8))
    region=cv2.GaussianBlur(region,(0,0),3.0)/255.0
    core=cv2.resize(core,(1080,1920),interpolation=cv2.INTER_LINEAR).astype(np.float32)
    region=cv2.resize(region.astype(np.float32),(1080,1920),interpolation=cv2.INTER_LINEAR)
    with Pool(4) as p:
        for k,_ in enumerate(p.imap_unordered(work,[(i,core,region) for i in range(1,657)],chunksize=8)):
            if k%200==0: print(k,flush=True)
    print('REFINED2',flush=True)
