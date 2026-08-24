import re

with open("src/routes/checkout.$slug.tsx", "r", encoding="utf-8") as f:
    content = f.read()

target = r"""                      <Input
                        id="tel"
                        value={contact.phone}
                        inputMode="tel"
                        placeholder="(11) 90000-0000"
                        onChange={(e) => setContact({ ...contact, phone: e.target.value })}
                      />
                    </div>"""

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
                    </div>"""

if target in content:
    content = content.replace(target, target + cep_ui)
    with open("src/routes/checkout.$slug.tsx", "w", encoding="utf-8") as f:
        f.write(content)
    print("Done")
else:
    print("Target not found")
