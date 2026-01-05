import mongoose from 'mongoose';

const generalSettingsSchema = new mongoose.Schema({
  // Company Information
  companyName: {
    type: String,
    required: true,
    default: 'Truscomp'
  },
  companyEmail: {
    type: String,
    required: true,
    default: 'info@truscomp.com'
  },
  companyPhone: {
    type: String,
    required: true,
    default: '+91 1234567890'
  },
  companyAddress: {
    type: String,
    required: true,
    default: '123 Business Street, City, State, PIN'
  },
  companyDescription: {
    type: String,
    required: true,
    default: 'A transparent, automated MLM system built on Binary + PV earning model'
  },
  companyLogo: {
    type: String,
    default: '/images/logo/logo.webp'
  },

  // Email verification fields
  pendingEmailChange: {
    type: String,
    default: null
  },
  emailVerificationToken: {
    type: String,
    default: null
  },
  emailVerificationExpiry: {
    type: Date,
    default: null
  },

  // Metadata
  lastUpdatedBy: {
    type: String,
    ref: 'User'
  },
  
  // Singleton pattern - only one settings document
  settingsId: {
    type: String,
    default: 'global',
    unique: true
  }
}, {
  timestamps: true
});

// Ensure only one settings document exists
generalSettingsSchema.index({ settingsId: 1 }, { unique: true });

export default mongoose.model('GeneralSettings', generalSettingsSchema);
