import Address from "../models/Address.js";

export const saveAddress = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phone,
      addressLine,
      city,
      state,
      zipCode,
      country,
    } = req.body;

    // ✅ Validation
    if (!userId || !fullName || !phone || !addressLine) {
      return res.status(400).json({
        message: "All required fields are required",
      });
    }

    // ✅ Duplicate check
    const existing = await Address.findOne({
      userId,
      addressLine,
    });

    if (existing) {
      return res.status(400).json({
        message: "Address already exists! Please add a different address.",
      });
    }

    // ✅ Save
    const address = await Address.create({
      userId,
      fullName,
      phone,
      addressLine,
      city,
      state,
      zipCode,
      country,
    });

    res.status(201).json({
      message: "Address saved successfully",
      address,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ userId: req.params.userId }).sort({
      createdAt: -1,
    });
    res.status(200).json({ addresses });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteAddress = async (req, res) => {
    try {
        await Address.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Address deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};
