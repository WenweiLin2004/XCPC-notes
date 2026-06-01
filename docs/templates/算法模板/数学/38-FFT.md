---
title: 'FFT'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# FFT

* 任一n个点就可以确定n-1元一次方程
* 系数表达式->点表达式->系数表达式
* 系数表达式->点表达式
    * $ A(x)=a_0+a_1x+a_2x^2+....+a_{n-1}x^{n-1} $
    * $ A_1(x)=a_0+a_2x^2+a_{n-2}x^{\frac{n}{2}-1} $
    * $ A_2(x)=a_1+a_3x+...+a_{n-1}x^{\frac{n}{2}-1} $
    * $ A(x)=A_1(x^2)+xA_2(x^2) $
    * $ k∈[0,\frac{n}{2}-1],A(\omega _n^k)=A_1(\omega _{\frac{n}{2}}^k)+\omega _n^kA_2(\omega _{\frac{n}{2}}^k) $
    * $ k∈[\frac{n}{2},n-1],A(\omega _n^k)=A_1(\omega _{\frac{n}{2}}^k)-\omega _n^kA_2(\omega _{\frac{n}{2}}^k) $ 
* 点表达式->系数表达式
    * $ A(x)=C_0+C_1x+C_2x^2+C_{n-1}x^{n-1} $
    * $ y_k=A(\omega _n^k),C_k=\sum _{i=0}^{n-1}y_i(\omega _n^{-k})^i $
    * $ B(x)=y_0+y_1x+...+y_{n-1}x^{n-1} $
    * $ C_k=B(\omega _n^{-k}) $
    * $ a_k=\frac{C_k}{n} $
```cpp
const double PI=acos(-1.0);
struct Complex{
    double x,y;
    Complex(double x=0,double y=0):x(x),y(y){}
    Complex operator +(const Complex &t)const{
        return {x+t.x,y+t.y};
    }
    Complex operator -(const Complex &t)const{
        return {x-t.x,y-t.y}; 
    }
    Complex operator *(const Complex &t)const{
        return {x*t.x-y*t.y,x*t.y+y*t.x};
    }
} a[N],b[N];
int rev[N],bit,tot;
void fft(Complex a[],int inv){
    for(int i=0;i<tot;i++){
        if(i<rev[i])swap(a[i],a[rev[i]]);
    }
    for(int mid=1;mid<tot;mid<<=1){
        Complex w1(cos(PI/mid),inv*sin(PI/mid));
        for(int i=0;i<tot;i+=mid*2){
            Complex wk(1,0);
            for(int j=0;j<mid;j++,wk=wk*w1){
                auto x=a[i+j],y=wk*a[i+j+mid];
                a[i+j]=x+y,a[i+j+mid]=x-y;
            }
        }
    }
}
void solve(){
    int n,m;
    cin>>n>>m;
    for(int i=0;i<=n;i++)cin>>a[i].x;
    for(int i=0;i<=m;i++)cin>>b[i].x;
    while((1ll<<bit)<n+m+1)bit++;
    tot=1ll<<bit;
    for(int i=0;i<tot;i++)rev[i]=(rev[i>>1]>>1)|((i&1)<<(bit-1));
    fft(a,1),fft(b,1);
    for(int i=0;i<tot;i++)a[i]=a[i]*b[i];
    fft(a,-1);
    for(int i=0;i<=n+m;i++)a[i].x/=tot;
    for(int i=0;i<=n+m;i++)cout<<(int)(a[i].x+0.5)<<" ";
}
```
