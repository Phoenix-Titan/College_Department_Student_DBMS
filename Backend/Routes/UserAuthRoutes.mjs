import { Router } from "express";
import { SignUpUser } from "../Controllers/UserAuth.mjs";


const route = Router()

//These are the Auth routes for the user.
route.post('/signUp', SignUpUser);

export default route

//----------These are the Auth routes below.

// POST - /api/v1//UserAuth/signUp