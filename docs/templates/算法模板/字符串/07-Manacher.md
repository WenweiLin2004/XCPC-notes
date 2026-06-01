---
title: 'Manacher'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Manacher

```cpp
string a,s;
int p[N],n;
//定义p_i为以i为中心的回文串的半径
//p[i]-1为原串以i为中心的最大回文长度
vector<int> manacher(string &t){
    string s="$#";
    for(auto c:t)s+=c,s+='#';
    s+='^';
    int n=s.size(),mr=0,id=0;
    vector<int> p(n+1);
    for(int i=1;i<n;i++){
        if(i<mr)p[i]=min(p[2*id-i],mr-i);
        else p[i]=1;
        while(s[i-p[i]]==s[i+p[i]])p[i]++;
        if(i+p[i]>mr){
            mr=i+p[i];
            id=i;
        }
    }
    return p;
}
```
