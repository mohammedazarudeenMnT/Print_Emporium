import GeneralSettings from "../models/GeneralSettings.js";
import User from "../models/User.js";
import nodemailer from "nodemailer";
import { getEmailConfig } from "../config/sendmail.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary-helper.js";

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
        companyName: "PrintEmporium", // Updated default
        companyEmail: process.env.ADMIN_EMAIL || "info@printemporium.com",
        companyPhone: "+91 1234567890",
        companyAddress: "123 Business Street, City, State, PIN",
        companyDescription:
          "PrintEmporium - Your one stop shop for printing needs.",
        companyLogo: "/images/logo/logo.webp",
      });
    }

    return res.status(200).json({
      success: true,
      data: generalSettings,
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
      companyAddress,
      companyDescription,
      companyLogo,
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
        message: "All fields are required",
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

    // Handle Cloudinary upload if companyLogo is a base64 string
    let uploadedLogoUrl = companyLogo;
    if (companyLogo && companyLogo.startsWith("data:image")) {
      // If there's an existing logo, try to delete it from Cloudinary
      if (settings?.companyLogo) {
        await deleteFromCloudinary(settings.companyLogo);
      }
      uploadedLogoUrl = await uploadToCloudinary(companyLogo, "company_assets");
    }

    if (!settings) {
      settings = await GeneralSettings.create({
        settingsId: "global",
        companyName,
        companyEmail: emailChanged ? oldEmail : companyEmail,
        companyPhone,
        companyAddress,
        companyDescription,
        companyLogo: uploadedLogoUrl || null,
        lastUpdatedBy: req.user?.id || "init",
      });
    } else {
      settings.companyName = companyName;
      if (!emailChanged) {
        settings.companyEmail = companyEmail;
      }
      settings.companyPhone = companyPhone;
      settings.companyAddress = companyAddress;
      settings.companyDescription = companyDescription;
      if (companyLogo !== undefined) {
        settings.companyLogo = uploadedLogoUrl;
      }
      settings.lastUpdatedBy = req.user?.id;
      await settings.save();
    }

    if (emailChanged) {
      console.log(`🔄 Email change requested: ${oldEmail} → ${companyEmail}`);
      
      try {
        const adminUser = await User.findById(req.user.id);

        if (!adminUser) {
            throw new Error('Admin user not found');
        }
        if (adminUser.role !== "admin") {
           throw new Error('User is not an admin');
        }

        const verificationToken = Math.random().toString(36).substring(2, 15) + 
                                 Math.random().toString(36).substring(2, 15);
        
        settings.pendingEmailChange = companyEmail;
        settings.emailVerificationToken = verificationToken;
        settings.emailVerificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); 
        await settings.save();

        // Send email logic
         const emailConfig = await getEmailConfig();
         const transporter = nodemailer.createTransport(emailConfig);
         const verificationUrl = `${process.env.BETTER_AUTH_URL}/api/settings/verify-email-change?token=${verificationToken}`;
         
         await transporter.sendMail({
            from: emailConfig.from,
            to: companyEmail,
            subject: "Verify Your New Admin Email Address",
            html: `<p>Click here to verify: <a href="${verificationUrl}">${verificationUrl}</a></p>`
         });

      } catch (emailError) {
        return res.status(200).json({
          success: true,
          message: "General settings updated successfully, but failed to send verification email.",
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

export const getPublicSettings = async (req, res) => {
  try {
    const generalSettings = await GeneralSettings.findOne({ settingsId: "global" }).select(
        "companyName companyEmail companyPhone companyAddress companyDescription companyLogo"
    );

    const combinedSettings = {
      companyName: generalSettings?.companyName || "PrintEmporium",
      companyEmail: generalSettings?.companyEmail || "info@printemporium.com",
      companyPhone: generalSettings?.companyPhone || "+91 1234567890",
      companyAddress: generalSettings?.companyAddress || "123 Business Street",
      companyDescription: generalSettings?.companyDescription || "PrintEmporium description",
      companyLogo: generalSettings?.companyLogo || '/images/logo/logo.webp',
    };

    return res.status(200).json({
      success: true,
      data: combinedSettings,
    });
  } catch (error) {
    console.error("Get public settings error:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch public settings",
      error: error.message,
    });
  }
};
