---
title: 'Lyndon分解'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# Lyndon分解

* Lyndon串：最小后缀是其本身
* Lyndon分解：分解成若干个Lyndon串，且 $ s_i>s_{i+1} $，并且唯一
* 性质1：如果u，v都是Lyndon串且u < v，则uv也是Lyndon串
* 性质2：若字符串u和字符c，d满足uc是某个Lyndon的前缀且c < d，则ud是Lyndon串
### 后缀数组求法
等价于sa[1]=1，按排名从小到大枚举，如果当前后缀未分出，则分出去
### Duval算法
```cpp
vector<string> duval(const string &s){
    int n=s.size(),i=0,j,k;
    // s1s2s3,s1=s[:i],s2=s[i:j],k为s2的指针,j为新加入字符
    vector<string> ans;
    while(i<n){
        j=i+1,k=i;
        while(j<n&&s[k]<=s[j]){
            if(s[k]<s[j])k=i;
            else k++;
            j++;
        }
        while(i<=k){// 循环节
            ans.push_back(s.substr(i,j-k));
            i+=j-k;
        }
    }
    return ans;
}
```
