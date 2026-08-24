import re

with open("src/components/site/Header.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add imports
content = content.replace(
    'import { Logo } from "./Logo";',
    'import { Logo } from "./Logo";\nimport { Route as rootRoute } from "@/routes/__root";\nimport { getText } from "@/data/texts";'
)

# Replace NAV array with a function that takes texts
nav_old = """const NAV = [
  { to: "/pacotes", label: "Pacotes" },
  { to: "/hoteis", label: "Hotéis" },
  { to: "/voos", label: "Voos" },
  { to: "/ofertas", label: "Ofertas" },
  { to: "/destinos", label: "Destinos" },
] as const;"""

if "Hotéis" not in content: nav_old = nav_old.replace("Hotéis", "HotǸis")

nav_new = """const getNav = (texts: any) => [
  { to: "/pacotes", label: getText(texts, "navPackages") },
  { to: "/hoteis", label: getText(texts, "navHotels") },
  { to: "/voos", label: getText(texts, "navFlights") },
  { to: "/ofertas", label: getText(texts, "navDeals") },
] as const;"""

content = content.replace(nav_old, nav_new)

# Add texts lookup inside Header component
content = content.replace(
    'const { user, logout } = useStore();',
    'const { user, logout } = useStore();\n  const { settings } = rootRoute.useLoaderData();\n  const texts = settings?.siteTexts || {};\n  const NAV = getNav(texts);'
)

# Replace static labels
replacements = {
    'Suporte': '{getText(texts, "navSupport")}',
    'Atendimento': '{getText(texts, "navSupport")}',
    'Minhas viagens': '{getText(texts, "navMyTrips")}',
    'Entrar ou cadastrar': '{getText(texts, "navLogin")}',
    'Painel administrativo': '{getText(texts, "navAdmin")}',
    'Área administrativa': '{getText(texts, "navAdmin")}'
}

# Be careful replacing, we only want to replace text inside React nodes.
# Let's replace manually the obvious ones
content = content.replace('Suporte\n            </Link>', '{getText(texts, "navSupport")}\n            </Link>')
content = content.replace('Atendimento\n            </Link>', '{getText(texts, "navSupport")}\n            </Link>')
content = content.replace('Minhas viagens\n            </Link>', '{getText(texts, "navMyTrips")}\n            </Link>')
content = content.replace('Entrar ou cadastrar</Link>', '{getText(texts, "navLogin")}</Link>')
content = content.replace('Entrar ou cadastrar\n                      </Link>', '{getText(texts, "navLogin")}\n                      </Link>')
content = content.replace('Painel administrativo</Link>', '{getText(texts, "navAdmin")}</Link>')

with open("src/components/site/Header.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
