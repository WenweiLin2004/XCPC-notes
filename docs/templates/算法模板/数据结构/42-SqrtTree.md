---
title: 'Sqrt Tree'
date: "2025-05-22"
sourceFile: "2025-05-22-补充算法笔记.md"
category: "templates"
---

<PostMeta />

# Sqrt Tree

预处理$O(n \log \log n)$，单点修改$O(\sqrt n)$，查询$O(1)$

```cpp
// 区间查询的聚合信息结构体（根据需求自定\left|\bigcap_{i=1}^{n}\{x_i \leq b_i\}\right| = 
\sum_{k=0}^{n}(-1)^{k} 
\sum_{1\leq i_1 < \cdots < i_k \leq n} 
\binom{ \left( m - \sum_{j=1}^{k}(b_{i_j} + 1) \right) + n - 1 }{ n - 1 }）
struct Info {
    // 示例：可包含最小值、和等聚合信息
    // 需要根据实际需求实现合并操作
};

// 平方分解树模板
// T: 元素类型，需要支持默认构造函数
// F: 合并函数类型，需实现 operator()(const T&, const T&)
template <typename T>
class SqrtTree {
private:
    // 基础数据参数
    int n;          // 原始数据元素个数
    int lg;         // log2(n) 的上界值
    int indexSz;    // 索引块的数量
    
    vector<T> v;    // 数据存储（包含辅助索引块）
    
    // 分层管理结构
    vector<int> clz;       // 前导零数量表（用于快速计算最高有效位）
    vector<int> layers;    // 每层的块大小层级（以log2表示）
    vector<int> onLayer;   // 每个可能的log值对应的层级
    
    // 预处理数据结构
    vector<vector<T>> pref;   // 各层的前缀聚合值
    vector<vector<T>> suf;    // 各层的后缀聚合值
    vector<vector<T>> between;// 层间块聚合值
    

    // 计算不小于n的最小2的幂次
    static int log2_ceil(int n) {
        int res = 0;
        while ((1 << res) < n) res++;
        return res;
    }
    static T f(const T& a, const T& b) {
        // 合并函数：根据需求实现
        return a+b;
    }
    // 构建单个块的前后缀聚合
    // layer: 当前处理层
    // l: 块左边界（包含）
    // r: 块右边界（不包含）
    void buildBlock(int layer, int l, int r) {
        // 计算前缀聚合：pref[i] = v[l] ⊗ v[l+1] ⊗ ... ⊗ v[i]
        pref[layer][l] = v[l];
        for (int i = l+1; i < r; i++)
            pref[layer][i] = f(pref[layer][i-1], v[i]);
        
        // 计算后缀聚合：suf[i] = v[i] ⊗ v[i+1] ⊗ ... ⊗ v[r-1]
        suf[layer][r-1] = v[r-1];
        for (int i = r-2; i >= l; i--)
            suf[layer][i] = f(v[i], suf[layer][i+1]);
    }

    // 构建层间块聚合结构
    // layer: 当前层（必须>=1）
    // lBound: 当前处理区间的左边界
    // rBound: 当前处理区间的右边界
    // betweenOffs: 当前层在between数组中的偏移量
    void buildBetween(int layer, int lBound, int rBound, int betweenOffs) {
        int bSzLog = (layers[layer]+1) >> 1; // 块大小的log值
        int bCntLog = layers[layer] >> 1;    // 块数量的log值
        int bSz = 1 << bSzLog;               // 块的实际大小
        int bCnt = (rBound - lBound + bSz - 1) >> bSzLog; // 总块数
        
        // 预计算所有块区间组合的聚合值
        for (int i = 0; i < bCnt; i++) {
            T ans;
            for (int j = i; j < bCnt; j++) {
                // 获取第j块的聚合值（来自后缀数组）
                T add = suf[layer][lBound + (j << bSzLog)];
                // 合并区间[i,j]的聚合结果
                ans = (i == j) ? add : f(ans, add);
                // 存储到between数组
                between[layer-1][betweenOffs + lBound + (i << bCntLog) + j] = ans;
            }
        }
    }

    // 构建第0层的特殊索引结构
    void buildBetweenZero() {
        int bSzLog = (lg + 1) >> 1;  // 基础块大小
        // 将每个块的聚合值存入辅助空间
        for (int i = 0; i < indexSz; i++)
            v[n + i] = suf[0][i << bSzLog];
        // 递归构建上层结构
        build(1, n, n + indexSz, (1 << lg) - n);
    }

    // 更新第0层的索引块
    void updateBetweenZero(int bid) {
        int bSzLog = (lg + 1) >> 1;
        v[n + bid] = suf[0][bid << bSzLog];
        update(1, n, n + indexSz, (1 << lg) - n, n + bid);
    }

    // 递归构建树结构
    // layer: 当前处理层
    // lBound: 当前处理的左边界
    // rBound: 当前处理的右边界
    // betweenOffs: 层间结构的存储偏移
    void build(int layer, int lBound, int rBound, int betweenOffs) {
        if (layer >= (int)layers.size()) return;
        
        int bSz = 1 << ((layers[layer] + 1) >> 1); // 当前层块大小
        // 遍历处理每个块
        for (int l = lBound; l < rBound; l += bSz) {
            int r = min(l + bSz, rBound);
            buildBlock(layer, l, r);      // 构建当前块的前后缀
            build(layer + 1, l, r, betweenOffs); // 递归构建下层
        }
        
        // 特殊处理第0层
        if (layer == 0) buildBetweenZero();
        else buildBetween(layer, lBound, rBound, betweenOffs);
    }

    // 更新操作的核心实现
    void update(int layer, int lBound, int rBound, int betweenOffs, int x) {
        if (layer >= (int)layers.size()) return;
        
        int bSzLog = (layers[layer] + 1) >> 1;  // 当前层块大小的log值
        int bSz = 1 << bSzLog;                  // 块的实际大小
        int blockIdx = (x - lBound) >> bSzLog;   // 定位块索引
        int l = lBound + (blockIdx << bSzLog);   // 块左边界
        int r = min(l + bSz, rBound);            // 块右边界
        
        // 重建所在块的前后缀
        buildBlock(layer, l, r);
        // 更新上层索引
        if (layer == 0) updateBetweenZero(blockIdx);
        else buildBetween(layer, lBound, rBound, betweenOffs);
        
        // 递归更新上层结构
        update(layer + 1, l, r, betweenOffs, x);
    }

    // 区间查询的核心实现
    T query(int l, int r, int betweenOffs, int base) {
        if (l == r) return v[l];          // 单点查询
        if (l + 1 == r) return f(v[l], v[r]); // 相邻点直接合并
        
        // 计算异或值用于确定层级
        int xorVal = (l - base) ^ (r - base);
        int layer = onLayer[clz[xorVal]]; // 选择最高有效位对应的层
        
        int bSzLog = (layers[layer] + 1) >> 1; // 当前层块大小的log值
        int bCntLog = layers[layer] >> 1;      // 块数量的log值
        
        // 计算当前层的左边界
        int lBound = ((((l - base) >> layers[layer]) << layers[layer]) + base);
        
        // 确定左右块索引
        int lBlock = ((l - lBound) >> bSzLog) + 1;
        int rBlock = ((r - lBound) >> bSzLog) - 1;
        
        T ans = suf[layer][l]; // 初始化为左端后缀
        
        // 处理中间完整块
        if (lBlock <= rBlock) {
            T add;
            if (layer == 0) {
                // 第0层需要递归查询索引块
                add = query(n + lBlock, n + rBlock, (1 << lg) - n, n);
            } else {
                // 上层直接从between数组获取
                add = between[layer-1][betweenOffs + lBound 
                    + (lBlock << bCntLog) + rBlock];
            }
            ans = f(ans, add);
        }
        
        // 合并右端前缀
        ans = f(ans, pref[layer][r]);
        return ans;
    }

public:
    // 构造函数
    // a: 原始数据数组
    // f: 合并函数（默认构造）
    SqrtTree(const vector<T>& a) : 
        n(a.size()), 
        lg(log2_ceil(n)),
        v(a),
        clz(1 << lg),     // 前导零表大小为2^lg
        onLayer(lg + 1)  // 层级映射表
    {
        // 初始化前导零表
        clz[0] = 0;
        for (int i = 1; i < (1 << lg); i++)
            clz[i] = clz[i >> 1] + 1;
        
        // 构建层级结构
        int tlg = lg;
        while (tlg > 1) {
            onLayer[tlg] = layers.size();
            layers.push_back(tlg);
            tlg = (tlg + 1) >> 1;  // 按log递减方式构建层
        }
        // 填充剩余的层级映射
        for (int i = lg-1; i >= 0; i--)
            onLayer[i] = max(onLayer[i], onLayer[i+1]);
        
        // 计算索引块参数
        int betweenLayers = max((int)0, (int)layers.size()-1);
        int bSzLog = (lg + 1) >> 1;
        int bSz = 1 << bSzLog;
        indexSz = (n + bSz - 1) >> bSzLog; // 向上取整
        
        // 调整数据存储大小
        v.resize(n + indexSz);
        
        // 初始化预处理数组
        pref.assign(layers.size(), vector<T>(n + indexSz));
        suf.assign(layers.size(), vector<T>(n + indexSz));
        between.assign(betweenLayers, vector<T>((1 << lg) + bSz));
        
        // 从第0层开始构建
        build(0, 0, n, 0);
    }

    // 区间查询接口 [l, r]
    T query(int l, int r) { 
        return query(l, r, 0, 0); 
    }

    // 单点更新接口
    void update(int x, const T& item) {
        v[x] = item;       // 更新原始数据
        update(0, 0, n, 0, x); // 从底层开始更新结构
    }
};
```
