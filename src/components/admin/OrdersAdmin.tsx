import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { getOrders } from "@/api/orders";
import { brl, dateBR } from "@/lib/format";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function OrdersAdmin() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  useEffect(() => {
    getOrders().then(data => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-4 text-center">Carregando pedidos reais do banco...</div>;

  if (orders.length === 0) return <div className="p-4 text-center text-muted-foreground">Nenhum pedido recebido ainda.</div>;

  return (
    <div className="surface-card overflow-x-auto p-4">
      <h2 className="text-xl font-bold mb-4">Pedidos Conectados ao Neon</h2>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Cdigo</TableHead>
            <TableHead>Cliente (Real)</TableHead>
            <TableHead>Data</TableHead>
            <TableHead>Pagamento</TableHead>
            <TableHead className="text-right">Total</TableHead>
            <TableHead>Status</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((b) => (
            <TableRow key={b.id}>
              <TableCell className="font-bold">{b.code}</TableCell>
              <TableCell>
                <span className="font-semibold">{b.customer?.name}</span>
                <br />
                <span className="text-xs text-muted-foreground">{b.customer?.email}</span>
              </TableCell>
              <TableCell className="text-xs">{dateBR(b.createdAt)}</TableCell>
              <TableCell className="max-w-48 text-xs text-muted-foreground">{b.paymentMethod}</TableCell>
              <TableCell className="text-right font-semibold text-primary">{brl(b.total)}</TableCell>
              <TableCell>
                <Select value={b.status} disabled>
                  <SelectTrigger className="w-36">
                    <SelectValue />
                  </SelectTrigger>
                </Select>
              </TableCell>
              <TableCell>
                <button 
                  className="text-xs text-primary underline font-bold cursor-pointer"
                  onClick={() => setSelectedOrder(b)}
                >
                  Ver tudo
                </button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Detalhes do Pedido {selectedOrder?.code}</DialogTitle>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-4">
              <div className="bg-secondary p-3 rounded text-sm">
                <p><strong>Cliente:</strong> {selectedOrder.customer?.name}</p>
                <p><strong>Email:</strong> {selectedOrder.customer?.email}</p>
                <p><strong>Telefone:</strong> {selectedOrder.customer?.phone || 'N/A'}</p>
                <p><strong>CPF:</strong> {selectedOrder.customer?.cpf || 'N/A'}</p>
              </div>
              <div className="bg-secondary p-3 rounded text-sm">
                <p><strong>Produto:</strong> {selectedOrder.package?.title || 'Produto Removido'}</p>
                <p><strong>Data da Compra:</strong> {dateBR(selectedOrder.createdAt)}</p>
                <p><strong>Mtodo Pagto:</strong> {selectedOrder.paymentMethod}</p>
                <p className="text-lg font-bold text-primary mt-2">Total: {brl(selectedOrder.total)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
