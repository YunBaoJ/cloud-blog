import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import type { ProjectArchiveItem } from "@/data/projects";

interface ProjectArchiveStackProps {
  items: readonly ProjectArchiveItem[];
  variant?: "home" | "index";
}

const CARD_DETAILS: Record<string, { footer: string; title: ReactNode }> = {
  "dormitory-system": { footer: "Vue · Spring Boot", title: <>智慧宿舍管理系统</> },
  "k8s-gitops": { footer: "K8s · GitOps · Prometheus", title: <>K8s 云原生与<br />GitOps 交付平台</> },
  "portfolio-archive": { footer: "内容组织", title: <>个人作品<br />归档工具</> },
  "linux-practice": { footer: "命令与排障", title: <>Linux<br />运维练习集</> },
  "service-observability": { footer: "可观测性", title: <>小型服务<br />监控面板</> },
  "next-record": { footer: "持续补充", title: <>下一件<br />待记录的事</> },
};

const COVER_IMAGES: Record<string, { src: string; position?: string }> = {
  "dormitory-system": { src: "/gallery/【搜图壁纸】四格-卡通.png", position: "object-center" },
  "k8s-gitops": { src: "/projects/k8s-gitops/01-grafana-cluster-dashboard.png", position: "object-center" },
  "portfolio-archive": { src: "/gallery/【哲风壁纸】剪影-壁纸-天空.png", position: "object-center" },
  "linux-practice": { src: "/gallery/【哲风壁纸】二次元-卡通.png", position: "object-center" },
  "service-observability": { src: "/gallery/【用户壁纸】持剑-黑发少女.jpg", position: "object-center" },
  "next-record": { src: "/gallery/【用户壁纸】蓝发-少女特写.jpg", position: "object-center" },
};

function ProjectCard({ item, size = "home" }: { item: ProjectArchiveItem; size?: "home" | "index" }) {
  const details = CARD_DETAILS[item.id] ?? { footer: "持续记录", title: item.title };
  const cover = COVER_IMAGES[item.id];
  const isIndex = size === "index";
  const cardClass = `group relative block isolate ${
    isIndex ? "h-[292px] w-full max-w-[414px]" : "h-[250px] w-[350px] shrink-0"
  } overflow-hidden rounded-3xl border border-[#26352A]/13 bg-[#FFFEF9] shadow-[0_19px_32px_rgba(38,53,42,0.15)] transition-[box-shadow,border-color] duration-300 motion-safe:hover:border-[#36513B]/35 motion-safe:hover:shadow-[0_26px_42px_rgba(38,53,42,0.22)] motion-reduce:transition-none`;

  const content = (
    <>
      <div className={`relative ${isIndex ? "h-[166px]" : "h-[142px]"} overflow-hidden bg-[#36513B]`}>
        {cover && (
          <Image
            src={cover.src}
            alt=""
            fill
            sizes={isIndex ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 414px" : "350px"}
            className={`object-cover transition-transform duration-500 ease-out motion-safe:group-hover:scale-[1.06] ${cover.position ?? "object-center"}`}
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,28,0.08),rgba(20,38,28,0.36))] transition-opacity duration-300 motion-safe:group-hover:opacity-70" />
        <span className="absolute left-4 top-4 rounded-full bg-[#FFFEF9]/92 px-2.5 py-1 text-[10px] font-bold text-[#36513B] shadow-sm transition-transform duration-300 motion-safe:group-hover:translate-x-1">
          {item.status}
        </span>
      </div>
      <div className={`flex ${isIndex ? "h-[126px] px-5 py-4" : "h-[108px] px-4 py-3.5"} flex-col justify-between bg-[#FFFEF9]`}>
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] font-bold tracking-[0.1em] text-[#748176]">
          <span>{item.serial}</span>
          <span className="text-[#D79B7B]">{item.kind === "published" ? "OPEN" : "PLANNING"}</span>
        </div>
        <h3 className={`${isIndex ? "text-[21px]" : "text-[19px]"} font-semibold leading-tight tracking-[-0.04em] text-[#26352A]`}>
          {details.title}
        </h3>
        <div className="flex items-center justify-between border-t border-[#36513B]/12 pt-2 text-[11px] text-[#6D7C6E]">
          <span>{details.footer}</span>
          <span className="font-semibold text-[#36513B]">{item.href ? "查看 →" : "待续"}</span>
        </div>
      </div>
    </>
  );

  return item.href ? (
    <Link href={item.href} className={cardClass}>
      {content}
    </Link>
  ) : (
    <article className={cardClass} aria-label={`${item.title}，${item.status}`}>
      {content}
    </article>
  );
}

