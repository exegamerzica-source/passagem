import re
import sys

# Update validations.ts
with open("src/lib/validations.ts", "a", encoding="utf-8") as f:
    f.write("\nexport function formatCPF(v: string): string {\n  v = v.replace(/\D/g, '');\n  if (v.length > 11) v = v.slice(0, 11);\n  v = v.replace(/(\\d{3})(\\d)/, '$1.$2');\n  v = v.replace(/(\\d{3})(\\d)/, '$1.$2');\n  v = v.replace(/(\\d{3})(\\d{1,2})$/, '$1-$2');\n  return v;\n}\n")

# Update checkout.$slug.tsx
with open("src/routes/checkout.$slug.tsx", "r", encoding="utf-8") as f:
    content = f.read()

content = content.replace(
    'import { validateCPF, validateLuhn } from "@/lib/validations";',
    'import { validateCPF, validateLuhn, formatCPF } from "@/lib/validations";'
)

content = content.replace(
    'document: e.target.value',
    'document: formatCPF(e.target.value)'
)

content = content.replace(
    'cpf: e.target.value',
    'cpf: formatCPF(e.target.value)'
)

# Also let's scroll to top when there are errors
# Find: setErrors(errs);
# Add window.scrollTo
content = content.replace(
    'setErrors(errs);\n      return errs.length === 0;',
    'setErrors(errs);\n      if (errs.length > 0) window.scrollTo({ top: 0, behavior: "smooth" });\n      return errs.length === 0;'
)


with open("src/routes/checkout.$slug.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
