---
title: '子集卷积exp(多个数无序)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 子集卷积exp(多个数无序)

无序指：`1 2`和`2 1`被看成同一种
```cpp
void solve(){
    int n;
    cin>>n;
    int m=FWT::init(2e5);
    sieve(1<<m);
    vector<int> A(1<<m);
    for(int i=1;i<=n;i++){
        int x;
        cin>>x;
        A[x]++;
    }
    vector B(m+1,vector<int>(1<<m)),C(m+1,vector<int>(1<<m));
    for(int i=1;i<1<<m;i++)B[__builtin_popcount(i)][i]=A[i];
    for(int i=0;i<=m;i++){
        FWT::fwt_or(B[i]);
        for(int j=0;j<1<<m;j++)B[i][j]=B[i][j]*i%mod;
    }
    for(int i=0;i<1<<m;i++){
        C[0][i]=1;
        for(int j=1;j<=m;j++){
            int sum=0;
            for(int k=1;k<=j;k++)sum=(sum+B[k][i]*C[j-k][i]%mod)%mod;
            C[j][i]=sum*qpow(j,mod-2)%mod;
        }
    }
    for(int i=0;i<=m;i++)FWT::ifwt_or(C[i]);
    int ans=1;
    for(int i=0;i<1<<m;i++){
        ans=(ans+phi[1+i]*C[__builtin_popcount(i)][i]%mod)%mod;
    }
    cout<<ans*qpow(2,A[0])%mod<<"\n";
}
```
