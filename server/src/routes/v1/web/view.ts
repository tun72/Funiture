import expres from "express";

import { home } from "../../../controllers/web/viewController";

const router = expres.Router();

router.get("/home", home);

export default router;
