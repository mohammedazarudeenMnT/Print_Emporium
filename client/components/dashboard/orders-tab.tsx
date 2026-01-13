"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Package,
  Search,
  Filter,
  Eye,
  Loader2,
  AlertCircle,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  ChevronLeft,
  ChevronRight,
  Download,
  FileText,
  Calendar,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

interface OrdersTabProps {
  user: any;
}

const statusConfig = {
  pending: { label: "Pending", icon: Clock, color: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900 dark:text-yellow-200" },
  confirmed: { label: "Confirmed", icon: CheckCircle2, color: "text-blue-600 bg-blue-100 dark:bg-blue-900 dark:text-blue-200" },
  processing: { label: "Processing", icon: Package, color: "text-purple-600 bg-purple-100 dark:bg-purple-900 dark:text-purple-200" },
  printing: { label: "Printing", icon: Package, color: "text-indigo-600 bg-indigo-100 dark:bg-indigo-900 dark:text-indigo-200" },
  shipped: { label: "Shipped", icon: Truck, color: "text-cyan-600 bg-cyan-100 dark:bg-cyan-900 dark:text-cyan-200" },
  delivered: { label: "Delivered", icon: CheckCircle2, color: "text-green-600 bg-green-100 dark:bg-green-900 dark:text-green-200" },
  cancelled: { label: "Cancelled", icon: XCircle, color: "text-destructive bg-destructive/10" },
};

export function OrdersTab({ user }: OrdersTabProps) {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);

  const isAdminOrEmployee = user.role === "admin" || user.role === "employee";

  useEffect(() => {
    fetchOrders();
  }, [page, statusFilter, search]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);

      const endpoint = isAdminOrEmployee ? "/api/orders/admin/all" : "/api/orders/my-orders";
      const params: any = { page, limit: 10 };
      
      if (statusFilter !== "all") params.status = statusFilter;
      if (search) params.search = search;

      const response = await axiosInstance.get(endpoint, { params });

      if (response.data.success) {
        setOrders(response.data.orders);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (err: any) {
      console.error("Failed to fetch orders:", err);
      setError(err.response?.data?.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const response = await axiosInstance.put(
        `/api/orders/admin/${orderId}/status`,
        { status: newStatus }
      );

      if (response.data.success) {
        fetchOrders();
        if (selectedOrder?._id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err: any) {
      console.error("Failed to update order status:", err);
      alert(err.response?.data?.message || "Failed to update order status");
    }
  };

  const handleDownloadInvoice = async (order: any) => {
    if (order.paymentStatus !== "paid") {
      toast.error("Invoice can only be generated for paid orders");
      return;
    }

    try {
      toast.info("Generating invoice...");
      
      // Download invoice from backend
      const response = await axiosInstance.get(`/api/orders/${order._id}/invoice`, {
        responseType: 'blob',
      });
      
      // Create blob and download
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Invoice-${order.orderNumber}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Invoice downloaded successfully");
    } catch (err: any) {
      console.error("Failed to download invoice:", err);
      toast.error(err.response?.data?.error || "Failed to download invoice");
    }
  };

  if (loading && orders.length === 0) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Error Loading Orders</h3>
        <p className="text-muted-foreground mb-4">{error}</p>
        <Button onClick={fetchOrders}>Try Again</Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6">
        <div className="flex items-center gap-4 mb-4">
          <Package className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-xl font-bold text-foreground">
              {isAdminOrEmployee ? "All Orders" : "My Orders"}
            </h2>
            <p className="text-sm text-muted-foreground">
              {isAdminOrEmployee
                ? "Manage and track all customer orders"
                : "View and track your order history"}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by order number, name, or phone..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="processing">Processing</SelectItem>
              <SelectItem value="printing">Printing</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Orders List */}
      {orders.length === 0 ? (
        <Card className="p-12 text-center">
          <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold mb-2">No Orders Found</h3>
          <p className="text-muted-foreground">
            {search || statusFilter !== "all"
              ? "Try adjusting your filters"
              : "You haven't placed any orders yet"}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const statusInfo = statusConfig[order.status as keyof typeof statusConfig] || {
              label: order.status,
              icon: Clock,
              color: "text-muted-foreground bg-muted"
            };
            const StatusIcon = statusInfo.icon;

            const isScheduled = order.deliveryInfo?.scheduleDelivery && order.estimatedDelivery;

            return (
              <Card key={order._id} className={cn(
                "p-6 hover:shadow-md transition-shadow",
                isScheduled && "border-2 border-primary/30 bg-primary/5"
              )}>
                <div className="space-y-4">
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2 flex-wrap">
                        <h3 className="font-bold text-foreground text-lg">
                          #{order.orderNumber}
                        </h3>
                        {isScheduled && (
                          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold bg-primary text-primary-foreground">
                            <Calendar className="h-3 w-3" />
                            Scheduled: {new Date(order.estimatedDelivery).toLocaleDateString()}
                          </span>
                        )}
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", statusInfo.color)}>
                          <StatusIcon className="h-3 w-3" />
                          {statusInfo.label}
                        </span>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          order.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        )}>
                          {order.paymentStatus === "paid" ? "Paid" : "Pending Payment"}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Ordered on {new Date(order.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      {isAdminOrEmployee && order.status !== "delivered" && order.status !== "cancelled" && (
                        <Select
                          value={order.status}
                          onValueChange={(value) => updateOrderStatus(order._id, value)}
                        >
                          <SelectTrigger className="w-[140px]">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="pending">Pending</SelectItem>
                            <SelectItem value="confirmed">Confirmed</SelectItem>
                            <SelectItem value="processing">Processing</SelectItem>
                            <SelectItem value="printing">Printing</SelectItem>
                            <SelectItem value="shipped">Shipped</SelectItem>
                            <SelectItem value="delivered">Delivered</SelectItem>
                            <SelectItem value="cancelled">Cancelled</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedOrder(order)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        Details
                      </Button>
                    </div>
                  </div>

                  {/* Customer & Order Info Grid */}
                  {isAdminOrEmployee && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-muted/50 rounded-lg">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Customer</p>
                        <p className="font-medium text-sm">{order.deliveryInfo?.fullName || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{order.deliveryInfo?.phone || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Location</p>
                        <p className="font-medium text-sm">{order.deliveryInfo?.city || 'N/A'}, {order.deliveryInfo?.state || 'N/A'}</p>
                        <p className="text-xs text-muted-foreground">{order.deliveryInfo?.pincode || 'N/A'}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Order Value</p>
                        <p className="font-bold text-lg text-primary">₹{order.pricing?.total?.toFixed(2) || '0.00'}</p>
                        <p className="text-xs text-muted-foreground">{order.items?.length || 0} item(s)</p>
                      </div>
                    </div>
                  )}

                  {/* Items Summary */}
                  <div className="space-y-2">
                    {order.items?.slice(0, 2).map((item: any, idx: number) => (
                      <div key={idx} className="flex items-center justify-between text-sm p-2 bg-muted/30 rounded">
                        <div className="flex-1">
                          <p className="font-medium">{item.serviceName || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">
                            {item.fileName || 'N/A'} • {item.pageCount || 0} pages • {item.configuration?.copies || 1} {item.configuration?.copies > 1 ? 'copies' : 'copy'}
                          </p>
                          {isAdminOrEmployee && (
                            <div className="flex items-center gap-2 mt-1">
                              <p className="text-xs text-muted-foreground">
                                {item.configuration?.printType} • {item.configuration?.paperSize} • {item.configuration?.paperType}
                              </p>
                              <div className="flex gap-1">
                                {item.fileUrl && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary">
                                    <Download className="h-2.5 w-2.5" />
                                    Original
                                  </span>
                                )}
                                {item.pdfUrl && (
                                  <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs bg-primary/10 text-primary">
                                    <FileText className="h-2.5 w-2.5" />
                                    PDF
                                  </span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                        <p className="font-semibold">₹{item.pricing?.subtotal?.toFixed(2) || '0.00'}</p>
                      </div>
                    )) || <p className="text-sm text-muted-foreground">No items</p>}
                    {order.items?.length > 2 && (
                      <p className="text-xs text-muted-foreground text-center">
                        +{order.items.length - 2} more item(s)
                      </p>
                    )}
                  </div>

                  {/* User View - Simple Summary */}
                  {!isAdminOrEmployee && (
                    <div className="flex items-center justify-between text-sm pt-2 border-t border-border">
                      <div>
                        <p className="text-muted-foreground">{order.items?.length || 0} item(s)</p>
                      </div>
                      <p className="font-bold text-lg">₹{order.pricing?.total?.toFixed(2) || '0.00'}</p>
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <Card
            className="max-w-4xl w-full max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-6 pb-4 border-b border-border">
                <div>
                  <div className="flex items-center gap-3 flex-wrap">
                    <h2 className="text-2xl font-bold">Order #{selectedOrder.orderNumber}</h2>
                    {selectedOrder.deliveryInfo?.scheduleDelivery && selectedOrder.estimatedDelivery && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-bold bg-primary text-primary-foreground">
                        <Calendar className="h-4 w-4" />
                        Scheduled Delivery
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Placed on {new Date(selectedOrder.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {selectedOrder.paymentStatus === "paid" && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadInvoice(selectedOrder)}
                      className="gap-2"
                    >
                      <Download className="h-4 w-4" />
                      Invoice
                    </Button>
                  )}
                  <Button variant="ghost" size="icon" onClick={() => setSelectedOrder(null)}>
                    <XCircle className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Order Status */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order Status
                    </h3>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Order Status</span>
                        <span className={cn("inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium", statusConfig[selectedOrder.status as keyof typeof statusConfig]?.color || "text-muted-foreground bg-muted")}>
                          {statusConfig[selectedOrder.status as keyof typeof statusConfig]?.label || selectedOrder.status}
                        </span>
                      </div>
                      <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <span className="text-sm">Payment Status</span>
                        <span className={cn(
                          "px-2 py-1 rounded-full text-xs font-medium",
                          selectedOrder.paymentStatus === "paid"
                            ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                            : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                        )}>
                          {selectedOrder.paymentStatus === "paid" ? "Paid" : "Pending"}
                        </span>
                      </div>
                      {selectedOrder.paymentId && (
                        <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                          <span className="text-sm">Payment ID</span>
                          <span className="text-xs font-mono">{selectedOrder.paymentId}</span>
                        </div>
                      )}
                      {selectedOrder.estimatedDelivery && (
                        <div className={cn(
                          "flex items-center justify-between p-3 rounded-lg",
                          selectedOrder.deliveryInfo?.scheduleDelivery 
                            ? "bg-primary/10 border-2 border-primary/30" 
                            : "bg-muted"
                        )}>
                          <span className="text-sm font-medium flex items-center gap-2">
                            {selectedOrder.deliveryInfo?.scheduleDelivery && (
                              <Calendar className="h-4 w-4 text-primary" />
                            )}
                            {selectedOrder.deliveryInfo?.scheduleDelivery ? "Scheduled Delivery" : "Est. Delivery"}
                          </span>
                          <span className={cn(
                            "text-xs font-bold",
                            selectedOrder.deliveryInfo?.scheduleDelivery && "text-primary"
                          )}>
                            {new Date(selectedOrder.estimatedDelivery).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Delivery Information */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Truck className="h-4 w-4" />
                      Delivery Information
                    </h3>
                    <div className="p-4 bg-muted rounded-lg space-y-2 text-sm">
                      <div>
                        <p className="text-xs text-muted-foreground">Full Name</p>
                        <p className="font-medium">{selectedOrder.deliveryInfo?.fullName || 'N/A'}</p>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-xs text-muted-foreground">Phone</p>
                          <p className="font-medium">{selectedOrder.deliveryInfo?.phone || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Email</p>
                          <p className="font-medium text-xs">{selectedOrder.deliveryInfo?.email || 'N/A'}</p>
                        </div>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Address</p>
                        <p className="font-medium">
                          {selectedOrder.deliveryInfo?.address || 'N/A'}
                        </p>
                        <p className="font-medium">
                          {selectedOrder.deliveryInfo?.city || ''}, {selectedOrder.deliveryInfo?.state || ''} - {selectedOrder.deliveryInfo?.pincode || ''}
                        </p>
                      </div>
                      {selectedOrder.deliveryInfo?.deliveryNotes && (
                        <div>
                          <p className="text-xs text-muted-foreground">Delivery Notes</p>
                          <p className="font-medium">{selectedOrder.deliveryInfo.deliveryNotes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Column */}
                <div className="space-y-6">
                  {/* Order Items */}
                  <div>
                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                      <Package className="h-4 w-4" />
                      Order Items ({selectedOrder.items?.length || 0})
                    </h3>
                    <div className="space-y-3">
                      {selectedOrder.items?.map((item: any, idx: number) => (
                        <div key={idx} className="p-4 bg-muted rounded-lg space-y-2">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <p className="font-medium text-sm">{item.serviceName || 'N/A'}</p>
                              <p className="text-xs text-muted-foreground mt-1">{item.fileName || 'N/A'}</p>
                            </div>
                            <p className="font-bold text-primary">₹{item.pricing?.subtotal?.toFixed(2) || '0.00'}</p>
                          </div>

                          {/* File Download Buttons */}
                          <div className="flex gap-2 pt-2">
                            {item.fileUrl && (
                              <a
                                href={item.fileUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <Button variant="outline" size="sm" className="w-full">
                                  <Download className="h-3 w-3 mr-2" />
                                  Original File
                                </Button>
                              </a>
                            )}
                            {item.pdfUrl && (
                              <a
                                href={item.pdfUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1"
                              >
                                <Button variant="outline" size="sm" className="w-full">
                                  <FileText className="h-3 w-3 mr-2" />
                                  PDF File
                                </Button>
                              </a>
                            )}
                            {!item.fileUrl && !item.pdfUrl && (
                              <p className="text-xs text-muted-foreground">No files available</p>
                            )}
                          </div>
                          
                          {/* Configuration Details */}
                          <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-border">
                            <div>
                              <span className="text-muted-foreground">Pages:</span>
                              <span className="ml-1 font-medium">{item.pageCount || 0}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Copies:</span>
                              <span className="ml-1 font-medium">{item.configuration?.copies || 1}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Print:</span>
                              <span className="ml-1 font-medium capitalize">{item.configuration?.printType || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Size:</span>
                              <span className="ml-1 font-medium uppercase">{item.configuration?.paperSize || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Paper:</span>
                              <span className="ml-1 font-medium capitalize">{item.configuration?.paperType || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">GSM:</span>
                              <span className="ml-1 font-medium">{item.configuration?.gsm || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Side:</span>
                              <span className="ml-1 font-medium capitalize">{item.configuration?.printSide || 'N/A'}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Binding:</span>
                              <span className="ml-1 font-medium capitalize">{item.configuration?.bindingOption || 'None'}</span>
                            </div>
                          </div>

                          {/* Pricing Breakdown */}
                          {isAdminOrEmployee && (
                            <div className="text-xs space-y-1 pt-2 border-t border-border">
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Base Price/Page:</span>
                                <span>₹{item.pricing?.basePricePerPage?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-muted-foreground">Final Price/Page:</span>
                                <span>₹{item.pricing?.pricePerPage?.toFixed(2) || '0.00'}</span>
                              </div>
                              <div className="flex justify-between font-medium">
                                <span>Total Pages × Copies:</span>
                                <span>{item.pricing?.totalPages || 0} × {item.pricing?.copies || 1}</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )) || <p className="text-muted-foreground text-sm">No items</p>}
                    </div>
                  </div>

                  {/* Pricing Summary */}
                  <div>
                    <h3 className="font-semibold mb-3">Pricing Summary</h3>
                    <div className="space-y-2 p-4 bg-muted rounded-lg">
                      <div className="flex justify-between text-sm pb-2 border-b border-border">
                        <span className="text-muted-foreground">Subtotal</span>
                        <span>₹{selectedOrder.pricing?.subtotal?.toFixed(2) || '0.00'}</span>
                      </div>
                      <div className="flex justify-between text-lg font-bold pt-2">
                        <span>Total Amount</span>
                        <span className="text-primary">₹{selectedOrder.pricing?.total?.toFixed(2) || '0.00'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
