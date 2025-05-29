import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import * as XLSX from 'xlsx';
import {
  SearchIcon,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Eye,
  Trash2,
  Download,
  Filter,
  X,
  AlertCircle,
  PackageSearch,
  ShoppingCart,
  Users,
  CreditCard,
  TrendingUp,
  Package
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_OPTIONS = [
  { value: "all", label: "All Status" },
  { value: "pending", label: "Pending" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
];

const PAYMENT_METHODS = [
  { value: "all", label: "All Methods" },
  { value: "upi", label: "UPI" },
  { value: "razorpay", label: "Razorpay" },
  { value: "cod", label: "Cash on Delivery" },
];

const statusStyles = {
  pending: "bg-[#fffdd0] text-yellow-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-blue-100 text-blue-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

const formatDateTimeForExport = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Skeleton loading component for stats
const StatSkeleton = () => (
  <div className="w-full p-4 flex items-center gap-4 border rounded-[20px] bg-white shadow-sm border-gray-100 animate-pulse">
    <div className="h-7 w-7 rounded-full bg-gray-200"></div>
    <div className="flex-1">
      <div className="h-5 w-3/4 mb-2 bg-gray-200 rounded"></div>
      <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
    </div>
  </div>
);

export default function OrdersTable() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedPayment, setSelectedPayment] = useState("all");
  const [dateRange, setDateRange] = useState({ start: null, end: null });
  const [exportLoading, setExportLoading] = useState(false);

  const itemsPerPage = 10;

  // Calculate stats dynamically using useMemo
  const stats = useMemo(() => {
    const totalOrders = orders.length;
    const uniqueCustomers = new Set(orders.map(order => order.email)).size;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.finalAmt || 0), 0);
    const pendingOrders = orders.filter(order => order.status.toLowerCase() === 'pending').length;

    return {
      totalOrders,
      totalCustomers: uniqueCustomers,
      totalRevenue,
      pendingOrders
    };
  }, [orders]);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("https://api.jewelsamarth.in/api/order/all", {
          headers: { "x-auth-token": token },
        });
        const ordersData = Array.isArray(res.data.order) ? res.data.order : [];
        setOrders(ordersData);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
        setError("Failed to load orders. Please try again later.");
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch = [
        order.orderNumber,
        `${order.firstName} ${order.lastName || ""}`,
        order.status,
        order.paymentMethod,
        order.finalAmt?.toString(),
      ].some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));

      const matchesStatus = selectedStatus === "all" ||
        order.status.toLowerCase() === selectedStatus;

      const matchesPayment = selectedPayment === "all" ||
        order.paymentMethod.toLowerCase() === selectedPayment;

      const orderDate = new Date(order.createdAt);
      const matchesDate = (!dateRange.start || orderDate >= new Date(dateRange.start)) &&
        (!dateRange.end || orderDate <= new Date(dateRange.end));

      return matchesSearch && matchesStatus && matchesPayment && matchesDate;
    });
  }, [orders, searchTerm, selectedStatus, selectedPayment, dateRange]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://api.jewelsamarth.in/api/order/change-status",
        { orderId, status: newStatus },
        { headers: { "x-auth-token": token } }
      );
      
      // Update the orders state - this will automatically trigger stats recalculation
      setOrders(prev =>
        prev.map(order =>
          order._id === orderId ? { ...order, status: newStatus } : order
        )
      );
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error("Status update failed:", err);
      toast.error("Failed to update order status");
    }
  };

  const handleDelete = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://api.jewelsamarth.in/api/order/delete/${orderId}`,
        { headers: { "x-auth-token": token } }
      );
      
      // Update the orders state - this will automatically trigger stats recalculation
      setOrders(prev => prev.filter(order => order._id !== orderId));
      toast.success("Order deleted successfully");
    } catch (err) {
      console.error("Delete failed:", err);
      toast.error("Failed to delete order");
    }
  };

  const handleExport = async () => {
    setExportLoading(true);
    try {
      // Add a small delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 500));

      // Prepare data for Excel export
      const exportData = filteredOrders.map((order, index) => ({
        "Sr. No.": index + 1,
        "Order ID": order.orderNumber,
        "Customer Name": `${order.firstName} ${order.lastName || ""}`.trim(),
        "Email": order.email || "",
        "Phone": order.phone || "",
        "Amount (₹)": order.finalAmt || 0,
        "Status": order.status || "",
        "Payment Method": order.paymentMethod || "",
        "Order Date": formatDateTimeForExport(order.createdAt),
        "Address": `${order.address || ""}, ${order.city || ""}, ${order.state || ""} - ${order.pincode || ""}`.replace(/^[, -]+|[, -]+$/g, ''),
        "Items": order.items ? order.items.map(item => `${item.name} (Qty: ${item.quantity})`).join('; ') : ""
      }));

      // Create workbook and worksheet
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);

      // Set column widths
      const columnWidths = [
        { wch: 8 },   // Sr. No.
        { wch: 15 },  // Order ID
        { wch: 20 },  // Customer Name
        { wch: 25 },  // Email
        { wch: 15 },  // Phone
        { wch: 12 },  // Amount
        { wch: 12 },  // Status
        { wch: 15 },  // Payment Method
        { wch: 18 },  // Order Date
        { wch: 40 },  // Address
        { wch: 50 }   // Items
      ];
      worksheet['!cols'] = columnWidths;

      // Add worksheet to workbook
      XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");

      // Generate filename with current date
      const currentDate = new Date().toISOString().split('T')[0];
      const filename = `orders_export_${currentDate}.xlsx`;

      // Save file
      XLSX.writeFile(workbook, filename);

      toast.success(`Excel file exported successfully as ${filename}`);
    } catch (error) {
      console.error("Export failed:", error);
      toast.error("Failed to export orders. Please try again.");
    } finally {
      setExportLoading(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedStatus("all");
    setSelectedPayment("all");
    setDateRange({ start: null, end: null });
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      {/* Header Navigation */}
      <div className="mb-6 mx-4">
        <div className="flex items-center justify-between bg-gray-50 rounded-[20px] p-4 shadow-sm">
          <div className="flex items-center gap-4">
            <Package className="" size={24} />
            <span className="text-xl font-semibold">All Orders</span>
          </div>
          <Button
            variant="outline"
            onClick={handleExport}
            className="rounded-[12px] border-gray-200 hover:bg-gray-50"
            disabled={filteredOrders.length === 0 || exportLoading}
          >
            {exportLoading ? (
              <>
                <div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-gray-600"></div>
                Exporting...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Export
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Stats Section - Now Dynamic */}
      <div className="mb-8 mx-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            <>
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
              <StatSkeleton />
            </>
          ) : (
            <>
              <div className="w-full p-4 flex items-center gap-4 border rounded-[20px] bg-white shadow-sm border-gray-100">
                <ShoppingCart className="text-blue-600" size={28} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalOrders}</p>
                </div>
              </div>

              <div className="w-full p-4 flex items-center gap-4 border rounded-[20px] bg-white shadow-sm border-gray-100">
                <Users className="text-green-600" size={28} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total Customers</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalCustomers}</p>
                </div>
              </div>

              <div className="w-full p-4 flex items-center gap-4 border rounded-[20px] bg-white shadow-sm border-gray-100">
                <TrendingUp className="text-purple-600" size={28} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString("en-IN")}</p>
                </div>
              </div>

              <div className="w-full p-4 flex items-center gap-4 border rounded-[20px] bg-white shadow-sm border-gray-100">
                <CreditCard className="text-orange-600" size={28} />
                <div className="flex-1">
                  <p className="text-sm text-gray-600">Pending Orders</p>
                  <p className="text-xl font-bold text-gray-900">{stats.pendingOrders}</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Filters Section */}
      <div className="space-y-4 bg-white p-6 rounded-[20px] shadow-sm mx-4 mb-6 border">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-10 rounded-[12px] border-gray-200 focus-visible:ring-2 focus-visible:ring-primary/50"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
          />
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Filters:</span>
          </div>

          <Select
            value={selectedStatus}
            onValueChange={(value) => {
              setSelectedStatus(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] rounded-[12px] border-gray-200">
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px]">
              {STATUS_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-[8px]">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            value={selectedPayment}
            onValueChange={(value) => {
              setSelectedPayment(value);
              setCurrentPage(1);
            }}
          >
            <SelectTrigger className="w-[180px] rounded-[12px] border-gray-200">
              <SelectValue placeholder="Payment method" />
            </SelectTrigger>
            <SelectContent className="rounded-[12px]">
              {PAYMENT_METHODS.map((option) => (
                <SelectItem key={option.value} value={option.value} className="rounded-[8px]">
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-2">
            <Input
              type="date"
              className="w-[150px] rounded-[12px] border-gray-200"
              value={dateRange.start || ""}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            />
            <span className="text-sm text-muted-foreground">to</span>
            <Input
              type="date"
              className="w-[150px] rounded-[12px] border-gray-200"
              value={dateRange.end || ""}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            />
          </div>

          {(searchTerm || selectedStatus !== "all" || selectedPayment !== "all" || dateRange.start || dateRange.end) && (
            <Button
              variant="ghost"
              onClick={resetFilters}
              className="text-muted-foreground rounded-[12px]"
            >
              <X className="mr-1 h-4 w-4" />
              Clear filters
            </Button>
          )}
        </div>
      </div>

      {/* Table Section */}
      <div className="mx-4">
        {error ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center bg-white rounded-[20px] shadow-sm">
            <AlertCircle className="h-12 w-12 text-red-500" />
            <p className="text-lg font-medium">{error}</p>
            <Button
              onClick={() => window.location.reload()}
              className="rounded-[12px]"
            >
              Retry
            </Button>
          </div>
        ) : loading ? (
          <div className="rounded-[20px] border overflow-hidden shadow-sm bg-white">
            <div className="bg-gray-50 p-4">
              <div className="grid grid-cols-8 gap-4">
                <Skeleton className="h-4 w-8 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-20 rounded" />
                <Skeleton className="h-4 w-16 rounded" />
                <Skeleton className="h-4 w-12 rounded" />
              </div>
            </div>
            <div className="flex justify-center items-center h-[50vh] w-full">
              <div className="w-full flex justify-center items-center gap-x-2">
                {[0, 1, 2].map((i) => (
                  <div
                    key={i}
                    className="w-5 h-5 bg-[var(--primary-color)] rounded-full animate-bounce animate-pulse"
                    style={{ animationDelay: `${i * 0.2}s` }}
                  ></div>
                ))}
              </div>
            </div>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 space-y-4 text-center bg-white rounded-[20px] shadow-sm">
            <PackageSearch className="h-12 w-12 text-muted-foreground" />
            <p className="text-lg font-medium">No orders found</p>
            <p className="text-sm text-muted-foreground">
              {orders.length === 0
                ? "No orders have been placed yet."
                : "Try adjusting your search or filters."}
            </p>
            {(searchTerm || selectedStatus !== "all" || selectedPayment !== "all") && (
              <Button
                variant="outline"
                onClick={resetFilters}
                className="rounded-[12px]"
              >
                Clear filters
              </Button>
            )}
          </div>
        ) : (
          <div className="rounded-[20px] border overflow-hidden shadow-sm">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead className="w-[80px] rounded-tl-[20px]">#</TableHead>
                  <TableHead>Order ID</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Payment</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead className="w-[50px] rounded-tr-[20px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentOrders.map((order, index) => (
                  <TableRow key={order._id} className="hover:bg-gray-50/50">
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell className="font-medium">
                      <Button
                        variant="link"
                        className="p-0 h-auto font-medium text-primary hover:text-primary/80"
                        onClick={() => navigate(`/order/${order._id}`)}
                      >
                        #{order.orderNumber}
                      </Button>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium capitalize">{order.firstName} {order.lastName}</div>
                      <div className="text-sm text-muted-foreground lowercase">{order.email}</div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      ₹{order.finalAmt?.toLocaleString("en-IN")}
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.status.toLowerCase()}
                        onValueChange={(value) => handleStatusChange(order._id, value)}
                      >
                        <SelectTrigger className={`w-[140px] capitalize rounded-[12px] ${statusStyles[order.status.toLowerCase()]}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-[12px]">
                          {STATUS_OPTIONS.slice(1).map((status) => (
                            <SelectItem
                              key={status.value}
                              value={status.value}
                              className="capitalize cursor-pointer rounded-[8px]"
                            >
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center rounded-[12px] bg-gray-100 px-3 py-1 text-xs font-medium text-gray-800 capitalize">
                        {order.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell>
                      {formatDate(order.createdAt)}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="rounded-[12px] hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="rounded-[12px] shadow-lg border border-gray-200"
                        >
                          <DropdownMenuItem
                            onClick={() => navigate(`/order/${order._id}`)}
                            className="rounded-[8px] cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(order._id)}
                            className="rounded-[8px] cursor-pointer text-red-600 focus:bg-red-50"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Pagination */}
        {filteredOrders.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-[20px]">
            <div className="text-sm text-muted-foreground">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)} {/*of{" "}
              {filteredOrders.length} entries */}
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant=""
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="rounded-[12px]"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {/* Page numbers */}
              {Array.from({ length: totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                
                // Show first page, last page, and pages around current page
                if (
                  pageNumber === 1 || 
                  pageNumber === totalPages || 
                  (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                ) {
                  return (
                    <Button
                      key={pageNumber}
                      variant={currentPage === pageNumber ? "default" : ""}
                      size="sm"
                      onClick={() => handlePageChange(pageNumber)}
                      className={`rounded-full px-4 hover:bg-gray-200 ${currentPage === pageNumber ? "bg-[var(--accent-color)] text-white hover:text-black" : ""}`}
                    >
                      {pageNumber}
                    </Button>
                  );
                }
                
                // Show ellipsis when skipping pages
                if (
                  (pageNumber === currentPage - 2 && currentPage > 3) ||
                  (pageNumber === currentPage + 2 && currentPage < totalPages - 2)
                ) {
                  return (
                    <span key={`ellipsis-${pageNumber}`} className="px-2">
                      ...
                    </span>
                  );
                }
                
                return null;
              })}
              
              <Button
                variant=""
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="rounded-[12px]"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}