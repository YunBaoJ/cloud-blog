import assert from "node:assert/strict";
import test from "node:test";
import { RESUME_DATA } from "./resume.ts";

test("简历核心个人信息字段完整有效", () => {
  const { basicInfo } = RESUME_DATA;
  assert.equal(basicInfo.name, "孙乾云");
  assert.equal(basicInfo.phone, "15680339616");
  assert.equal(basicInfo.email, "2445686870@qq.com");
  assert.equal(basicInfo.photoUrl, "/resume-photo.jpg");
  assert.equal(basicInfo.pdfUrl, "/resume-sunqianyun.pdf");
  assert.ok(basicInfo.summary.length >= 3);
});

test("简历技能矩阵覆盖云计算、自动化与网络体系", () => {
  const { skills } = RESUME_DATA;
  assert.equal(skills.length, 4);
  const categories = skills.map((s) => s.category);
  assert.ok(categories.includes("云计算与系统架构"));
  assert.ok(categories.includes("脚本自动化编程"));
  assert.ok(categories.includes("数据库与计算机网络"));
  assert.ok(categories.includes("研发工具与 AI 赋能"));
});

test("简历项目经历关联完整技术实操并包含真实手册链接", () => {
  const { projects } = RESUME_DATA;
  assert.ok(projects.length >= 2);
  const k8sProj = projects.find((p) => p.name.includes("K8s"));
  assert.ok(k8sProj);
  assert.equal(k8sProj?.handbookHref, "/notes/k8s-gitops-handbook");
  assert.ok(k8sProj?.technologies.includes("Kubernetes v1.28"));
  assert.ok(k8sProj?.technologies.includes("ArgoCD"));
  assert.equal(k8sProj?.sections.length, 4);

  const openstackProj = projects.find((p) => p.name.includes("OpenStack"));
  assert.ok(openstackProj);
  assert.ok(openstackProj?.technologies.includes("OpenStack"));
  assert.equal(openstackProj?.sections.length, 3);
});
