import { describe, expect, it } from "vitest";
import { createPatientSchema } from "./booking-schema";

describe("createPatientSchema", () => {
  it("normalizes email to lowercase and trims whitespace", () => {
    const result = createPatientSchema.parse({
      name: "  Jitney Vim Sasil  ",
      phone: "09271121480",
      email: "  JitneyVim10@Gmail.com  ",
      treatment: "Other",
    });

    expect(result.email).toBe("jitneyvim10@gmail.com");
    expect(result.name).toBe("Jitney Vim Sasil");
  });
});
