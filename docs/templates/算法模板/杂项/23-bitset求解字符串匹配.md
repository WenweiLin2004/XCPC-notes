---
title: 'bitset求解字符串匹配'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# bitset求解字符串匹配

给长串s，模式串t，t中含有？作为通配符，求s中t出现了几次，分别在哪开始？

复杂度 $O(\frac{n}{\omega})$
```cpp
bitset<N>b[28];
bitset<N>ans;
void solve(){
	string s,t;cin>>s>>t;
	n=s.size();m=t.size();
	for(int i=0;i+m-1<n;i++)ans[i]=1;
	for(int i=0;i<n;i++)b[s[i]-'a'][i]=1;
	for(int i=0;i<m;i++){
		if(t[i]=='?')continue;
		ans&=b[t[i]-'a']>>i;
	}
	cout<<ans.count()<<endl;
	for(int i=0;i+m-1<n;i++){
		if(ans[i]==1)cout<<i<<endl;
	}
}
```
字符串$s$，$q$次操作
* `1 i c`把第$i$个改成字符`c`
* `2 l r t`求$[l,r]$内字符串出现次数
```cpp
void solve(){
    string s;
    cin>>s;
    int q;
    cin>>q;
    bitset<100001> bs[26],ans;
    for(int i=0;i<s.size();i++){
        bs[s[i]-'a'].set(i);
    }
    while(q--){
        int op,l,r;
        cin>>op;
        if(op==2){
            string t;
            cin>>l>>r>>t;
            ans.set();
            r--;
            l--;
            for(int i=0;i<t.size();i++){
                ans&=bs[t[i]-'a']>>i;
            }
            int cl,cr;
            if(l)cl=(ans>>l-1).count();
            else cl=ans.count();
            cr=(ans>>r).count();
            cout<<cl-cr<<"\n";
        }
        else{
            cin>>l;
            char c;
            cin>>c;
            l--;
            bs[s[l]-'a'].reset(l);
            bs[c-'a'].set(l);
            s[l]=c;
        }
    }
}   
```
