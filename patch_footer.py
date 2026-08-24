import re

with open("src/components/site/Footer.tsx", "r", encoding="utf-8") as f:
    content = f.read()

nav_old = """const COLUMNS = [
  {
    title: "Viagens",
    links: [
      { to: "/pacotes", label: "Pacotes" },
      { to: "/hoteis", label: "Hotéis" },
      { to: "/voos", label: "Voos" },
      { to: "/ofertas", label: "Ofertas" },
    ],
  },"""

if "Hotéis" not in content: nav_old = nav_old.replace("Hotéis", "HotǸis")

nav_new = """const getColumns = (texts: any) => [
  {
    title: "Viagens",
    links: [
      { to: "/pacotes", label: getText(texts, "navPackages") },
      { to: "/hoteis", label: getText(texts, "navHotels") },
      { to: "/voos", label: getText(texts, "navFlights") },
      { to: "/ofertas", label: getText(texts, "navDeals") },
    ],
  },"""

content = content.replace(nav_old, nav_new)

content = content.replace(
    'const texts = settings?.siteTexts || {};',
    'const texts = settings?.siteTexts || {};\n  const COLUMNS = getColumns(texts);'
)

content = content.replace(
    'Central de ajuda\n              </Link>',
    '{getText(texts, "navSupport")}\n              </Link>'
)
content = content.replace(
    'Minhas viagens\n              </Link>',
    '{getText(texts, "navMyTrips")}\n              </Link>'
)
content = content.replace(
    'Área administrativa\n              </Link>',
    '{getText(texts, "navAdmin")}\n              </Link>'
)
content = content.replace(
    '?rea administrativa\n              </Link>',
    '{getText(texts, "navAdmin")}\n              </Link>'
)

with open("src/components/site/Footer.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
