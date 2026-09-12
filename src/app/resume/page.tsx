import type { Metadata } from "next";
import ResumeClient from "./ResumeClient";

export const metadata: Metadata = {
  title: "孙乾云 | 云计算运维工程师 / SRE 在线简历",
  description: "孙乾云的在线简历。专注于云计算运维与云原生 SRE，具备 Kubernetes、OpenStack 集群规划、网络调优与 GitOps 自动化交付实操经验。提供在线浏览、联系方式即点即拷与 PDF 导出。",
  openGraph: {
    title: "孙乾云 | 云计算运维工程师 / SRE 在线简历",
    description: "专注于云计算运维与云原生 SRE，具备 K8s、OpenStack、GitOps 自动化交付与 Linux 底层排障实操沉淀。",
  },
};

export default function ResumePage() {
  return <ResumeClient />;
}
