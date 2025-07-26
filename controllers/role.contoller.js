import Role from '../models/Role';

/** ###################################### Roles EndPoints ###################################### **/

/** Create Role */
export const createRole    = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Invalid name" });
    }
    if (await Role.findOne({ name })) {
      return res.status(400).json({ message: "Role already exists" });
    }
    const newRole = new Role({ name, description });
    const saved = await newRole.save();
    res.status(201).json({ message: "Role created", role: saved });
  } catch (err) {
    next(err);
  }
};

/** Find Role */
export const findRole      = async (req, res, next) => {
  try {
    const { name, id } = req.query;
    const lookupField = name ? 'name' : id ? '_id' : null;
    const value = name || id;
    if (!lookupField) {
      return res.status(400).json({ message: 'Provide name or id' });
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
    const { name, id } = req.query;
    const lookupField = name ? 'name' : id ? '_id' : null;
    const value = name || id;
    if (!lookupField) {
      return res.status(400).json({ message: 'Provide name or id' });
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
export const updateRole = async (req, res, next) => {
  try {
        const { name, id } = req.query;
        const { ...updates } = req.body;
    const lookup = id ? { _id: id } : email ? { email } : null;

    if (!lookup) {
      return res.status(400).json({ message: "Please Provide Name" });
    }
    if (lookup._id && !mongoose.Types.ObjectId.isValid(lookup._id)) {
      return res.status(400).json({ message: "Invalid ID format." });
    }
    
        const updated = await User.findOneAndUpdate(
          lookup,
          { $set: updates },
          { new: true, runValidators: true }
        )
    
    if (!updated) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.json(updatedTask)
  } catch (err) {
    next(err);
  }
};
