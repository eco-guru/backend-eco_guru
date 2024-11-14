import express from "express";
import pricelistController from "../controller/pricelist-controller.js";
import { wasteCollectorMiddleware } from "../middleware/wasteCollector-middleware.js";

const collectorRouter = new express.Router();
collectorRouter.use(wasteCollectorMiddleware);

collectorRouter.get('/api/pricelist/get', pricelistController.getPricelist);
collectorRouter.get('/api/pricelist/get-one/:wasteTypeId/:uomId', pricelistController.getOne);
collectorRouter.post('/api/pricelist', pricelistController.postPricelist);
collectorRouter.patch('/api/pricelist/update', pricelistController.updatePricelist);
collectorRouter.delete('/api/pricelist/delete/:wasteTypeId/:uomId', pricelistController.deletePricelist);

export {
    collectorRouter
}