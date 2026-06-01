---
title: 'P2522 [HAOI2011] Problem b'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# P2522 [HAOI2011] Problem b

题意:     
给出a,b,c,d,k,求 $ \sum_{x=a}^b \sum_{y=c}^d gcd(x,y)=k $     
思路：   
定义 $ F(n)=\sum_{x=1}^a \sum_{y=1}^b [n|gcd(x,y)] ,f(n)=\sum_{x=1}^a \sum_{y=1}^b [gcd(x,y)=n] $  
$ f(n)=\sum_{n|d} \mu(\frac{d}{n})F(d)= \sum_{n|d} \mu(\frac{d}{n}) \lfloor \frac{a}{d} \rfloor \lfloor \frac{b}{d} \rfloor $    
令 $ d'=\frac{d}{n},=\sum \mu(d') \lfloor \frac{a}{d'n} \rfloor \lfloor \frac{b}{d'n} \rfloor =\sum \mu(d') \lfloor \frac{a'}{d'} \rfloor \lfloor \frac{b'}{d'} \rfloor $
* 然后求的话就是二维前缀和容斥
* 算的时候用整除分块，枚举每个公共的块，使得 $ \lfloor \frac{a}{d} \rfloor=\lfloor \frac{b}{d} \rfloor $
* 复杂度为 $ O(\sqrt n) $
