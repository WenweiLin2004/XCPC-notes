---
title: '计算几何'
date: "2024-07-31"
sourceFile: "算法模板（合并）"
category: "templates"
---

<PostMeta />

# 计算几何

```cpp
namespace Geometry{
    const double PI=acos(-1);
    const double eps=1e-12;

    struct Point{//点坐标
        double x,y;
        Point(double x=0,double y=0):x(x),y(y) {}
        //可用Point a(1,2);语句直接将值设置为x=1,y=2
        //如果未设定初值则直接设置为x=0,y=0
        bool operator==(const Point a) const{
            return (fabs(x-a.x)<=eps&&fabs(y-a.y)<=eps);
        }
        bool operator<(const Point &b) const{//以横纵坐标从小到大排序
            return x == b.x ? y < b.y : x < b.x;
        }
    };
    typedef Point Vector;//向量

    //简化向量运算
    Vector operator +(Vector A,Vector B){
        return Vector(A.x+B.x,A.y+B.y);
    }
    Vector operator -(Vector A,Vector B){
        return Vector(A.x-B.x,A.y-B.y);
    }
    Vector operator *(Vector A,double p){
        return Vector(A.x*p,A.y*p);
    }
    Vector operator /(Vector A,double p){
        return Vector(A.x/p,A.y/p);
    }

    int sign(double x){//符号函数：精度为eps
        if(fabs(x)<eps) return 0;//x为0
        if(x<0) return -1;//x为负数
        return 1;//x为正数
    }

    int cmp(double x,double y){//比较函数：精度为eps
        if(fabs(x-y)<eps) return 0;//x与y相等
        if(x<y) return -1;//x小于y
        return 1;//x大于y
    }

    double dot(Point a,Point b){//向量点积
        return a.x*b.x+a.y*b.y;
    }

    double cross(Point a,Point b){//向量叉积
        return a.x*b.y-b.x*a.y;
    }

    double get_dist(Point a,Point b){//求两点间距离
        return sqrt((a.x-b.x)*(a.x-b.x)+(a.y-b.y)*(a.y-b.y));
    }

    double get_length(Point a){//向量模长（线段长度）
        return sqrt(dot(a,a));
    }

    double get_angle(Point a,Point b){//求A->B的有向角
        return acos(dot(a,b)/get_length(a)/get_length(b));
    }

    double area(Point a,Point b,Point c){//A为顶点，向量AB与向量AC的叉积，即三角形ABC面积的2倍（有向）
        return cross(b-a,c-a);
    }

    Point rotate(Point a,double angle){
        return Point(a.x*cos(angle)+a.y*sin(angle),-a.x*sin(angle)+a.y*cos(angle));
    }

    Point get_line_intersection(Point p,Vector v,Point q,Vector w){//两直线的交点
        //使用前提，直线必须有交点
        //cross(v, w) == 0则两直线平行或者重合
        Vector u=p-q;
        double t=cross(w,u)/cross(v,w);
        return p+v*t;
    }
    //若判断线段/射线是否相交 还需判断交点是否在线段/射线上

    double distance_to_line(Point p,Point a,Point b){//点p到直线ab的距离
        Vector v1=b-a,v2=p-a;
        return fabs(cross(v1,v2)/get_length(v1));
    }

    double distance_to_segment(Point p,Point a,Point b){//点p到线段ab的距离
        if(a==b) return get_length(p-a);

        Vector v1=b-a,v2=p-a,v3=p-b;
        if(sign(dot(v1,v2))<0) return get_length(v2);
        if(sign(dot(v1,v3))>0) return get_length(v3);
        return distance_to_line(p,a,b);
    }

    Point get_line_projection(Point p,Point a,Point b){//点p在直线ab上的投影
        Vector v=b-a;
        return a+v*(dot(v,p-a)/dot(v,v));
    }

    bool on_segment(Point p,Point a,Point b){//点p是否在线段ab上
        return sign(cross(p-a,p-b))==0&&sign(dot(p-a,p-b))<=0;
    }

    bool segment_intersection(Point a1,Point a2,Point b1,Point b2){// 判断两个线段a1a2与b1b2是否相交
        //在同一直线上但不重合的两线段会错判为相交
        double c1=cross(a2-a1,b1-a1),c2=cross(a2-a1,b2-a1);
        double c3=cross(b2-b1,a2-b1),c4=cross(b2-b1,a1-b1);
        return sign(c1)*sign(c2)<=0&&sign(c3)*sign(c4)<=0;
    }

    double polygon_area(Point p[],int n){//求多边形面积(不一定是凸多边形)
        double s=0;
        for(int i=1;i+1<n;i++)
            s+=cross(p[i]-p[0],p[i+1]-p[i]);
        return s/2;
    }

    bool in_line(Point p1,Point p2,Point p3){ //判断三点是否共线
        double res=(p2.x-p1.x)*(p3.y-p1.y)-(p3.x-p1.x)*(p2.y-p1.y);
        if(fabs(res)<=eps) return 0;//共线
        return 1;//不共线
    }

    Point get_circle_center(Point a,Point b,Point c){//根据三点求圆的圆心坐标
        double fm1=2*(a.y-c.y)*(a.x-b.x)-2*(a.y-b.y)*(a.x-c.x);
        double fm2=2*(a.y-b.y)*(a.x-c.x)-2*(a.y-c.y)*(a.x-b.x);
        double x,y;
        if(fm1==0||fm2==0)//三点共线
        {
            x=y=1e18;
            return {x,y};
            //if(x==y&&abs(x-1e18)<eps) 三点共线
        }
        double fz1=a.x*a.x-b.x*b.x+a.y*a.y-b.y*b.y;
        double fz2=a.x*a.x-c.x*c.x+a.y*a.y-c.y*c.y;
        x=(fz1*(a.y-c.y)-fz2*(a.y-b.y))/fm1;
        y=(fz1*(a.x-c.x)-fz2*(a.x-b.x))/fm2;
        return {x,y};
    }

    int stk[N];
    Point q[N];
    bool used[N];
    int top;
    void andrew(int n){//求凸包
        sort(q,q+n);//以横纵坐标从小到大排序
        for(int i=0;i<n;i++)
        {
            while(top>=2&&sign(area(q[stk[top-1]],q[stk[top]],q[i]))<=0)//
                //不带等号：可以求出所有点都在一条直线上的情况
            {
                if(sign(area(q[stk[top-1]],q[stk[top]],q[i]))<0)
                    used[stk[top--]]=false;
                else top--;
            }
            stk[++top]=i;
            used[i]=true;
        }
        used[0]=false;
        for(int i=n-1;i>=0;i--)
        {
            if(used[i]) continue;
            while(top>=2&&sign(area(q[stk[top-1]],q[stk[top]],q[i]))<=0)
                top--;
            stk[++top]=i;
        }
        //凸包上的点为1~top-1,q[top]与q[1]为同一点
        //该遍历为逆时针顺序！！！
        //      for (int i = 1; i <= top; i ++ )
        //          cout << stk[i] << ' ';
        //      cout<<endl;
    }

    // -------------------求凸包直径--------------------------------
    int rotating_calipers(int n){//旋转卡壳求凸包直径平方
        if(top<=2)return get_dist(q[0],q[n-1]);
        int res=0;
        vector<Point> tmp;
        for(int i=1;i<=top;i++)tmp.push_back(q[stk[i]]);
        top--;
        for(int i=0,j=2;i<top;i++){
            auto d=tmp[i],e=tmp[i+1];
            while(area(d,e,tmp[j])<area(d,e,tmp[j+1]))j=(j+1)%top;
            res=max({res,get_dist(d,tmp[j]),get_dist(e,tmp[j])});
        }
        return res;
    }

    //-------求最小矩形覆盖-------------------
    Vector norm(Vector a){//法向量
        return a/get_length(a);
    }

    double get_project(Point a, Point b, Point c){
        return dot(b - a, c - a) / get_length(b - a);
    }

    double min_area=1e20;//最小面积
    Point ans[4];//矩形四个顶点

    void rotating_calipers(int n){//旋转卡壳求最小矩形覆盖
        vector<Point> tmp;
        for(int i=1;i<=top;i++)tmp.push_back(q[stk[i]]);
        top--;
        for(int i=0,a=2,b=1,c=2;i<top;i++){
            auto d=tmp[i],e=tmp[i+1];
            while(cmp(area(d,e,tmp[a]),area(d,e,tmp[a+1]))<0)a=(a+1)%top;
            while(cmp(get_project(d,e,tmp[b]),get_project(d,e,tmp[b+1]))<0)b=(b+1)%top;
            if(!i)c=a;
            while(cmp(get_project(d,e,tmp[c]),get_project(d,e,tmp[c+1]))>0)c=(c+1)%top;
            auto x=tmp[a],y=tmp[b],z=tmp[c];
            auto h=area(d,e,x)/get_length(e-d);
            auto w=dot(y-z,e-d)/get_length(e-d);
            if(h*w<min_area){
                min_area=h*w;
                ans[0] = d + norm(e - d) * get_project(d, e, y);
                ans[3] = d + norm(e - d) * get_project(d, e, z);
                auto u = norm(rotate(e - d, -PI / 2));
                ans[1] = ans[0] + u * h;
                ans[2] = ans[3] + u * h;            
            }
        }
    }

    int cnt;
    struct Line{//存储凸包上每条线段的起点和终点
        Point st,ed;
    }line[N];
    Point pg[N],ans[N];//
    int l[N];

    double line_get_angle(const Line& a){
        return atan2(a.ed.y-a.st.y,a.ed.x-a.st.x);
    }

    bool line_cmp(const Line& a, const Line& b){
        double A=line_get_angle(a),B=line_get_angle(b);
        if (!cmp(A,B)) return area(a.st,a.ed,b.ed)<0;
        return A<B;
    }

    Point get_line_intersection(Line a,Line b){
        return get_line_intersection(a.st,a.ed-a.st,b.st,b.ed-b.st);
    }

    bool on_right(Line& a, Line& b, Line& c){//判断bc的交点是否在a的右侧
        auto o = get_line_intersection(b,c);
        return sign(area(a.st,a.ed,o))<=0;
        //需要保留经过半平面交的所有直线的时候，将该处等号去掉
    }

    double half_plane_intersection(){
        sort(line,line+cnt,line_cmp);//对每条直线按照极坐标进行排序
        int hh=0,tt=-1;//定义双端队列对头和队尾元素
        for(int i=0;i<cnt;i++)//遍历每一条直线
        {
            if (i&&!cmp(line_get_angle(line[i]),line_get_angle(line[i-1]))) continue;//当两直线极坐标角度相同
            while(hh+1<=tt&&on_right(line[i],line[l[tt-1]],line[l[tt]])) tt--;
            //如果line[l[tt-1]]和line[l[tt]]的交点在line[i]的右侧,删除队尾元素
            while(hh+1<=tt&&on_right(line[i],line[l[hh]],line[l[hh+1]])) hh++;
            //如果line[l[hh]]和line[l[hh+1]]的交点在line[i]的右侧,删除队头元素
            l[++tt]=i;//将该直线加入队尾
        }
        //判断一下第一条直线与最后一条直线
        while (hh+1<=tt&&on_right(line[l[hh]],line[l[tt-1]],line[l[tt]])) tt--;//队尾更新队头
        while (hh+1<=tt&&on_right(line[l[tt]],line[l[hh]],line[l[hh+1]])) hh++;//队头更新队尾

        l[++tt]=l[hh];//将第一条直线再次加入双端队列末尾

        //计算半平面交交点
        int k=0;
        for (int i=hh;i<tt;i++) //对于半平面交上的直线两两之间求出交点
            ans[k++]=get_line_intersection(line[l[i]],line[l[i+1]]);

        //计算半平面交面积
        return polygon_area(ans,k);
    }

    Point po[N];
    struct Circle{
        Point p;
        double r;
    };

    pair<Point,Point> get_line(Point a,Point b){//找到与向量ab垂直的向量的起点与终点
        return {(a+b)/2,rotate(b-a,PI/2)};
    }

    Circle get_circle(Point a,Point b,Point c){//根据不共线的三点求出圆的圆心坐标和半径
        auto u=get_line(a,b),v=get_line(a,c);//求出垂直于ab和ac的向量
        auto p=get_line_intersection(u.first,u.second,v.first,v.second);//两向量交点即为所求圆的圆心
        return {p,get_dist(p,a)};
    }

    Circle get_circle(Point a,Point b,Point c){//根据不共线的三点求出圆的圆心坐标和半径
        Point p=get_circle_center(a,b,c);
        double r=get_dist(p,a);
        return {p,r};
    }

    void smallest_circle(int n)
    {
        random_shuffle(po,po+n);
        Circle c={po[0],0};//最开始时直接将第一个点看作圆心，半径为0
        for(int i=1;i<n;i++)
        {
            if(cmp(c.r,get_dist(c.p,po[i]))<0)//如果第i个点不在前i-1个点的最小圆覆盖内，则进入下一重循环
            {
                c={po[i],0};//将第i个点当作圆心，半径为0，重新确定圆
                for(int j=0;j<i;j++)
                {
                    if(cmp(c.r,get_dist(c.p,po[j]))<0)//
                    {
                        c={(po[i]+po[j])/2,get_dist(po[i],po[j])/2};
                        for(int k=0;k<j;k++)
                            if(cmp(c.r,get_dist(c.p,po[k]))<0)//确定了最小圆覆盖上的三个点，直接求出圆
                                c=get_circle(po[i],po[j],po[k]);
                    }
                }
            }
        }

        printf("%.10lf\n",c.r);//输出圆的半径
        printf("%.10lf %.10lf\n",c.p.x,c.p.y);//输出圆心坐标
    }
    //------------求圆与三角形的面积并---------------------
    Point q[N],r;
    double R;
    Vector norm(Vector a){//法向量
        return a/get_length(a);
    }
    double get_circle_line_intersection(Point a, Point b, Point& pa, Point& pb)
    {
        auto e = get_line_intersection(a, b - a,r, rotate(b - a, PI / 2));
        auto mind = get_dist(r, e);
        if (!on_segment(e, a, b)) mind = min(get_dist(r, a), get_dist(r, b));
        if (cmp(R, mind) <= 0) return mind;
        auto len = sqrt(R * R - get_dist(r, e) * get_dist(r, e));
        pa = e + norm(a - b) * len;
        pb = e + norm(b - a) * len;
        return mind;
    }

    double get_sector(Point a, Point b)
    {
        auto angle = acos((dot(a, b)) / get_length(a) / get_length(b));
        if (sign(cross(a, b)) < 0) angle = -angle;
        return R * R * angle / 2;
    }

    double get_circle_triangle_area(Point a, Point b)
    {
        auto da = get_dist(r, a), db = get_dist(r, b);
        if (cmp(R, da) >= 0 && cmp(R, db) >= 0) return cross(a, b) / 2;
        if (!sign(cross(a, b))) return 0;
        Point pa, pb;
        auto mind = get_circle_line_intersection(a, b, pa, pb);
        if (cmp(R, mind) <= 0) return get_sector(a, b);
        if (cmp(R, da) >= 0) return cross(a, pb) / 2 + get_sector(pb, b);
        if (cmp(R, db) >= 0) return get_sector(a, pa) + cross(pa, b) / 2;
        return get_sector(a, pa) + cross(pa, pb) / 2 + get_sector(pb, b);
    }

    double work(int n)
    {
        double res = 0;
        for (int i = 0; i < n; i ++ )
            res += get_circle_triangle_area(q[i], q[(i + 1) % n]);
        return fabs(res);
    }
}
using namespace Geometry;

void solve1()//求凸包
{
    scanf("%d",&n);//点个数
    for(int i=0;i<n;i++) scanf("%lf%lf",&q[i].x,&q[i].y);//输入点坐标
    //下标从0开始，且求凸包之后不保留原下标顺序
    andrew();//求凸包
    double ans=1e9;
    printf("%.10lf",ans);
}

void solve2()//求半平面交
{
    int n,m;
    scanf("%d",&n);
    while(n--)
    {
        scanf("%d",&m);
        for(int i=0;i<m;i++) scanf("%lf%lf",&pg[i].x,&pg[i].y);//读入凸包上的所有点
        for(int i=0;i<m;i++) line[cnt++]={pg[i],pg[(i+1)%m]};//指定每一条线段的两端点
        //pg[(i+1)%m]处理最后一个点与第一个点之间的线段
    }
    double res=half_plane_intersection();
    printf("%.3lf\n",res);
}

void solve3()//求最小圆覆盖
{
    scanf("%d",&n);
    for(int i=0;i<n;i++) scanf("%lf%lf",&po[i].x,&po[i].y);
    random_shuffle(po,po+n);//将所有的点随机化
    smallest_circle();
}
```

