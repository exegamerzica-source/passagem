export const defaultSiteTexts: Record<string, { label: string, default: string, isTextarea?: boolean }> = {
  navPackages: { label: "Navegação: Pacotes", default: "Pacotes" },
  navHotels: { label: "Navegação: Hotéis", default: "Hotéis" },
  navFlights: { label: "Navegação: Voos", default: "Voos" },
  navDeals: { label: "Navegação: Ofertas", default: "Ofertas" },
  navSupport: { label: "Navegação: Suporte", default: "Suporte" },
  navMyTrips: { label: "Navegação: Minhas Viagens", default: "Minhas viagens" },
  navLogin: { label: "Navegação: Entrar", default: "Entrar" },
  navAdmin: { label: "Navegação: Admin", default: "Área administrativa" },

  heroBadge: { label: "Hero: Selo Promoção", default: "🔥 Oferta Exclusiva" },
  heroTitle: { label: "Hero: Título Principal", default: "Viaje mais. Pague menos. Viva o melhor!" },
  heroSubtitle: { label: "Hero: Subtítulo", default: "Aproveite nossa promoção relâmpago. Garanta já a sua viagem com tudo incluso e pague em até 12x sem juros.", isTextarea: true },
  
  heroDefaultBadge: { label: "Hero (Sem Banner): Selo", default: "Mais de 320 mil viajantes atendidos" },
  heroDefaultTitle: { label: "Hero (Sem Banner): Título", default: "Sua próxima viagem começa com o melhor preço do Brasil" },
  heroDefaultSubtitle: { label: "Hero (Sem Banner): Subtítulo", default: "Pacotes com voo, hotel e traslado, hotéis auditados e voos nacionais. Reserve em minutos e pague em até 12x sem juros.", isTextarea: true },

  brandPromise: { label: "Faixa de Marca: Título", default: "Pra toda viagem. Pra vida toda." },
  brandStat1: { label: "Faixa de Marca: Estatística 1", default: "+320 mil viajantes" },
  brandStat2: { label: "Faixa de Marca: Estatística 2", default: "Hotéis selecionados" },
  brandStat3: { label: "Faixa de Marca: Estatística 3", default: "Voos garantidos" },
  brandStat4: { label: "Faixa de Marca: Estatística 4", default: "Traslado incluso" },

  whyBadge: { label: "Seção Por Quê: Tag", default: "Viaje com tranquilidade" },
  whyTitle: { label: "Seção Por Quê: Título", default: "Uma agência completa cuidando de cada detalhe" },
  whyDesc: { label: "Seção Por Quê: Descrição", default: "Da pesquisa ao retorno, a Voar Brasil acompanha sua viagem com estrutura de grande operadora e atendimento humano.", isTextarea: true },

  whyStat1Value: { label: "Seção Por Quê: Estatística 1 Valor", default: "320 mil" },
  whyStat1Label: { label: "Seção Por Quê: Estatística 1 Desc", default: "viajantes atendidos" },
  whyStat2Value: { label: "Seção Por Quê: Estatística 2 Valor", default: "4.8/5" },
  whyStat2Label: { label: "Seção Por Quê: Estatística 2 Desc", default: "satisfação dos clientes" },
  whyStat3Value: { label: "Seção Por Quê: Estatística 3 Valor", default: "1.200+" },
  whyStat3Label: { label: "Seção Por Quê: Estatística 3 Desc", default: "hotéis parceiros" },
  whyStat4Value: { label: "Seção Por Quê: Estatística 4 Valor", default: "18 anos" },
  whyStat4Label: { label: "Seção Por Quê: Estatística 4 Desc", default: "de mercado" },

  packagesTitle: { label: "Sessão Pacotes: Título", default: "Pacotes Nacionais" },
  packagesDesc: { label: "Sessão Pacotes: Subtítulo", default: "Voos e hospedagem com valores imperdíveis para você curtir o Brasil." },
  
  hotelsTitle: { label: "Sessão Hotéis: Título", default: "Hospedagens Incríveis" },
  hotelsDesc: { label: "Sessão Hotéis: Subtítulo", default: "Resorts all inclusive, pousadas charmosas e hotéis renomados." },

  destinationsTitle: { label: "Sessão Destinos: Título", default: "Principais Destinos" },
  destinationsDesc: { label: "Sessão Destinos: Subtítulo", default: "Onde você quer viver sua próxima história?" },

  checkoutTitle: { label: "Checkout: Título", default: "Resumo da reserva" },
  checkoutTravelers: { label: "Checkout: Viajantes", default: "Viajantes" },
  checkoutContact: { label: "Checkout: Contato", default: "Contato" },
  checkoutExtras: { label: "Checkout: Serviços Adicionais", default: "Serviços adicionais" },
  checkoutExtrasDesc: { label: "Checkout: Serviços Adicionais Desc", default: "Opcionais para deixar a viagem mais tranquila." },
  checkoutPassengers: { label: "Checkout: Passageiros", default: "Passageiros" },
  checkoutCoupon: { label: "Checkout: Cupom", default: "Cupom de desconto" },
  checkoutPaymentTitle: { label: "Checkout: Pagamento Título", default: "Pagamento" },
  checkoutPaymentTestEnv: { label: "Checkout: Aviso Teste", default: "Ambiente de teste: nenhuma cobrança real é feita e os dados do cartão são simulados." },
  checkoutPixText: { label: "Checkout: Texto Pix", default: "Faça o Pix para a chave acima e anexe o comprovante. A reserva fica pendente até a nossa verificação." },
  checkoutBoletoText: { label: "Checkout: Texto Boleto", default: "O boleto simulado vence em 1 dia útil. A reserva ficará com status pendente até a confirmação." },
  checkoutSecurityMsg: { label: "Checkout: Mensagem Segurança", default: "Pagamento protegido e reembolso garantido conforme política" },
  checkoutFinishBtn: { label: "Checkout: Botão Finalizar", default: "Finalizar Reserva Seguro" },

  footerAboutTitle: { label: "Rodapé: Sobre (Título)", default: "Sobre o Voar Brasil" },
  footerAboutText: { label: "Rodapé: Sobre (Texto)", default: "Sua agência de viagens digital focada em destinos incríveis pelo Brasil e pelo mundo.", isTextarea: true },
  footerCopy: { label: "Rodapé: Direitos Autorais", default: "© 2026 Voar Brasil Viagens e Turismo. Todos os direitos reservados." },
};

export function getText(texts: Record<string, string> | undefined, key: keyof typeof defaultSiteTexts) {
  if (!texts || texts[key] === undefined) return defaultSiteTexts[key]?.default ?? "";
  return texts[key];
}
