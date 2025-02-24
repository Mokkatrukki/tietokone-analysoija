import express, { Request, Response } from 'express';
import { ToriListing } from './types/ToriListing';

export const app = express();

app.use(express.json());

app.post('/api/listings', (req: Request<{}, {}, ToriListing>, res: Response) => {
  res.json({ success: true });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
