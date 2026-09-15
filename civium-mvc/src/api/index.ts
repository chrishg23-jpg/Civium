import express from 'express';
import householdRoutes from './routes/householdRoutes';
import personRoutes from './routes/personRoutes';
import signalRoutes from './routes/signalRoutes';
import neighbourhoodRoutes from './routes/neighbourhoodRoutes';

const app = express();
app.use(express.json());

// Register routes
app.use('/households', householdRoutes);
app.use('/persons', personRoutes);
app.use('/signals', signalRoutes);
app.use('/neighbourhoods', neighbourhoodRoutes);

// Start server
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Civium MVC API running on port ${PORT}`);
});
