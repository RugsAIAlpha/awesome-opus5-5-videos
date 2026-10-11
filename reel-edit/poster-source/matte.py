import os
os.environ['OMP_NUM_THREADS']='1'; os.environ['OMP_WAIT_POLICY']='PASSIVE'
import sys, subprocess, glob, numpy as np, cv2
cv2.setNumThreads(1)
from multiprocessing import Pool
from PIL import Image
OUT='reel/public/seq'
JOBS={ # name: (src, nframes)
 'A1':('assets/src/A1_shop.mp4',96),'A2':('assets/src/A2_phone.mp4',96),'A3':('assets/src/A3_clip.mp4',40),
 'A4':('assets/src/A4_scale.mp4',72),'B2':('assets/src/B2_wall.mp4',40),'B3':('assets/src/B3_bag.mp4',60),
 'B4':('assets/src/B4_mistri.mp4',48),'B5':('assets/src/B5_helmet.mp4',40),'C1':('assets/src/C1_bricks.mp4',40),
 'C2':('assets/src/C2_wallet.mp4',60),
}
_s=None
def sess():
    global _s
    if _s is None:
        from rembg import new_session
        _s=new_session('isnet-general-use')
    return _s
def refine(a, close=False):
    a=a.astype(np.uint8)
    if close:
        m=(a>40).astype(np.uint8)
        cs,_=cv2.findContours(m,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_SIMPLE)
        big=max(cs,key=cv2.contourArea); f=np.zeros_like(m); cv2.drawContours(f,[big],-1,1,-1); a=(f*255).astype(np.uint8)
    a=cv2.erode(a,np.ones((3,3),np.uint8),iterations=1)
    return cv2.GaussianBlur(a,(3,3),0.8)
def work(args):
    src,dst,name=args
    if os.path.exists(dst) and os.path.getsize(dst)>1000: return dst
    from rembg import remove
    im=Image.open(src).convert('RGB')
    out=remove(im,session=sess())
    arr=np.array(out)
    arr[...,3]=refine(arr[...,3], close=(name=='A3'))
    Image.fromarray(arr).save(dst,'WEBP',quality=90,method=4)
    return dst
if __name__=='__main__':
    which=sys.argv[1]
    tasks=[]
    if which=='clips':
        for n,(src,nf) in JOBS.items():
            os.makedirs(f'{OUT}/{n}',exist_ok=True); os.makedirs(f'/tmp/mt/{n}',exist_ok=True)
            subprocess.run(['ffmpeg','-v','error','-y','-i',src,'-frames:v',str(nf),f'/tmp/mt/{n}/%04d.png'],check=True)
            for i in range(1,nf+1): tasks.append((f'/tmp/mt/{n}/{i:04d}.png',f'{OUT}/{n}/{i:04d}.webp',n))
    else:
        n='P'; os.makedirs(f'{OUT}/P',exist_ok=True); os.makedirs('/tmp/mt/P',exist_ok=True)
        subprocess.run(['ffmpeg','-v','error','-y','-i','src.mp4','-frames:v','656','/tmp/mt/P/%04d.png'],check=True)
        for i in range(1,657): tasks.append((f'/tmp/mt/P/{i:04d}.png',f'{OUT}/P/{i:04d}.webp','P'))
    with Pool(4) as p:
        for k,_ in enumerate(p.imap_unordered(work,tasks,chunksize=4)):
            if k%50==0: print(which,k,len(tasks),flush=True)
    print('DONE',which,flush=True)
