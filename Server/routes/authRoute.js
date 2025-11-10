import { Router } from "express";
import * as authControllers from "../controllers/auth.controller.js";
import { verifyAuthentication } from "../middlewares/VerifyAuth.middleware.js";

const router = Router();


router
    .route("/register")
    .post(authControllers.postRegister)


router
    .route("/login")
    .post(authControllers.postLogin);
    
router
    .route("/contact")
    .post(authControllers.postContactMessage)

router
    .route("/user")
    .get(verifyAuthentication, authControllers.User)

router
    .route("/addHistory")
    .post(verifyAuthentication, authControllers.AddHistory);

router
    .route("/getHistory")
    .get(verifyAuthentication, authControllers.GetHistory);

router
    .route("/removeHistory/:id")
    .delete(verifyAuthentication, authControllers.RemoveHistory);


router
    .route("/isAdmin")
    .get(verifyAuthentication, authControllers.CheckIsAdmin);


router
    .route("/getAllUsers")
    .get(verifyAuthentication, authControllers.GetAllUsers);

router
    .route("/removeUser/:id")
    .delete(verifyAuthentication, authControllers.RemoveUser);


router
    .route("/getAllMeetingRoom")
    .get(verifyAuthentication, authControllers.GetAllMeetingRooms);

router
    .route("/removeMeetingRoom/:id")
    .delete(verifyAuthentication, authControllers.RemoveMeetingRoom);


router
    .route("/getAllMessage")
    .get(verifyAuthentication, authControllers.GetAllMessages);

router
    .route("/removeMessage/:id")
    .delete(verifyAuthentication, authControllers.RemoveMessage);

router
    .route("/addUser")
    .post(verifyAuthentication, authControllers.AddUser);

router
    .route("/editUser")
    .patch(verifyAuthentication, authControllers.EditUser);

router
    .route("/editPassword")
    .patch(verifyAuthentication, authControllers.EditPassword)


export const authRoute = router;