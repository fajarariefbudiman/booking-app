import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building, Users, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle, Search, Download, Filter, MoreVertical, Eye, Edit, Trash2, LayoutDashboard, Home, LogOut, Settings, Bell, Menu, X } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // State untuk data dari API
  const [allBookings, setAllBookings] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allRukos, setAllRukos] = useState([]);
  const [stats, setStats] = useState({
    totalRukos: 0,
    totalUsers: 0,
    activeBookings: 0,
    monthlyRevenue: 0,
    pendingPayments: 0,
    completedBookings: 0,
    cancelledBookings: 0,
  });

  const API_BASE = "https://booking-api-production-8f43.up.railway.app/api";

  useEffect(() => {
    checkAdminAccess();
    fetchDashboardData();
  }, []);

  const checkAdminAccess = () => {
    const userStr = localStorage.getItem("user");
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "You do not have admin privileges.",
          variant: "destructive",
        });
        navigate("/");
      }
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Please login first.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Fetch all data
      const [bookingsRes, usersRes, rukosRes] = await Promise.all([
        axios.get(`${API_BASE}/bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/users`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        axios.get(`${API_BASE}/ruko`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      setAllBookings(bookingsRes.data || []);
      setAllUsers(usersRes.data || []);
      setAllRukos(rukosRes.data || []);

      // Calculate stats
      const bookings = bookingsRes.data || [];
      const activeCount = bookings.filter((b: any) => b.booking_status === "confirmed" && b.payment_status === "paid").length;

      const monthlyRevenue = bookings
        .filter((b: any) => {
          const createdDate = new Date(b.created_at);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear() && b.payment_status === "paid";
        })
        .reduce((sum: number, b: any) => sum + b.total_price, 0);

      const pendingCount = bookings.filter((b: any) => b.payment_status === "pending").length;

      const completedCount = bookings.filter((b: any) => b.booking_status === "confirmed").length;

      const cancelledCount = bookings.filter((b: any) => b.booking_status === "cancelled" || b.booking_status === "rejected").length;

      setStats({
        totalRukos: rukosRes.data?.length || 0,
        totalUsers: usersRes.data?.length || 0,
        activeBookings: activeCount,
        monthlyRevenue: monthlyRevenue,
        pendingPayments: pendingCount,
        completedBookings: completedCount,
        cancelledBookings: cancelledCount,
      });

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);

      if (error.response?.status === 401) {
        toast({
          title: "Error",
          description: "Session expired. Please login again.",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: "Failed to load dashboard data.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  const sidebarMenu = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "users", label: "Users", icon: Users },
    { id: "rukos", label: "Rukos", icon: Building },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      confirmed: "bg-blue-100 text-blue-600",
      pending: "bg-yellow-100 text-yellow-600",
      waiting: "bg-purple-100 text-purple-600",
      cancelled: "bg-red-100 text-red-600",
      rejected: "bg-red-100 text-red-600",
      paid: "bg-green-100 text-green-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Logout Successful",
      description: "You have been logged out.",
    });
    navigate("/login");
  };

  // Prepare chart data
  const bookingStatusData = [
    { name: "Confirmed", value: stats.completedBookings, color: "#3b82f6" },
    { name: "Pending", value: stats.pendingPayments, color: "#f59e0b" },
    { name: "Cancelled", value: stats.cancelledBookings, color: "#ef4444" },
  ];

  const recentBookings = allBookings.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  const recentUsers = allUsers.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 5);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} bg-blue-600 text-white transition-all duration-300 flex-shrink-0 overflow-hidden`}>
        <div className="p-6 h-full flex flex-col">
          <div className="flex items-center gap-3 mb-8">
            <Building className="h-8 w-8" />
            <h2 className="text-xl font-bold">RukoSpace</h2>
          </div>

          <nav className="space-y-2 flex-1">
            {sidebarMenu.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${activeTab === item.id ? "bg-white text-blue-600" : "text-white hover:bg-blue-700"}`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <div className="pt-6 border-t border-blue-500 space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-700 transition-colors">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">Admin Dashboard</h1>
                  <p className="text-gray-600 text-sm">Welcome back, Admin</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {stats.pendingPayments > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>
                <Button
                  variant="outline"
                  className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                >
                  <Download className="h-4 w-4" />
                  Export Report
                </Button>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="week">This Week</option>
                  <option value="month">This Month</option>
                  <option value="year">This Year</option>
                </select>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Rukos</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalRukos}</h3>
                    <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                      <Building className="h-4 w-4" />
                      Properties listed
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Users</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalUsers}</h3>
                    <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Registered users
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Active Bookings</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.activeBookings}</h3>
                    <p className="text-green-600 text-sm mt-2 flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      Confirmed rentals
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Monthly Revenue</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.monthlyRevenue > 0 ? formatCurrency(stats.monthlyRevenue).split(",")[0] : "Rp0"}</h3>
                    <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      This month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="p-6 lg:col-span-2 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Statistics</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="text-center p-4 bg-blue-50 rounded-lg">
                        <p className="text-2xl font-bold text-blue-600">{stats.completedBookings}</p>
                        <p className="text-sm text-gray-600 mt-1">Completed</p>
                      </div>
                      <div className="text-center p-4 bg-yellow-50 rounded-lg">
                        <p className="text-2xl font-bold text-yellow-600">{stats.pendingPayments}</p>
                        <p className="text-sm text-gray-600 mt-1">Pending</p>
                      </div>
                      <div className="text-center p-4 bg-red-50 rounded-lg">
                        <p className="text-2xl font-bold text-red-600">{stats.cancelledBookings}</p>
                        <p className="text-sm text-gray-600 mt-1">Cancelled</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Status</h3>
                    <ResponsiveContainer
                      width="100%"
                      height={200}
                    >
                      <PieChart>
                        <Pie
                          data={bookingStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                          outerRadius={70}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {bookingStatusData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.color}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </Card>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Recent Bookings</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("bookings")}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {recentBookings.length > 0 ? (
                        recentBookings.map((booking: any) => (
                          <div
                            key={booking.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-gray-800">Booking #{booking.id.slice(-8)}</p>
                                <p className="text-sm text-gray-600">{formatDate(booking.created_at)}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.booking_status)}`}>{booking.booking_status}</span>
                            </div>
                            <div className="flex justify-between items-center text-sm text-gray-600">
                              <span>{formatDate(booking.start_date)}</span>
                              <span className="font-semibold text-gray-800">{formatCurrency(booking.total_price)}</span>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">No bookings yet</p>
                      )}
                    </div>
                  </Card>

                  <Card className="p-6 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("users")}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {recentUsers.length > 0 ? (
                        recentUsers.map((user: any) => (
                          <div
                            key={user.id}
                            className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-gray-800">{user.name}</p>
                                <p className="text-sm text-gray-600">{user.email}</p>
                              </div>
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "owner" ? "bg-blue-100 text-blue-600" : user.role === "admin" ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"}`}>
                                {user.role}
                              </span>
                            </div>
                            <p className="text-sm text-gray-500">Joined: {formatDate(user.created_at)}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-500 py-8">No users yet</p>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <Card className="p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Bookings ({allBookings.length})</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Booking ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Ruko ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Period</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Payment</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {allBookings.length > 0 ? (
                        allBookings.map((booking: any) => (
                          <tr
                            key={booking.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-4 text-sm text-gray-800">#{booking.id.slice(-8)}</td>
                            <td className="px-4 py-4 text-sm text-gray-800">{booking.ruko_id.slice(-8)}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">
                              {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                            </td>
                            <td className="px-4 py-4 text-sm font-medium text-gray-800">{formatCurrency(booking.total_price)}</td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.payment_status)}`}>{booking.payment_status}</span>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.booking_status)}`}>{booking.booking_status}</span>
                            </td>
                            <td className="px-4 py-4 text-sm">
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-8 w-8 p-0 hover:bg-blue-50"
                                >
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={7}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No bookings found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <Card className="p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Users ({allUsers.length})</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Phone</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Join Date</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {allUsers.length > 0 ? (
                        allUsers.map((user: any) => (
                          <tr
                            key={user.id}
                            className="hover:bg-gray-50"
                          >
                            <td className="px-4 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                            <td className="px-4 py-4 text-sm text-gray-600">{user.phone || "-"}</td>
                            <td className="px-4 py-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === "owner" ? "bg-blue-100 text-blue-600" : user.role === "admin" ? "bg-purple-100 text-purple-600" : "bg-green-100 text-green-600"}`}>{user.role}</span>
                            </td>
                            <td className="px-4 py-4 text-sm text-gray-600">{formatDate(user.created_at)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td
                            colSpan={5}
                            className="px-4 py-8 text-center text-gray-500"
                          >
                            No users found
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Rukos Tab */}
            {activeTab === "rukos" && (
              <Card className="p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Rukos ({allRukos.length})</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search rukos..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                {allRukos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {allRukos.map((ruko: any) => (
                      <div
                        key={ruko.id}
                        className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                      >
                        <div className="h-48 bg-gray-200 flex items-center justify-center">
                          {ruko.image ? (
                            <img
                              src={ruko.image}
                              alt={ruko.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building className="h-16 w-16 text-gray-400" />
                          )}
                        </div>
                        <div className="p-4">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-semibold text-gray-800">{ruko.name}</h4>
                            <span className={`px-2 py-1 text-xs rounded ${ruko.is_available ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>{ruko.is_available ? "Available" : "Rented"}</span>
                          </div>
                          <p className="text-sm text-gray-600 mb-2">{ruko.city || "Location not specified"}</p>
                          <p className="font-semibold text-blue-600 mb-3">
                            {formatCurrency(ruko.price)}/{ruko.rental_type === "monthly" ? "month" : "year"}
                          </p>
                          {ruko.discount_percent > 0 && <p className="text-xs text-green-600 mb-2">{ruko.discount_percent}% Discount Available</p>}
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50"
                            >
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No rukos found</p>
                  </div>
                )}
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
