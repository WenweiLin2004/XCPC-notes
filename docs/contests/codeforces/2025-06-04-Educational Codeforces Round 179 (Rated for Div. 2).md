---
title: "Educational Codeforces Round 179 (Rated for Div. 2)"
date: "2025-06-04"
sourceFile: "2025-06-04-Educational Codeforces Round 179 (Rated for Div. 2).md"
category: "contests"
categoryLabel: "竞赛题解"
subcategory: "codeforces"
subcategoryLabel: "Codeforces"
tags: ["竞赛题解", "Codeforces"]
---

<PostMeta />
CF2111,简单手速场

# A. Energy Crystals
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/650c5d8fe66c430c9938548ff012b154.png)
贪心，每次最小值会乘2，直接模拟即可，复杂度$O(\log n)$
```cpp
void solve(){
	int x;
	cin>>x;
	multiset<int> s={0,0,0};
	int res=0;
	while(*s.begin()<x){
		int x=*s.begin();
		s.erase(s.begin());
		int y=*s.begin();
		s.insert(y*2+1);
		res++;
	}
	cout<<res<<"\n";
}
```
# B. Fibonacci Cubes
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/6fbf4cce0e7749148962499dd56a2364.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/499d5f6661e54b0d9a31ed0d9d320761.png)
从这个图可以发现如果$n \gt 1$，那么只要能容纳第$n$个方块和$n-1$个方块，由斐波那契数列的性质，必然能容纳全部的方块
```cpp
void solve(){
	int n,m;
	cin>>n>>m;
	vector<int> fib={0,1,2};
	for(int i=3;i<=n;i++)fib.push_back(fib[i-1]+fib[i-2]);
	while(m--){
		int w,l,h;
		cin>>w>>l>>h;
		array<int,3> tmp={w,l,h};
		ranges::sort(tmp);
		bool ok=0;
		if(n==1){
			if(tmp[2]>=fib[n])ok=1;
		}
		else{
			if(tmp[2]>=fib[n]+fib[n-1]&&tmp[1]>=fib[n]&&tmp[0]>=fib[n])ok=1;
		}
		cout<<ok;
	}
	cout<<"\n";
}
```
# C. Equal Values
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/cd8c828b839040a1acd545bb0a44eb19.png)
很明显的选取一个连续段，对左右两边操作一次取最小(题意短，好像比ab简单)
```cpp
void solve(){
	int n;
	cin>>n;
	vector<int> a(n+1);
	for(int i=1;i<=n;i++)cin>>a[i];
	int ans=INF;
	for(int i=1,j;i<=n;i++){
		j=i;
		while(j+1<=n&&a[j+1]==a[i])j++;
		ans=min(ans,(i-1+n-j)*a[i]);
		i=j;
	}
	cout<<ans<<"\n";
}
```
# D. Creating a Schedule
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/c6cbecc79e74459db423933d94553b5c.png)
考虑只有两个组的情况，那么只需要两间教室，就可以满足。因此贪心两两配对最大和最小的肯定最优；如果多出一个组，如果还有两间教室，那么这个组单独享用两个教室，否则任意找到之前配对的两个教室和两个组，相互轮换即可(不会改变答案)

```cpp
void solve(){
	int n,m;
	cin>>n>>m;
	multiset<PII> s;
	for(int i=1;i<=m;i++){
		int x;
		cin>>x;
		s.insert({x/100,x});
	}
	if(n==1){
		if(s.size()>=2){
			auto a=*s.begin(),b=*s.rbegin();
			s.extract(a);
			s.extract(b);
			for(int j=1;j<=6;j++){
				if(j&1)cout<<a.S<<" ";
				else cout<<b.S<<" ";
			}
		}
		else{
			auto c=*s.begin();
			for(int j=1;j<=6;j++)cout<<c.S<<" ";
		}
		cout<<"\n";
		return;
	}
	vector<vector<int>> ans(n+1);
	int nn;
	if(n&1)nn=n-3;
	else nn=n;
	for(int i=1;i<=nn;i+=2){
		auto a=*s.begin(),b=*s.rbegin();
		s.extract(a);
		s.extract(b);
		int g=0;
		for(int j=1;j<=6;j++,g^=1){
			if(!g)ans[i].push_back(a.S),ans[i+1].push_back(b.S);
			else ans[i].push_back(b.S),ans[i+1].push_back(a.S);
		}
	}	
	if(n&1){
		auto a=*s.begin(),b=*s.rbegin();
		s.extract(a);
		s.extract(b);
		if(s.size()>=2){
			int g=0;
			for(int j=1;j<=6;j++,g^=1){
				if(!g)ans[n-2].push_back(a.S),ans[n-1].push_back(b.S);
				else ans[n-2].push_back(b.S),ans[n-1].push_back(a.S);
			}
			auto a=*s.begin(),b=*s.rbegin();
			s.extract(a);	
			s.extract(b);
			g=0;
			for(int j=1;j<=6;j++,g^=1){
				if(!g)ans[n].push_back(a.S);
				else ans[n].push_back(b.S);
			}
		}
		else{
			auto c=*s.begin();
			int g=0;
			for(int j=1;j<=6;j++,g=(g+1)%3){
				if(g==0)ans[n-2].push_back(a.S),ans[n-1].push_back(c.S),ans[n].push_back(b.S);
				else if(g==1)ans[n-2].push_back(b.S),ans[n-1].push_back(a.S),ans[n].push_back(c.S);
				else ans[n-2].push_back(c.S),ans[n-1].push_back(b.S),ans[n].push_back(a.S);
			}
		}
	}
	for(int i=1;i<=n;i++){
		for(int j=0;j<6;j++)cout<<ans[i][j]<<" ";
		cout<<"\n";
	}
}
signed main(){
    cin.tie(0)->sync_with_stdio(0);
    int T=1;
    cin>>T;
    while(T--)solve();
    return 0;
}
```
# E. Changing the String

