import Item from "../models/dummymodels.js";

 const getAllItems = async (req, res) => {
  try {
   const page = parseInt( req.query.page) || 1;
    const limit = parseInt( req.query.limit) || 10;

    const skip = (page-1)*limit; // it will ignore the records in the eg:..jpage=2  it will remove the first 10 records and give next 10.

    const items = await Item.find().skip(skip).limit(limit); // fetch all records
    const total = await Item.countDocuments();

    res.status(200).json({ data: items, pagination:{ total, page, limit, totalPages: Math.ceil(total / limit)}});
    
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ message: "Server error while fetching items" });
  }
};

export default getAllItems;
