import { describe, expect, it } from "vitest";

import { resolveStaticNoteLocalePath } from "./staticNoteLocale";

describe("static fall-recruiting note locales", () => {
  it("keeps the existing Simplified Chinese URL and selects static locale siblings", () => {
    expect(resolveStaticNoteLocalePath("fall-recruiting/autumn-recruitment-roadmap.md", "cn"))
      .toBe("fall-recruiting/autumn-recruitment-roadmap.md");
    expect(resolveStaticNoteLocalePath("fall-recruiting/autumn-recruitment-roadmap.md", "tw"))
      .toBe("fall-recruiting/autumn-recruitment-roadmap.tw.md");
    expect(resolveStaticNoteLocalePath("fall-recruiting/autumn-recruitment-roadmap.md", "en"))
      .toBe("fall-recruiting/autumn-recruitment-roadmap.en.md");
  });

  it("does not rewrite content outside the pilot subject", () => {
    expect(resolveStaticNoteLocalePath("python/getting-started.md", "en"))
      .toBe("python/getting-started.md");
  });
});
