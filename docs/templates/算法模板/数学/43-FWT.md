---
title: 'FWT'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# FWT

$C_i = \sum_{j \oplus k} A_jB_k$
* $or:FWT[A]_i=\sum_{i|j=i}A_j$，本质是高维前缀和
  * 正变换：$FWT[A]=(FWT[A_0],FWT[A_0+A_1])$
  * 逆变换：$IFWT[A]=(IFWT[A_0],IFWT[A_1-A_0])$ 
* $and:FWT[A]_i=\sum_{i\&j=i}A_j$，本质是高维后缀和
  * 正变换：$FWT[A]=(FWT[A_0+A_1],FWT[A_1])$ 
  * 逆变换：$IFWT[A]=(IFWT[A_0-A_1],IFWT[A_1])$
* $xor:FWT[A]_i=\sum_j (-1)^{popcount(i\&j)}A_j$
  * 正变换：$FWT[A]=(FWT[A_0+A_1],FWT[A_0-A_1])$
  * 逆变换：$IFWT[A]=(\frac{IFWT[A_0+A_1]}{2},\frac{IFWT[A_0-A_1]}{2})$
```cpp
namespace FWT{
    static constexpr int mod=998244353;
    static constexpr int inv2=(mod+1)/2;
    int n;
    void fwt_or(vector<int> &a,int op=1){
        for(int x=2;x<=n;x<<=1){
            int k=x>>1;
            for(int i=0;i<n;i+=x){
                for(int j=0;j<k;j++){
                    a[i+j+k]+=a[i+j]*op%mod;
                    a[i+j+k]%=mod;
                }
            }
        }
    }
    void fwt_and(vector<int> &a,int op=1){
        for(int x=2;x<=n;x<<=1){
            int k=x>>1;
            for(int i=0;i<n;i+=x){
                for(int j=0;j<k;j++){
                    a[i+j]+=a[i+j+k]*op%mod;
                    a[i+j]%=mod;
                }
            }
        }
    }
    void fwt_xor(vector<int> &a,int op=1){
        for(int x=2;x<=n;x<<=1){
            int k=x>>1;
            for(int i=0;i<n;i+=x){
                for(int j=0;j<k;j++){
                    int X=a[i+j],Y=a[i+j+k];
                    a[i+j]=(X+Y)*op%mod;
                    a[i+j+k]=(X-Y+mod)%mod*op%mod;
                }
            }
        }
    }
    // 同或
    void fwt_xnor(vector<int> &a,int op){
        for(int x=2;x<=n;x<<=1){
            int k=x>>1;
            for(int i=0;i<n;i+=x){
                for(int j=0;j<k;j++){
                    int X=a[i+j],Y=a[i+j+k];
                    a[i+j+k]=(X+Y)*op%mod;
                    a[i+j]=(X-Y+mod)%mod*op%mod;
                }
            }
        }
    }
    void ifwt_or(vector<int> &a){
        fwt_or(a,mod-1);
    }
    void ifwt_and(vector<int> &a){
        fwt_and(a,mod-1);
    }
    void ifwt_xor(vector<int> &a){
        fwt_xor(a,inv2);
    }
    void ifwt_xnor(vector<int> &a){
        fwt_xnor(a,inv2);
    }
    void init(int m){
        for(n=1;n<=m;n<<=1);
    }
}
```
