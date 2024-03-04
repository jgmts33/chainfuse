export function toShortId(name: string, trim = true) {
  return name
    .toLowerCase()
    .replace(/[^a-zA-Z0-9-]/g, "-")
    .replace(/^-+/, "")
    .replace(/--+/g, "-")
    .replace(trim ? /-+$/ : "", "");
}
