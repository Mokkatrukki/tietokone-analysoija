import { z } from 'zod';

export const ToriListingSchema = z.object({
  // Required fields with specific validation rules
  id: z.string().min(1, 'ID is required'),
  url: z.string().url('Must be a valid URL'),
  title: z.string().min(1, 'Title is required'),
  price: z.number().min(0, 'Price must be non-negative'),
  type: z.string().min(1, 'Type is required'),
  description: z.string().min(1, 'Description is required'),

  // Optional fields with their own validation rules
  categories: z.object({
    full: z.string(),
    levels: z.array(z.string()),
    primary: z.string(),
    secondary: z.string(),
    tertiary: z.string()
  }).optional(),
  
  additionalInfo: z.record(z.unknown()).optional(),
  address: z.string().optional(),
  sellerType: z.string().optional(),
  errors: z.array(z.string()).optional()
});

// Export the type that Zod infers from our schema
export type ToriListing = z.infer<typeof ToriListingSchema>;
