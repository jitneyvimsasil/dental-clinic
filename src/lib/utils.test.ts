import { describe, expect, it } from "vitest";
import { cn } from "./utils";

describe("test harness smoke check", () => {
  it("merges class names via the existing cn() helper", () => {
    expect(cn("a", false && "b", "c")).toBe("a c");
  });
});
