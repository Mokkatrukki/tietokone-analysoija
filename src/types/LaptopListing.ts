export interface LaptopListing {
  model: string;
  cpu: string;
  ram: number;
  storage: {
    type: string;
    amount: number;
  };
  display: {
    size: number;
    resolution: string;
    type: string;
  };
  gpu: string;
} 