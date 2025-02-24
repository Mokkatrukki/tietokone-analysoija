import express, { Request, Response } from 'express';
import { ToriListingSchema } from './schemas/toriListing.schema';
import { z } from 'zod';

export const app = express();

app.use(express.json());

app.post('/api/listings', (req: Request<{}, {}, z.infer<typeof ToriListingSchema>>, res: Response) => {
  const result = ToriListingSchema.safeParse(req.body);

  if (!result.success) {
    // Format Zod errors into a more readable format
    const errors = result.error.issues.map(issue => ({
      field: issue.path.join('.'),
      message: issue.message
    }));
    
    return res.status(400).json({ 
      error: 'Validation failed',
      details: errors
    });
  }

  // result.data contains the validated and typed data
  res.json({ success: true });
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
}
