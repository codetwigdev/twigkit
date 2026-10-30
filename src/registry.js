// Every folder in src/tools/ that has an index.js is a tool. Drop a folder in
// and it shows up in the sidebar. Nothing else to register.
const modules = import.meta.glob('./tools/*/index.js', { eager: true })

export const tools = Object.values(modules)
  .map((m) => m.default)
  .sort((a, b) => a.name.localeCompare(b.name))
