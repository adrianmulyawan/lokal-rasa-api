import express, { Request, Response } from 'express';
import 'dotenv/config';
import 'http-errors';
import path from 'path';

import RegionRoute from './routes/region.route';
import ProvinceRoute from './routes/province.route';
import CategoryRoute from './routes/category.route';
import FoodRoute from './routes/food.route';
import IngridientRoute from './routes/ingridients.route';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware untuk menangani file statis
app.use('/images', express.static(path.join(__dirname, '../public/images')));

app.use(RegionRoute);
app.use(ProvinceRoute);
app.use(CategoryRoute);
app.use(FoodRoute);
app.use(IngridientRoute);

app.use((req: Request, res: Response, next: Function) => {
  console.log('404 handler:', req.url);
  res.status(404).json({
    status: "Failed",
    statusCode: 404,
    message: "Route is Not Defined!"
  });
});

app.listen(port, () => {
  console.info(`Express Run in Port ${port}`);
});