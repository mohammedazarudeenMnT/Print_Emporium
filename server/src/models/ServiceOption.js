import mongoose from "mongoose";

const serviceOptionSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      required: true,
      enum: ["printType", "paperSize", "paperType", "gsm", "printSide", "bindingOption"],
      index: true,
    },
    label: {
      type: String,
      required: true,
      trim: true,
    },
    value: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    pricePerPage: {
      type: Number,
    },
    pricePerCopy: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

// Validation: Ensure only one pricing field is set (either pricePerPage OR pricePerCopy, not both)
serviceOptionSchema.pre('save', function(next) {
  if (this.pricePerPage > 0 && this.pricePerCopy > 0) {
    const error = new Error('Cannot set both pricePerPage and pricePerCopy. Please choose only one pricing type.');
    return next(error);
  }
  
  // Remove the field that is 0 or undefined to keep only the selected pricing type
  if (!this.pricePerPage || this.pricePerPage === 0) {
    this.pricePerPage = undefined;
  }
  if (!this.pricePerCopy || this.pricePerCopy === 0) {
    this.pricePerCopy = undefined;
  }
  
  if (typeof next === 'function') {
    next();
  }
});

// Unique combination of category and value
serviceOptionSchema.index({ category: 1, value: 1 }, { unique: true });

export default mongoose.model("ServiceOption", serviceOptionSchema);
