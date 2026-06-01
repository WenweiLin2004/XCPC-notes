---
title: 'FWT求三个集合异或的不同个数'
date: "2024-07-31"
sourceFile: "2024-07-31-算法模板.md"
category: "templates"
---

<PostMeta />

# FWT求三个集合异或的不同个数

复杂度$O(V \log V)$
```cpp
class Solution {
public:
    int uniqueXorTriplets(vector<int>& nums) {
        int mx=*max_element(nums.begin(),nums.end());
        init(mx);
        vector<long long> A(n),B(n);
        for(auto x:nums)A[x]=1,B[x]=1;
        fwt_xor(A);
        for(int i=0;i<n;i++)A[i]=A[i]*A[i]%mod;
        fwt_xor(B);
        for(int i=0;i<n;i++)A[i]=A[i]*B[i]%mod;
        ifwt_xor(A);
        int ans=0;
        for(int i=0;i<n;i++){
            if(A[i])ans++;
        }
        return ans;
    }
};
```
