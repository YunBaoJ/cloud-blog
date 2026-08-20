---
id: "dormitory-system-architecture"
title: "从零构建智慧宿舍管理系统：Spring Boot 3 与 Vue 3 的工程化实战与架构权衡"
summary: "深度复盘一个覆盖学生、宿管与管理员三端的高校宿舍综合管理系统。以统一身份认证为入口，全面拆解 RBAC 权限设计、JWT 双向鉴权、状态机工单流转与前后端工程化实践。"
date: "2026-08-15"
readTime: "10 min read"
category: "工程实战"
tags: ["Spring Boot 3", "Vue 3", "系统架构", "RBAC", "全栈开发"]
iconName: "Server"
coverImage: "/projects/dormitory-system/login.png"
coverAlt: "智慧宿舍管理系统统一身份认证与多角色登录入口"
featured: true
---

# 从零构建智慧宿舍管理系统：Spring Boot 3 与 Vue 3 的工程化实战与架构权衡

高校宿舍管理是一项典型的多角色、重流程、高并发变动的校园信息化业务。从每学期初的大规模新生批量入住、学期中的调宿与设施损坏报修，到每日的外来访客登记与晚归考勤，传统的纸质台账或分散系统极易导致数据孤岛与协同低效。

为了打破这种管理壁垒，我们基于 **Spring Boot 3、Java 17、Vue 3、Element Plus 与 MySQL 8.0** 构建了一套全流程闭环的智慧宿舍管理系统。本文将以统一身份认证为起点，全面复盘其系统分层架构、RBAC 细粒度权限控制、JWT 无状态鉴权以及状态机工单流转的工程化落地过程。

---

## 1. 统一身份认证与多端角色入口

系统的首要安全关口是统一身份认证网关。系统涵盖在住学生 (Student)、楼栋宿管 (Manager) 与系统管理员 (Admin) 三类完全不同的用户群体，所有角色的交互均始于统一的自适应登录门户。

![统一身份认证 - 学生/宿管/管理员三端安全登录入口](../../public/projects/dormitory-system/login.png)

### 1.1 鉴权与路由流转机制
1. **多角色自适应登录**：用户在同一入口选择身份角色并输入学工号/密码，前端通过统一接口 `/api/auth/login` 发起认证请求；
2. **Spring Security 强校验**：后端基于 BCrypt 哈希算法完成密码比对，校验通过后签发包含用户 ID、账号及角色元数据的 HS256 JWT Token；
3. **Pinia 状态持久化与动态路由**：Vue 3 客户端接收 Token 并持久化至 LocalStorage/Pinia，全局路由守卫 `router.beforeEach` 依据角色动态挂载对应权限树的路由表；
4. **Axios 拦截器无感注入**：后续业务请求在 Request Header 中自动携带 `Authorization: Bearer <Token>`，后端统一网关执行无状态解析与越权拦截。

### 1.2 JWT 核心过滤器实现

在 Spring Boot 3 中，我们通过继承 `OncePerRequestFilter` 实现轻量高效的无状态安全过滤器：

```java
@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Override
    protected void doFilterInternal(HttpServletRequest request, 
                                    HttpServletResponse response, 
                                    FilterChain filterChain) throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");

        if (StringUtils.hasText(authHeader) && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);
            if (jwtUtils.validateToken(token)) {
                Claims claims = jwtUtils.getClaimsFromToken(token);
                String username = claims.getSubject();
                String role = claims.get("role", String.class);

                // 构建 Spring Security 权限上下文
                List<GrantedAuthority> authorities = List.of(
                    new SimpleGrantedAuthority("ROLE_" + role)
                );
                UsernamePasswordAuthenticationToken authentication = 
                    new UsernamePasswordAuthenticationToken(username, null, authorities);
                
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }
        filterChain.doFilter(request, response);
    }
}
```

---

## 2. 系统总体分层与全栈工程规范

为了保证系统的高内聚低耦合，我们采用了严谨的标准三层架构设计：表现层（Vue 3 Client）、业务安全层（Spring Boot 3 API）与数据持久层（MySQL 8.0）。

![系统管理员全局中枢数据监控看板](../../public/projects/dormitory-system/admin-overview.png)

