import express, { Request, Response } from 'express';
import { ToriListingSchema } from './schemas/toriListing.schema';
import { z } from 'zod';
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from './swagger';
import { analyzeListing } from './listing-analyzer';
import { HardwareSpecsDB } from './db/hardware-specs';

export const app = express();
const db = HardwareSpecsDB.getInstance();

app.use(express.json());

// Swagger UI setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDefinition));

app.post('/api/listings', async (req: Request<{}, {}, z.infer<typeof ToriListingSchema>>, res: Response) => {
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

  try {
    const analysis = await analyzeListing(db, result.data);
    res.json({ 
      success: true,
      analysis
    });
  } catch (error) {
    console.error('Error analyzing listing:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: [{ message: 'Failed to analyze listing' }]
    });
  }
});

if (require.main === module) {
  const port = process.env.PORT || 3000;
  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
    console.log(`Swagger documentation available at http://localhost:${port}/api-docs`);
  });
}
