import re
import os

def patch_loader(file_path, api_import, seed_array, fetch_func, return_fields):
    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    # Import
    if api_import not in content:
        content = content.replace(
            'import { notFound } from "@tanstack/react-router";',
            f'import {{ notFound }} from "@tanstack/react-router";\nimport {{ {fetch_func} }} from "@/api/catalog";'
        )
        content = content.replace(
            'import { createFileRoute, notFound } from "@tanstack/react-router";',
            f'import {{ createFileRoute, notFound }} from "@tanstack/react-router";\nimport {{ {fetch_func} }} from "@/api/catalog";'
        )

    # Loader
    pattern = r'loader:\s*\(\{\s*params\s*\}\)\s*=>\s*\{\s*const\s+\w+\s*=\s*' + seed_array + r'\.find\(\(\w+\)\s*=>\s*\w+\.slug\s*===\s*params\.slug\);\s*if\s*\(!\w+\)\s*throw\s*notFound\(\);\s*return\s*\{[^\}]+\};\s*\},'
    
    new_loader = f'''loader: async ({{ params }}) => {{
    const items = await {fetch_func}();
    const item = items.find((p: any) => p.slug === params.slug);
    if (!item) throw notFound();
    return {return_fields};
  }},'''

    content = re.sub(pattern, new_loader, content)
    
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

patch_loader("src/routes/hoteis.$slug.tsx", "getHotels", "seedHotels", "getHotels", "{ name: item.name, stars: item.stars, price: item.nightPrice }")
patch_loader("src/routes/destinos.$slug.tsx", "getDestinations", "seedDestinations", "getDestinations", "{ name: item.name, uf: item.uf }")