## 本专题目录

- [基础知识](/templates/算法模板/计算几何/01-基础知识)
- [凸包](/templates/算法模板/计算几何/02-凸包)
- [极角排序](/templates/算法模板/计算几何/03-极角排序)
- [平面最近点对](/templates/算法模板/计算几何/04-平面最近点对)
- [平面最近最远点对随机法](/templates/算法模板/计算几何/05-平面最近最远点对随机法)
- [旋转卡壳求凸包直径](/templates/算法模板/计算几何/06-旋转卡壳求凸包直径)
- [旋转卡壳求最小矩形覆盖](/templates/算法模板/计算几何/07-旋转卡壳求最小矩形覆盖)
- [k远点对](/templates/算法模板/计算几何/08-k远点对)
- [半平面交(求凸多边形的交集)](/templates/算法模板/计算几何/09-半平面交求凸多边形的交集)
- [最小覆盖圆](/templates/算法模板/计算几何/10-最小覆盖圆)
- [三维计算几何基础](/templates/算法模板/计算几何/11-三维计算几何基础)
- [三维凸包](/templates/算法模板/计算几何/12-三维凸包)
- [三角形面积并](/templates/算法模板/计算几何/13-三角形面积并)
- [最小圆覆盖](/templates/算法模板/计算几何/14-最小圆覆盖)
- [自适应辛普森积分](/templates/算法模板/计算几何/15-自适应辛普森积分)
- [自适应辛普森积分求圆的面积并](/templates/算法模板/计算几何/16-自适应辛普森积分求圆的面积并)
- [计算积分(发散收敛)](/templates/算法模板/计算几何/17-计算积分发散收敛)