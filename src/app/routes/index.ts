import { Router } from "express";
import { UserRoutes } from "../modules/user/user.route";

export const router = Router();

const appRoutes = [
  {
    path: "/user",
    route: UserRoutes,
  },
];

// Registering all module routes
appRoutes.forEach((route) => {
  router.use(route.path, route.route);
});
