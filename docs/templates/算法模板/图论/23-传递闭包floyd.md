---
title: '传递闭包(floyd)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 传递闭包(floyd)

```cpp
int adj[N][N],n;
void solve(){
	cin>>n;
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n;j++)cin>>adj[i][j];
	}
	for(int k=1;k<=n;k++){
		for(int i=1;i<=n;i++){
			for(int j=1;j<=n;j++){
				if(adj[i][k]&&adj[k][j])adj[i][j]=1;
			}
		}
	}
	for(int i=1;i<=n;i++){
		for(int j=1;j<=n;j++)cout<<adj[i][j]<<" \n"[j==n];
	}
}
```
