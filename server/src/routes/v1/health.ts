import expres from "express";

import { check } from "../../middlewares/check";
import { healthCheck } from "../../controllers/healthController";

const router = expres.Router();

router.get("/health", check, healthCheck);

export default router;
