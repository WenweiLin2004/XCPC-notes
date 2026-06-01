---
title: '三模数NTT'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 三模数NTT

假设答案为x，三模数分别为A,B,C
* $ x \equiv x_1(mod\ A) $
* $ x \equiv x_2(mod\ B) $
* $ x \equiv x_3(mod\ C) $

合并前两个，
* $ x_1+k_1A=x_2+k_2B $
* $ x_1+k_1A \equiv x_2(mod\ B) $
* $ k1 \equiv \frac{x_2-x_1}{A}(mod\ B) $

求出 $ x \equiv x_1+k_1A(mod\ AB),x_4=x_1+k_1A(mod\ AB) $

* $ x_4+k_4AB=x_3+k_3C $
* $ k_4 \equiv \frac{x_3-x_4}{AB}(mod\ C) $

求出 $ x \equiv x_4+k_4AB(mod\ ABC),x<ABC,x=x_4+k_4AB $
```cpp
namespace NTT{
    vector<int> rev;
    int bit=0,tot;
    int qpow(int a,int b,const int mod){
        int ans=1;
        for(;b;b>>=1){
            if(b&1)ans=ans*a%mod;
            a=a*a%mod;
        }
        return ans;
    }
    int inv(int n,int P){
        return qpow(n,P-2,P);
    }
    const int mod1=998244353,mod2=1004535809,mod3=469762049,g=3;
    const int mod1_2=mod1*mod2;
    const int inv1=inv(mod1,mod2),inv2=inv(mod1_2%mod3,mod3);
    struct Int{
        int A,B,C;
        Int(){}
        Int(int val):A(val),B(val),C(val){}
        Int(int _A,int _B,int _C):A(_A),B(_B),C(_C){}
        static Int reduce(const Int &x){
            return Int(x.A+(x.A>>31&mod1),x.B+(x.B>>31&mod2),x.C+(x.C>>31&mod3));
        }
        Int operator + (const Int &t)const{
            return reduce(Int(A+t.A-mod1,B+t.B-mod2,C+t.C-mod3));
        }
        Int operator - (const Int &t)const{
            return reduce(Int(A-t.A,B-t.B,C-t.C));
        }
        Int operator * (const Int &t)const{
            return {A*t.A%mod1,B*t.B%mod2,C*t.C%mod3};
        }
        int val(){
            int x=(B-A+mod2)%mod2*inv1%mod2*mod1+A;
            return ((C-x%mod3+mod3)%mod3*inv2%mod3*(mod1_2%P)%P+x)%P;
        }
    } itot;
    vector<Int> gn;
    void ntt(vector<Int> &a,int inv){
        for(int i=1;i<tot;i++){
            if(i<rev[i])swap(a[i],a[rev[i]]);
        }
        for(int mid=1;mid<tot;mid<<=1){
            const int t=tot/mid>>1;
            for(int i=0;i<tot;i+=mid*2){
                for(int j=0;j<mid;j++){
                    const Int gk=(inv==1?gn[t*j]:gn[tot-t*j]);
                    const Int x=a[i+j],y=gk*a[i+j+mid];
                    a[i+j]=x+y,a[i+j+mid]=x-y;
                }
            }
        }
        if(inv==-1){
            for(int i=0;i<tot;i++)a[i]=a[i]*itot;
        }
    }
    void init(int n){
        bit=0;
        while((1<<bit)<n)bit++;
        tot=1<<bit;
        itot={inv(tot,mod1),inv(tot,mod2),inv(tot,mod3)};
        rev.resize(tot);
        gn.resize(tot+1);
        const Int t={qpow(g,(mod1-1)/tot,mod1),qpow(g,(mod2-1)/tot,mod2),qpow(g,(mod3-1)/tot,mod3)};
        gn[0]=Int(1);
        for(int i=0;i<tot;i++){
            rev[i]=(rev[i>>1]>>1)|((i&1)<<(bit-1));
            gn[i+1]=gn[i]*t;
        }
    }
    void mul(vector<Int> &a,vector<Int> &b,int n,int m){
        init(n+m+1);
        a.resize(tot,Int(0));
        b.resize(tot,Int(0));
        ntt(a,1),ntt(b,1);
        for(int i=0;i<tot;i++)a[i]=a[i]*b[i];
        ntt(a,-1);
    }
}
using NTT::Int;
void solve(){
    int n,m;
    cin>>n>>m>>P;
    vector<Int> a(n+1),b(m+1);
    for(int i=0;i<=n;i++){
        int x;
        cin>>x;
        a[i]=Int(x%P);
    }
    for(int i=0;i<=m;i++){
        int x;
        cin>>x;
        b[i]=Int(x%P);
    }
    NTT::mul(a,b,n,m);
    for(int i=0;i<=n+m;i++)cout<<a[i].val()<<" ";
}
```
