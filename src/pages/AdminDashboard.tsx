import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building, Users, Calendar, DollarSign, TrendingUp, CheckCircle, XCircle, Clock, AlertCircle, Search, Download, Filter, MoreVertical, Eye, Edit, Trash2, LayoutDashboard, Home, LogOut, Settings, Bell, Menu, X } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - replace with actual API calls
  const stats = {
    totalRukos: 45,
    totalUsers: 328,
    activeBookings: 23,
    monthlyRevenue: 156500000,
    pendingPayments: 12,
    completedBookings: 89,
    cancelledBookings: 7,
    averageRating: 4.7,
  };

  const revenueData = [
    { month: "Jan", revenue: 125000000, bookings: 18 },
    { month: "Feb", revenue: 138000000, bookings: 21 },
    { month: "Mar", revenue: 142000000, bookings: 19 },
    { month: "Apr", revenue: 155000000, bookings: 25 },
    { month: "May", revenue: 148000000, bookings: 22 },
    { month: "Jun", revenue: 156500000, bookings: 23 },
  ];

  const bookingStatusData = [
    { name: "Confirmed", value: 89, color: "#3b82f6" },
    { name: "Pending", value: 12, color: "#f59e0b" },
    { name: "Cancelled", value: 7, color: "#ef4444" },
  ];

  const recentBookings = [
    {
      id: "1",
      rukoName: "Ruko Green Valley",
      tenant: "Budi Santoso",
      startDate: "2025-11-10",
      endDate: "2025-12-10",
      totalPrice: 3000000,
      status: "pending",
      paymentMethod: "online",
    },
    {
      id: "2",
      rukoName: "Ruko Sudirman Center",
      tenant: "Rina Oktaviani",
      startDate: "2025-11-05",
      endDate: "2026-11-05",
      totalPrice: 55000000,
      status: "confirmed",
      paymentMethod: "offline",
    },
    {
      id: "3",
      rukoName: "Ruko Grand Boulevard",
      tenant: "Andi Wirawan",
      startDate: "2025-11-15",
      endDate: "2025-12-15",
      totalPrice: 8500000,
      status: "waiting",
      paymentMethod: "online",
    },
  ];

  const recentUsers = [
    { id: "1", name: "Ahmad Fauzi", email: "ahmad@email.com", role: "tenant", joinDate: "2025-11-01" },
    { id: "2", name: "Siti Nurhaliza", email: "siti@email.com", role: "owner", joinDate: "2025-10-28" },
    { id: "3", name: "Dedi Setiawan", email: "dedi@email.com", role: "tenant", joinDate: "2025-10-25" },
  ];

  const sidebarMenu = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "users", label: "Users", icon: Users },
    { id: "rukos", label: "Rukos", icon: Building },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const styles = {
      confirmed: "bg-blue-100 text-blue-600",
      pending: "bg-yellow-100 text-yellow-600",
      waiting: "bg-purple-100 text-purple-600",
      cancelled: "bg-red-100 text-red-600",
      rejected: "bg-red-100 text-red-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? "w-64" : "w-0"} bg-blue-600 text-white transition-all duration-300 flex-shrink-0 overflow-hidden`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <Building className="h-8 w-8" />
            <h2 className="text-xl font-bold">RukoSpace</h2>
          </div>

          <nav className="space-y-2">
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

          <div className="mt-auto pt-8 border-t border-blue-500">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-700 transition-colors">
              <Settings className="h-5 w-5" />
              <span className="font-medium">Settings</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-700 transition-colors mt-2">
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
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
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
                      <TrendingUp className="h-4 w-4" />
                      +12% from last month
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
                      <TrendingUp className="h-4 w-4" />
                      +8% from last month
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
                    <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      +15% from last month
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
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(stats.monthlyRevenue).split(",")[0]}</h3>
                    <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      +6% from last month
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
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue & Bookings Trend</h3>
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <LineChart data={revenueData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis yAxisId="left" />
                        <YAxis
                          yAxisId="right"
                          orientation="right"
                        />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Line
                          yAxisId="left"
                          type="monotone"
                          dataKey="revenue"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Revenue"
                        />
                        <Line
                          yAxisId="right"
                          type="monotone"
                          dataKey="bookings"
                          stroke="#10b981"
                          strokeWidth={2}
                          name="Bookings"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Booking Status</h3>
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <PieChart>
                        <Pie
                          data={bookingStatusData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
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
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {recentBookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-800">{booking.rukoName}</p>
                              <p className="text-sm text-gray-600">{booking.tenant}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(booking.status)}`}>{booking.status}</span>
                          </div>
                          <div className="flex justify-between items-center text-sm text-gray-600">
                            <span>{booking.startDate}</span>
                            <span className="font-semibold text-gray-800">{formatCurrency(booking.totalPrice)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>

                  <Card className="p-6 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Recent Users</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="space-y-3">
                      {recentUsers.map((user) => (
                        <div
                          key={user.id}
                          className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-800">{user.name}</p>
                              <p className="text-sm text-gray-600">{user.email}</p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${user.role === "owner" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>{user.role}</span>
                          </div>
                          <p className="text-sm text-gray-500">Joined: {user.joinDate}</p>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <Card className="p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Bookings</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search bookings..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <Button
                      variant="outline"
                      className="flex items-center gap-2 border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      <Filter className="h-4 w-4" />
                      Filter
                    </Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Ruko</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Tenant</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Period</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Payment</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentBookings.map((booking) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-4 text-sm text-gray-800">{booking.rukoName}</td>
                          <td className="px-4 py-4 text-sm text-gray-800">{booking.tenant}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {booking.startDate} - {booking.endDate}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">{formatCurrency(booking.totalPrice)}</td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${booking.paymentMethod === "online" ? "bg-blue-100 text-blue-600" : "bg-gray-100 text-gray-600"}`}>{booking.paymentMethod}</span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.status)}`}>{booking.status}</span>
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
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Users Tab */}
            {activeTab === "users" && (
              <Card className="p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Users</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add User</Button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Name</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Email</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Role</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Join Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {recentUsers.map((user) => (
                        <tr
                          key={user.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">{user.name}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{user.email}</td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${user.role === "owner" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>{user.role}</span>
                          </td>
                          <td className="px-4 py-4 text-sm text-gray-600">{user.joinDate}</td>
                          <td className="px-4 py-4 text-sm">
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                              >
                                <Eye className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-blue-50"
                              >
                                <Edit className="h-4 w-4 text-blue-600" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 p-0 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Rukos Tab */}
            {activeTab === "rukos" && (
              <Card className="p-6 bg-white">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All Rukos</h3>
                  <div className="flex gap-3">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search rukos..."
                        className="pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">Add Ruko</Button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div
                      key={i}
                      className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow bg-white"
                    >
                      <div className="h-48 bg-gray-200"></div>
                      <div className="p-4">
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold text-gray-800">Ruko Example {i}</h4>
                          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded">Available</span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">Jakarta Selatan</p>
                        <p className="font-semibold text-blue-600 mb-3">Rp 5.000.000/month</p>
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
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
