import re
import sys

with open("src/routes/checkout.$slug.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# Add imports
imports = """import { Route as rootRoute } from "./__root";
import { getText } from "@/data/texts";
"""
content = content.replace('import { createOrder } from "@/api/orders";', 'import { createOrder } from "@/api/orders";\n' + imports)

# Add texts logic inside Checkout
content = content.replace(
    'const { packageBySlug, hotelBySlug, destinationBySlug, coupons } = useCatalog();',
    'const { packageBySlug, hotelBySlug, destinationBySlug, coupons } = useCatalog();\n  const { settings } = rootRoute.useLoaderData();\n  const texts = settings?.siteTexts || {};'
)

# Replacements
replacements = [
    ('Resumo da reserva', '{getText(texts, "checkoutTitle")}'),
    ('Viajantes<', '{getText(texts, "checkoutTravelers")}<'),
    ('Contato<', '{getText(texts, "checkoutContact")}<'),
    ('Serviços adicionais<', '{getText(texts, "checkoutExtras")}<'),
    ('Opcionais para deixar a viagem mais tranquila.', '{getText(texts, "checkoutExtrasDesc")}'),
    ('Passageiros<', '{getText(texts, "checkoutPassengers")}<'),
    ('Cupom de desconto<', '{getText(texts, "checkoutCoupon")}<'),
    ('Pagamento<', '{getText(texts, "checkoutPaymentTitle")}<'),
    ('Ambiente de teste: nenhuma cobrança real é feita e os dados do cartão são simulados.', '{getText(texts, "checkoutPaymentTestEnv")}'),
    ('Faça o Pix para a chave acima e anexe o comprovante. A reserva fica pendente até a nossa verificação.', '{getText(texts, "checkoutPixText")}'),
    ('O boleto simulado vence em 1 dia útil. A reserva ficará com status pendente até a confirmação.', '{getText(texts, "checkoutBoletoText")}'),
    ('Pagamento protegido e reembolso garantido conforme política', '{getText(texts, "checkoutSecurityMsg")}'),
    ('Finalizar Reserva Seguro', '{getText(texts, "checkoutFinishBtn")}'),
]

for old, new in replacements:
    content = content.replace(old, new)

with open("src/routes/checkout.$slug.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Patched.")
