import re

with open("src/data/texts.ts", "r", encoding="utf-8") as f:
    content = f.read()

# Replace getText function
old_get_text = """export function getText(texts: Record<string, string> | undefined, key: keyof typeof defaultSiteTexts) {
  if (!texts) return defaultSiteTexts[key].default;
  return texts[key] !== undefined && texts[key] !== "" ? texts[key] : defaultSiteTexts[key].default;
}"""
new_get_text = """export function getText(texts: Record<string, string> | undefined, key: keyof typeof defaultSiteTexts) {
  if (!texts || texts[key] === undefined) return defaultSiteTexts[key]?.default ?? "";
  return texts[key];
}"""
content = content.replace(old_get_text, new_get_text)

# Add nav texts
nav_texts = """  navPackages: { label: "Navegação: Pacotes", default: "Pacotes" },
  navHotels: { label: "Navegação: Hotéis", default: "Hotéis" },
  navFlights: { label: "Navegação: Voos", default: "Voos" },
  navDeals: { label: "Navegação: Ofertas", default: "Ofertas" },
  navSupport: { label: "Navegação: Suporte", default: "Suporte" },
  navMyTrips: { label: "Navegação: Minhas Viagens", default: "Minhas viagens" },
  navLogin: { label: "Navegação: Entrar", default: "Entrar" },
  navAdmin: { label: "Navegação: Admin", default: "Área administrativa" },
"""

content = content.replace("export const defaultSiteTexts: Record<string, { label: string, default: string, isTextarea?: boolean }> = {", "export const defaultSiteTexts: Record<string, { label: string, default: string, isTextarea?: boolean }> = {\n" + nav_texts)

with open("src/data/texts.ts", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
