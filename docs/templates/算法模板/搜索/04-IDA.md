---
title: 'IDA*'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# IDA*

* 配合迭代加深，如果当前估价步数已经大于`max_length`，则直接剪掉  
```cpp
int f(){}
bool dfs(int dep,int max_dep){
	if(dep+f()>max_dep)return false;
    //操作
}
void solve(){
	int dep=0;
	while(!dfs(0,dep))dep++;
}
```
