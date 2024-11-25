import express from "express";
import pricelistController from "../../controller/pricelist-controller.js";
import { wasteCollectorMiddleware } from "../../middleware/wasteCollector-middleware.js";
import paymentRequestController from "../../controller/payment-request-controller.js";
import wastePickupController from "../../controller/waste-pickup-controller.js";

const collectorRouter = new express.Router();
collectorRouter.use(wasteCollectorMiddleware);

collectorRouter.get('/api/pricelist/get', pricelistController.getPricelist);
collectorRouter.get('/api/pricelist/get-one/:wasteTypeId/:uomId', pricelistController.getOne);
collectorRouter.post('/api/pricelist', pricelistController.postPricelist);
collectorRouter.put('/api/pricelist/update/:wasteTypeId/:uomId', pricelistController.updatePricelist);
collectorRouter.delete('/api/pricelist/delete/:wasteTypeId/:uomId', pricelistController.deletePricelist);

collectorRouter.get("/api/payment-requests", paymentRequestController.get);
collectorRouter.get("/api/payment-requests/:paymentRequestId", paymentRequestController.getById);
collectorRouter.post("/api/payment-requests", paymentRequestController.create);
collectorRouter.put("/api/payment-requests/:paymentRequestId", paymentRequestController.update);
collectorRouter.delete("/api/payment-requests/:paymentRequestId", paymentRequestController.remove);

collectorRouter.get('/api/waste-pickups', wastePickupController.getAllWastePickups);
collectorRouter.get('/api/waste-pickups/:id', wastePickupController.getOneWastePickup);
collectorRouter.post('/api/waste-pickups', wastePickupController.createWastePickup);
collectorRouter.put('/api/waste-pickups/:id', wastePickupController.updateWastePickup);
collectorRouter.delete('/api/waste-pickups/:id', wastePickupController.deleteWastePickup);

export {
    collectorRouter
}