---
title: 'NTT'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# NTT

单位根换原根即可
### 固定模数板子

```cpp
namespace NTT{
    vector<int> rev;
    int bit=0,tot,g=3,gi;
    const int P=998244353;
    int qpow(int a,int b){
        int ans=1;
        for(;b;b>>=1){
            if(b&1)ans=ans*a%P;
            a=a*a%P;
        }
        return ans;
    }
    int inv(int n){
        return qpow(n,P-2);
    }
    void ntt(vector<int> &a,int inv){
        for(int i=0;i<tot;i++){
            if(i<rev[i])swap(a[i],a[rev[i]]);
        }
        for(int mid=1;mid<tot;mid<<=1){
            int g1=qpow(inv==1?g:gi,(P-1)/(mid*2));
            for(int i=0;i<tot;i+=mid*2){
                int gk=1;
                for(int j=0;j<mid;j++,gk=gk*g1%P){
                    auto x=a[i+j],y=gk*a[i+j+mid]%P;
                    a[i+j]=(x+y)%P,a[i+j+mid]=(x-y+P)%P;
                }
            }
        }
        if(inv==-1){
            int invn=NTT::inv(tot);
            for(int i=0;i<tot;i++)a[i]=a[i]*invn%P;
        }
    }
    void init(int n){
        while((1<<bit)<n)bit++;
        tot=1<<bit;
        rev.resize(tot);
        for(int i=0;i<tot;i++)rev[i]=(rev[i>>1]>>1)|((i&1)<<(bit-1));
        gi=inv(g);
    }
    void mul(vector<int> &a,vector<int> &b,int n,int m){
        init(n+m+1);
        a.resize(tot),b.resize(tot);
        ntt(a,1),ntt(b,1);
        for(int i=0;i<tot;i++)a[i]=a[i]*b[i]%P;
        ntt(a,-1);
    }
}
void solve(){
    int n,m;
    cin>>n>>m;
    vector<int> a(n+1),b(m+1);
    for(int i=0;i<=n;i++)cin>>a[i];
    for(int i=0;i<=m;i++)cin>>b[i];
    NTT::mul(a,b,n,m);
    for(int i=0;i<=n+m;i++)cout<<a[i]<<" ";
}
```
### 常见NTT模数
```
r*2^k+1                        r                            k                            g
3                              1                            1                            2
5                              1                            2                            2
17                             1                            4                            3
97                             3                            5                            5
193                            3                            6                            5
257                            1                            8                            3
7681                           15                           9                            17
12289                          3                            12                           11
40961                          5                            13                           3
65537                          1                            16                           3
786433                         3                            18                           10
5767169                        11                           19                           3
7340033                        7                            20                           3
23068673                       11                           21                           3
104857601                      25                           22                           3
167772161                      5                            25                           3
469762049                      7                            26                           3
998244353                      119                          23                           3
1004535809                     479                          21                           3
2013265921                     15                           27                           31
2281701377                     17                           27                           3
3221225473                     3                            30                           5
75161927681                    35                           31                           3
77309411329                    9                            33                           7
206158430209                   3                            36                           22
2061584302081                  15                           37                           7
2748779069441                  5                            39                           3
6597069766657                  3                            41                           5
39582418599937                 9                            42                           5
79164837199873                 9                            43                           5
263882790666241                15                           44                           7
1231453023109121               35                           45                           3
1337006139375617               19                           46                           3
3799912185593857               27                           47                           5
4222124650659841               15                           48                           19
7881299347898369               7                            50                           6
31525197391593473              7                            52                           3
180143985094819841             5                            55                           6
1945555039024054273            27                           56                           5
4179340454199820289            29                           57                           3   
```
### 高精度乘法NTT板子
```cpp
namespace NTT{
    const int P=998244353;
    int rev[N],bit=0,tot,g=3,gi;
    int qpow(int a,int b){
        int ans=1;
        for(;b;b>>=1){
            if(b&1)ans=ans*a%P;
            a=a*a%P;
        }
        return ans;
    }
    int inv(int n){
        return qpow(n,P-2);
    }
    void ntt(vector<int> &a,int inv){
        for(int i=0;i<tot;i++){
            if(i<rev[i])swap(a[i],a[rev[i]]);
        }
        for(int mid=1;mid<tot;mid<<=1){
            int g1=qpow(inv==1?g:gi,(P-1)/(mid*2));
            for(int i=0;i<tot;i+=mid*2){
                int gk=1;
                for(int j=0;j<mid;j++,gk=gk*g1%P){
                    auto x=a[i+j],y=gk*a[i+j+mid]%P;
                    a[i+j]=(x+y)%P,a[i+j+mid]=(x-y+P)%P;
                }
            }
        }
    }
    void init(int n){
        while((1<<bit)<n)bit++;
        tot=1<<bit;
        for(int i=0;i<tot;i++)rev[i]=(rev[i>>1]>>1)|((i&1)<<(bit-1));
        gi=inv(g);
    }
}
vector<int> mul(vector<int> &A,vector<int> &B){
    vector<int> a,b;
    int n=A.size()-1,m=B.size()-1;
    for(int i=0;i<=n;i++)a.push_back(A[i]);
    for(int i=0;i<=m;i++)b.push_back(B[i]);
    NTT::init(n+m+1);
    int tot=NTT::tot;
    while(a.size()<tot)a.push_back(0);
    while(b.size()<tot)b.push_back(0);
    NTT::ntt(a,1),NTT::ntt(b,1);
    for(int i=0;i<tot;i++)a[i]=a[i]*b[i]%NTT::P;
    NTT::ntt(a,-1);
    int inv=NTT::inv(tot);
    for(int i=0;i<tot;i++)a[i]=a[i]*inv%NTT::P;
    vector<int> C;
    for(int i=0,t=0;i<tot||t;i++){
        if(i<tot)t+=a[i];
        C.push_back(t%10);
        t/=10;
    }
    while(C.size()>1&&C.back()==0)C.pop_back();
    return C;
}
void solve(){
    string s,t;
    cin>>s>>t;
    vector<int> A,B;
    for(int i=s.size()-1;i>=0;i--)A.push_back(s[i]-'0');
    for(int i=t.size()-1;i>=0;i--)B.push_back(t[i]-'0');
    auto ans=mul(A,B);
    for(int i=ans.size()-1;i>=0;i--)cout<<ans[i];
}
```