// 5 张卡片的精确扇形定位与动效参数（与原版 100% 相同）
const FAN_STACK_CONFIGS = [
  {
    slotClass: "left-0 bottom-[54px] z-10 hover:z-[60]",
    motionClass: "-rotate-[8deg] group-hover:-rotate-[5deg] group-hover:-translate-y-5",
  },
  {
    slotClass: "left-[18%] bottom-[54px] z-20 hover:z-[60]",
    motionClass: "-rotate-[4deg] group-hover:-rotate-[2deg] group-hover:-translate-y-5",
  },
  {
    slotClass: "left-[36%] bottom-[54px] z-30 hover:z-[60]",
    motionClass: "rotate-0 group-hover:-translate-y-6",
  },
  {
    slotClass: "left-[54%] bottom-[54px] z-40 hover:z-[60]",
    motionClass: "rotate-[4deg] group-hover:rotate-[2deg] group-hover:-translate-y-5",
  },
  {
    slotClass: "left-[72%] bottom-[54px] z-50 hover:z-[60]",
    motionClass: "rotate-[8deg] group-hover:rotate-[5deg] group-hover:-translate-y-5",
  },
];

export default function ProjectArchiveStack({ items, variant = "home" }: ProjectArchiveStackProps) {
  if (variant === "index") {
    return (
      <div className="grid justify-center gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="transition-transform duration-300 hover:-translate-y-2">
            <ProjectCard item={item} size="index" />
          </div>
        ))}
      </div>
    );
  }

  return (
    <>
      {/* 桌面端：采用与画廊完全相同的“静止外层槽位 + 内层承载扇形动效”架构，彻底消除边缘闪烁 */}
      <div
        className="relative mx-auto hidden h-[390px] max-w-[1180px] lg:block select-none"
        aria-label="从左到右扇开的项目档案"
      >
        <div
          className="pointer-events-none absolute inset-x-[8%] bottom-[35px] h-[46px] rounded-[50%] bg-[#304831]/14 blur-[18px]"
          aria-hidden="true"
        />

        {items.map((item, index) => {
          const config = FAN_STACK_CONFIGS[index % FAN_STACK_CONFIGS.length];
          return (
            <div
              key={item.id}
              className={`group absolute block cursor-pointer isolate ${config.slotClass}`}
            >
              {/* 不可见安全扩充层：与画廊一模一样，确保鼠标在卡片边缘永远不会丢失命中区域 */}
              <div className="absolute -inset-4 pointer-events-auto" aria-hidden="true" />

              {/* 内层卡片：承载原本 100% 相同的扇形倾角与浮升动效 */}
              <div
                className={`relative transition-all duration-300 ease-out transform motion-reduce:transition-none group-hover:shadow-[0_28px_48px_rgba(38,53,42,0.22)] rounded-3xl ${config.motionClass}`}
              >
                <ProjectCard item={item} />
              </div>
            </div>
          );
        })}
      </div>

      {/* 移动端水平滚动 */}
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-[22%] lg:hidden">
        {items.map((item) => (
          <div key={item.id} className="snap-start">
            <ProjectCard item={item} />
          </div>
        ))}
      </div>
    </>
  );
}
