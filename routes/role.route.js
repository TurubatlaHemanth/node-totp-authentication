import express from 'express';
import { createRole, findRole, deleteRole, fetchAllRoles, updateRole } from '../controllers/role.contoller.js';

/** ################### Role Routes ################### **/

const roleRouter = express.Router();

roleRouter.post('/createRole',   createRole);
roleRouter.post('/fetchRole',     findRole);
roleRouter.delete('/removeRole', deleteRole);
roleRouter.get('/fetchAllRoles', fetchAllRoles);
roleRouter.put('/updateRole',    updateRole);

export default roleRouter;