### 为什么选择 Spring Boot 3 与 Java 17？
- **Jakarta EE 命名空间升级与性能基准**：基于 Spring Boot 3 享受最新的框架性能与安全基准，全面拥抱响应式与函数式编程范式；
- **RESTful 契约统一**：通过统一响应体 `R<T>`、全局错误码枚举 `ResultCode` 与统一异常拦截器 `@RestControllerAdvice`，实现严格的前后端数据接口契约；
- **MyBatis-Plus 高效持久化**：在单表基础 CRUD 上做到零 SQL 编码，在多表复杂统计与大屏聚合查询中使用手写 XML 优化 SQL 执行计划。

```json
// 统一 RESTful 响应报文契约
{
  "code": 200,
  "message": "操作成功",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsIn...",
    "userInfo": {
      "id": 1001,
      "username": "admin",
      "role": "ADMIN"
    }
  },
  "timestamp": 1786790400000
}
```

---

## 3. 宿管工作台与房态图谱可视化

在宿管端，如何直观展示整栋楼宇数十个房间的实时入住率与空余床位是一个核心前端交互难点。

![宿管日常工作台 - 楼栋入住率看板与房态状态机](../../public/projects/dormitory-system/manager-workbench.png)

### 房态可视化与防抖优化：
- **动态房态色谱**：绿色代表完全空闲、蓝色代表部分入住、琥珀色代表满员满宿、灰色代表维保锁定；
- **虚拟滚动与数据防抖**：在单栋楼宇包含 500+ 房间列表时，采用虚拟滚动渲染视口可见卡片，确保在移动端与小屏笔记本上保持 60fps 丝滑滚动体验；
- **快速办理与调宿联动**：支持宿管一键分配空余床位、快捷登记入住并联动学工系统的学籍状态。

---

## 4. 报修业务 5 节点状态机审批流

报修是宿舍日常最高频的交互场景。为了防止工单流转出现状态倒流或挂起，我们设计了严格的状态机流转模型。

![学生个人服务台 - 在线报修申报与实时工单追踪](../../public/projects/dormitory-system/student-repair.png)

### 报修流转的 5 个关键生命周期：
1. **待审核 (PENDING)**：学生在线拍照提交报修申报，表单自动关联其所在楼栋与房间床位；
2. **已派单 (ASSIGNED)**：楼栋值班宿管审核故障描述，指派对应维修师傅并记录派单时间；
3. **维修中 (PROCESSING)**：师傅上门检修并更换配件，系统触发学生端进度提醒；
4. **已完成 (COMPLETED)**：维修完成申报，记录工单总耗时与耗材配件明细；
5. **已归档 (ARCHIVED)**：学生在个人工作台进行验收、打分并提交星级评价。

---

## 5. 敏感数据脱敏与全栈安全防护

在校园管理系统中，学生个人隐私安全与操作审计是不可忽视的底线：

1. **细粒度数据脱敏**：在全校大盘展示、访客记录与考勤导出中，对学生身份证号（如 `110101********1234`）与手机号（如 `138****1234`）统一在后端 Serializer 层执行脱敏，避免明文泄露；
2. **SQL 注入与 XSS 防护**：通过 MyBatis-Plus 参数预编译绑定与前端富文本渲染过滤，彻底阻断注入攻击；
3. **全链路操作日志审计**：针对调宿审批、退宿结算等关键操作，借助 AOP 切面自动记录操作人员 IP、工号、修改前后快照，确保业务变动全程可追溯。

---

## 6. 工程复盘与思考

1. **前后端类型契约的统一**：通过 TypeScript Interface 与 Java DTO 保持完全镜像，消除了前后端联调时的字段类型隐患；
2. **状态驱动胜于事件堆叠**：将报修、调宿等复杂业务抽象为状态机模型，大幅降低了分支判断的复杂度；
3. **克制的设计与直观的感知**：通过清爽的控制台布局与图文并茂的画廊展示，让复杂的工程系统兼具工业级稳健性与优雅的视觉体验。

> 架构设计准则：一个优秀的管理系统不仅在于功能的完备，更在于架构设计的严谨性、状态流转的自洽性与交互界面的克制之美。
