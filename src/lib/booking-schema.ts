import { z } from "zod";

// Shared between every caller of booking-core (chat route, Retell functions
// route, dashboard) so validation can't drift between them — same pattern
// as vim-automations-website's lib/contact-schema.ts.

export const checkAvailabilitySchema = z.object({
  fromDate: z.string().datetime().optional(),
  limit: z.number().int().min(1).max(10).default(5),
});

export const lookupPatientSchema = z.object({
  phone: z.string().min(1).max(20),
});

export const createPatientSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(200),
  phone: z.string().trim().min(1, "Phone is required").max(20),
  // Normalized to lowercase — most mail providers (including Gmail) treat
  // the local part case-insensitively, so storing mixed case risks treating
  // the same person as two different patients on a future lookup.
  email: z.string().trim().email("Please enter a valid email").max(254).toLowerCase(),
  treatment: z.string().min(1, "Please select a treatment").max(200),
  insurance: z.string().max(200).optional(),
  isNewPatient: z.boolean().default(true),
  urgency: z.enum(["emergency", "soon", "routine"]).default("routine"),
});

export const bookAppointmentSchema = z.object({
  availabilityId: z.string().uuid(),
  patientId: z.string().uuid(),
  source: z.enum(["web", "phone", "manual"]),
  treatmentType: z.string().max(200).optional(),
  notes: z.string().max(2000).optional(),
});

export type CheckAvailabilityInput = z.infer<typeof checkAvailabilitySchema>;
export type LookupPatientInput = z.infer<typeof lookupPatientSchema>;
export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type BookAppointmentInput = z.infer<typeof bookAppointmentSchema>;
