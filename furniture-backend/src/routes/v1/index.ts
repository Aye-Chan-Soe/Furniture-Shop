import express from "express";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import userRoutes from "./api";
import { authorise } from "../../middlewares/authorise";
import { auth } from "../../middlewares/auth";
// import healthRoutes from "./health";
// import viewRoutes from "./web/view";
//import * as errorController from "../../controllers/web/errorController";

const router = express.Router();

router.use("/api/v1", authRoutes);
router.use("/api/v1/user", auth, userRoutes); // Profile routes
router.use("/api/v1/admins", auth, authorise(true, "ADMIN"), adminRoutes); // Admin user routes
// app.use("/api/v1", healthRoutes); // API route
// app.use(viewRoutes); // Web view routes
//app.use(errorController.notFound); //for view

export default router;
