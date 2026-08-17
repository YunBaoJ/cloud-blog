import assert from "node:assert/strict";
import test from "node:test";
import { DORMITORY_SYSTEM_PROJECT } from "./projects.ts";

test("宿舍系统案例保持可核对的开发中状态与真实截图", () => {
  assert.equal(DORMITORY_SYSTEM_PROJECT.slug, "dormitory-system");
  assert.equal(DORMITORY_SYSTEM_PROJECT.status, "开发中");
  assert.equal(DORMITORY_SYSTEM_PROJECT.screenshots.length, 4);
  assert.deepEqual(
    DORMITORY_SYSTEM_PROJECT.workflows.map((item) => item.title),
    ["角色访问", "学生服务", "宿舍运营", "管理维护"],
  );
  assert.ok(DORMITORY_SYSTEM_PROJECT.stack.includes("Spring Boot 3"));
  assert.ok(DORMITORY_SYSTEM_PROJECT.stack.includes("Vue 3"));
  assert.deepEqual(
    DORMITORY_SYSTEM_PROJECT.architecture.map((item) => item.title),
    ["界面层", "服务层", "数据层"],
  );
  assert.equal(DORMITORY_SYSTEM_PROJECT.responsibilities.length, 3);
});
