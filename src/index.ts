import express, {Request, Response} from 'express';
import 'dotenv/config';
import 'http-errors';

import RegionRoute from './routes/region.route';
import ProvinceRoute from './routes/province.route';

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(RegionRoute);
app.use(ProvinceRoute);

app.use((req: Request, res: Response, next: Function) => {
  res.status(404).json({
    status: "Failed",
    statusCode: 404,
    message: "Route is Not Defined!"
  });
});

app.listen(port, () => {
  console.info(`Express Run in Port ${port}`);
})