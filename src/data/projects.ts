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
      title: "界面层",
      description: "Vue 3、Vite、Pinia 与 Element Plus 承载三类角色的页面与状态展示。",
    },
    {
      title: "服务层",
      description: "Spring Boot 3 提供登录、权限与宿舍业务接口，并通过 JWT 校验访问身份。",
    },
    {
      title: "数据层",
      description: "MySQL 持久化用户、宿舍资源、报修、访客与公告等业务数据。",
    },
  ],
  responsibilities: [
    "AI 辅助项目：参与需求梳理与功能设计。",
    "在 AI 辅助下迭代，进行代码阅读与功能验证。",
    "参与问题排查，项目仍在开发中。",
  ],
  screenshots: [
    {
      src: "/projects/dormitory-system/login.png",
      alt: "智慧宿舍管理系统的登录页，包含角色选择与账号验证表单",
      width: 1440,
      height: 960,
    },
    {
      src: "/projects/dormitory-system/student-desk.png",
      alt: "学生端服务台，展示宿舍、报修、费用、公告与室友信息",
      width: 1440,
      height: 960,
    },
    {
      src: "/projects/dormitory-system/manager-workbench.png",
      alt: "宿管端工作台，展示入住、报修、访客与楼栋业务动态",
      width: 1440,
      height: 960,
    },
    {
      src: "/projects/dormitory-system/admin-overview.png",
      alt: "管理员端管理概览，展示资源分布与系统业务概览",
      width: 1440,
      height: 960,
    },
  ],
  currentFocus: "项目仍在开发中，当前持续完善多角色日常运营流程。",
};
