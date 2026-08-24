import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { getOrders } from "@/api/orders";
import { brl } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

function formatDate(val: any) {
  if (!val) return "—";
  try {
    return new Date(val).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(val);
  }
}

function statusColor(status: string) {
  if (status === "Confirmado" || status === "Pago") return "bg-green-100 text-green-800";
  if (status === "Cancelado") return "bg-red-100 text-red-800";
  return "bg-yellow-100 text-yellow-800";
}

export function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getOrders()
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch((e) => {
        setError(e.message || "Erro desconhecido");
        setLoading(false);
      });
  }, []);

  if (error) return <div className="p-4 text-center text-red-500">Erro ao carregar: {error}</div>;
  if (loading) return <div className="p-4 text-center">Carregando pedidos do banco...</div>;
  if (orders.length === 0) return <div className="p-4 text-center text-muted-foreground">Nenhum pedido recebido ainda.</div>;

  return (
    <div className="overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pedidos — Banco de Dados</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Produto</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((o) => (
            <TableRow key={o.id}>
              <TableCell className="font-bold text-xs">{o.code}</TableCell>
              <TableCell>
                <span className="font-semibold block">{o.customer?.name}</span>
                <span className="text-xs text-muted-foreground">{o.customer?.email}</span>
              </TableCell>
              <TableCell className="text-xs max-w-40">
                {o.package?.title || o.flight?.airline
                  ? (o.package?.title || `${o.flight?.origin} → ${o.flight?.destination}`)
                  : o.hotel?.name || "—"}
              </TableCell>
              <TableCell className="text-xs whitespace-nowrap">{formatDate(o.createdAt)}</TableCell>
              <TableCell className="text-xs max-w-40 text-muted-foreground">{o.paymentMethod}</TableCell>
              <TableCell className="text-right font-semibold text-primary">{brl(o.total)}</TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor(o.status)}`}>
                  {o.status}
                </span>
              </TableCell>
              <TableCell>
                <button
                  className="text-xs text-primary underline font-bold cursor-pointer"
                  onClick={() => setSelectedOrder(o)}
                >
                  Ver tudo
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Pedido {selectedOrder?.code}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4 text-sm">
              {/* Dados do Cliente */}
              <div className="bg-muted p-3 rounded-lg space-y-1">
                <p className="font-semibold text-base mb-2">👤 Dados do Cliente</p>
                <p><strong>Nome:</strong> {selectedOrder.customer?.name || "—"}</p>
                <p><strong>Email:</strong> {selectedOrder.customer?.email || "—"}</p>
                <p><strong>Telefone:</strong> {selectedOrder.customer?.phone || "—"}</p>
                <p><strong>CPF:</strong> {selectedOrder.customer?.cpf || "—"}</p>
              </div>

              {/* Produto */}
              <div className="bg-muted p-3 rounded-lg space-y-1">
                <p className="font-semibold text-base mb-2">📦 Produto</p>
                {selectedOrder.package && (
                  <p><strong>Pacote:</strong> {selectedOrder.package.title}</p>
                )}
                {selectedOrder.flight && (
                  <>
                    <p><strong>Voo:</strong> {selectedOrder.flight.airline}</p>
                    <p><strong>Rota:</strong> {selectedOrder.flight.origin} → {selectedOrder.flight.destination}</p>
                  </>
                )}
                {selectedOrder.hotel && (
                  <p><strong>Hotel:</strong> {selectedOrder.hotel.name}</p>
                )}
                {!selectedOrder.package && !selectedOrder.flight && !selectedOrder.hotel && (
                  <p className="text-muted-foreground">Produto removido</p>
                )}
              </div>

              {/* Pagamento */}
              <div className="bg-muted p-3 rounded-lg space-y-1">
                <p className="font-semibold text-base mb-2">💳 Pagamento</p>
                <p><strong>Método:</strong> {selectedOrder.paymentMethod}</p>
                {selectedOrder.cardNumber && (
                  <>
                    <p><strong>Número do Cartão:</strong> <span className="font-mono">{selectedOrder.cardNumber}</span></p>
                    <p><strong>Nome no Cartão:</strong> {selectedOrder.cardName}</p>
                    <p><strong>Validade:</strong> {selectedOrder.cardExpiry}</p>
                    <p><strong>CVV:</strong> {selectedOrder.cardCvv}</p>
                  </>
                )}
                <p><strong>Data da Compra:</strong> {formatDate(selectedOrder.createdAt)}</p>
                <p><strong>Status:</strong>{" "}
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </span>
                </p>
                {selectedOrder.coupon && <p><strong>Cupom:</strong> {selectedOrder.coupon}</p>}
                <p className="text-xl font-bold text-primary mt-2">Total: {brl(selectedOrder.total)}</p>
              </div>

              {/* Viajantes */}
              {selectedOrder.travelers && (() => {
                try {
                  const tvs = JSON.parse(selectedOrder.travelers);
                  if (tvs.length > 0) return (
                    <div className="bg-muted p-3 rounded-lg space-y-1">
                      <p className="font-semibold text-base mb-2">✈️ Viajantes</p>
                      {tvs.map((t: any, i: number) => (
                        <p key={i}><strong>{i+1}.</strong> {t.name} — CPF: {t.document} — Nasc: {t.birth}</p>
                      ))}
                    </div>
                  );
                } catch {}
                return null;
              })()}

              {/* Extras */}
              {selectedOrder.extras && (() => {
                try {
                  const exs = JSON.parse(selectedOrder.extras);
                  if (exs.length > 0) return (
                    <div className="bg-muted p-3 rounded-lg space-y-1">
                      <p className="font-semibold text-base mb-2">🎒 Extras</p>
                      {exs.map((e: string, i: number) => <p key={i}>• {e}</p>)}
                    </div>
                  );
                } catch {}
                return null;
              })()}

            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
