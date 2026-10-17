"use client";

import { useState } from "react";
import { AlertTriangle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

interface InvoiceFraudReportProps {
  invoiceId: string;
  issuerId: string;
}

export function InvoiceFraudReport({
  invoiceId,
  issuerId,
}: InvoiceFraudReportProps) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const reasonOptions = [
    "Suspicious issuer activity",
    "Document authenticity concerns",
    "Unusual payment patterns",
    "Compliance violations",
    "Other (specify below)",
  ];

  const handleSubmit = async () => {
    if (!reason || !details.trim()) {
      toast.error("Please select a reason and provide details");
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await fetch("/api/invoices/fraud-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          invoiceId,
          issuerId,
          reason,
          details: details.trim(),
          reportedAt: new Date().toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit fraud report");
      }

      toast.success("Fraud report submitted successfully");
      setOpen(false);
      setReason("");
      setDetails("");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to submit report"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="gap-2 text-destructive hover:text-destructive"
          aria-label="Report fraud for this invoice"
        >
          <AlertTriangle className="h-4 w-4" />
          <span className="hidden sm:inline">Report Fraud</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Report Suspicious Activity</DialogTitle>
          <DialogDescription>
            Help us maintain platform integrity by reporting fraudulent or suspicious invoices.
            Your report will be reviewed by our compliance team.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              Reason for Report
            </label>
            <div className="space-y-2">
              {reasonOptions.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setReason(opt)}
                  className="w-full text-left p-3 border rounded-md hover:bg-accent transition-colors"
                  aria-pressed={reason === opt}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className="h-4 w-4 rounded border"
                      style={{
                        background:
                          reason === opt ? "currentColor" : "transparent",
                      }}
                    />
                    <span className="text-sm">{opt}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="details" className="text-sm font-medium mb-2 block">
              Detailed Description *
            </label>
            <Textarea
              id="details"
              placeholder="Provide specific details about your concern..."
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              rows={4}
              className="resize-none"
              aria-required="true"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Include any evidence or observations that support your report.
            </p>
          </div>

          <div className="rounded-md bg-amber-50 p-3">
            <p className="text-xs text-amber-800">
              ⚠️ Reports are confidential. False reports may result in account
              restrictions.
            </p>
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !reason || !details.trim()}
              className="gap-2"
            >
              {isSubmitting && (
                <Loader2 className="h-4 w-4 animate-spin" />
              )}
              Submit Report
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
