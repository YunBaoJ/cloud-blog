---
id: "dormitory-system-architecture"
title: "从零构建智慧宿舍管理系统：Spring Boot 3 与 Vue 3 的工程化实战与架构权衡"
summary: "深度复盘一个覆盖学生、宿管与管理员三端的高校宿舍综合管理系统。拆解 RBAC 权限设计、JWT 双向认证、状态机工单流转与前后端工程化实践。"
date: "2026-08-15"
readTime: "10 min read"
category: "工程实战"
tags: ["Spring Boot 3", "Vue 3", "系统架构", "RBAC", "全栈开发"]
iconName: "Server"
coverImage: "/projects/dormitory-system/admin-overview.png"
coverAlt: "智慧宿舍管理系统系统管理员全局中枢数据监控看板"
featured: true
---

# 从零构建智慧宿舍管理系统：Spring Boot 3 与 Vue 3 的工程化实战与架构权衡

高校宿舍管理是一项典型的多角色、重流程、高并发变动的校园信息化业务。从每学期初的**大规模新生批量入住**、**学期中的调宿与设施损坏报修**，到**每日的外来访客登记与晚归考勤**，传统的纸质台账或单体管理模式极易导致数据孤岛与协同低效。

本文将从需求分析、系统分层架构、RBAC 细粒度权限控制、JWT 无状态双向鉴权到状态机工单流转，深度复盘基于 **Spring Boot 3 + Java 17 + Vue 3 + Element Plus** 构建的智慧宿舍管理系统的工程化落地过程。

---

## 🏛️ 1. 系统总体分层与技术选型

为了保证系统的高内聚低耦合，我们采用了严谨的标准三层架构设计：表现层（Vue 3 Client）、业务安全层（Spring Boot 3 API）与数据持久层（MySQL 8.0）。

![智慧宿舍管理系统 - 总体架构与系统管理员全局中枢监控看板](/projects/dormitory-system/admin-overview.png)

### 为什么选择 Spring Boot 3 与 Java 17？
- **Jakarta EE 命名空间升级与性能基准**：基于 Spring Boot 3 享受最新的框架性能与安全基准，全面支持响应式与函数式编程范式；
- **RESTful 契约统一**：通过统一响应体 `R<T>`、全局错误码枚举 `ResultCode` 与统一异常拦截器 `@RestControllerAdvice`，实现严格的前后端数据接口契约；
- **MyBatis-Plus 高效持久化**：在单表基础操作上零 SQL 编码，在多表复杂统计与大屏聚合查询中使用 XML 手写优化 SQL。

---

## 🛡️ 2. RBAC 细粒度权限模型与 JWT 双向鉴权

系统涵盖 **学生 (Student)**、**宿管 (Manager)** 与 **系统管理员 (Admin)** 三类完全不同的用户群体，权限边界的隔离是系统的生命线。

![统一身份认证 - 学生/宿管/管理员三端安全登录入口](/projects/dormitory-system/login.png)

### 2.1 鉴权与路由流转机制
1. **统一登录网关**：用户提交身份角色 + 学工号 + 密码至认证接口 `/api/auth/login`；
2. **Spring Security 校验**：基于 BCrypt 强哈希算法进行密码比对，校验通过后签发包含用户 ID 与角色元数据的 HS256 JWT Token；
3. **前端状态与动态路由**：Vue 3 客户端通过 Pinia 持久化 Token，全局路由守卫 `router.beforeEach` 动态生成当前角色可访问的专属菜单；
4. **Axios 拦截器透传**：后续所有业务请求在 Header 中自动注入 `Authorization: Bearer <Token>`，后端统一网关拦截器无状态校验。

### 2.2 JWT 拦截器核心实现代码

在 Spring Boot 3 后端通过自定义 `JwtAuthenticationFilter` 对每个 HTTP 请求进行无状态解析与权限注入：

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

## ⚙️ 3. 报修业务 5 节点状态机审批流

报修是宿舍日常最高频的交互场景。为了防止工单流转出现状态倒流或悬挂，我们设计了严格的状态机流转模型。

![学生个人服务台 - 在线报修申报与实时工单追踪](/projects/dormitory-system/student-repair.png)

### 报修流转的 5 个关键生命周期：
1. **待审核 (PENDING)**：学生在线拍照提交报修申报，表单自动关联其所在楼栋与房间床位；
2. **已派单 (ASSIGNED)**：楼栋值班宿管审核故障描述，指派对应维修师傅并记录派单时间；
3. **维修中 (PROCESSING)**：师傅上门检修并更换配件，系统触发学生端进度提醒；
4. **已完成 (COMPLETED)**：维修完成申报，记录工单总耗时与耗材配件明细；
5. **已归档 (ARCHIVED)**：学生在个人工作台进行验收、打分并提交星级评价。

---

## 📊 4. 宿管工作台与房态图谱优化

在宿管端，如何直观展示**整栋楼宇数十个房间的实时入住率与空余床位**是一个核心前端交互难点。

![宿管日常工作台 - 楼栋入住率看板与房态状态机](/projects/dormitory-system/manager-workbench.png)

### 房态可视化与防抖优化：
- **动态房态色谱**：绿色代表完全空闲、蓝色代表部分入住、琥珀色代表满员满宿、灰色代表维保锁定；
- **虚拟滚动与数据防抖**：在单栋楼宇包含 500+ 房间列表时，采用虚拟滚动渲染视口可见卡片，确保在移动端与小屏笔记本上保持 60fps 丝滑滚动体验。

---

## 🎯 5. 工程复盘与思考

1. **前后端类型契约的统一**：通过 TypeScript Interface 与 Java DTO 保持完全镜像，消除了前后端联调时的字段类型隐患；
2. **细粒度数据脱敏**：在全校大盘展示与访客记录中，对学生身份证号、手机号统一使用脱敏掩码（如 `138****1234`），保障校园个人隐私安全；
3. **图文并茂的直观呈现**：通过左右双栏联动画廊与实景高清插图，让复杂的工程系统以最直观易懂的视觉形态对外呈现。

---

> 💡 **项目结语**：
> 一个优秀的管理系统不仅在于功能的完备，更在于架构设计的严谨性、状态流转的自洽性与交互界面的克制之美。
