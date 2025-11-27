import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CreditCard, Download, Users, Calendar, DollarSign } from "lucide-react";
import { mockBillingInfo } from "@/data/mockAdminData";
import { useToast } from "@/hooks/use-toast";

export function BillingTab() {
  const { toast } = useToast();
  const [managePlanOpen, setManagePlanOpen] = useState(false);
  const billing = mockBillingInfo;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleDownloadInvoice = (invoiceId: string) => {
    toast({
      title: "Download Started",
      description: `Downloading ${invoiceId}... (mock)`,
    });
  };

  return (
    <div className="space-y-6">
      {/* Billing Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Billing Overview
              </CardTitle>
              <CardDescription>
                Manage your AVIR subscription and billing details
              </CardDescription>
            </div>
            <Button onClick={() => setManagePlanOpen(true)}>Manage Plan</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Plan</p>
              <p className="text-xl font-semibold">{billing.planName}</p>
              <Badge
                variant="secondary"
                className={`${
                  billing.status === "Active"
                    ? "bg-green-100 text-green-800"
                    : "bg-red-100 text-red-800"
                }`}
              >
                {billing.status}
              </Badge>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Users className="h-4 w-4" />
                Seats
              </p>
              <p className="text-xl font-semibold">
                {billing.seatsUsed} / {billing.totalSeats}
              </p>
              <p className="text-xs text-muted-foreground">
                {billing.totalSeats - billing.seatsUsed} available
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <DollarSign className="h-4 w-4" />
                Monthly Price
              </p>
              <p className="text-xl font-semibold">
                {formatCurrency(billing.monthlyPrice)}
              </p>
              <p className="text-xs text-muted-foreground">per month</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Next Billing
              </p>
              <p className="text-xl font-semibold">{billing.nextBillingDate}</p>
              <p className="text-xs text-muted-foreground">auto-renewal</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Invoices */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>View and download past invoices</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Invoice
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Period
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Amount
                  </th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">
                    Status
                  </th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">
                    Download
                  </th>
                </tr>
              </thead>
              <tbody>
                {billing.invoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b last:border-0">
                    <td className="py-4 px-4 font-medium">{invoice.id}</td>
                    <td className="py-4 px-4 text-muted-foreground">
                      {invoice.period}
                    </td>
                    <td className="py-4 px-4">
                      {formatCurrency(invoice.amount)}
                    </td>
                    <td className="py-4 px-4">
                      <Badge
                        variant="secondary"
                        className={`${
                          invoice.status === "Paid"
                            ? "bg-green-100 text-green-800"
                            : invoice.status === "Pending"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {invoice.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadInvoice(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Billing Contacts */}
      <Card>
        <CardHeader>
          <CardTitle>Billing Contacts</CardTitle>
          <CardDescription>
            These contacts will receive billing notifications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {billing.billingContacts.map((contact, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
              >
                <div>
                  <p className="font-medium">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.email}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Manage Plan Modal */}
      <Dialog open={managePlanOpen} onOpenChange={setManagePlanOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage Plan</DialogTitle>
          </DialogHeader>
          <div className="py-8 text-center">
            <p className="text-muted-foreground">
              Plan management features coming soon.
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Contact support@avir.space to modify your subscription.
            </p>
          </div>
          <div className="flex justify-end">
            <Button variant="outline" onClick={() => setManagePlanOpen(false)}>
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
