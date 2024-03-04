import { type Template as T, type TemplateKey } from "core/templates";
import { selector, selectorFamily, useRecoilValue } from "recoil";

export const Template = selectorFamily({
  key: "Template",
  get(id: TemplateKey) {
    return async function (ctx) {
      const templates = await ctx.get(TemplateList);
      return templates.find((x) => x.id === id) as T;
    };
  },
});

export const TemplateList = selector({
  key: "TemplateList",
  async get() {
    /* eslint-disable-next-line @typescript-eslint/no-unused-vars */
    const { default: _, ...templates } = await import("core/templates");
    return Object.keys(templates).map(
      (key) => templates[key as keyof typeof templates]
    );
  },
});

export function useTemplate(id: TemplateKey) {
  return useRecoilValue(Template(id));
}

export function useTemplateList() {
  return useRecoilValue(TemplateList);
}
