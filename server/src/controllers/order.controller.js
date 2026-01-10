import Order from '../models/order.model.js';
import { uploadToCloudinary, uploadRawToCloudinary, getUrlFromPublicId, getRawUrlFromPublicId } from '../utils/cloudinary-helper.js';
import { convertFileToPdf } from './fileConversion.controller.js';

/**
 * Upload order file to Cloudinary and convert to PDF
 */
export const uploadOrderFile = async (req, res) => {
  try {
    const { fileData, fileName, pdfData } = req.body;

    if (!fileData || !fileName) {
      return res.status(400).json({ 
        success: false,
        error: 'File data and name are required' 
      });
    }

    const customPublicId = fileName.split('.')[0];
    const fileExtension = fileName.split('.').pop().toLowerCase();

    // 1. Upload original file as RAW to preserve original format
    console.log(`Uploading original ${fileName} to Cloudinary (raw)...`);
    const originalUpload = await uploadRawToCloudinary(
      fileData,
      'printemporium/orders/originals',
      `${customPublicId}.${fileExtension}` // Include extension in public_id
    );

    let pdfPublicId = null;

    // 2. Handle PDF version
    if (fileExtension === 'pdf') {
      pdfPublicId = originalUpload.public_id;
      console.log('File is already PDF, using same file for both');
    } else if (pdfData) {
      // Use the PDF data provided by frontend (converted on client)
      console.log(`Uploading provided PDF data for ${fileName}...`);
      const pdfUpload = await uploadToCloudinary(
        pdfData,
        'printemporium/orders/pdfs',
        `${customPublicId}_pdf`
      );
      pdfPublicId = pdfUpload.public_id;
    } else {
      // Optional: If no pdfData provided, we could convert it here on server
      // But for now, let's try to upload the original as auto and hope Cloudinary handles it
      // or use the server-side converter if we have the buffer.
      // Since we have base64, we'd need to convert it to buffer first.
      
      console.log(`No PDF data provided, attempting server-side conversion for ${fileName}...`);
      try {
        const base64Content = fileData.split(',')[1] || fileData;
        const buffer = Buffer.from(base64Content, 'base64');
        const pdfBuffer = await convertFileToPdf(buffer, fileExtension);
        const pdfBase64 = `data:application/pdf;base64,${pdfBuffer.toString('base64')}`;
        
        const pdfUpload = await uploadToCloudinary(
          pdfBase64,
          'printemporium/orders/pdfs',
          `${customPublicId}_pdf`
        );
        pdfPublicId = pdfUpload.public_id;
      } catch (convError) {
        console.warn('Server-side conversion failed, falling back to auto upload:', convError.message);
        const pdfUpload = await uploadToCloudinary(
          fileData,
          'printemporium/orders/pdfs',
          `${customPublicId}_pdf`
        );
        pdfPublicId = pdfUpload.public_id;
      }
    }

    // Return both public_ids
    res.json({
      success: true,
      filePublicId: originalUpload.public_id,
      pdfPublicId: pdfPublicId
    });

  } catch (error) {
    console.error('File upload error:', error);
    res.status(500).json({ 
      success: false,
      error: 'Failed to upload file',
      details: error.message 
    });
  }
};

/**
 * Create a new order
 */
export const createOrder = async (req, res) => {
  try {
    const { items, deliveryInfo, pricing } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ error: 'Order must contain at least one item' });
    }

    if (!deliveryInfo) {
      return res.status(400).json({ error: 'Delivery information is required' });
    }

    // Validate required delivery fields
    const requiredFields = ['fullName', 'phone', 'email', 'address', 'city', 'state', 'pincode'];
    for (const field of requiredFields) {
      if (!deliveryInfo[field]) {
        return res.status(400).json({ error: `${field} is required` });
      }
    }

    // Generate Order Number
    const date = new Date();
    const year = date.getFullYear().toString().slice(-2);
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    
    // Count orders today for sequence
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    
    const count = await Order.countDocuments({
      createdAt: { $gte: startOfDay, $lte: endOfDay }
    });
    
    const sequence = (count + 1).toString().padStart(4, '0');
    const orderNumber = `PE${year}${month}${day}${sequence}`;

    // Create the order
    const order = new Order({
      userId,
      orderNumber,
      items: items.map(item => ({
        serviceId: item.serviceId,
        serviceName: item.serviceName,
        fileName: item.file.name,
        fileSize: item.file.size,
        pageCount: item.file.pageCount,
        filePublicId: item.file.filePublicId || null, // Original file public_id
        pdfPublicId: item.file.pdfPublicId || null,   // PDF file public_id
        configuration: item.configuration,
        pricing: item.pricing
      })),
      deliveryInfo,
      pricing,
      status: 'pending',
      paymentStatus: 'pending',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000) // 5 days from now
    });

    await order.save();

    res.status(201).json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus,
        total: order.pricing.total,
        estimatedDelivery: order.estimatedDelivery,
        createdAt: order.createdAt
      }
    });

  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ 
      error: 'Failed to create order',
      details: error.message 
    });
  }
};

