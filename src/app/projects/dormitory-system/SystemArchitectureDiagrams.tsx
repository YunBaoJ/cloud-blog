"use client";

import { useState } from "react";
import { 
  KeyRound, 
  ShieldCheck, 
  Workflow, 
  Database, 
  Copy, 
  Check, 
  ArrowRight, 
  Lock, 
  UserCheck, 
  GraduationCap, 
  Shield, 
  ArrowDown, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  FileCheck2,
  Server,
  Layers,
  Sparkles
} from "lucide-react";

export default function SystemArchitectureDiagrams() {
  const [activeTab, setActiveTab] = useState<"jwt" | "rbac" | "state" | "er">("jwt");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-10">
      
      {/* ======================= 1. 三端测试体验账号快捷复制 ======================= */}
      <div className="rounded-3xl border border-[var(--border-line-color)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-line-color)] pb-5">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-green)]">
              <KeyRound className="size-4" />
              <span>快速测试体验</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight">
              三端内置测试账号凭证
            </h3>
          </div>
          <p className="text-xs text-[var(--muted)]">
            点击账号卡片右侧按钮即可一键复制账号与密码
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* 学生测试账号 */}
          <div className="rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface-2)] p-5 space-y-3 relative group hover:border-[var(--accent-green)]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] px-2.5 py-0.5 text-xs font-semibold text-[#36513B] dark:text-[#7CD090]">
                <GraduationCap className="size-3.5" />
                <span>学生角色 (Student)</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--muted)]">权限: 个人服务台</span>
            </div>
            <div className="space-y-1 font-mono text-xs text-[var(--foreground)]">
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-line-color)]/60">
                <span className="text-[var(--muted)]">学号:</span>
                <span className="font-bold">20240001</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--muted)]">密码:</span>
                <span className="font-bold">123456</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("20240001", "student")}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[var(--surface)] ring-1 ring-[var(--border-line-color)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--accent-green)] hover:text-white transition-all cursor-pointer"
            >
              {copiedKey === "student" ? (
                <>
                  <Check className="size-3.5 text-green-500" />
                  <span>已复制学号</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>一键复制学号</span>
                </>
              )}
            </button>
          </div>

          {/* 宿管测试账号 */}
          <div className="rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface-2)] p-5 space-y-3 relative group hover:border-[var(--accent-green)]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] px-2.5 py-0.5 text-xs font-semibold text-[#36513B] dark:text-[#7CD090]">
                <UserCheck className="size-3.5" />
                <span>宿管角色 (Manager)</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--muted)]">权限: 楼栋工作台</span>
            </div>
            <div className="space-y-1 font-mono text-xs text-[var(--foreground)]">
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-line-color)]/60">
                <span className="text-[var(--muted)]">工号:</span>
                <span className="font-bold">manager1</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--muted)]">密码:</span>
                <span className="font-bold">123456</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("manager1", "manager")}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[var(--surface)] ring-1 ring-[var(--border-line-color)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--accent-green)] hover:text-white transition-all cursor-pointer"
            >
              {copiedKey === "manager" ? (
                <>
                  <Check className="size-3.5 text-green-500" />
                  <span>已复制工号</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>一键复制工号</span>
                </>
              )}
            </button>
          </div>

          {/* 管理员测试账号 */}
          <div className="rounded-2xl border border-[var(--border-line-color)] bg-[var(--surface-2)] p-5 space-y-3 relative group hover:border-[var(--accent-green)]/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-[#E2EBE4] dark:bg-[#23382C] px-2.5 py-0.5 text-xs font-semibold text-[#36513B] dark:text-[#7CD090]">
                <Shield className="size-3.5" />
                <span>超级管理员 (Admin)</span>
              </span>
              <span className="text-[10px] font-mono text-[var(--muted)]">权限: 全局中枢</span>
            </div>
            <div className="space-y-1 font-mono text-xs text-[var(--foreground)]">
              <div className="flex justify-between items-center py-1 border-b border-[var(--border-line-color)]/60">
                <span className="text-[var(--muted)]">账号:</span>
                <span className="font-bold">admin</span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-[var(--muted)]">密码:</span>
                <span className="font-bold">123456</span>
              </div>
            </div>
            <button
              type="button"
              onClick={() => handleCopy("admin", "admin")}
              className="w-full mt-2 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-[var(--surface)] ring-1 ring-[var(--border-line-color)] text-xs font-semibold text-[var(--foreground)] hover:bg-[var(--accent-green)] hover:text-white transition-all cursor-pointer"
            >
              {copiedKey === "admin" ? (
                <>
                  <Check className="size-3.5 text-green-500" />
                  <span>已复制超管账号</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>一键复制超管账号</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* ======================= 2. 交互式架构与时序图表 ======================= */}
      <div className="rounded-3xl border border-[var(--border-line-color)] bg-[var(--surface)] p-6 sm:p-8 shadow-sm space-y-6">
        
        {/* Top Control Tabs */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[var(--border-line-color)] pb-5">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold text-[var(--accent-green)]">
              <Layers className="size-4" />
              <span>架构深度可视化</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-[var(--foreground)] tracking-tight mt-1">
              核心机制与数据流转拓扑
            </h3>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5 rounded-2xl bg-[var(--surface-2)] p-1.5 ring-1 ring-[var(--border-line-color)]">
            <button
              type="button"
              onClick={() => setActiveTab("jwt")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "jwt"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              JWT 鉴权时序
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("rbac")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "rbac"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              RBAC 权限拓扑
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("state")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "state"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              报修状态机流转
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("er")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === "er"
                  ? "bg-[var(--surface)] text-[var(--foreground)] shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              核心 ER 数据模型
            </button>
          </div>
        </div>

        {/* Tab 1: JWT 鉴权时序图 */}
        {activeTab === "jwt" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-2xl bg-[var(--surface-2)] p-4 sm:p-6 border border-[var(--border-line-color)] space-y-4">
              <span className="text-xs font-mono font-bold text-[var(--accent-green)] uppercase tracking-wider block">
                [Sequence Diagram] JWT 无状态鉴权与双向 Token 校验机制
              </span>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
                
                <div className="rounded-xl bg-[var(--surface)] p-4 border border-[var(--border-line-color)] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[var(--accent-green)] text-white text-[10px]">1</span>
                    <span>Client 请求登录</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    用户提交身份 (role) + 学工号 + 密码至 <code>/api/auth/login</code>
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-4 border border-[var(--border-line-color)] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[var(--accent-green)] text-white text-[10px]">2</span>
                    <span>Spring Security 校验</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    BCrypt 密码比对，通过后签发包含 <code>userId, role</code> 的 HS256 JWT Token。
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-4 border border-[var(--border-line-color)] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[var(--accent-green)] text-white text-[10px]">3</span>
                    <span>前端存储与路由分发</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    Pinia 存储 Token，全局前置守卫 <code>beforeEach</code> 动态生成对应角色工作台。
                  </p>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-4 border border-[var(--border-line-color)] space-y-2">
                  <div className="flex items-center gap-2 font-bold text-[var(--foreground)]">
                    <span className="flex size-5 items-center justify-center rounded-full bg-[var(--accent-green)] text-white text-[10px]">4</span>
                    <span>Axios 拦截器透传</span>
                  </div>
                  <p className="text-[11px] text-[var(--muted)] leading-relaxed">
                    后续请求 Header 携带 <code>Authorization: Bearer Token</code>，网关统一过滤器鉴权。
                  </p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 2: RBAC 细粒度权限拓扑 */}
        {activeTab === "rbac" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-2xl bg-[var(--surface-2)] p-4 sm:p-6 border border-[var(--border-line-color)] space-y-4">
              <span className="text-xs font-mono font-bold text-[var(--accent-green)] uppercase tracking-wider block">
                [RBAC Hierarchy] 三层角色职责与资源访问权限树
              </span>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                
                {/* 管理员 */}
                <div className="rounded-xl bg-[var(--surface)] p-5 border-l-4 border-l-[#8C4A31] border border-[var(--border-line-color)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--foreground)] text-sm">超级管理员 (ROLE_ADMIN)</span>
                    <span className="font-mono text-[10px] text-[#8C4A31]">全域权限</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[var(--muted)]">
                    <li className="flex items-center gap-1.5">· 楼栋资产与房间床位拓扑配置</li>
                    <li className="flex items-center gap-1.5">· 用户账号状态与 RBAC 角色授权</li>
                    <li className="flex items-center gap-1.5">· 全校报修大盘与宏观统计报表</li>
                    <li className="flex items-center gap-1.5">· 操作安全审计日志与敏感操作回溯</li>
                  </ul>
                </div>

                {/* 宿管 */}
                <div className="rounded-xl bg-[var(--surface)] p-5 border-l-4 border-l-[#2A5270] border border-[var(--border-line-color)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--foreground)] text-sm">宿管主管/员 (ROLE_MANAGER)</span>
                    <span className="font-mono text-[10px] text-[#2A5270]">楼栋权限</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[var(--muted)]">
                    <li className="flex items-center gap-1.5">· 楼栋学生入住/退宿办理与房态看板</li>
                    <li className="flex items-center gap-1.5">· 设施报修审核、师傅指派与完工验收</li>
                    <li className="flex items-center gap-1.5">· 外来访客登记留痕与晚归考勤审计</li>
                    <li className="flex items-center gap-1.5">· 寝室卫生定期评分与水电账单催缴</li>
                  </ul>
                </div>

                {/* 学生 */}
                <div className="rounded-xl bg-[var(--surface)] p-5 border-l-4 border-l-[#36513B] border border-[var(--border-line-color)] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-[var(--foreground)] text-sm">在住学生 (ROLE_STUDENT)</span>
                    <span className="font-mono text-[10px] text-[#36513B]">个人服务</span>
                  </div>
                  <ul className="space-y-1.5 text-[11px] text-[var(--muted)]">
                    <li className="flex items-center gap-1.5">· 查看本寝室床位、室友档案与通知</li>
                    <li className="flex items-center gap-1.5">· 设施损坏拍照申报与工单实时追踪</li>
                    <li className="flex items-center gap-1.5">· 水电费用账单明细与缴费记录</li>
                    <li className="flex items-center gap-1.5">· 访客来访预约申请与宿舍调换申请</li>
                  </ul>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 3: 报修状态机流转闭环 */}
        {activeTab === "state" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-2xl bg-[var(--surface-2)] p-4 sm:p-6 border border-[var(--border-line-color)] space-y-4">
              <span className="text-xs font-mono font-bold text-[var(--accent-green)] uppercase tracking-wider block">
                [State Machine] 报修工单 5 节点全闭环状态机审批流
              </span>

              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                
                <div className="rounded-xl bg-[var(--surface)] p-3.5 border border-[var(--border-line-color)] text-center flex-1 w-full space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 text-[10px] font-bold">
                    PENDING (待审核)
                  </span>
                  <p className="text-[11px] text-[var(--muted)]">学生在线提交申报</p>
                </div>

                <ArrowRight className="size-4 text-[var(--muted)] shrink-0 hidden sm:block" />
                <ArrowDown className="size-4 text-[var(--muted)] shrink-0 block sm:hidden" />

                <div className="rounded-xl bg-[var(--surface)] p-3.5 border border-[var(--border-line-color)] text-center flex-1 w-full space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                    ASSIGNED (已派单)
                  </span>
                  <p className="text-[11px] text-[var(--muted)]">宿管审核并指派师傅</p>
                </div>

                <ArrowRight className="size-4 text-[var(--muted)] shrink-0 hidden sm:block" />
                <ArrowDown className="size-4 text-[var(--muted)] shrink-0 block sm:hidden" />

                <div className="rounded-xl bg-[var(--surface)] p-3.5 border border-[var(--border-line-color)] text-center flex-1 w-full space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 dark:bg-purple-950 dark:text-purple-300 text-[10px] font-bold">
                    PROCESSING (维修中)
                  </span>
                  <p className="text-[11px] text-[var(--muted)]">师傅上门更换配件</p>
                </div>

                <ArrowRight className="size-4 text-[var(--muted)] shrink-0 hidden sm:block" />
                <ArrowDown className="size-4 text-[var(--muted)] shrink-0 block sm:hidden" />

                <div className="rounded-xl bg-[var(--surface)] p-3.5 border border-[var(--border-line-color)] text-center flex-1 w-full space-y-1">
                  <span className="inline-block px-2 py-0.5 rounded-full bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-300 text-[10px] font-bold">
                    COMPLETED (已完成)
                  </span>
                  <p className="text-[11px] text-[var(--muted)]">学生验收并星级评价</p>
                </div>

              </div>
            </div>
          </div>
        )}

        {/* Tab 4: 核心 ER 数据模型 */}
        {activeTab === "er" && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="rounded-2xl bg-[var(--surface-2)] p-4 sm:p-6 border border-[var(--border-line-color)] space-y-4">
              <span className="text-xs font-mono font-bold text-[var(--accent-green)] uppercase tracking-wider block">
                [Entity-Relationship] 核心数据表设计与外键关联关系
              </span>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                
                <div className="rounded-xl bg-[var(--surface)] p-3.5 border border-[var(--border-line-color)] space-y-1 font-mono">
                  <span className="font-bold text-[var(--foreground)] block text-xs">sys_building</span>
                  <span className="text-[10px] text-[var(--muted)] block">楼宇资产表 (ID, 楼栋号, 层数, 宿管ID)</span>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-3.5 border border-[var(--border-line-color)] space-y-1 font-mono">
                  <span className="font-bold text-[var(--foreground)] block text-xs">sys_room</span>
                  <span className="text-[10px] text-[var(--muted)] block">房间床位表 (ID, 楼栋ID, 房间号, 床位数, 已住人数)</span>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-3.5 border border-[var(--border-line-color)] space-y-1 font-mono">
                  <span className="font-bold text-[var(--foreground)] block text-xs">sys_user</span>
                  <span className="text-[10px] text-[var(--muted)] block">用户核心表 (ID, 学工号, 密码, 角色, 房间ID)</span>
                </div>

                <div className="rounded-xl bg-[var(--surface)] p-3.5 border border-[var(--border-line-color)] space-y-1 font-mono">
                  <span className="font-bold text-[var(--foreground)] block text-xs">biz_repair</span>
                  <span className="text-[10px] text-[var(--muted)] block">报修工单表 (ID, 学生ID, 房间ID, 状态, 派单人)</span>
                </div>

              </div>
            </div>
          </div>
        )}

      </div>

    </div>
  );
}
