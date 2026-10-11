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

PH=[(0.0, 2.38, 'Dukandaar ki salah par construction ka maal khareed rahe hain?'), (2.74, 3.87, 'Yeh jeb par bahut bhaari padega.'), (4.33, 5.61, 'Dukandaar wahi brand bechega'), (5.91, 7.11, 'jisme uska margin zyada ho,'), (7.47, 8.82, 'na ki jo aapke ghar ke liye sahi hai.'), (9.22, 11.73, 'Baad mein eentey paani sookenge aur mistri kaam rok dega.'), (12.16, 13.54, 'Ek client ne galat cement khareeda,'), (13.8, 14.76, 'chhat dobara daalni padi'), (14.98, 16.9, 'aur 1 lakh ka faltu kharcha ho gaya.'), (17.19, 20.42, 'Solution hai, khareedne se pehle material sheet aur rate comparison tayar rakhna.'), (20.91, 22.17, 'Sahi maal aur sahi rate ke liye'), (22.39, 23.54, "comment karein 'MATERIAL'"), (23.73, 25.9, 'aur main aapko DM mein poori jaankari bhej doonga.')]
def W(p,w):
    s,e,t=PH[p]; ws=t.replace("'",'').split(' '); wt=[len(x)+2 for x in ws]; return s+(e-s)*sum(wt[:w])/sum(wt)
for ts in [0.02,2.70,4.34,7.44,9.18,10.1,10.86,12.14,13.8,14.98,17.2,20.92,22.4,23.74]: add(ts,whoosh(0.4),0.2)
# stamps / slams
for ts,f in [(W(4,0)+0.15,75),(W(5,8)+0.1,60),(W(6,3)+0.4,80),(W(1,4),70)]: add(ts,thud(f),0.75)
# 1 lakh counter: ticks, then boom
for k in range(14): add(W(8,1)+k*0.075,tick(),0.35)
add(W(8,1)+1.25,thud(50,0.6),0.95); add(W(8,1)+1.25,crash(),0.3)
add(13.8+0.2,crash(),0.35)          # chhat crack
add(10.1+0.1,crash(),0.3)           # wall crack
add(W(2,2),pop(600),0.5); add(W(3,2),pop(500),0.5); add(W(4,3),pop(700),0.5)
for k in range(8): add(W(11,1)+(8+k*2.2)/25,click(),0.5)   # typing MATERIAL
for i in range(4): add(18.55+i*0.25+0.2,ding(1100+i*140),0.35)   # sheet rows
for ts in [W(10,1)+0.1,W(10,4)+0.1]: add(ts,ding(1500,0.4),0.35)
add(W(12,4),pop(800),0.55); add(W(12,6),pop(700),0.55); add(W(12,7),ding(1320),0.4)
out=np.tanh(out*1.1)*0.6
w=wave.open('sfx.wav','wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(SR); w.writeframes((out*32767).astype('<i2').tobytes()); w.close()
print('peak',np.abs(out).max())
