import User from '../models/User.js';
import { sendEmail } from '../config/sendmail.js';
import crypto from 'crypto';

/**
 * Get all employees (admin only)
 */
export const getAllEmployees = async (req, res) => {
  try {
    const { status, page = 1, limit = 20, search } = req.query;
    
    const query = { role: 'employee' };
    
    if (status === 'active') {
      query.banned = false;
    } else if (status === 'inactive') {
      query.banned = true;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const employees = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      employees,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get employees error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to fetch employees',
      error: error.message 
    });
  }
};

/**
 * Create employee account (admin only)
 */
export const createEmployee = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({
        success: false,
        message: 'Name and email are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Create employee user
    const employee = new User({
      name,
      email,
      role: 'employee',
      emailVerified: false,
      banned: false,
      emailVerificationToken: verificationToken,
      emailVerificationExpiry: verificationExpiry
    });

    await employee.save();

    // Send verification email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-employee?token=${verificationToken}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to PrintEmporium!</h1>
          </div>
          <div class="content">
            <h2>Hello ${name},</h2>
            <p>You have been invited to join PrintEmporium as an <strong>Employee</strong>.</p>
            <p>To activate your account and set up your password, please click the button below:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Activate Account</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; background: white; padding: 10px; border-radius: 5px;">${verificationUrl}</p>
            <p><strong>This link will expire in 24 hours.</strong></p>
            <p>If you didn't expect this invitation, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} PrintEmporium. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(email, 'Welcome to PrintEmporium - Activate Your Employee Account', emailHtml);

    res.status(201).json({
      success: true,
      message: 'Employee account created. Verification email sent.',
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role,
        emailVerified: employee.emailVerified
      }
    });

  } catch (error) {
    console.error('Create employee error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to create employee account',
      error: error.message 
    });
  }
};

/**
 * Verify employee account and set password
 */
export const verifyEmployee = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({
        success: false,
        message: 'Token and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters'
      });
    }

    // Find user with valid token
    const employee = await User.findOne({
      emailVerificationToken: token,
      emailVerificationExpiry: { $gt: new Date() },
      role: 'employee'
    });

    if (!employee) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token'
      });
    }

    // Update employee - set password via better-auth
    employee.emailVerified = true;
    employee.emailVerificationToken = undefined;
    employee.emailVerificationExpiry = undefined;
    
    await employee.save();

    res.json({
      success: true,
      message: 'Account verified successfully. You can now log in.',
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: employee.role
      }
    });

  } catch (error) {
    console.error('Verify employee error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to verify employee account',
      error: error.message 
    });
  }
};

/**
 * Update employee status (admin only)
 */
export const updateEmployeeStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { banned } = req.body;

    if (typeof banned !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Banned status must be a boolean'
      });
    }

    const employee = await User.findOne({ _id: id, role: 'employee' });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    employee.banned = banned;
    await employee.save();

    res.json({
      success: true,
      message: `Employee ${banned ? 'deactivated' : 'activated'} successfully`,
      employee: {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        banned: employee.banned
      }
    });

  } catch (error) {
    console.error('Update employee status error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to update employee status',
      error: error.message 
    });
  }
};

/**
 * Delete employee (admin only)
 */
export const deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({ _id: id, role: 'employee' });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    await User.deleteOne({ _id: id });

    res.json({
      success: true,
      message: 'Employee deleted successfully'
    });

  } catch (error) {
    console.error('Delete employee error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to delete employee',
      error: error.message 
    });
  }
};

/**
 * Resend verification email (admin only)
 */
export const resendVerification = async (req, res) => {
  try {
    const { id } = req.params;

    const employee = await User.findOne({ _id: id, role: 'employee' });

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee not found'
      });
    }

    if (employee.emailVerified) {
      return res.status(400).json({
        success: false,
        message: 'Employee account is already verified'
      });
    }

    // Generate new verification token
    const verificationToken = crypto.randomBytes(32).toString('hex');
    const verificationExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000);

    employee.emailVerificationToken = verificationToken;
    employee.emailVerificationExpiry = verificationExpiry;
    await employee.save();

    // Send verification email
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
    const verificationUrl = `${frontendUrl}/verify-employee?token=${verificationToken}`;

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Activate Your Account</h1>
          </div>
          <div class="content">
            <h2>Hello ${employee.name},</h2>
            <p>Here's a new link to activate your PrintEmporium employee account:</p>
            <div style="text-align: center;">
              <a href="${verificationUrl}" class="button">Activate Account</a>
            </div>
            <p>This link will expire in 24 hours.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    await sendEmail(employee.email, 'Activate Your PrintEmporium Account', emailHtml);

    res.json({
      success: true,
      message: 'Verification email sent successfully'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ 
      success: false,
      message: 'Failed to resend verification email',
      error: error.message 
    });
  }
};
