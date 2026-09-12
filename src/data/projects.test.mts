import assert from "node:assert/strict";
import test from "node:test";
import { DORMITORY_CATEGORIES, DORMITORY_SYSTEM_PROJECT, PROJECT_ARCHIVE_ITEMS } from "./projects.ts";

test("宿舍系统案例保持可核对的开发中状态与真实截图", () => {
  assert.equal(DORMITORY_SYSTEM_PROJECT.slug, "dormitory-system");
  assert.equal(DORMITORY_SYSTEM_PROJECT.status, "开发中");
  assert.equal(
    DORMITORY_SYSTEM_PROJECT.screenshots.length,
    DORMITORY_CATEGORIES.flatMap((category) => category.screenshots).length,
  );
  assert.deepEqual(
    DORMITORY_SYSTEM_PROJECT.workflows.map((item) => item.title),
    ["角色访问与鉴权", "学生综合服务", "楼栋运营枢纽", "全局资源管理"],
  );
  assert.ok(DORMITORY_SYSTEM_PROJECT.stack.includes("Spring Boot 3"));
  assert.ok(DORMITORY_SYSTEM_PROJECT.stack.includes("Vue 3"));
  assert.deepEqual(
    DORMITORY_SYSTEM_PROJECT.architecture.map((item) => item.title),
    ["表现层 (Vue 3 Client)", "业务层 (Spring Boot 3 API)", "数据层 (MySQL & MyBatis-Plus)"],
  );
  assert.equal(DORMITORY_SYSTEM_PROJECT.responsibilities.length, 4);
});

test("项目档案仅链接已公开的真实案例", () => {
  assert.equal(PROJECT_ARCHIVE_ITEMS.length, 5);
  assert.equal(PROJECT_ARCHIVE_ITEMS.filter((item) => item.status === "开发中").length, 1);
  assert.equal(PROJECT_ARCHIVE_ITEMS.filter((item) => item.status === "已完成").length, 1);
  assert.deepEqual(
    PROJECT_ARCHIVE_ITEMS.filter((item) => "href" in item && item.href).map((item) => item.id),
    ["dormitory-system", "k8s-gitops"],
  );
});
