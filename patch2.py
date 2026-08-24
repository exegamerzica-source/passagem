import re
import sys

with open("src/routes/checkout.$slug.tsx", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Imports
content = content.replace(
    'import { createOrder } from "@/api/orders";',
    'import { createOrder } from "@/api/orders";\nimport { validateCPF, validateLuhn } from "@/lib/validations";'
)

# 2. Contact state
content = content.replace(
    'const [contact, setContact] = useState({ email: user?.email ?? "", phone: "", name: user?.name ?? "", cpf: "" });',
    'const [contact, setContact] = useState({ email: user?.email ?? "", phone: "", name: user?.name ?? "", cpf: "", cep: "", street: "", neighborhood: "", city: "", state: "" });'
)

# 3. Add handleCep to Checkout component
cep_logic = """
  const handleCep = async (cepVal: string) => {
    const rawCep = cepVal.replace(/\D/g, '');
    setContact(prev => ({ ...prev, cep: cepVal }));
    if (rawCep.length === 8) {
      try {
        const res = await fetch(`https://viacep.com.br/ws/${rawCep}/json/`);
        const data = await res.json();
        if (!data.erro) {
          setContact(prev => ({
            ...prev,
            street: data.logradouro || '',
            neighborhood: data.bairro || '',
            city: data.localidade || '',
            state: data.uf || ''
          }));
        }
      } catch (e) {
        console.error("CEP fetch failed", e);
      }
    }
  };
"""
content = content.replace('const [proof, setProof] = useState<PaymentProof | null>(null);', 'const [proof, setProof] = useState<PaymentProof | null>(null);\n' + cep_logic)

# 4. CPF validations in step 0
old_step0 = 'if (t.document.replace(/\\D/g, "").length < 11) errs.push(`Informe um CPF válido para o viajante ${i + 1}.`);'
if old_step0 not in content: old_step0 = old_step0.replace('válido', 'vlido')
if old_step0 not in content: old_step0 = old_step0.replace('vlido', 'vǭlido')
new_step0 = 'if (!validateCPF(t.document)) errs.push(`Informe um CPF válido para o viajante ${i + 1}.`);'
content = content.replace(old_step0, new_step0)

# 5. CPF validation in step 1
old_step1 = 'if (contact.cpf.replace(/\\D/g, "").length < 11) errs.push("Informe um CPF válido.");'
if old_step1 not in content: old_step1 = old_step1.replace('válido', 'vlido')
if old_step1 not in content: old_step1 = old_step1.replace('vlido', 'vǭlido')
new_step1 = 'if (!validateCPF(contact.cpf)) errs.push("Informe um CPF válido para o responsável.");\n      if (!contact.cep || !contact.street || !contact.city || !contact.state) errs.push("Preencha o endereço completo.");'
content = content.replace(old_step1, new_step1)

# 6. Luhn validation in step 4
old_step4 = 'if (card.number.length < 14) errs.push("Número do cartão inválido.");'
if old_step4 not in content: old_step4 = old_step4.replace('Número do cartão inválido', 'Nǧmero do cartǜo invǭlido')
new_step4 = 'if (!validateLuhn(card.number)) errs.push("Número do cartão inválido.");'
content = content.replace(old_step4, new_step4)

# 7. Add CEP UI
cep_ui = """
                    <div className="sm:col-span-2 grid gap-4 grid-cols-2 mt-4 pt-4 border-t border-border">
                      <div className="col-span-2">
                        <Label className="mb-1.5 text-xs font-semibold">Endereço de Cobrança</Label>
                      </div>
                      <div>
                        <Label htmlFor="cep" className="mb-1.5 text-xs font-semibold">CEP</Label>
                        <Input id="cep" value={contact.cep} onChange={(e) => handleCep(e.target.value)} placeholder="00000-000" />
                      </div>
                      <div className="col-span-1">
                        <Label htmlFor="street" className="mb-1.5 text-xs font-semibold">Rua</Label>
                        <Input id="street" value={contact.street} onChange={(e) => setContact({ ...contact, street: e.target.value })} />
                      </div>
                      <div>
                        <Label htmlFor="neighborhood" className="mb-1.5 text-xs font-semibold">Bairro</Label>
                        <Input id="neighborhood" value={contact.neighborhood} onChange={(e) => setContact({ ...contact, neighborhood: e.target.value })} />
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <Label htmlFor="city" className="mb-1.5 text-xs font-semibold">Cidade</Label>
                          <Input id="city" value={contact.city} onChange={(e) => setContact({ ...contact, city: e.target.value })} />
                        </div>
                        <div>
                          <Label htmlFor="state" className="mb-1.5 text-xs font-semibold">Estado</Label>
                          <Input id="state" value={contact.state} onChange={(e) => setContact({ ...contact, state: e.target.value })} />
                        </div>
                      </div>
                    </div>
"""
# Insert after cpf input
cpf_input = 'onChange={(e) => setContact({ ...contact, cpf: e.target.value })}\n                      />\n                    </div>'
content = content.replace(cpf_input, cpf_input + cep_ui)


with open("src/routes/checkout.$slug.tsx", "w", encoding="utf-8") as f:
    f.write(content)

print("Done")
