import GeneralSettings from "../models/GeneralSettings.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { getEmailConfig } from "../config/sendmail.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
  getUrlFromPublicId,
  getPublicIdFromUrl, // Add this import
} from "../utils/cloudinary-helper.js";

// Get all settings (General/Email only)
export const getSettings = async (req, res) => {
  try {
    let generalSettings = await GeneralSettings.findOne({
      settingsId: "global",
    });

    // Create default settings if they don't exist
    if (!generalSettings) {
      generalSettings = await GeneralSettings.create({
        settingsId: "global",
        companyName: "The Print Emporium",
        companyEmail: "info@printemporium.com",
        companyPhone: "+91 431 2345678",
        whatsappNumber: "+91 9876543210",
        companyAddress:
          "No. 45, Main Road, Thillai Nagar, Trichy – 620018, Tamil Nadu, India",
        companyDescription:
          "Your trusted partner for high-quality printing solutions in Trichy. From business cards to large format prints, we deliver excellence in every project.",
        companyLogo: "/images/logo/logo.webp",
        favicon: "/images/favicon/favicon.ico",
        workingHours: "Mon – Sat: 9:00 AM – 8:00 PM\nSun: 10:00 AM – 6:00 PM",
        latitude: "10.8050456",
        longitude: "78.6868581",
        googleMapEmbed:
          "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.2258756337205!2d78.6868581!3d10.8050456!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baaf72c5c0940ad%3A0x2748d41a1133m31!2sThillai%20Nagar%2C%20Tiruchirappalli%2C%20Tamil%20Nadu!5e0!3m2!1sen!2sin!4v1234567890",
        socialMedia: {
          facebook: "https://facebook.com/printemporium",
          instagram: "https://instagram.com/printemporium",
          twitter: "https://twitter.com/printemporium",
          linkedin: "https://linkedin.com/company/printemporium",
        },
        gstNumber: "33ABCDE1234F1Z5",
        termsAndConditions:
          "All orders are subject to verification. Prices are inclusive of GST. Delivery charges may apply for orders below ₹500.",
        footerNote:
          "© 2024 The Print Emporium. All rights reserved. Serving Trichy with quality printing since 2020.",
      });
    }

    const data = {
      ...generalSettings._doc,
      companyLogo: getUrlFromPublicId(generalSettings.companyLogo),
      favicon: getUrlFromPublicId(generalSettings.favicon),
    };

    // Prune sensitive fields if not admin (accessed via signature)
    if (!req.user || req.user.role !== "admin") {
      delete data.emailVerificationToken;
      delete data.emailVerificationExpiry;
      delete data.pendingEmailChange;
      delete data._id;
      delete data.__v;
    }

    return res.status(200).json({
      success: true,
      data: data,
    });
  } catch (error) {
    console.error("Get settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch settings",
      error: error.message,
    });
  }
};

