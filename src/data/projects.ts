export interface ProjectCaseStudy {
  slug: string;
  title: string;
  status: "开发中";
  summary: string;
  stack: readonly string[];
  workflows: readonly {
    title: string;
    description: string;
  }[];
  architecture: readonly {
    title: string;
    description: string;
  }[];
  responsibilities: readonly string[];
  screenshots: readonly {
    title?: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
  currentFocus: string;
}

export const DORMITORY_SYSTEM_PROJECT: ProjectCaseStudy = {
  slug: "dormitory-system",
  title: "智慧宿舍管理系统",
  status: "开发中",
  summary:
    "面向学生、宿管与管理员的多角色宿舍管理系统，覆盖住宿、报修、费用、访客与调宿等日常流程。",
  stack: [
    "Spring Boot 3",
    "Java 17",
    "MyBatis-Plus",
    "MySQL",
    "JWT",
    "Vue 3",
    "Vite",
    "Pinia",
    "Element Plus",
    "Axios",
  ],
  workflows: [
    {
      title: "角色访问",
      description: "通过 JWT 校验与角色路由区分学生、宿管和管理员入口。",
    },
    {
      title: "学生服务",
      description: "学生端提供宿舍、报修、费用、公告、访客和调宿等功能入口。",
    },
    {
      title: "宿舍运营",
      description: "宿管端聚合入住、报修、卫生、访客、晚归和水电计费等日常工作。",
    },
    {
      title: "管理维护",
      description: "管理员端提供用户权限、宿舍资源、公告、维修监控、操作日志与数据报表入口。",
    },
  ],
  architecture: [
    {
      title: "表现层 (Vue 3 Client)",
      description: "Element Plus + Pinia + Vue Router 构建的三端响应式工作台。",
    },
    {
      title: "业务层 (Spring Boot 3 API)",
      description: "RESTful API 契约设计，统一全局异常捕获、JWT 鉴权拦截与业务分发。",
    },
    {
      title: "数据层 (MySQL & MyBatis-Plus)",
      description: "ORM 映射、多表联查、分页查询与状态流转审计日志记录。",
    },
  ],
  responsibilities: [
    "负责整体系统需求梳理与 RBAC 权限模型设计",
    "独立实现基于 Spring Boot 3 的后端 RESTful 接口体系与鉴权中间件",
    "负责 Vue 3 + Element Plus 的三端动态路由渲染与表单验证交互",
    "设计规范化的接口错误码标准与脱敏数据响应模型",
  ],
  screenshots: [
    {
      title: "统一身份认证登录",
      src: "/projects/dormitory-system/login.png",
      alt: "登录界面：支持学生、宿管和管理员统一账号认证与鉴权",
      width: 1440,
      height: 900,
    },
    {
      title: "系统管理员总览",
      src: "/projects/dormitory-system/admin-overview.png",
      alt: "系统管理员工作台：楼宇资产、用户权限与全局数据看板",
      width: 1440,
      height: 900,
    },
    {
      title: "宿管工作台",
      src: "/projects/dormitory-system/manager-workbench.png",
      alt: "宿管工作台：日常入住登记、报修流转与晚归访客审计",
      width: 1440,
      height: 900,
    },
    {
      title: "学生服务中心",
      src: "/projects/dormitory-system/student-desk.png",
      alt: "学生个人工作台：我的宿舍、水电费用账单与在线报修申请",
      width: 1440,
      height: 900,
    },
  ],
  currentFocus: "优化晚归考勤模块与水电自动计费预警流程。",
};
