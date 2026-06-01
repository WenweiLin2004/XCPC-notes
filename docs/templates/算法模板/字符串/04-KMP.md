---
title: 'KMP'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# KMP

```cpp
//最小循环串：n-ne[n];
int ne[N];
string s,p;
void solve(){
    cin>>s>>p;
    int ls=s.size(),lp=p.size();    
    s=" "+s;
    p=" "+p;
    for(int i=2,j=0;i<=lp;i++){
        while(j&&p[i]!=p[j+1])j=ne[j];
        if(p[i]==p[j+1])j++;
        ne[i]=j;
    }
    for(int i=1,j=0;i<=ls;i++){
        while(j&&s[i]!=p[j+1])j=ne[j];
        if(s[i]==p[j+1])j++;
        if(j==lp){
            cout<<i-lp+1<<"\n";
            j=ne[j];
        }
    }
    for(int i=1;i<=lp;i++)cout<<ne[i]<<" ";
}
```
