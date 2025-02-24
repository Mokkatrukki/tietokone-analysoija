export interface ToriListing {
  // Required fields
  id: string;
  url: string;
  title: string;
  price: number;
  type: string;
  description: string;

  // Optional fields
  categories?: {
    full: string;
    levels: string[];
    primary: string;
    secondary: string;
    tertiary: string;
  };
  additionalInfo?: Record<string, unknown>;
  address?: string;
  sellerType?: string;
  errors?: string[];
}
