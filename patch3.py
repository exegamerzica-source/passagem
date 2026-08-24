import re
import sys

with open("src/routes/checkout.$slug.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Step 1
content = re.sub(
    r'if \(contact\.name\.trim\(\)\.length < 3\).*?errs\.push\([^)]+\);',
    'if (contact.name.trim().length < 3) errs.push("Informe o nome do responsável pela reserva.");\n      if (!validateCPF(contact.cpf)) errs.push("Informe um CPF válido para o responsável.");\n      if (!contact.cep || !contact.street || !contact.city || !contact.state) errs.push("Preencha o endereço completo.");',
    content
)

# Step 4
content = re.sub(
    r'if \(card\.number\.replace.*?errs\.push\([^)]+\);',
    'if (!validateLuhn(card.number)) errs.push("Número do cartão inválido.");',
    content
)

with open("src/routes/checkout.$slug.tsx", "w", encoding="utf-8") as f:
    f.write(content)
print("Done")
