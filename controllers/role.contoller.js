import Role from '../models/roleSchema.js';
import { mongoose } from "mongoose";

/** ###################################### Roles EndPoints ###################################### **/

/** Create Role */
export const createRole    = async (req, res, next) => {
  try {
    const { role, description } = req.body;
    if (!role) {
      return res.status(400).json({ message: "Invalid role" });
    }
    if (await Role.findOne({ role })) {
      return res.status(400).json({ message: "Role already exists" });
    }
    const newRole = new Role({ role, description });
    const saved = await newRole.save();
    res.status(201).json({ message: "Role created", role: saved });
  } catch (err) {
    next(err);
  }
};

/** Find Role */
export const findRole      = async (req, res, next) => {
  try {
    const { role, id } = req.query;
    const lookupField = role ? 'role' : id ? '_id' : null;
    const value = role || id;
    if (!lookupField) {
      return res.status(400).json({ message: 'Provide role or id' });
    }
    if (lookupField === '_id' && !mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }

    const found = await Role.findOne({ [lookupField]: value });
    if (!found) return res.status(404).json({ message: 'Role not found' });
    res.json(found);
  } catch (err) {
    next(err);
  }
};

/** Delete Role */ 
export const deleteRole    = async (req, res, next) => {
  try {
    const { role, id } = req.query;
    const lookupField = role ? 'role' : id ? '_id' : null;
    const value = role || id;
    if (!lookupField) {
      return res.status(400).json({ message: 'Provide role or id' });
    }
    if (lookupField === '_id' && !mongoose.Types.ObjectId.isValid(value)) {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    const result = await Role.deleteOne({ [lookupField]: value });
    if (!result.deletedCount) return res.status(404).json({ message: 'Role not found' });
    res.json({ message: 'Role deleted' });
  } catch (err) {
    next(err);
  }
};

/** Fetch All Roles */
export const fetchAllRoles = async (req, res, next) => {
  try {
    const all = await Role.find({});
    if (!all.length) return res.status(404).json({ message: 'No roles' });
    res.status(200).json(all);
  } catch (err) {
    next(err);
  }
};

/** Update Role */
// export const updateRole = async (req, res, next) => {
//   try {
//     const { id } = req.query;
//     const { role, description } = req.body;

//     // Determine lookup field dynamically
//     const lookup = id ? { _id: id } : role ? { role: role } : null;

//     if (!lookup) {
//       return res.status(400).json({ message: 'Please provide either role ID or existing role role in query' });
//     }

//     if (id && !mongoose.Types.ObjectId.isValid(id)) {
//       return res.status(400).json({ message: 'Invalid ID format.' });
//     }

//     const updates = {};
//     if (role) updates.role = role;
//     if (description) updates.description = description;

//     // Prevent duplicate role conflicts
//     if (role) {
//       const existing = await Role.findOne({ role });
//       if (existing && existing._id.toString() !== (id || existing._id.toString())) {
//         return res.status(400).json({ message: 'New role role already in use' });
//       }
//     }

//     const updated = await Role.findOneAndUpdate(
//       lookup,
//       { $set: updates },
//       { new: true, runValidators: true }
//     );

//     if (!updated) {
//       return res.status(404).json({ message: 'Role not found' });
//     }

//     return res.json({ message: 'Role updated successfully', updated });
//   } catch (err) {
//     next(err);
//   }
// };

export const updateRole = async (req, res, next) => {
  try {
    const { id } = req.query;
    const { role: newRole, description } = req.body;

    let filter = null;
    if (id) {
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: 'Invalid ID format' });
      }
      filter = { _id: id };
    } else if (newRole) {
      filter = { role: newRole };
    }

    if (!filter) {
      return res.status(400).json({
        message: 'Missing identifier: provide "id" in query or "role" in body'
      });
    }

    const updates = {};
    if (description) updates.description = description;
    

    let changingRole = false;
    if (newRole && newRole !== filter.role) {
      changingRole = true;
      updates.role = newRole;
    }

    const existing = await Role.findOne(filter);
    if (!existing) {
      return res.status(404).json({ message: 'Role not found with given identifier' });
    }

    if (changingRole) {
      const conflict = await Role.findOne({ role: newRole });
      if (conflict && conflict._id.toString() !== existing._id.toString()) {
        return res.status(400).json({ message: 'Role name already in use' });
      }
    }

    const updated = await Role.findOneAndUpdate(
      filter,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.json({ message: 'Role updated successfully', updated });
  } catch (err) {
    next(err);
  }
};