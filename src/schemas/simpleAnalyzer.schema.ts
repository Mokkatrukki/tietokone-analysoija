import { z } from 'zod';

export const SimpleAnalyzerSchema = z.object({
  url: z.string().url("Invalid URL format"),
  title: z.string().min(1, "Title is required"),
  specs: z.string().min(1, "Specs are required"),
  price: z.union([
    z.number().positive("Price must be a positive number"),
    z.string().min(1, "Price string must not be empty")
  ])
}); 