/**
 * Get all orders for the current user
 */
export const getUserOrders = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const { status, page = 1, limit = 10 } = req.query;
    
    const query = { userId };
    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    // Convert public_ids to URLs
    const ordersWithUrls = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        fileUrl: item.filePublicId ? getRawUrlFromPublicId(item.filePublicId) : null,
        pdfUrl: item.pdfPublicId ? getUrlFromPublicId(item.pdfPublicId) : null,
      }))
    }));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders: ordersWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get user orders error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
};

/**
 * Get a single order by ID
 */
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const order = await Order.findOne({ _id: id, userId }).lean();

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Convert public_ids to URLs
    const orderWithUrls = {
      ...order,
      items: order.items.map(item => ({
        ...item,
        fileUrl: item.filePublicId ? getRawUrlFromPublicId(item.filePublicId) : null,
        pdfUrl: item.pdfPublicId ? getUrlFromPublicId(item.pdfPublicId) : null,
      }))
    };

    res.json({
      success: true,
      order: orderWithUrls
    });

  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order',
      details: error.message 
    });
  }
};

/**
 * Update order payment status (for payment gateway callback)
 */
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus, paymentId, paymentMethod } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    order.paymentStatus = paymentStatus;
    if (paymentId) order.paymentId = paymentId;
    if (paymentMethod) order.paymentMethod = paymentMethod;

    // Update order status based on payment
    if (paymentStatus === 'paid') {
      order.status = 'confirmed';
    } else if (paymentStatus === 'failed') {
      order.status = 'cancelled';
    }

    await order.save();

    res.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        paymentStatus: order.paymentStatus
      }
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({ 
      error: 'Failed to update payment status',
      details: error.message 
    });
  }
};

/**
 * Cancel an order (user can cancel pending orders)
 */
export const cancelOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const order = await Order.findOne({ _id: id, userId });

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Only allow cancellation of pending or confirmed orders
    if (!['pending', 'confirmed'].includes(order.status)) {
      return res.status(400).json({ 
        error: 'Cannot cancel order',
        message: 'Order is already being processed and cannot be cancelled'
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({
      success: true,
      message: 'Order cancelled successfully',
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status
      }
    });

  } catch (error) {
    console.error('Cancel order error:', error);
    res.status(500).json({ 
      error: 'Failed to cancel order',
      details: error.message 
    });
  }
};

// ============ ADMIN ENDPOINTS ============

/**
 * Get all orders (admin only)
 */
export const getAllOrders = async (req, res) => {
  try {
    const { status, paymentStatus, page = 1, limit = 20, search } = req.query;
    
    const query = {};
    if (status) query.status = status;
    if (paymentStatus) query.paymentStatus = paymentStatus;
    if (search) {
      query.$or = [
        { orderNumber: { $regex: search, $options: 'i' } },
        { 'deliveryInfo.fullName': { $regex: search, $options: 'i' } },
        { 'deliveryInfo.phone': { $regex: search, $options: 'i' } }
      ];
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .populate('userId', 'name email')
      .lean();

    // Convert public_ids to URLs
    const ordersWithUrls = orders.map(order => ({
      ...order,
      items: order.items.map(item => ({
        ...item,
        fileUrl: item.filePublicId ? getRawUrlFromPublicId(item.filePublicId) : null,
        pdfUrl: item.pdfPublicId ? getUrlFromPublicId(item.pdfPublicId) : null,
      }))
    }));

    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders: ordersWithUrls,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get all orders error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch orders',
      details: error.message 
    });
  }
};

/**
 * Update order status (admin only)
 */
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, trackingNumber, notes } = req.body;

    const order = await Order.findById(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    if (status) order.status = status;
    if (trackingNumber) order.trackingNumber = trackingNumber;
    if (notes) order.notes = notes;

    await order.save();

    res.json({
      success: true,
      order: {
        id: order._id,
        orderNumber: order.orderNumber,
        status: order.status,
        trackingNumber: order.trackingNumber
      }
    });

  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ 
      error: 'Failed to update order status',
      details: error.message 
    });
  }
};

/**
 * Get order statistics (admin only)
 */
export const getOrderStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const thisMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    
    const [
      totalOrders,
      todayOrders,
      monthOrders,
      pendingOrders,
      processingOrders,
      completedOrders,
      revenueStats
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.countDocuments({ createdAt: { $gte: thisMonth } }),
      Order.countDocuments({ status: 'pending' }),
      Order.countDocuments({ status: { $in: ['confirmed', 'processing', 'printing'] } }),
      Order.countDocuments({ status: 'delivered' }),
      Order.aggregate([
        { $match: { paymentStatus: 'paid' } },
        { $group: { _id: null, total: { $sum: '$pricing.total' } } }
      ])
    ]);

    res.json({
      success: true,
      stats: {
        totalOrders,
        todayOrders,
        monthOrders,
        pendingOrders,
        processingOrders,
        completedOrders,
        totalRevenue: revenueStats[0]?.total || 0
      }
    });

  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch order statistics',
      details: error.message 
    });
  }
};