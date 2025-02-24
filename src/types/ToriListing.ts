export interface ToriListing {
  id: string;
  url: string;
  title: string;
  categories: {
    full: string;
    levels: string[];
    primary: string;
    secondary: string;
    tertiary: string;
  };
  price: number;
  type: string;
  description: string;
  additionalInfo: Record<string, unknown>;
  address: string;
  sellerType: string;
  errors: string[];
}