![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/133aba3b225f45a3886b0df23b8a7df3.png)
题意：
* 有只包含`a,b,c`的字符串，`q`次操作，给出字符`x y`将字符串一个`x`替换成`y`，或者忽略操作，最后最小化字典序

考虑贪心，从左到右考虑每一位，a则不动，b变成a，c变成a或者b
然后有两种特殊操作，`b->c->a`和`c->b->a`

直接贪会有问题，因为可能`c->a`出现在`b->c`之前，那么`b->c->a`就无法达成

换个思路，我们贪心地配对`b->c`和`c->a`操作，以及`c->b`和`b->a`操作，记为`bca,cba`
·
那么我们有六种操作分别为`cb,bc,ca,ba,cba,bca`,其中`ca`和`ba`前面没有`bc,cb`（否则就会合并成`bca,cba`），因此这两种操作随便用，贪心用完，剩下的`b`和`c`没变成`a`的我们单独拿出来处理

可以发现这些没变的下标都可以使用`bca,cba`变成`a`，同时`c`可以利用`cb`变成`b`，因此我们贪心地让`b`使用`cba`，这样就可以多解放一个`cb`操作；让`c`使用`bca`

最后两个都用完了，如果是`c`则可以使用`cb`变成`c`

```cpp
void solve(){   
    int n,m;
    cin>>n>>m;
    string s;
    cin>>s;
    int bc,cb,ba,ca,bca,cba;
    bc=cb=ba=ca=bca=cba=0;
    for(int i=1;i<=m;i++){
        char x,y;
        cin>>x>>y;
        if(x=='b'&&y=='a'){
            if(cb>0){
                cb--;
                cba++;
            }
            else ba++;
        }
        else if(x=='c'&&y=='a'){
            if(bc>0){
                bc--;
                bca++;
            }
            else ca++;
        }
        else if(x=='b'&&y=='c')bc++;
        else if(x=='c'&&y=='b')cb++;
    }
    vector<int> tmp;
    for(int i=0;i<n;i++){
        if(s[i]=='a')continue;
        if(s[i]=='b'){
            if(ba>0){
                ba--;
                s[i]='a';
                continue;
            }
            tmp.push_back(i);
            continue;
        }
        if(s[i]=='c'){
            if(ca>0){
                ca--;
                s[i]='a';
                continue;
            }
            tmp.push_back(i);
            continue;   
        }
    }
    for(auto x:tmp){
        if(bca&&cba){
            if(s[x]=='b'){
                cba--;
                cb++;
                s[x]='a';
            }
            else{
                bca--;
                bc++;
                s[x]='a';
            }
        }
        else if(bca){
            bca--;
            if(s[x]=='c')bc++;
            s[x]='a';
        }
        else if(cba){
            cba--;
            if(s[x]=='b')cb++;
            s[x]='a';
        }
        else{
            if(s[x]=='c'&&cb){
                cb--;
                s[x]='b';
            }
        }
    }
    cout<<s<<"\n";
}
```
# F. Puzzle
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/f6a72f29c25a4498b32b82c09f4e8a71.png)
![在这里插入图片描述](https://i-blog.csdnimg.cn/direct/2eb2c75756d242f785220b4a2d371710.png)

枚举周长，发现周长只和最大最小坐标有关，因此我们可以先使用一个`L`字形固定住周长，然后看面积是否合法，贪心地往里面放格子填满即可

可以证明这是正确的，因为两条边的和确定了，假设为$P$，那么面积的最值，由均值不等式可得，最大值就是$\frac{P+1}{2}*\frac{P}{2}$，最小值就是$(P-1)*1$

```cpp
void solve(){   
    int p,s;
    cin>>p>>s;
    for(int P=2;P<=50001;P++){
        if(2*P*s%p!=0)continue;
        int S=2*P*s/p;
        if(S>(P>>1)*(P+1>>1)||S<P-1)continue;
        int w=P>>1,h=P+1>>1;
        cout<<S<<"\n";
        for(int i=0;i<w;i++)cout<<i<<" 0\n";
        for(int i=1;i<h;i++)cout<<"0 "<<i<<"\n";
        int need=S-(w+h-1);
        for(int i=1;i<w&&need;i++){
            for(int j=1;j<h&&need;j++){
                cout<<i<<" "<<j<<"\n";
                need--;
            }
        }
        return;
    }
    cout<<"-1\n";
}
```
