import Item from "../models/dummymodels.js";

 const getAllItems = async (req, res) => {
  try {
    const items = await Item.find(); // fetch all records
    res.status(200).json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

export default getAllItems;
