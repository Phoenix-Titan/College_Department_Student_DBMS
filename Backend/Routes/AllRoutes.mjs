import { Router } from "express";

// Various Routes import
import StudentRecordsRoutes from './StudentRecordsRoute.mjs'
import UserAuthRoutes from './UserAuthRoutes.mjs'

const route = Router()

route.use('/StudentRecords',StudentRecordsRoutes);
route.use("/UserAuth", UserAuthRoutes)

export default route;