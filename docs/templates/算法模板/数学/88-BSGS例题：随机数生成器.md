---
title: 'BSGS例题：随机数生成器'
date: "2025-05-22"
sourceFile: "2025-05-22-补充算法笔记.md"
category: "templates"
---

<PostMeta />

# BSGS例题：随机数生成器

题意：
$第i天看的数是x_i$
$x_{i+1}=(x_i \times a + b)(mod\ p)$    
通向公式：$x_n+\frac{b}{a-1}=a^{n-1}(x_1+\frac{b}{a-1})(mod\ p)$   
$x_n=t,a^{n-1}=\frac{t+\frac{b}{a-1}}{x_1+\frac{b}{a-1}}(mod\ p)$

```cpp
int exgcd(int a,int b,int &x,int &y){
    if(!b){
        x=1,y=0;
        return a;
    }
    int d=exgcd(b,a%b,y,x);
    y-=a/b*x;
    return d;
}
int bsgs(int a,int b,int p){
    if(1%p==b%p)return 0;//特判x=0
    int k=sqrt(p)+1;
    vector<int> pw(k+1);
    unordered_map<int,int> mp;
    pw[0]=1;
    for(int i=1;i<=k;i++)pw[i]=pw[i-1]*a%p;
    for(int i=0;i<k;i++)mp[b*pw[i]%p]=i;
    for(int i=1,j=pw[k];i<=k;i++,j=j*pw[k]%p){
        if(mp.count(j))return k*i-mp[j];
    }
    return -1;
}
int exbsgs(int a,int b,int p){
    b=(b%p+p)%p;//保证正数
    if(1%p==b%p)return 0;
    int x,y;
    int d=exgcd(a,p,x,y);
    if(d>1){
        if(b%d)return -1;
        exgcd(a/d,p/d,x,y);
        int ans=exbsgs(a,b/d*x%(p/d),p/d);
        if(ans==-1)return -1;
        return ans+1;
    }
    return bsgs(a,b,p);
}
int qpow(int a,int b){
    int ans=1;
    for(;b;b>>=1){
        if(b&1)ans=ans*a%mod;
        a=a*a%mod;
    }
    return ans;
}
int inv(int a,int p){
    int x,y;
    exgcd(a,p,x,y);
    x=(x%p+p)%p;
    return x;
}
void solve(){
    int p,a,b,x,t;
    cin>>p>>a>>b>>x>>t;
    if(x==t){
        cout<<"1\n";
        return;
    }
    if(a==0){
        if(b==t)cout<<"2\n";
        else cout<<"-1\n";
        return;
    }
    if(a==1){
        if(b==0)cout<<"-1\n";
        else{
            cout<<((t-x)%p+p)%p*inv(b,p)%p+1<<"\n";
        }
        return;
    }
    int C=b*inv(a-1,p)%p;
    int A=(x+C)%p;
    int B=(t+C)%p;
    int res=exbsgs(a,B*inv(A,p)%p,p);
    if(res==-1)cout<<res<<"\n";
    else cout<<res+1<<'\n';
}
```
