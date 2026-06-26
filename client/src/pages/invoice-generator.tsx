import { useState, useEffect, useMemo } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Customer, type Product, type Settings, type InvoiceItem, type GSTBreakupItem, type InsertInvoice } from "@shared/schema";
import { Trash2, Plus } from "lucide-react";
import { useLocation } from "wouter";

export default function InvoiceGenerator() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [selectedCustomerId, setSelectedCustomerId] = useState("");
  const [priceMode, setPriceMode] = useState<"retail" | "wholesale">("retail");
  const [billPrefix, setBillPrefix] = useState("INV");
  const [billNumber, setBillNumber] = useState("0001");
  const [discount, setDiscount] = useState(0);
  const [items, setItems] = useState<InvoiceItem[]>([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const [quantity, setQuantity] = useState(1);

  const { data: customers = [] } = useQuery<Customer[]>({ queryKey: ["/api/customers"] });
  const { data: products = [] } = useQuery<Product[]>({ queryKey: ["/api/products"] });
  const { data: settings } = useQuery<Settings>({ queryKey: ["/api/settings"] });

  useEffect(() => {
    if (settings) {
      setBillPrefix(settings.billPrefix);
      setBillNumber(String(settings.nextBillNumber).padStart(4, '0'));
    }
  }, [settings]);

  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const addItem = () => {
    if (!selectedProductId) {
      toast({ title: "Please select a product", variant: "destructive" });
      return;
    }

    const product = products.find(p => p.id === selectedProductId);
    if (!product) return;

    if (quantity <= 0) {
      toast({ title: "Quantity must be greater than 0", variant: "destructive" });
      return;
    }

    const price = priceMode === "retail" ? product.retailPrice : product.wholesalePrice;
    const lineTotal = price * quantity;
    const gstAmount = (lineTotal * product.gstRate) / 100;
    const total = lineTotal + gstAmount;

    const newItem: InvoiceItem = {
      productId: product.id,
      productName: product.name,
      itemCode: product.itemCode,
      hsnCode: product.hsnCode,
      quantity,
      price,
      gstRate: product.gstRate,
      gstAmount,
      total,
    };

    setItems([...items, newItem]);
    setSelectedProductId("");
    setQuantity(1);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const calculations = useMemo(() => {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const totalGST = items.reduce((sum, item) => sum + item.gstAmount, 0);
    
    const isIGST = selectedCustomer?.gstin && 
      settings?.gstin && 
      selectedCustomer.gstin.substring(0, 2) !== settings.gstin.substring(0, 2);
    
    const cgst = isIGST ? 0 : totalGST / 2;
    const sgst = isIGST ? 0 : totalGST / 2;
    const igst = isIGST ? totalGST : 0;
    
    const beforeRoundOff = subtotal + totalGST - discount;
    const roundOff = Math.round(beforeRoundOff) - beforeRoundOff;
    const total = Math.round(beforeRoundOff);

    const gstBreakup: GSTBreakupItem[] = [];
    const rateGroups = new Map<number, { taxable: number; gst: number }>();
    
    items.forEach(item => {
      const taxableValue = item.price * item.quantity;
      const existing = rateGroups.get(item.gstRate) || { taxable: 0, gst: 0 };
      rateGroups.set(item.gstRate, {
        taxable: existing.taxable + taxableValue,
        gst: existing.gst + item.gstAmount,
      });
    });

    rateGroups.forEach((value, rate) => {
      gstBreakup.push({
        gstRate: rate,
        taxableValue: value.taxable,
        cgst: isIGST ? 0 : value.gst / 2,
        sgst: isIGST ? 0 : value.gst / 2,
        igst: isIGST ? value.gst : 0,
        totalTax: value.gst,
      });
    });

    return { subtotal, cgst, sgst, igst, roundOff, total, gstBreakup, isIGST };
  }, [items, discount, selectedCustomer, settings]);

  const createInvoiceMutation = useMutation({
    mutationFn: (data: InsertInvoice) => apiRequest("POST", "/api/invoices", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/invoices"] });
      queryClient.invalidateQueries({ queryKey: ["/api/settings"] });
      toast({ title: "Invoice created successfully" });
      setItems([]);
      setSelectedCustomerId("");
      setDiscount(0);
      setLocation("/history");
    },
  });

  const handleCreateInvoice = () => {
    if (!selectedCustomer) {
      toast({ title: "Please select a customer", variant: "destructive" });
      return;
    }

    if (items.length === 0) {
      toast({ title: "Please add at least one item", variant: "destructive" });
      return;
    }

    const invoiceData: InsertInvoice = {
      customerId: selectedCustomer.id,
      customerName: selectedCustomer.name,
      customerPhone: selectedCustomer.phone,
      customerAddress: selectedCustomer.address,
      customerGstin: selectedCustomer.gstin || undefined,
      items: JSON.stringify(items),
      subtotal: calculations.subtotal,
      cgst: calculations.cgst,
      sgst: calculations.sgst,
      igst: calculations.igst,
      discount,
      roundOff: calculations.roundOff,
      total: calculations.total,
      priceMode,
      gstBreakup: JSON.stringify(calculations.gstBreakup),
    };

    createInvoiceMutation.mutate(invoiceData);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-semibold">Create Invoice</h2>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Next Bill Number (Preview)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    value={`${billPrefix}${billNumber}`}
                    readOnly
                    className="bg-muted"
                    data-testid="input-bill-preview"
                  />
                  <p className="text-xs text-muted-foreground">Auto-generated by system</p>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  To change prefix or starting number, go to Settings
                </p>
              </div>

              <div className="space-y-2">
                <Label>Customer *</Label>
                <Select value={selectedCustomerId} onValueChange={setSelectedCustomerId}>
                  <SelectTrigger data-testid="select-customer">
                    <SelectValue placeholder="Select customer" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.phone}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                <div className="flex items-center gap-3">
                  <Label htmlFor="price-mode" className="text-sm font-medium">Price Mode:</Label>
                  <div className="flex items-center gap-2">
                    <span className={priceMode === "wholesale" ? "text-muted-foreground" : "font-medium"}>Retail</span>
                    <Switch
                      id="price-mode"
                      checked={priceMode === "wholesale"}
                      onCheckedChange={(checked) => setPriceMode(checked ? "wholesale" : "retail")}
                      data-testid="switch-price-mode"
                    />
                    <span className={priceMode === "retail" ? "text-muted-foreground" : "font-medium"}>Wholesale</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Add Products</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-[1fr_120px_100px] gap-4">
                <Select value={selectedProductId} onValueChange={setSelectedProductId}>
                  <SelectTrigger data-testid="select-product">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.id}>
                        {product.name} - ₹{priceMode === "retail" ? product.retailPrice : product.wholesalePrice}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                  placeholder="Qty"
                  min="1"
                  data-testid="input-quantity"
                />
                <Button onClick={addItem} className="w-full" data-testid="button-add-item">
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>

              {items.length > 0 && (
                <div className="border rounded-lg overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-muted">
                      <tr>
                        <th className="text-left py-2 px-3 text-sm font-medium">Product</th>
                        <th className="text-right py-2 px-3 text-sm font-medium">Qty</th>
                        <th className="text-right py-2 px-3 text-sm font-medium">Price</th>
                        <th className="text-right py-2 px-3 text-sm font-medium">GST</th>
                        <th className="text-right py-2 px-3 text-sm font-medium">Total</th>
                        <th className="text-right py-2 px-3 text-sm font-medium w-12"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item, index) => (
                        <tr key={index} className="border-t" data-testid={`row-invoice-item-${index}`}>
                          <td className="py-2 px-3 text-sm">
                            <div className="font-medium">{item.productName}</div>
                            <div className="text-xs text-muted-foreground">HSN: {item.hsnCode}</div>
                          </td>
                          <td className="py-2 px-3 text-sm text-right">{item.quantity}</td>
                          <td className="py-2 px-3 text-sm text-right">₹{item.price.toFixed(2)}</td>
                          <td className="py-2 px-3 text-sm text-right">
                            <div>{item.gstRate}%</div>
                            <div className="text-xs text-muted-foreground">₹{item.gstAmount.toFixed(2)}</div>
                          </td>
                          <td className="py-2 px-3 text-sm text-right font-medium">₹{item.total.toFixed(2)}</td>
                          <td className="py-2 px-3 text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeItem(index)}
                              data-testid={`button-remove-item-${index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>

          {calculations.gstBreakup.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>GST Breakup</CardTitle>
              </CardHeader>
              <CardContent>
                <table className="w-full">
                  <thead className="border-b">
                    <tr>
                      <th className="text-left py-2 px-3 text-sm font-medium">GST %</th>
                      <th className="text-right py-2 px-3 text-sm font-medium">Taxable Value</th>
                      {calculations.isIGST ? (
                        <th className="text-right py-2 px-3 text-sm font-medium">IGST</th>
                      ) : (
                        <>
                          <th className="text-right py-2 px-3 text-sm font-medium">CGST</th>
                          <th className="text-right py-2 px-3 text-sm font-medium">SGST</th>
                        </>
                      )}
                      <th className="text-right py-2 px-3 text-sm font-medium">Total Tax</th>
                    </tr>
                  </thead>
                  <tbody>
                    {calculations.gstBreakup.map((item, index) => (
                      <tr key={index} className="border-b">
                        <td className="py-2 px-3 text-sm">{item.gstRate}%</td>
                        <td className="py-2 px-3 text-sm text-right">₹{item.taxableValue.toFixed(2)}</td>
                        {calculations.isIGST ? (
                          <td className="py-2 px-3 text-sm text-right">₹{item.igst.toFixed(2)}</td>
                        ) : (
                          <>
                            <td className="py-2 px-3 text-sm text-right">₹{item.cgst.toFixed(2)}</td>
                            <td className="py-2 px-3 text-sm text-right">₹{item.sgst.toFixed(2)}</td>
                          </>
                        )}
                        <td className="py-2 px-3 text-sm text-right font-medium">₹{item.totalTax.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Invoice Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotal:</span>
                <span className="font-medium">₹{calculations.subtotal.toFixed(2)}</span>
              </div>
              
              {calculations.isIGST ? (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">IGST:</span>
                  <span className="font-medium">₹{calculations.igst.toFixed(2)}</span>
                </div>
              ) : (
                <>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">CGST:</span>
                    <span className="font-medium">₹{calculations.cgst.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">SGST:</span>
                    <span className="font-medium">₹{calculations.sgst.toFixed(2)}</span>
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label>Discount (₹)</Label>
                <Input
                  type="number"
                  step="0.01"
                  value={discount}
                  onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                  placeholder="0.00"
                  data-testid="input-discount"
                />
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Round Off:</span>
                <span className="font-medium">{calculations.roundOff >= 0 ? '+' : ''}{calculations.roundOff.toFixed(2)}</span>
              </div>

              <div className="pt-3 border-t">
                <div className="flex justify-between">
                  <span className="text-lg font-semibold">Total:</span>
                  <span className="text-2xl font-bold text-primary" data-testid="text-invoice-total">
                    ₹{calculations.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleCreateInvoice}
                disabled={!selectedCustomer || items.length === 0 || createInvoiceMutation.isPending}
                data-testid="button-create-invoice"
              >
                Create Invoice
              </Button>
            </CardContent>
          </Card>

          {selectedCustomer && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Customer Details</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <div className="font-medium">{selectedCustomer.name}</div>
                <div className="text-muted-foreground">{selectedCustomer.phone}</div>
                <div className="text-muted-foreground">{selectedCustomer.address}</div>
                {selectedCustomer.gstin && (
                  <div className="text-muted-foreground">GSTIN: {selectedCustomer.gstin}</div>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
