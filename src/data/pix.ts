/** Dados da conta Pix usada para recebimento das reservas. */
export const PIX_ACCOUNT = {
  key: "11992013539",
  keyLabel: "(11) 99201-3539",
  keyType: "Telefone",
  holder: "VASTOMIX LTDA",
  bank: "Pix • Instituição de pagamento",
} as const;

/** Limite para guardar o arquivo do comprovante (≈2MB em base64). */
export const PROOF_MAX_BYTES = 2 * 1024 * 1024;
