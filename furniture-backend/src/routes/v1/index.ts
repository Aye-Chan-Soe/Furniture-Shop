import express from "express";
import authRoutes from "./auth";
import adminRoutes from "./admin";
import userRoutes from "./api";
import { authorise } from "../../middlewares/authorise";
import { auth } from "../../middlewares/auth";
import { maintenance } from "../../middlewares/maintenance";
// import healthRoutes from "./health";
// import viewRoutes from "./web/view";
//import * as errorController from "../../controllers/web/errorController";

const router = express.Router();

router.use("/api/v1", authRoutes);
router.use("/api/v1/user", auth, userRoutes); // Profile routes
router.use("/api/v1/admins", auth, authorise(true, "ADMIN"), adminRoutes); // Admin user routes

// FOR MAINTENANCE MODE
// router.use("/api/v1", maintenance, authRoutes
// );
// router.use("/api/v1/user", maintenance, userRoutes);
// router.use(
//   "/api/v1/admins",
//   maintenance,
//   auth,
//   authorise(true, "ADMIN"),
//   adminRoutes
// );
// app.use("/api/v1", healthRoutes); // API route
// app.use(viewRoutes); // Web view routes
//app.use(errorController.notFound); //for view

export default router;
