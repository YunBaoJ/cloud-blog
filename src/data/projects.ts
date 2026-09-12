export interface ProjectCategory {
  id: string;
  name: string;
  tag: string;
  path: string;
  techStack: string;
  highlights: readonly string[];
  screenshots: readonly {
    title: string;
    subTitle: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
}

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
  categories: readonly ProjectCategory[];
  screenshots: readonly {
    title?: string;
    src: string;
    alt: string;
    width: number;
    height: number;
  }[];
  currentFocus: string;
}

export interface ProjectArchiveItem {
  id: string;
  serial: string;
  title: string;
  summary: string;
  status: "开发中" | "已完成" | "筹备中" | "留白";
  kind: "published" | "planning" | "notebook";
  href?: string;
}

export const DORMITORY_CATEGORIES: readonly ProjectCategory[] = [
  {
    id: "login",
    name: "统一身份认证登录",
    tag: "安全网关",
    path: "/login",
    techStack: "Spring Security / JWT / BCrypt 加密 / 动态路由分发",
    highlights: [
      "学生、宿管与管理员三端统一切换入口，表单防抖校验",
      "基于 JWT 的无状态鉴权与双向 Token 校验机制",
      "按角色自动定向至对应专属动态工作台，防止未授权越权",
    ],
    screenshots: [
      {
        title: "学生登录认证",
        subTitle: "学号验证",
        src: "/projects/dormitory-system/login-student.png",
        alt: "统一身份认证 - 学生角色登录入口，提供学号与密码快速验证",
        width: 1440,
        height: 900,
      },
      {
        title: "宿管登录认证",
        subTitle: "工号验证",
        src: "/projects/dormitory-system/login-manager.png",
        alt: "统一身份认证 - 宿管员角色登录入口，支持楼栋专属权限绑定",
        width: 1440,
        height: 900,
      },
      {
        title: "管理员登录认证",
        subTitle: "超管入口",
        src: "/projects/dormitory-system/login-admin.png",
        alt: "统一身份认证 - 系统超级管理员入口，掌控全站资源配置权限",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    id: "student",
    name: "学生个人服务台",
    tag: "学生中心",
    path: "/student/desk",
    techStack: "Vue 3 / Element Plus / 响应式布局 / 步骤条进度流",
    highlights: [
      "寝室床位、水电费用账单明细与室友通讯录实时互通",
      "在线拍照报修申请与工单派单进度实时追踪",
      "宿舍调换申请、访客进出预约与智慧 AI 生活助手",
    ],
    screenshots: [
      {
        title: "学生工作台总览",
        subTitle: "个人中心",
        src: "/projects/dormitory-system/student-desk.png",
        alt: "学生服务台 - 个人宿舍信息、室友概况、费用统计与最新通知看板",
        width: 1440,
        height: 900,
      },
      {
        title: "我的寝室与室友",
        subTitle: "寝室档案",
        src: "/projects/dormitory-system/student-dorm.png",
        alt: "学生服务台 - 宿舍详细成员信息、床位分布与寝室互动",
        width: 1440,
        height: 900,
      },
      {
        title: "在线报修申请",
        subTitle: "报修追踪",
        src: "/projects/dormitory-system/student-repair.png",
        alt: "学生服务台 - 设施损坏申报表单与工单流转实时状态条",
        width: 1440,
        height: 900,
      },
      {
        title: "水电费用账单",
        subTitle: "费用明细",
        src: "/projects/dormitory-system/student-fees.png",
        alt: "学生服务台 - 水电用量、历史账单明细与在线快捷缴费记录",
        width: 1440,
        height: 900,
      },
      {
        title: "访客登记预约",
        subTitle: "访客预约",
        src: "/projects/dormitory-system/student-visitor.png",
        alt: "学生服务台 - 外来亲友来访登记预约与出入审批记录",
        width: 1440,
        height: 900,
      },
      {
        title: "宿舍调换申请",
        subTitle: "调宿办理",
        src: "/projects/dormitory-system/student-transfer.png",
        alt: "学生服务台 - 跨楼栋/跨房间调宿原因申报与审批流程",
        width: 1440,
        height: 900,
      },
      {
        title: "智慧 AI 助理",
        subTitle: "生活助手",
        src: "/projects/dormitory-system/student-ai.png",
        alt: "学生服务台 - 基于大模型的校园宿舍生活问答与智能指引助手",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    id: "manager",
    name: "宿管日常工作台",
    tag: "楼栋运营",
    path: "/dormmanager/workbench",
    techStack: "状态机审批流 / 房态图谱 / 批量表格处理 / WebSocket",
    highlights: [
      "实时入住、退宿办理与房态空闲/满员即时变色看板",
      "学生报修工单接单、流转、指派与完成状态归档",
      "外来访客进出留痕登记与夜间晚归异常考勤记录",
    ],
    screenshots: [
      {
        title: "宿管工作台总览",
        subTitle: "日常总览",
        src: "/projects/dormitory-system/manager-workbench.png",
        alt: "宿管日常工作台 - 楼栋入住率、待办报修与今日访客实时统计看板",
        width: 1440,
        height: 900,
      },
      {
        title: "入住与退宿管理",
        subTitle: "入住登记",
        src: "/projects/dormitory-system/manager-checkin.png",
        alt: "宿管日常工作台 - 新生入住登记、床位分配与毕业生退宿办理",
        width: 1440,
        height: 900,
      },
      {
        title: "报修处理与派单",
        subTitle: "工单调度",
        src: "/projects/dormitory-system/manager-repair.png",
        alt: "宿管日常工作台 - 学生报修工单审核、师傅派单与完工确认",
        width: 1440,
        height: 900,
      },
      {
        title: "访客出入留痕",
        subTitle: "访客留痕",
        src: "/projects/dormitory-system/manager-visitor.png",
        alt: "宿管日常工作台 - 进出人员身份证登记、出入时间与事由留痕",
        width: 1440,
        height: 900,
      },
      {
        title: "晚归考勤审计",
        subTitle: "考勤记录",
        src: "/projects/dormitory-system/manager-latereturn.png",
        alt: "宿管日常工作台 - 门禁晚归刷卡记录与考勤异常预警",
        width: 1440,
        height: 900,
      },
      {
        title: "寝室卫生评比",
        subTitle: "卫生检查",
        src: "/projects/dormitory-system/manager-hygiene.png",
        alt: "宿管日常工作台 - 定期寝室卫生检查打分与文明宿舍评比",
        width: 1440,
        height: 900,
      },
      {
        title: "调宿审批流转",
        subTitle: "调宿审核",
        src: "/projects/dormitory-system/manager-transfer.png",
        alt: "宿管日常工作台 - 调宿申请核验、目标床位空闲校验与房态更新",
        width: 1440,
        height: 900,
      },
      {
        title: "水电计费催缴",
        subTitle: "水电催缴",
        src: "/projects/dormitory-system/manager-fee.png",
        alt: "宿管日常工作台 - 楼栋宿舍水电用量监控与欠费催缴通知",
        width: 1440,
        height: 900,
      },
    ],
  },
  {
    id: "admin",
    name: "系统管理员中枢",
    tag: "全局中枢",
    path: "/admin/overview",
    techStack: "RBAC 权限模型 / ECharts 大屏看板 / MyBatis-Plus / 审计日志",
    highlights: [
      "全校楼宇、楼层与宿舍床位资源可视化拓扑分布",
      "RBAC 细粒度角色与系统运维操作日志全流程审计",
      "全站数据报表聚合，支持多条件筛选与批量导出",
    ],
    screenshots: [
      {
        title: "管理员总览大屏",
        subTitle: "全局看板",
        src: "/projects/dormitory-system/admin-overview.png",
        alt: "系统管理员中枢 - 全校宿舍资源、总人数、报修趋势与资产统计大屏",
        width: 1440,
        height: 900,
      },
      {
        title: "楼宇资产拓扑",
        subTitle: "楼栋配置",
        src: "/projects/dormitory-system/admin-buildings.png",
        alt: "系统管理员中枢 - 楼栋新增、层数结构与宿管分配管理",
        width: 1440,
        height: 900,
      },
      {
        title: "房间与床位分配",
        subTitle: "床位调度",
        src: "/projects/dormitory-system/admin-rooms.png",
        alt: "系统管理员中枢 - 房间类型、床位数、价格与批量生成配置",
        width: 1440,
        height: 900,
      },
      {
        title: "用户角色与权限",
        subTitle: "权限管理",
        src: "/projects/dormitory-system/admin-users.png",
        alt: "系统管理员中枢 - RBAC 角色授权、账号禁用与密码重置",
        width: 1440,
        height: 900,
      },
      {
        title: "全校维修调度",
        subTitle: "维修调度",
        src: "/projects/dormitory-system/admin-repairs.png",
        alt: "系统管理员中枢 - 全校报修工单大盘监控与维保效率分析",
        width: 1440,
        height: 900,
      },
      {
        title: "综合数据报表",
        subTitle: "统计报表",
        src: "/projects/dormitory-system/admin-reports.png",
        alt: "系统管理员中枢 - 住宿率、水电消耗、违纪与报修数据多维报表",
        width: 1440,
        height: 900,
      },
      {
        title: "操作审计日志",
        subTitle: "安全审计",
        src: "/projects/dormitory-system/admin-logs.png",
        alt: "系统管理员中枢 - 系统关键操作记录、IP 追踪与安全审计日志",
        width: 1440,
        height: 900,
      },
    ],
  },
];

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
      title: "角色访问与鉴权",
      description: "通过 JWT 校验与动态角色路由，区分学生、宿管和管理员入口。",
    },
    {
      title: "学生综合服务",
      description: "学生端提供个人宿舍档案、室友通讯、报修申报、费用账单、访客预约与调宿申请。",
    },
    {
      title: "楼栋运营枢纽",
      description: "宿管端聚合入住退宿、报修流转、卫生检查、访客留痕、晚归考勤与水电催缴等日常工作。",
    },
    {
      title: "全局资源管理",
      description: "管理员端提供楼宇床位拓扑、用户权限体系、全校维修大盘、数据报表与操作审计日志。",
    },
  ],
  architecture: [
    {
      title: "表现层 (Vue 3 Client)",
      description: "Element Plus + Pinia + Vue Router 构建的三端响应式工作台，26+ 页面全闭环。",
    },
    {
      title: "业务层 (Spring Boot 3 API)",
      description: "RESTful API 契约设计，统一全局异常捕获、JWT 鉴权拦截与业务分发处理。",
    },
    {
      title: "数据层 (MySQL & MyBatis-Plus)",
      description: "ORM 映射、多表联查、分页查询与状态流转审计日志持久化记录。",
    },
  ],
  responsibilities: [
    "负责整体系统需求梳理与 RBAC 权限模型设计",
    "独立实现基于 Spring Boot 3 的后端 RESTful 接口体系与鉴权中间件",
    "负责 Vue 3 + Element Plus 的三端动态路由渲染与表单验证交互",
    "设计规范化的接口错误码标准与脱敏数据响应模型",
  ],
  categories: DORMITORY_CATEGORIES,
  screenshots: DORMITORY_CATEGORIES.flatMap((c) => c.screenshots),
  currentFocus: "优化晚归考勤模块与水电自动计费预警流程。",
};

export const PROJECT_ARCHIVE_ITEMS = [
  {
    id: "dormitory-system",
    serial: "CASE 01 / IN PROGRESS",
    title: "智慧宿舍管理系统",
    summary: "多角色宿舍日常管理与服务流程整理。",
    status: "开发中",
    kind: "published",
    href: "/projects/dormitory-system",
  },
  {
    id: "k8s-gitops",
    serial: "CASE 02 / PUBLISHED",
    title: "K8s 云原生与 GitOps 交付平台",
    summary: "多节点 K8s v1.28 集群、Calico CNI、NFS 存储、Prometheus 监控与 ArgoCD 持续交付闭环。",
    status: "已完成",
    kind: "published",
    href: "/notes/k8s-gitops-handbook",
  },
  {
    id: "hexo-blog",
    serial: "CASE 03 / PUBLISHED",
    title: "初代 Hexo 博客与演进复盘",
    summary: "大一时期个人技术原点，涵盖 Linux 系统运维基础与静态博客架构演进。",
    status: "已完成",
    kind: "published",
    href: "/notes/from-hexo-to-nextjs-retrospective",
  },
  {
    id: "service-observability",
    serial: "CASE 04 / PLANNING",
    title: "小型服务监控面板",
    summary: "用于练习服务观察与状态呈现的计划。",
    status: "筹备中",
    kind: "planning",
  },
  {
    id: "next-record",
    serial: "CASE 05 / NOTEBOOK",
    title: "下一件待记录的事",
    summary: "为下一段真实实践预留的位置。",
    status: "留白",
    kind: "notebook",
  },
] as const satisfies readonly ProjectArchiveItem[];
