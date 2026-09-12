export interface ResumeBasicInfo {
  name: string;
  title: string;
  graduationStatus: string;
  birth: string;
  location: string;
  phone: string;
  email: string;
  photoUrl: string;
  pdfUrl: string;
  summary: readonly string[];
}

export interface ResumeSkillItem {
  name: string;
  desc: string;
}

export interface ResumeSkillCategory {
  category: string;
  tag: string;
  items: readonly ResumeSkillItem[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  major: string;
  period: string;
  badge: string;
  highlights: readonly string[];
}

export interface ResumeProjectSection {
  title: string;
  details: string;
}

export interface ResumeProject {
  name: string;
  role: string;
  period: string;
  technologies: readonly string[];
  handbookHref?: string;
  sections: readonly ResumeProjectSection[];
}

export interface ResumeData {
  basicInfo: ResumeBasicInfo;
  skills: readonly ResumeSkillCategory[];
  education: readonly ResumeEducation[];
  projects: readonly ResumeProject[];
}

export const RESUME_DATA: ResumeData = {
  basicInfo: {
    name: "孙乾云",
    title: "云计算运维工程师 / SRE / 云平台运维工程师",
    graduationStatus: "27届应届生",
    birth: "2003/03",
    location: "四川 · 成都",
    phone: "15680339616",
    email: "2445686870@qq.com",
    photoUrl: "/resume-photo.jpg",
    pdfUrl: "/resume-sunqianyun.pdf",
    summary: [
      "专注于云计算运维与云原生 SRE 方向，具备 Kubernetes、OpenStack 集群规划、网络调优与 GitOps 自动化交付实操经验；",
      "熟练使用 Shell/Python 编写自动化运维与巡检脚本；擅长 Linux 底层网络排错与可观测性建设，注重运维排障沉淀；",
      "具备良好的抗压与自主解决问题能力。",
    ],
  },
  skills: [
    {
      category: "云计算与系统架构",
      tag: "Cloud & OS",
      items: [
        { name: "Linux 系统运维", desc: "熟练掌握 Linux 常用命令与系统运维；具备基础环境配置、日常故障排查与性能调优能力。" },
        { name: "OpenStack 云平台", desc: "具备 OpenStack 云平台部署实操经验；深入理解 Nova、Neutron、Cinder 等核心组件联调与虚机生命周期。" },
        { name: "Docker 与 Kubernetes", desc: "掌握 Docker、Kubernetes 基础环境部署与日常资源调度管理，具备常见服务排错能力。" },
        { name: "容器与底层虚拟化", desc: "了解 Containerd 运行时替代机制、Calico CNI 网络插件与底层 KVM 虚拟化原理。" },
      ],
    },
    {
      category: "脚本自动化编程",
      tag: "Automation",
      items: [
        { name: "Python 自动化", desc: "掌握 Python 基础语法与常用模块，可快速编写日常自动化运维与集群巡检脚本。" },
        { name: "Shell 脚本", desc: "熟悉 Shell 脚本编写，能完成环境初始化、日志分析与服务器批量化任务处理。" },
      ],
    },
    {
      category: "数据库与计算机网络",
      tag: "Network & DB",
      items: [
        { name: "计算机网络", desc: "熟悉计算机网络基础协议，掌握常见网络排查命令与抓包排障（ping、netstat、iptables、tcpdump 等）。" },
        { name: "MySQL 基础运维", desc: "掌握 MySQL 基础运维管理、数据表 SQL 查询操作与定期数据备份还原策略。" },
      ],
    },
    {
      category: "研发工具与 AI 赋能",
      tag: "Tools & AI",
      items: [
        { name: "Git 版本控制", desc: "熟练使用 Git 进行日常代码版本管理与分支协作。" },
        { name: "容器应用部署", desc: "熟悉常见中间件与容器应用的部署配置、挂载与生命周期纳管。" },
        { name: "AI 效能工程", desc: "善于借助 AI 生产力工具辅助排查系统深层报错、快速编写运维排障脚本与梳理技术文档。" },
      ],
    },
  ],
  education: [
    {
      school: "四川大学锦江学院",
      degree: "本科",
      major: "人工智能",
      period: "2025/09 - 2027/06",
      badge: "GPA：前 5%",
      highlights: [
        "主修课程：计算机网络、云计算与虚拟化技术、数据库原理",
        "统招专升本在读，系统化强化人工智能与分布式系统理论支撑",
      ],
    },
    {
      school: "四川邮电职业技术学院",
      degree: "专科",
      major: "云计算技术应用",
      period: "2022/09 - 2025/06",
      badge: "GPA：前 1%（专业顶尖）",
      highlights: [
        "专业顶尖学业表现，荣获校级一等奖学金 2 次、二等奖学金 2 次",
        "主修/实操：主导完成校内私有云平台搭建，完成多套虚拟化与容器环境部署、调优与功能测试",
      ],
    },
  ],
  projects: [
    {
      name: "企业级 K8s 平台构建与 GitOps 交付实践",
      role: "云原生平台运维",
      period: "2024/10 - 2024/12",
      handbookHref: "/notes/k8s-gitops-handbook",
      technologies: [
        "Kubernetes v1.28",
        "Containerd",
        "Calico CNI",
        "Helm 3",
        "NFS StorageClass",
        "Prometheus",
        "Grafana",
        "ArgoCD",
      ],
      sections: [
        {
          title: "集群架构与运行时调优",
          details:
            "以 Containerd 替代传统 Docker 运行时，调优 SystemdCgroup 及 pause 镜像国内分发机制；基于 kubeadm 规划部署 3 节点集群，启用内核网络转发与 IPVS 负载代理，显著降低 Pod 转发延迟。",
        },
        {
          title: "CNI 网络与动态存储（CSI）",
          details:
            "部署 Calico 网络插件，精细规划 Pod CIDR 以规避物理网段冲突；搭建 NFS-Subdir-External-Provisioner 动态存储供给器，独立定位并修复 RBAC 权限缺失引发的 Leader 选举死锁，实现持久化卷秒级自动绑定。",
        },
        {
          title: "全链路可观测性与压测闭环",
          details:
            "通过 Helm 部署 kube-prometheus-stack，对接 Node-Exporter 物理指标与 K8s 对象状态；定制 Grafana 统一监控看板，设计 CPU/内存高水位告警规则；部署多线程高负载 Pod 验证指标采集与告警状态流转。",
        },
        {
          title: "GitOps 持续交付与自愈",
          details:
            "部署 ArgoCD 搭建声明式持续交付流水线，构建内网私有代码仓库突破 DNS 污染；实现代码配置提交后 10 秒内集群自动感知、滚动发布与自动化故障自愈（Self-Healing）。",
        },
      ],
    },
    {
      name: "OpenStack 私有云平台构建与网络高可用排障",
      role: "云平台运维工程师",
      period: "2024/09 - 2024/12",
      technologies: [
        "Linux",
        "OpenStack",
        "KVM 虚拟化",
        "Neutron 网络",
        "Cinder 存储",
        "OVS",
      ],
      sections: [
        {
          title: "私有云环境规划",
          details:
            "主导 OpenStack 云平台实验环境的部署，完成 Nova 计算、Neutron 网络与 Cinder 存储核心组件的配置与联调，纳管底层 KVM 虚拟化资源，实现多租户虚机秒级创建与全生命周期管理。",
        },
        {
          title: "网络与存储故障排查",
          details:
            "深入调试 Neutron OVS 网络架构，运用 iptables 与抓包工具定位并解决跨节点 VXLAN 隧道通信中断、DHCP 无法分配 IP 等网络链路故障；完成 iSCSI/Cinder 存储卷挂载稳定性调优。",
        },
        {
          title: "自动化与运维文档",
          details:
            "编写 Shell 自动化巡检脚本，定期捕获异常状态虚机；梳理并沉淀 3 万字《OpenStack 架构部署与高频排错手册》。",
        },
      ],
    },
  ],
};
