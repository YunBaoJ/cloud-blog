import assert from "node:assert/strict";
import test from "node:test";
import {
  appendGameRecord,
  clampGameVolume,
  resolveGamePlaybackVolume,
  type GameRecord,
} from "./gameRecords.mts";

const record = (id: string): GameRecord => ({
  id,
  gameId: "snake",
  gameName: "贪吃蛇",
  result: `${id} 分`,
  playedAt: "2026-08-14T00:00:00.000Z",
});

test("appendGameRecord keeps newest records first and respects the limit", () => {
  assert.deepEqual(
    appendGameRecord([record("2"), record("1")], record("3"), 2).map(({ id }) => id),
    ["3", "2"],
  );
});

test("clampGameVolume keeps persisted volume in the supported range", () => {
  assert.equal(clampGameVolume(-1), 0);
  assert.equal(clampGameVolume(0.45), 0.45);
  assert.equal(clampGameVolume(2), 1);
  assert.equal(clampGameVolume(Number.NaN), 0.8);
});

test("game sound gain remains audible at the default preference", () => {
  assert.ok(Math.abs(resolveGamePlaybackVolume(0.36, 0.8) - 0.6912) < Number.EPSILON);
  assert.equal(resolveGamePlaybackVolume(0.78, 0.8), 1);
});
