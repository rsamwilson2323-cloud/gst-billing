import { useQuery } from "@tanstack/react-query";
import { type Invoice, type InvoiceItem, type GSTBreakupItem, type Settings } from "@shared/schema";
import { format } from "date-fns";

interface PrintableInvoiceProps {
  invoice: Invoice;
}

export function PrintableInvoice({ invoice }: PrintableInvoiceProps) {
  const { data: settings } = useQuery<Settings>({
    queryKey: ["/api/settings"],
  });

  const items: InvoiceItem[] = JSON.parse(invoice.items);
  const gstBreakup: GSTBreakupItem[] = JSON.parse(invoice.gstBreakup);
  const isIGST = invoice.igst > 0;

  return (
    <div className="bg-white text-black p-8 max-w-4xl mx-auto print:p-6">
      <div className="border-2 border-black p-6">
        <div className="text-center border-b-2 border-black pb-4 mb-4">
          <h1 className="text-3xl font-bold uppercase">{settings?.shopName || "Shop Name"}</h1>
          <p className="text-sm mt-1">{settings?.address || "Shop Address"}</p>
          <p className="text-sm">Phone: {settings?.phone || "Phone"} | GSTIN: {settings?.gstin || "GSTIN"}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div>
            <h3 className="font-semibold text-sm mb-2 border-b border-black pb-1">Bill To:</h3>
            <p className="font-medium">{invoice.customerName}</p>
            <p className="text-sm">{invoice.customerPhone}</p>
            <p className="text-sm">{invoice.customerAddress}</p>
            {invoice.customerGstin && <p className="text-sm">GSTIN: {invoice.customerGstin}</p>}
          </div>
          <div className="text-right">
            <div className="border border-black p-3">
              <h3 className="font-semibold text-lg">Invoice No.</h3>
              <p className="text-2xl font-bold">{invoice.billNumber}</p>
              <p className="text-sm mt-2">Date: {format(new Date(invoice.createdAt), 'dd/MM/yyyy')}</p>
              <p className="text-sm">Time: {format(new Date(invoice.createdAt), 'hh:mm a')}</p>
            </div>
          </div>
        </div>

        <table className="w-full mb-6 border-collapse">
          <thead>
            <tr className="border-y-2 border-black">
              <th className="text-left py-2 px-2 text-sm">Sr.</th>
              <th className="text-left py-2 px-2 text-sm">Description</th>
              <th className="text-center py-2 px-2 text-sm">HSN</th>
              <th className="text-center py-2 px-2 text-sm">Qty</th>
              <th className="text-right py-2 px-2 text-sm">Rate</th>
              <th className="text-center py-2 px-2 text-sm">GST%</th>
              <th className="text-right py-2 px-2 text-sm">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={index} className="border-b border-gray-300">
                <td className="py-2 px-2 text-sm">{index + 1}</td>
                <td className="py-2 px-2 text-sm">
                  <div className="font-medium">{item.productName}</div>
                  <div className="text-xs text-gray-600">Code: {item.itemCode}</div>
                </td>
                <td className="py-2 px-2 text-sm text-center">{item.hsnCode}</td>
                <td className="py-2 px-2 text-sm text-center">{item.quantity}</td>
                <td className="py-2 px-2 text-sm text-right">₹{item.price.toFixed(2)}</td>
                <td className="py-2 px-2 text-sm text-center">{item.gstRate}%</td>
                <td className="py-2 px-2 text-sm text-right">₹{item.total.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="grid grid-cols-2 gap-8 mb-6">
          <div>
            <h3 className="font-semibold text-sm mb-2 border-b border-black pb-1">GST Summary</h3>
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-1">Rate</th>
                  <th className="text-right py-1">Taxable</th>
                  {isIGST ? (
                    <th className="text-right py-1">IGST</th>
                  ) : (
                    <>
                      <th className="text-right py-1">CGST</th>
                      <th className="text-right py-1">SGST</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody>
                {gstBreakup.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-1">{item.gstRate}%</td>
                    <td className="text-right py-1">₹{item.taxableValue.toFixed(2)}</td>
                    {isIGST ? (
                      <td className="text-right py-1">₹{item.igst.toFixed(2)}</td>
                    ) : (
                      <>
                        <td className="text-right py-1">₹{item.cgst.toFixed(2)}</td>
                        <td className="text-right py-1">₹{item.sgst.toFixed(2)}</td>
                      </>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div>
            <table className="w-full">
              <tbody>
                <tr className="border-b">
                  <td className="py-2 text-sm">Subtotal:</td>
                  <td className="py-2 text-sm text-right">₹{invoice.subtotal.toFixed(2)}</td>
                </tr>
                {isIGST ? (
                  <tr className="border-b">
                    <td className="py-2 text-sm">IGST:</td>
                    <td className="py-2 text-sm text-right">₹{invoice.igst.toFixed(2)}</td>
                  </tr>
                ) : (
                  <>
                    <tr className="border-b">
                      <td className="py-2 text-sm">CGST:</td>
                      <td className="py-2 text-sm text-right">₹{invoice.cgst.toFixed(2)}</td>
                    </tr>
                    <tr className="border-b">
                      <td className="py-2 text-sm">SGST:</td>
                      <td className="py-2 text-sm text-right">₹{invoice.sgst.toFixed(2)}</td>
                    </tr>
                  </>
                )}
                {invoice.discount > 0 && (
                  <tr className="border-b">
                    <td className="py-2 text-sm">Discount:</td>
                    <td className="py-2 text-sm text-right">-₹{invoice.discount.toFixed(2)}</td>
                  </tr>
                )}
                <tr className="border-b">
                  <td className="py-2 text-sm">Round Off:</td>
                  <td className="py-2 text-sm text-right">
                    {invoice.roundOff >= 0 ? '+' : ''}₹{invoice.roundOff.toFixed(2)}
                  </td>
                </tr>
                <tr className="border-t-2 border-black">
                  <td className="py-2 text-lg font-bold">Total:</td>
                  <td className="py-2 text-xl font-bold text-right">₹{invoice.total.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 mt-8 pt-6 border-t-2 border-black">
          <div>
            <p className="text-xs text-gray-600 mb-2">Terms & Conditions:</p>
            <p className="text-xs text-gray-600">1. Goods once sold will not be taken back.</p>
            <p className="text-xs text-gray-600">2. All disputes subject to local jurisdiction.</p>
          </div>
          <div className="text-right">
            <p className="text-sm font-semibold mb-8">For {settings?.shopName || "Shop Name"}</p>
            <div className="border-t border-black pt-2">
              <p className="text-sm">Authorized Signatory</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .print\\:block, .print\\:block * {
            visibility: visible;
          }
          .print\\:block {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
