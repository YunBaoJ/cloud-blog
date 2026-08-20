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
  "portfolio-archive": { footer: "内容组织", title: <>个人作品<br />归档工具</> },
  "linux-practice": { footer: "命令与排障", title: <>Linux<br />运维练习集</> },
  "service-observability": { footer: "可观测性", title: <>小型服务<br />监控面板</> },
  "next-record": { footer: "持续补充", title: <>下一件<br />待记录的事</> },
};

const COVER_IMAGES: Record<string, { src: string; position?: string }> = {
  "dormitory-system": { src: "/gallery/【搜图壁纸】四格-卡通.png", position: "object-center" },
  "portfolio-archive": { src: "/gallery/【哲风壁纸】剪影-壁纸-天空.png", position: "object-center" },
  "linux-practice": { src: "/gallery/【哲风壁纸】二次元-卡通.png", position: "object-center" },
  "service-observability": { src: "/gallery/【用户壁纸】持剑-黑发少女.jpg", position: "object-center" },
  "next-record": { src: "/gallery/【用户壁纸】蓝发-少女特写.jpg", position: "object-center" },
};

function ProjectCard({ item, liftOnHover = false, size = "home" }: { item: ProjectArchiveItem; liftOnHover?: boolean; size?: "home" | "index" }) {
  const details = CARD_DETAILS[item.id] ?? { footer: "持续记录", title: item.title };
  const cover = COVER_IMAGES[item.id];
  const isIndex = size === "index";
  const cardClass = `group relative block isolate ${isIndex ? "h-[292px] w-full max-w-[414px]" : "h-[250px] w-[350px] shrink-0"} overflow-hidden rounded-[22px] border border-[#26352A]/13 bg-[#FFFEF9] shadow-[0_19px_32px_rgba(38,53,42,0.15)] transition-[transform,box-shadow] duration-300 motion-reduce:transition-none ${
    liftOnHover ? "hover:-translate-y-2 hover:shadow-[0_28px_42px_rgba(38,53,42,0.2)]" : ""
  }`;

  const content = (
    <>
      <div className={`relative ${isIndex ? "h-[166px]" : "h-[142px]"} overflow-hidden bg-[#36513B]`}>
        {cover && <Image src={cover.src} alt="" fill sizes={isIndex ? "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 414px" : "350px"} className={`object-cover ${cover.position ?? "object-center"}`} />}
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(20,38,28,0.08),rgba(20,38,28,0.36))]" />
        <span className="absolute left-4 top-4 rounded-full bg-[#FFFEF9]/92 px-2.5 py-1 text-[10px] font-bold text-[#36513B] shadow-sm">
          {item.status}
        </span>
      </div>
      <div className={`flex ${isIndex ? "h-[126px] px-5 py-4" : "h-[108px] px-4 py-3.5"} flex-col justify-between bg-[#FFFEF9]`}>
        <div className="flex items-center justify-between gap-3 font-mono text-[10px] font-bold tracking-[0.1em] text-[#748176]">
          <span>{item.serial}</span>
          <span className="text-[#D79B7B]">{item.kind === "published" ? "OPEN" : "PLANNING"}</span>
        </div>
        <h3 className={`${isIndex ? "text-[21px]" : "text-[19px]"} font-semibold leading-tight tracking-[-0.04em] text-[#26352A]`}>{details.title}</h3>
        <div className="flex items-center justify-between border-t border-[#36513B]/12 pt-2 text-[11px] text-[#6D7C6E]">
          <span>{details.footer}</span>
          <span className="font-semibold text-[#36513B]">{item.href ? "查看 →" : "待续"}</span>
        </div>
      </div>
    </>
  );

  return item.href ? (
    <Link href={item.href} className={cardClass}>{content}</Link>
  ) : (
    <article className={cardClass} aria-label={`${item.title}，${item.status}`}>{content}</article>
  );
}

const STACK_POSITIONS = [
  "left-0 bottom-[54px] z-10 -rotate-[8deg] hover:z-[60] hover:-translate-y-5 hover:-rotate-[5deg]",
  "left-[18%] bottom-[54px] z-20 -rotate-[4deg] hover:z-[60] hover:-translate-y-5 hover:-rotate-[2deg]",
  "left-[36%] bottom-[54px] z-30 hover:z-[60] hover:-translate-y-6",
  "left-[54%] bottom-[54px] z-40 rotate-[4deg] hover:z-[60] hover:-translate-y-5 hover:rotate-[2deg]",
  "left-[72%] bottom-[54px] z-50 rotate-[8deg] hover:z-[60] hover:-translate-y-5 hover:rotate-[5deg]",
];

export default function ProjectArchiveStack({ items, variant = "home" }: ProjectArchiveStackProps) {
  if (variant === "index") {
    return <div className="grid justify-center gap-6 sm:grid-cols-2 xl:grid-cols-3">{items.map((item) => <ProjectCard key={item.id} item={item} liftOnHover size="index" />)}</div>;
  }

  return (
    <>
      <div className="relative mx-auto hidden h-[390px] max-w-[1180px] lg:block" aria-label="从左到右扇开的项目档案">
        <div className="pointer-events-none absolute inset-x-[8%] bottom-[35px] h-[46px] rounded-[50%] bg-[#304831]/14 blur-[18px]" aria-hidden="true" />
        {items.map((item, index) => (
          <div key={item.id} className={`absolute transition-transform duration-300 motion-reduce:transition-none ${STACK_POSITIONS[index]}`}>
            <ProjectCard item={item} />
          </div>
        ))}
      </div>
      <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-4 pr-[22%] lg:hidden">
        {items.map((item) => <div key={item.id} className="snap-start"><ProjectCard item={item} liftOnHover /></div>)}
      </div>
    </>
  );
}
