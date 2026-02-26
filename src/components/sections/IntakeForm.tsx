"use client";

import { useState, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { TREATMENT_OPTIONS } from "@/lib/constants";
import { submitIntakeForm } from "@/lib/api";
import type { IntakeFormData } from "@/lib/types";
import { useUtmParams } from "@/hooks/useUtmParams";
import { Loader2, CheckCircle2, AlertCircle } from "lucide-react";

type FormStatus = "idle" | "submitting" | "success" | "error";

function IntakeFormInner() {
  const utm = useUtmParams();
  const [status, setStatus] = useState<FormStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    treatment: "",
    insurance: "",
    isNewPatient: true,
    urgency: "routine" as IntakeFormData["urgency"],
  });

  const updateField = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const isValid =
    formData.name.trim() &&
    formData.phone.trim() &&
    formData.email.trim() &&
    formData.treatment;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || status === "submitting") return;

    setStatus("submitting");
    setErrorMessage("");

    const result = await submitIntakeForm({
      ...formData,
      utmSource: utm.utmSource,
      utmMedium: utm.utmMedium,
      utmCampaign: utm.utmCampaign,
    });

    if (result.success) {
      setStatus("success");
    } else {
      setStatus("error");
      setErrorMessage(result.message || "Something went wrong.");
    }
  };

  if (status === "success") {
    return (
      <section id="intake-form" className="py-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Card className="border-primary/20 bg-sage-light/30">
            <CardContent className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground mb-3">
                Thank You!
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                We&apos;ve received your information and will be in touch
                shortly. If your request is urgent, please call us directly.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  return (
    <section id="intake-form" className="py-24 px-6 bg-sage-light/20">
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="text-sm font-medium tracking-widest uppercase text-primary/70 mb-3">
            Get Started
          </p>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Book an Appointment
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            Fill out the form below and our team will reach out to confirm your
            appointment.
          </p>
        </div>

        <Card className="border-border/50 shadow-xl shadow-primary/5">
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Name & Phone row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    type="text"
                    placeholder="Juan Dela Cruz"
                    value={formData.name}
                    onChange={(e) => updateField("name", e.target.value)}
                    maxLength={200}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="0927-112-1480"
                    value={formData.phone}
                    onChange={(e) => updateField("phone", e.target.value)}
                    maxLength={20}
                    pattern="[0-9+\-\s()]*"
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => updateField("email", e.target.value)}
                  maxLength={254}
                  required
                />
              </div>

              {/* Treatment & Insurance row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="treatment">Treatment Needed *</Label>
                  <Select
                    value={formData.treatment}
                    onValueChange={(v) => updateField("treatment", v)}
                  >
                    <SelectTrigger id="treatment">
                      <SelectValue placeholder="Select treatment" />
                    </SelectTrigger>
                    <SelectContent>
                      {TREATMENT_OPTIONS.map((t) => (
                        <SelectItem key={t} value={t}>
                          {t}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="insurance">Insurance Provider</Label>
                  <Input
                    id="insurance"
                    type="text"
                    placeholder="e.g. PhilHealth, or none"
                    value={formData.insurance}
                    onChange={(e) => updateField("insurance", e.target.value)}
                    maxLength={200}
                  />
                </div>
              </div>

              {/* New patient toggle */}
              <div className="space-y-2">
                <Label>Are you a new patient?</Label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => updateField("isNewPatient", true)}
                    className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${
                      formData.isNewPatient
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    Yes, I&apos;m new
                  </button>
                  <button
                    type="button"
                    onClick={() => updateField("isNewPatient", false)}
                    className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${
                      !formData.isNewPatient
                        ? "bg-primary text-primary-foreground border-primary shadow-md"
                        : "bg-card text-muted-foreground border-border hover:border-primary/30"
                    }`}
                  >
                    Returning patient
                  </button>
                </div>
              </div>

              {/* Urgency */}
              <div className="space-y-2">
                <Label>How soon do you need to be seen?</Label>
                <div className="flex gap-3">
                  {[
                    { value: "emergency", label: "Emergency" },
                    { value: "soon", label: "Within a week" },
                    { value: "routine", label: "Routine" },
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => updateField("urgency", opt.value)}
                      className={`flex-1 h-11 rounded-xl border text-sm font-medium transition-all ${
                        formData.urgency === opt.value
                          ? "bg-primary text-primary-foreground border-primary shadow-md"
                          : "bg-card text-muted-foreground border-border hover:border-primary/30"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Error banner */}
              {status === "error" && (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-sm text-destructive">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {errorMessage}
                </div>
              )}

              {/* Submit */}
              <Button
                type="submit"
                disabled={!isValid || status === "submitting"}
                className="w-full h-13 text-base font-medium rounded-xl shadow-lg shadow-primary/20"
              >
                {status === "submitting" ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Request"
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

export function IntakeForm() {
  return (
    <Suspense>
      <IntakeFormInner />
    </Suspense>
  );
}
