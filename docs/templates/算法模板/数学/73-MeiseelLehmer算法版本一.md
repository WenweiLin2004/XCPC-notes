---
title: 'Meiseel Lehmer算法(版本一)'
date: "2025-05-22"
sourceFile: "2025-05-22-补充算法笔记.md"
category: "templates"
---

<PostMeta />

# Meiseel Lehmer算法(版本一)

```cpp
struct Meissel_Lehmer{
    //通过知道前面的 n^1/3 的质数可以推断后面n^2/3的质数所以可以适当减小
    static const int M=7;
    static const int PM=2*3*5*7*11*13*17;
    static const int N=5e6+5;
    vector<bool> np;//是否是素数
    vector<T> prime,pi;// 质数容器，质数个数
    vector<vector<T>> phi;
    vector<T> sz;
    int n;
    Meissel_Lehmer(){
        init();
    }
    void sieve(){
        int c=0;
        np[0]=np[1]=1;
        pi[0]=pi[1]=0;
        for(int i=2;i<N;i++){
            if(!np[i])prime[++c]=i;
            pi[i]=c;
            for(int j=1;j<=c&&prime[j]*i<N;j++){
                np[prime[j]*i]=1;
                if(i%prime[j]==0)break;
            }
        }
    }
    void init(){
        np.resize(N,0);
        pi.resize(N,0);
        prime.resize(N,0);
        phi.resize(PM+1,vector<T>(M+1,0));
        sz.resize(M+1,0);
        sieve();
        sz[0]=1;
        for(int i=0;i<=PM;i++)phi[i][0]=i;
        for(int i=1;i<=M;i++){
            sz[i]=prime[i]*sz[i-1];
            for(int j=1;j<=PM;j++)phi[j][i]=phi[j][i-1]-phi[j/prime[i]][i-1];
        }
    }
    int Sqrt(T x){
        int r=sqrtl(x-0.1);
        while(r*r<=x)r++;
        return r-1;
    }
    int Cbrt(T x){
        int r=cbrtl(x-0.1);
        while(r*r*r<=x)r++;
        return r-1;
    }
    T get_phi(T x,int s){
        if(s==0)return x;
        if(s<=M)return phi[x%sz[s]][s]+(x/sz[s])*phi[sz[s]][s];
        if(x<=prime[s]*prime[s])return pi[x]-s+1;
        if(x<=prime[s]*prime[s]*prime[s]&&x<N){
            T tmp=pi[Sqrt(x)];
            T ans=pi[x]-(tmp+s-2)*(tmp-s+1)/2;
            for(int i=s+1;i<=tmp;i++)ans+=pi[x/prime[i]];
            return ans;
        }
        return get_phi(x,s-1)-get_phi(x/prime[s],s-1);
    }
    T get_pi(int x){
        if(x<N)return pi[x];
        T ans=get_phi(x,pi[Cbrt(x)])+pi[Cbrt(x)]-1;
        for(int i=pi[Cbrt(x)]+1,ed=pi[Sqrt(x)];i<=ed;i++)ans-=get_pi(x/prime[i])-i+1;
        return ans;
    }
    T lehmer(T x){
        if(x<N)return pi[x];
        T a=lehmer(Sqrt(Sqrt(x)));
        T b=lehmer(Sqrt(x));
        T c=lehmer(Cbrt(x));
        T ans=get_phi(x,a)+(b+a-2)*(b-a+1)/2;
        for(int i=a+1;i<=b;i++){
            T w=x/prime[i];
            ans-=lehmer(w);
            if(i>c)continue;
            T lim=lehmer(Sqrt(w));
            for(int j=i;j<=lim;j++)ans-=lehmer(w/prime[j])-j+1;
        }
        return ans;
    }
};
```
