import { Router, Request, Response, NextFunction } from "express";
import { fetchData } from "../adapters/ExternalDataAdapter";
import { logger } from "../utils/logger";
const dataRouter = Router();
dataRouter.get(
  "/data",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const url = process.env.API_URL ? process.env.API_URL : ""; // Replace with your actual API URL
      logger.info(`Fetching data from external API: ${url}`);
      const items = await fetchData(url);
      res.status(200).json(items);
    } catch (error) {
      next(error);
    }
  },
);
export { dataRouter };
