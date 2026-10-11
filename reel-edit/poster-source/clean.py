import sys, glob, numpy as np, cv2
from PIL import Image
for name in sys.argv[1:]:
    for f in sorted(glob.glob(f'reel/public/seq/{name}/*.webp')):
        im=np.array(Image.open(f).convert('RGBA'))
        m=(im[...,3]>40).astype(np.uint8)
        n,lab,st,_=cv2.connectedComponentsWithStats(m,connectivity=8)
        if n<=2: continue
        big=st[1:,cv2.CC_STAT_AREA].max()
        keep=np.zeros(n,bool); keep[0]=False
        for i in range(1,n):
            if st[i,cv2.CC_STAT_AREA]>=0.08*big: keep[i]=True
        mask=keep[lab]
        im[...,3]=np.where(mask,im[...,3],0)
        Image.fromarray(im).save(f,'WEBP',quality=90,method=4)
print('cleaned',sys.argv[1:])
