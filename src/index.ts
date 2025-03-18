import express, { Request, Response } from 'express';
import { ToriListingSchema } from './schemas/toriListing.schema';
import { SimpleAnalyzerSchema } from './schemas/simpleAnalyzer.schema';
import { z } from 'zod';
import swaggerUi from 'swagger-ui-express';
import { swaggerDefinition } from './swagger';
import { analyzeListing } from './listing-analyzer';
import { analyzeSimpleListing } from './simple-analyzer';
import { HardwareSpecsDB } from './db/hardware-specs';
import cors from 'cors';

export const app = express();
const db = HardwareSpecsDB.getInstance();

// Enable CORS for all routes
app.use(cors({
  origin: '*', // Allow all origins - you can restrict this to specific origins if needed
  methods: ['GET', 'POST'], // Allow only specific methods
  allowedHeaders: ['Content-Type', 'Authorization']
}));

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
    res.status(500).json({ 
      error: 'Internal server error',
      details: [{ message: 'Failed to analyze listing' }]
    });
  }
});

app.post('/api/simple-analysis', async (req: Request<{}, {}, z.infer<typeof SimpleAnalyzerSchema>>, res: Response) => {
  const result = SimpleAnalyzerSchema.safeParse(req.body);

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
    const analysis = await analyzeSimpleListing(db, result.data);
    res.json({ 
      success: true,
      analysis
    });
  } catch (error) {
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
