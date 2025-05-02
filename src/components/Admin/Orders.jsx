import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import { 
  SearchIcon, 
  ChevronLeft, 
  ChevronRight, 
  MoreHorizontal,
  Edit,
  Trash2,
  Check,
  X
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export default function OrdersTable() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get("https://api.jewelsamarth.in/api/order/all", {
          headers: { 'x-auth-token': token }
        });
        setOrders(Array.isArray(res.data.order) ? res.data.order : []);
      } catch (err) {
        console.error("Error fetching orders:", err);
        toast.error("Failed to fetch orders");
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post(
        "http://localhost:5000/api/order/change-status",
        { 
          orderId,
          status: newStatus.toLowerCase() 
        },
        { 
          headers: { 'x-auth-token': token } 
        }
      );
      console.log(res.data)
      
      setOrders(orders.map(order => 
        order._id === orderId ? { ...order, status: newStatus } : order
      ));
      toast.success("Order status updated successfully");
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update order status");
    }
  };

  const handleDeleteOrder = async (orderId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(
        `http://localhost:5000/api/order/delete/${orderId}`,
        { headers: { 'x-auth-token': token } }
      );
      setOrders(orders.filter(order => order._id !== orderId));
      toast.success("Order deleted successfully");
    } catch (err) {
      console.error("Error deleting order:", err);
      toast.error("Failed to delete order");
    }
  };

  const filteredOrders = orders.filter((order) =>
    [
      order.orderNumber?.toLowerCase(),
      order.firstName?.toLowerCase(),
      order.status?.toLowerCase(),
      order.paymentMethod?.toLowerCase(),
      order.finalAmt?.toString()
    ].some((field) => field?.includes(searchTerm.toLowerCase()))
  );

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentData = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const statusColors = {
    pending: {
      bg: "bg-yellow-50",
      text: "text-yellow-700",
      border: "border-yellow-200"
    },
    processing: {
      bg: "bg-purple-50",
      text: "text-purple-700",
      border: "border-purple-200"
    },
    shipped: {
      bg: "bg-blue-50",
      text: "text-blue-700",
      border: "border-blue-200"
    },
    delivered: {
      bg: "bg-green-50",
      text: "text-green-700",
      border: "border-green-200"
    },
    cancelled: {
      bg: "bg-red-50",
      text: "text-red-700",
      border: "border-red-200"
    },
  };

  return (
    <div className="w-full p-6 rounded-[20px]">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-[var(--accent-color)]">Order Management</h2>
          <p className="text-sm text-gray-500">
            {filteredOrders.length} {filteredOrders.length === 1 ? "order" : "orders"} found
          </p>
        </div>
        <div className="relative w-full sm:w-[30%]">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            type="text"
            placeholder="Search orders..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 rounded-[15px] border-gray-200 focus-visible:ring-[var(--accent-color)]"
          />
        </div>
      </div>

      {loading ? (
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
      ) : (
        <>
          <div className="rounded-[20px] border border-gray-200 overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50">
                  <TableHead className="font-medium text-gray-600">Sr</TableHead>
                  <TableHead className="font-medium text-gray-600">Order ID</TableHead>
                  <TableHead className="font-medium text-gray-600">Customer</TableHead>
                  <TableHead className="font-medium text-gray-600">Amount</TableHead>
                  <TableHead className="font-medium text-gray-600">Status</TableHead>
                  <TableHead className="font-medium text-gray-600">Payment</TableHead>
                  <TableHead className="font-medium text-gray-600">Date</TableHead>
                  <TableHead className="font-medium text-gray-600">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentData.map((order, index) => (
                  <TableRow key={order._id} className="hover:bg-gray-50 border-b border-gray-100 last:border-b-0">
                    <TableCell className="text-gray-600">{index + 1 + startIndex}</TableCell>
                    <TableCell className="font-medium">#{order.orderNumber}</TableCell>
                    <TableCell className="capitalize">{order.firstName || "N/A"}</TableCell>
                    <TableCell>₹{order.finalAmt?.toLocaleString()}</TableCell>
                    <TableCell>
                      <Select
                        value={order.status.toLowerCase()}
                        onValueChange={(value) => handleStatusChange(order._id, value)}
                      >
                        <SelectTrigger 
                          className={`w-[150px] rounded-[15px] capitalize ${statusColors[order.status.toLowerCase()]?.bg} ${statusColors[order.status.toLowerCase()]?.text} ${statusColors[order.status.toLowerCase()]?.border}`}
                        >
                          <SelectValue placeholder={order.status} />
                        </SelectTrigger>
                        <SelectContent className="rounded-[15px] border border-gray-200 shadow-sm">
                          {Object.entries(statusColors).map(([status, colors]) => (
                            <SelectItem 
                              key={status} 
                              value={status}
                              className={`rounded-[10px] capitalize cursor-pointer ${colors.text} hover:${colors.bg} focus:${colors.bg}`}
                            >
                              {status}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="uppercase">
                      <span className="px-3 py-1 rounded-full bg-gray-50 text-gray-700 text-xs border border-gray-200">
                        {order.paymentMethod}
                      </span>
                    </TableCell>
                    <TableCell className="text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="rounded-[12px] hover:bg-gray-100"
                          >
                            <MoreHorizontal className="h-4 w-4 text-gray-500" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-40 rounded-[12px] border border-gray-200 shadow-sm">
                          <DropdownMenuItem 
                            className="cursor-pointer rounded-[8px] focus:bg-gray-100"
                            onClick={() => navigate(`/order/${order._id}`)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>View</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem 
                            className="cursor-pointer rounded-[8px] focus:bg-red-50 focus:text-red-600"
                            onClick={() => handleDeleteOrder(order._id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Delete</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
            <div className="text-sm text-gray-500">
              Showing {startIndex + 1} to {Math.min(startIndex + itemsPerPage, filteredOrders.length)}
            </div>
            <div className="flex items-center gap-1">
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="rounded-l-[15px] rounded-r-none border-r-0 px-3"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              
              {[...Array(totalPages)].map((_, index) => {
                if (
                  index === 0 ||
                  index === totalPages - 1 ||
                  (index >= currentPage - 2 && index <= currentPage + 2)
                ) {
                  return (
                    <Button
                      key={index}
                      variant={currentPage === index + 1 ? "default" : ""}
                      size="sm"
                      onClick={() => handlePageChange(index + 1)}
                      className={`rounded-full border-l-0 ${currentPage === index + 1 ? "bg-[var(--accent-color)] border-[var(--accent-color)] text-white" : ""}`}
                    >
                      {index + 1}
                    </Button>
                  );
                } else if (index === currentPage - 3 || index === currentPage + 3) {
                  return (
                    <span 
                      key={index} 
                      className="px-3 py-1.5 text-sm"
                    >
                      ...
                    </span>
                  );
                }
                return null;
              })}
              
              <Button
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="rounded-r-[15px] rounded-l-none border-l-0 px-3"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}