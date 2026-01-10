import ServiceOption from "../models/ServiceOption.js";
// Clean up duplicate service options
const cleanupDuplicates = async () => {
  try {
    const duplicates = await ServiceOption.aggregate([
      {
        $group: {
          _id: { category: "$category", value: "$value" },
          count: { $sum: 1 },
          docs: { $push: "$_id" },
        },
      },
      {
        $match: { count: { $gt: 1 } },
      },
    ]);
    let removedCount = 0;
    for (const duplicate of duplicates) {
      // Keep the first document, remove the rest
      const docsToRemove = duplicate.docs.slice(1);
      await ServiceOption.deleteMany({ _id: { $in: docsToRemove } });
      removedCount += docsToRemove.length;
    }
    if (removedCount > 0) {
      console.log(`🧹 Cleaned up ${removedCount} duplicate service options`);
    }
  } catch (error) {
    console.error("Error cleaning up duplicates:", error.message);
  }
};
// Seed default service options if none exist
const seedDefaultServiceOptions = async () => {
  try {
    // Check if we already have any service options
    const existingCount = await ServiceOption.countDocuments();

    if (existingCount > 0) {
      return; // Already have data, don't seed
    }
    const defaultOptions = [
      // Print Types (Page-based)
      {
        category: "printType",
        label: "Black & White",
        value: "bw",
        isActive: true,
      },
      {
        category: "printType",
        label: "Color",
        value: "color",
        isActive: true,
        pricePerPage: 5,
      },
      {
        category: "printType",
        label: "Grayscale",
        value: "grayscale",
        isActive: true,
        pricePerPage: 2,
      },
      // Paper Sizes (Page-based)
      { category: "paperSize", label: "A4", value: "a4", isActive: true },
      { category: "paperSize", label: "A5", value: "a5", isActive: true },
      { category: "paperSize", label: "A3", value: "a3", isActive: true, pricePerPage: 10 },
      { category: "paperSize", label: "A6", value: "a6", isActive: true },
      {
        category: "paperSize",
        label: "Business Card (3.5x2)",
        value: "3.5x2",
        isActive: true,
      },
      {
        category: "paperSize",
        label: "Legal (8.5x14)",
        value: "8.5x14",
        isActive: true,
        pricePerPage: 5,
      },
      // Paper Types (Mixed)
      {
        category: "paperType",
        label: "Bond Paper",
        value: "bond",
        isActive: true,
      },
      {
        category: "paperType",
        label: "Glossy",
        value: "glossy",
        isActive: true,
        pricePerPage: 5,
      },
      {
        category: "paperType",
        label: "Matte",
        value: "matte",
        isActive: true,
        pricePerPage: 3,
      },
      {
        category: "paperType",
        label: "Art Card",
        value: "art-card",
        isActive: true,
        pricePerCopy: 2,
      },
      {
        category: "paperType",
        label: "Newsprint",
        value: "newsprint",
        isActive: true,
      },
      {
        category: "paperType",
        label: "Cardstock",
        value: "cardstock",
        isActive: true,
        pricePerCopy: 1,
      },
      // GSM (Mixed)
      {
        category: "gsm",
        label: "70 GSM",
        value: "70",
        isActive: true,
      },
      {
        category: "gsm",
        label: "80 GSM",
        value: "80",
        isActive: true,
        pricePerPage: 1,
      },
      {
        category: "gsm",
        label: "100 GSM",
        value: "100",
        isActive: true,
        pricePerPage: 2,
      },
      {
        category: "gsm",
        label: "120 GSM",
        value: "120",
        isActive: true,
        pricePerPage: 3,
      },
      {
        category: "gsm",
        label: "150 GSM",
        value: "150",
        isActive: true,
        pricePerPage: 5,
      },
      {
        category: "gsm",
        label: "200 GSM",
        value: "200",
        isActive: true,
        pricePerPage: 8,
      },
      {
        category: "gsm",
        label: "250 GSM",
        value: "250",
        isActive: true,
        pricePerCopy: 1,
      },
      {
        category: "gsm",
        label: "300 GSM",
        value: "300",
        isActive: true,
        pricePerCopy: 2,
      },
      // Print Side (All free)
      {
        category: "printSide",
        label: "Single Side",
        value: "single-side",
        isActive: true,
      },
      {
        category: "printSide",
        label: "Double Side",
        value: "double-side",
        isActive: true,
      },
      {
        category: "printSide",
        label: "Duplex",
        value: "duplex",
        isActive: true,
      },
      // Binding Options (Copy-based)
      {
        category: "bindingOption",
        label: "No Binding",
        value: "no-binding",
        isActive: true,
      },
      {
        category: "bindingOption",
        label: "Spiral Binding",
        value: "spiral-binding",
        isActive: true,
        pricePerCopy: 50,
      },
      {
        category: "bindingOption",
        label: "Comb Binding",
        value: "comb-binding",
        isActive: true,
        pricePerCopy: 40,
      },
      {
        category: "bindingOption",
        label: "Perfect Binding",
        value: "perfect-binding",
        isActive: true,
        pricePerCopy: 80,
      },
      {
        category: "bindingOption",
        label: "Saddle Stitch",
        value: "saddle-stitch",
        isActive: true,
        pricePerCopy: 30,
      },
      {
        category: "bindingOption",
        label: "Folding",
        value: "folding",
        isActive: true,
        pricePerCopy: 10,
      },
    ];
    // Insert each option individually to handle duplicates gracefully
    let insertedCount = 0;
    for (const option of defaultOptions) {
      try {
        // Check if this specific option already exists
        const existing = await ServiceOption.findOne({
          category: option.category,
          value: option.value,
        });

        if (!existing) {
          await ServiceOption.create(option);
          insertedCount++;
        }
      } catch (error) {
        // Skip individual duplicates and continue
        if (error.code !== 11000) {
          console.error(
            `Error inserting option ${option.value}:`,
            error.message
          );
        }
      }
    }
    if (insertedCount > 0) {
      console.log(
        `✅ ${insertedCount} default service options seeded successfully`
      );
    } else {
      console.log("ℹ️ All service options already exist");
    }
  } catch (error) {
    console.error("Error seeding default service options:", error.message);
  }
};
// Get all service options (filtered by category if provided)
export const getAllServiceOptions = async (req, res) => {
  try {
    // Clean up any existing duplicates first
    await cleanupDuplicates();

    // Seed default service options if database is empty
    await seedDefaultServiceOptions();
    const { category, activeOnly } = req.query;
    const query = {};
    if (category) {
      query.category = category;
    }
    if (activeOnly === "true") {
      query.isActive = true;
    }
    const options = await ServiceOption.find(query).sort({ label: 1 });
    return res.status(200).json({
      success: true,
      data: options,
    });
  } catch (error) {
    console.error("Get service options error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch service options",
      error: error.message,
    });
  }
};
// Create or Update a service option
export const upsertServiceOption = async (req, res) => {
  try {
    const { category, label, value, isActive, pricePerPage, pricePerCopy, id } =
      req.body;
    if (!category || !label || !value) {
      return res.status(400).json({
        success: false,
        message: "Category, Label, and Value are required",
      });
    }

    // Validate: Only one pricing type can be set
    if (pricePerPage > 0 && pricePerCopy > 0) {
      return res.status(400).json({
        success: false,
        message: "Cannot set both pricePerPage and pricePerCopy. Please choose only one pricing type.",
      });
    }

    let option;
    if (id) {
      option = await ServiceOption.findByIdAndUpdate(
        id,
        { category, label, value, isActive, pricePerPage, pricePerCopy },
        { new: true, runValidators: true }
      );
    } else {
      // Check if it already exists for this category/value
      const existing = await ServiceOption.findOne({ category, value });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: `This option already exists in the ${category} category`,
        });
      }
      option = new ServiceOption({
        category,
        label,
        value,
        isActive,
        pricePerPage,
        pricePerCopy,
      });
      await option.save();
    }
    return res.status(200).json({
      success: true,
      message: "Service option saved successfully",
      data: option,
    });
  } catch (error) {
    console.error("Save service option error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to save service option",
      error: error.message,
    });
  }
};
// Delete a service option
export const deleteServiceOption = async (req, res) => {
  try {
    const { id } = req.params;
    const option = await ServiceOption.findByIdAndDelete(id);
    if (!option) {
      return res.status(404).json({
        success: false,
        message: "Service option not found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Service option deleted successfully",
    });
  } catch (error) {
    console.error("Delete service option error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to delete service option",
      error: error.message,
    });
  }
};
