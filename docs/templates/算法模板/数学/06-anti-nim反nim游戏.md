---
title: 'anti-nim(反nim游戏)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# anti-nim(反nim游戏)

反nim游戏。正常的nim游戏是取走最后一颗的人获胜，而反nim游戏是取走最后一颗的人输。

一个状态为必胜态，当且仅当：

　　1）所有堆的石子个数为1，且NIM_sum=0

　　2）至少有一堆的石子个数大于1，且 NIM_sum≠0

```cpp
void solve(){
    int n;
    cin>>n;
    int ans=0;
    bool g=0;
    for(int i=1;i<=n;i++){
        int x;
        cin>>x;
        if(x>1)g=1;
        ans^=x;
    }
    if((g&&ans)||(!g&&!ans))cout<<"John\n";//必胜
    else cout<<"Brother\n";
}   
```
