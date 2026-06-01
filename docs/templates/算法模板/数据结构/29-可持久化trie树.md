---
title: '可持久化trie树'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# 可持久化trie树

题意：  
给定一个非负数的序列长度为`N`,有`M`个操作
* `A x`添加`x`到序列末尾,长度加`1`
* `Q l r x`从`[l,r]`选择一个数`p`,使得 $ a_p \oplus a_{p+1} \oplus...\oplus a_n \oplus x $最大  

思路：
* 假定已经选择了一个`p`,则用前缀异或和可以优化成 $ S_{p-1} \oplus S_n \oplus x $ 
* 很明显`S[n]^x`为定值，此时只需看`S[p-1]`  
* 再考虑一个问题：求最大异或对时，我们是将每个值都插入到01trie中，然后对于每一位每次寻找相反的路径  
* 假设没有左边界，我们只需用`S[n]^x`去找最大值即可
* 考虑有左边界，我们可以对每棵树记录当前子树中的最大节点的标号，如果有最大标号>=`l`说明可以继续走，否则不能走
* 注意：trie的一般写法不需要使用深搜，但是此题需要从子节点更新父节点，因此插入需要写深搜
```cpp
const int N=600010,M=25*N;//每次新建一条路经(对应一个新的值)就会产生最多25个节点
int tr[M][2],max_id[M],idx,n,m,root[N],s[N];
void insert(int p,int q,int k,int i){//上一个版本，当前版本，二进制的第k位,在数组的第i位
    if(k<0){//边界
        max_id[q]=i;
        return;
    }
    int v=s[i]>>k&1;//当前位
    if(p)tr[q][v^1]=tr[p][v^1];
    tr[q][v]=++idx;
    insert(tr[p][v],tr[q][v],k-1,i);
    max_id[q]=max(max_id[tr[q][0]],max_id[tr[q][1]]);
}
int find(int p,int val,int l){
    for(int i=23;i>=0;i--){
        int v=val>>i&1;
        if(max_id[tr[p][v^1]]>=l)p=tr[p][v^1];
        else p=tr[p][v];
    }
    return val^s[max_id[p]];
}
void solve(){   
    cin>>n>>m;
    root[0]=++idx;
    max_id[0]=-1;
    insert(0,root[0],23,0);
    for(int i=1,x;i<=n;i++){
        cin>>x;
        s[i]=s[i-1]^x;
        root[i]=++idx;
        insert(root[i-1],root[i],23,i);
    }
    while(m--){
        char op;
        int l,r,x;
        cin>>op;
        if(op=='A'){
            cin>>x;
            n++;
            s[n]=s[n-1]^x;
            root[n]=++idx;
            insert(root[n-1],root[n],23,n);
        }
        else{
            cin>>l>>r>>x;
            cout<<find(root[r-1],s[n]^x,l-1)<<"\n";
        }
    }
}
```
