---
title: 'rope(实际为可持久化平衡树，实现块状链表)'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# rope(实际为可持久化平衡树，实现块状链表)

```cpp
#include<ext/rope>
using namespace __gnu_cxx;
rope<T> a;
a.push_back(x)
a.insert(pos,x)//在pos处插入x
a.erase(pos,x)//在pos处删除x个元素
a.at(x),a[x]//随机访问
a.length()或a.size()//大小
a.insert(pos,T *s,int n)//将数组区间[0,n-1]插入到pos
a.append(T *s,int pos,int n)//[pos,pos+n-1]插入到队尾
a.substr(int pos,int len)//提取[pos,pos+len-1]
a.substr(begin,end)//迭代器区间
a.copy(int pos,int len,T *s)//将[pos,pos+len-1]复制到数组s
a.replace(int pos,int n,T *s)//将[pos,pos+n-1]替换成数组s的值
//copy和replace为相反操作可以实现区间翻转
//保险起见，所有操作均认为根号n的复杂度
//空间复杂度未知，慎用
```