export const updateGeneralSettings = async (req, res) => {
  try {
    const {
      companyName,
      companyEmail,
      companyPhone,
      whatsappNumber,
      companyAddress,
      companyDescription,
      companyLogo,
      favicon,
      workingHours,
      latitude,
      longitude,
      googleMapEmbed,
      socialMedia,
      gstNumber,
      termsAndConditions,
      footerNote,
    } = req.body;

    if (
      !companyName ||
      !companyEmail ||
      !companyPhone ||
      !companyAddress ||
      !companyDescription
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(companyEmail)) {
      return res.status(400).json({
        success: false,
        message: "Invalid email format",
      });
    }

    let settings = await GeneralSettings.findOne({ settingsId: "global" });
    const oldEmail = settings?.companyEmail || process.env.ADMIN_EMAIL;
    const emailChanged = oldEmail && oldEmail !== companyEmail;

    // Handle Cloudinary upload if companyLogo is a base64 string or an object with data
    let uploadedLogoValue = undefined; // Will remain undefined if not being updated
    const logoData =
      typeof companyLogo === "object" && companyLogo !== null
        ? companyLogo.data
        : companyLogo;
    const logoName =
      typeof companyLogo === "object" && companyLogo !== null
        ? companyLogo.name
        : null;

    if (logoData && logoData.startsWith("data:image")) {
      // New upload - delete old and upload new
      if (settings?.companyLogo) {
        await deleteFromCloudinary(settings.companyLogo);
      }

      // Extract filename without extension for public_id
      const customPublicId = logoName ? logoName.split(".")[0] : null;

      const uploadResult = await uploadToCloudinary(
        logoData,
        "printemporium/images/logo",
        customPublicId
      );
      uploadedLogoValue = uploadResult.public_id;
    } else if (typeof logoData === "string" && logoData.startsWith("http")) {
      // It's an existing Cloudinary URL - extract and save the public ID
      const publicId = getPublicIdFromUrl(logoData);
      if (publicId) {
        uploadedLogoValue = publicId;
      }
    } else if (typeof logoData === "string" && logoData && !logoData.startsWith("/images/")) {
      // It's already a public ID - keep it as-is
      uploadedLogoValue = logoData;
    } else if (logoData === null) {
      // Explicit removal
      if (settings?.companyLogo) {
        await deleteFromCloudinary(settings.companyLogo);
      }
      uploadedLogoValue = null;
    }
    // If logoData is empty string or undefined, uploadedLogoValue remains undefined (no update)

    // Handle Cloudinary upload if favicon is a base64 string or an object
    let uploadedFaviconValue = undefined; // Will remain undefined if not being updated
    const faviconData =
      typeof favicon === "object" && favicon !== null ? favicon.data : favicon;
    const faviconName =
      typeof favicon === "object" && favicon !== null ? favicon.name : null;

    if (faviconData && faviconData.startsWith("data:image")) {
      // New upload - delete old and upload new
      if (settings?.favicon) {
        await deleteFromCloudinary(settings.favicon);
      }

      const customPublicId = faviconName ? faviconName.split(".")[0] : null;

      const uploadResult = await uploadToCloudinary(
        faviconData,
        "printemporium/images/favicon",
        customPublicId
      );
      uploadedFaviconValue = uploadResult.public_id;
    } else if (
      typeof faviconData === "string" &&
      faviconData.startsWith("http")
    ) {
      // It's an existing Cloudinary URL - extract and save the public ID
      const publicId = getPublicIdFromUrl(faviconData);
      if (publicId) {
        uploadedFaviconValue = publicId;
      }
    } else if (typeof faviconData === "string" && faviconData && !faviconData.startsWith("/images/")) {
      // It's already a public ID - keep it as-is
      uploadedFaviconValue = faviconData;
    } else if (faviconData === null) {
      // Explicit removal
      if (settings?.favicon) {
        await deleteFromCloudinary(settings.favicon);
      }
      uploadedFaviconValue = null;
    }
    // If faviconData is empty string or undefined, uploadedFaviconValue remains undefined (no update)

    if (!settings) {
      settings = await GeneralSettings.create({
        settingsId: "global",
        companyName,
        companyEmail: emailChanged ? oldEmail : companyEmail,
        companyPhone,
        whatsappNumber,
        companyAddress,
        companyDescription,
        companyLogo: uploadedLogoValue || null,
        favicon: uploadedFaviconValue || null,
        workingHours,
        latitude,
        longitude,
        googleMapEmbed,
        socialMedia,
        gstNumber,
        termsAndConditions,
        footerNote,
        lastUpdatedBy: req.user?.id || "init",
      });
    } else {
      settings.companyName = companyName;
      if (!emailChanged) {
        settings.companyEmail = companyEmail;
      }
      settings.companyPhone = companyPhone;
      settings.whatsappNumber = whatsappNumber;
      settings.companyAddress = companyAddress;
      settings.companyDescription = companyDescription;
      // Only update if we have a new value to set
      if (uploadedLogoValue !== undefined) {
        settings.companyLogo = uploadedLogoValue;
      }
      if (uploadedFaviconValue !== undefined) {
        settings.favicon = uploadedFaviconValue;
      }
      settings.workingHours = workingHours;
      settings.latitude = latitude;
      settings.longitude = longitude;
      settings.googleMapEmbed = googleMapEmbed;
      settings.socialMedia = socialMedia;
      settings.gstNumber = gstNumber;
      settings.termsAndConditions = termsAndConditions;
      settings.footerNote = footerNote;
      settings.lastUpdatedBy = req.user?.id;
      await settings.save();
    }

    if (emailChanged) {
      console.log(`🔄 Email change requested: ${oldEmail} → ${companyEmail}`);

      try {
        const adminUser = await User.findById(req.user.id);

        if (!adminUser) {
          throw new Error("Admin user not found");
        }
        if (adminUser.role !== "admin") {
          throw new Error("User is not an admin");
        }

        const verificationToken =
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15);

        settings.pendingEmailChange = companyEmail;
        settings.emailVerificationToken = verificationToken;
        settings.emailVerificationExpiry = new Date(
          Date.now() + 24 * 60 * 60 * 1000
        );
        await settings.save();

        // Send email logic
        const emailConfig = await getEmailConfig();
        const transporter = nodemailer.createTransport(emailConfig);
        const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/settings/verify-email-change?token=${verificationToken}`;

        await transporter.sendMail({
          from: emailConfig.from,
          to: companyEmail,
          subject: "Verify Your New Admin Email Address",
          html: `<p>Click here to verify: <a href="${verificationUrl}">${verificationUrl}</a></p>`,
        });
      } catch (emailError) {
        return res.status(200).json({
          success: true,
          message:
            "General settings updated successfully, but failed to send verification email.",
          data: settings,
          emailChanged,
          warning: `Failed to send verification email: ${emailError.message}`,
        });
      }
    }

    return res.status(200).json({
      success: true,
      message: emailChanged
        ? "General settings updated successfully. Verification email sent to new admin email."
        : "General settings updated successfully",
      data: settings,
      emailChanged,
    });
  } catch (error) {
    console.error("Update general settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update general settings",
      error: error.message,
    });
  }
};

