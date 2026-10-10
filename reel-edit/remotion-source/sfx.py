import numpy as np, wave
SR=48000; N=int(26.28*SR); rng=np.random.default_rng(7)
out=np.zeros(N)
def add(t,sig,g=1.0):
    i=int(t*SR); 
    if i>=N: return
    s=sig[:N-i]; out[i:i+len(s)]+=s*g
def env(n,a=0.01,r=None):
    x=np.linspace(0,1,n); e=np.minimum(x/a,1)*np.exp(-x*(r or 5)); return e
def lp(x,k):  # simple moving-average low-pass
    return np.convolve(x,np.ones(k)/k,mode='same')
def whoosh(d=0.45):
    n=int(d*SR); x=rng.standard_normal(n); t=np.linspace(0,1,n)
    # rising-then-falling band: crossfade between low-passed and high-passed noise
    low=lp(x,60); high=x-lp(x,6)
    s=low*(1-t)+high*0.5*t
    e=np.sin(np.pi*t)**1.6
    return s*e*3.0
def thud(f=70,d=0.35):
    n=int(d*SR); t=np.arange(n)/SR; fr=f*(1+2.5*np.exp(-t*30))
    return np.sin(2*np.pi*np.cumsum(fr)/SR)*np.exp(-t*11)*1.0+rng.standard_normal(n)*np.exp(-t*60)*0.25
def pop(f=700,d=0.12):
    n=int(d*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*np.cumsum(f*np.exp(-t*12)+250)/SR)*np.exp(-t*30)
def click(): 
    n=int(0.03*SR); return (rng.standard_normal(n)-lp(rng.standard_normal(n),5))*np.exp(-np.arange(n)/SR*180)*0.8
def tick():
    n=int(0.02*SR); t=np.arange(n)/SR; return np.sin(2*np.pi*1900*t)*np.exp(-t*220)*0.6
def ding(f=1320,d=0.5):
    n=int(d*SR); t=np.arange(n)/SR; return (np.sin(2*np.pi*f*t)+0.5*np.sin(2*np.pi*f*2*t)+0.25*np.sin(2*np.pi*f*3.01*t))*np.exp(-t*7)*0.4
def crash():
    n=int(0.5*SR); t=np.arange(n)/SR; return rng.standard_normal(n)*np.exp(-t*8)*0.7
for ts in [0.02,2.70,4.30,7.44,9.16,12.10,13.78,14.96,17.16,20.88,22.36,23.70]: add(ts,whoosh(),0.20)
for ts,f in [(3.02,70),(11.0,60),(12.74,80),(15.92,75)]: add(ts,thud(f),0.75)
add(16.32,thud(50,0.6),0.95); add(16.32,crash(),0.35)
add(13.94,crash(),0.5)
add(8.0,pop(500),0.6); add(24.26,pop(800),0.55); add(24.9,pop(700),0.55); add(25.3,pop(900),0.5)
for k in range(8): add(22.36+(5+k*2.2)/25,click(),0.5)
for k in range(15): add(15.12+k*0.08,tick(),0.35)
for i in range(4): add(17.16+(26+6*i)/25,ding(1100+i*140),0.35)
for ts in [20.88+0.3,21.28+0.3]: add(ts,ding(1500,0.4),0.3)
out=np.tanh(out*1.1)*0.6
w=wave.open('sfx.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
print('peak',np.abs(out).max())
