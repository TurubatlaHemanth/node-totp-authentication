import express from 'express';
import { createRole, findRole, deleteRole, fetchAllRoles } from '../controllers/role.contoller';

/** ################### Role Routes ################### **/

const roleRouter = express.Router();

roleRouter.post('/createRole',   createRole);
roleRouter.post('/findRole',     findRole);
roleRouter.delete('/removeRole', deleteRole);
roleRouter.get('/fetchAllRoles', fetchAllRoles);

export default roleRouter;