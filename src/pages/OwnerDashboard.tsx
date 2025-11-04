import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building, DollarSign, TrendingUp, Calendar, Plus, Edit, Trash2, Eye, MapPin, Star, CheckCircle, XCircle, Clock, AlertCircle, Users, BarChart3, Settings, BellRing, LayoutDashboard, LogOut, Menu, X, Bell } from "lucide-react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const OwnerDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - replace with actual API calls
  const ownerStats = {
    totalRukos: 8,
    activeRentals: 5,
    monthlyIncome: 32500000,
    pendingBookings: 3,
    totalEarnings: 195000000,
    occupancyRate: 62.5,
    averageRating: 4.7,
    totalReviews: 24,
  };

  const incomeData = [
    { month: "Jan", income: 28000000, rentals: 4 },
    { month: "Feb", income: 30000000, rentals: 5 },
    { month: "Mar", income: 29000000, rentals: 4 },
    { month: "Apr", income: 31000000, rentals: 5 },
    { month: "May", income: 30500000, rentals: 5 },
    { month: "Jun", income: 32500000, rentals: 5 },
  ];

  const myRukos = [
    {
      id: "1",
      name: "Ruko Green Valley Premium",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
      address: "Jl. Raya Tangerang No. 45",
      city: "Tangerang",
      priceMonthly: 3000000,
      priceYearly: 30000000,
      status: "rented",
      rating: 4.6,
      reviews: 8,
      currentTenant: "Budi Santoso",
      rentalEnd: "2025-12-10",
      discount: 10,
    },
    {
      id: "2",
      name: "Ruko Sudirman Center",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      address: "Jl. Sudirman Kav. 12",
      city: "Jakarta Pusat",
      priceMonthly: 5000000,
      priceYearly: 55000000,
      status: "rented",
      rating: 4.8,
      reviews: 12,
      currentTenant: "Rina Oktaviani",
      rentalEnd: "2026-11-05",
      discount: 0,
    },
    {
      id: "3",
      name: "Ruko Grand Boulevard",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400",
      address: "Jl. Boulevard Raya No. 88",
      city: "Bekasi",
      priceMonthly: 8500000,
      priceYearly: 95000000,
      status: "available",
      rating: 4.9,
      reviews: 4,
      currentTenant: null,
      rentalEnd: null,
      discount: 15,
    },
    {
      id: "4",
      name: "Ruko Business Park",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400",
      address: "Jl. Ciledug Raya No. 22",
      city: "Ciledug",
      priceMonthly: 4000000,
      priceYearly: 42000000,
      status: "available",
      rating: 4.5,
      reviews: 0,
      currentTenant: null,
      rentalEnd: null,
      discount: 0,
    },
  ];

  const pendingBookings = [
    {
      id: "1",
      rukoName: "Ruko Grand Boulevard",
      tenantName: "Ahmad Fauzi",
      tenantEmail: "ahmad@email.com",
      startDate: "2025-11-15",
      endDate: "2025-12-15",
      duration: "1 Month",
      totalPrice: 7225000,
      paymentMethod: "online",
      bookingDate: "2025-11-02",
    },
    {
      id: "2",
      rukoName: "Ruko Business Park",
      tenantName: "Siti Nurhaliza",
      tenantEmail: "siti@email.com",
      startDate: "2025-12-01",
      endDate: "2026-12-01",
      duration: "1 Year",
      totalPrice: 42000000,
      paymentMethod: "offline",
      bookingDate: "2025-11-03",
    },
  ];

  const recentActivities = [
    { id: "1", type: "booking", message: "New booking request for Ruko Grand Boulevard", time: "2 hours ago" },
    { id: "2", type: "payment", message: "Payment received from Budi Santoso - Rp 3,000,000", time: "5 hours ago" },
    { id: "3", type: "review", message: "New review (5 stars) on Ruko Sudirman Center", time: "1 day ago" },
    { id: "4", type: "rental", message: "Rental period ending soon - Ruko Green Valley", time: "2 days ago" },
  ];

  const sidebarMenu = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "my-rukos", label: "My Rukos", icon: Building },
    { id: "bookings", label: "Bookings", icon: Calendar },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
  ];

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const getStatusColor = (status) => {
    return status === "rented" ? "bg-blue-100 text-blue-600" : "bg-green-100 text-green-600";
  };

  const getActivityIcon = (type) => {
    switch (type) {
      case "booking":
        return <Calendar className="h-5 w-5 text-blue-600" />;
      case "payment":
        return <DollarSign className="h-5 w-5 text-green-600" />;
      case "review":
        return <Star className="h-5 w-5 text-yellow-600" />;
      case "rental":
        return <Clock className="h-5 w-5 text-orange-600" />;
      default:
        return <BellRing className="h-5 w-5 text-gray-600" />;
    }
  };

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
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-white hover:bg-blue-700 transition-colors">
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
                  <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
                  <p className="text-gray-600 text-sm">Manage your rukos and track your income</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Ruko
                </Button>
                <select
                  value={selectedPeriod}
                  onChange={(e) => setSelectedPeriod(e.target.value)}
                  className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
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
                    <p className="text-gray-600 text-sm font-medium">My Rukos</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{ownerStats.totalRukos}</h3>
                    <p className="text-blue-600 text-sm mt-2">{ownerStats.activeRentals} Active Rentals</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Monthly Income</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(ownerStats.monthlyIncome).split(",")[0].slice(0, -3)}jt</h3>
                    <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      +6.4% from last month
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Pending Bookings</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{ownerStats.pendingBookings}</h3>
                    <p className="text-orange-600 text-sm mt-2">Requires action</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Occupancy Rate</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{ownerStats.occupancyRate}%</h3>
                    <p className="text-gray-600 text-sm mt-2">
                      {ownerStats.activeRentals}/{ownerStats.totalRukos} rukos rented
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Income Chart & Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <Card className="p-6 lg:col-span-2 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Income Trend</h3>
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <LineChart data={incomeData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Legend />
                        <Line
                          type="monotone"
                          dataKey="income"
                          stroke="#3b82f6"
                          strokeWidth={2}
                          name="Income"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div
                          key={activity.id}
                          className="flex gap-3"
                        >
                          <div className="flex-shrink-0 w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">{getActivityIcon(activity.type)}</div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-gray-800">{activity.message}</p>
                            <p className="text-xs text-gray-500 mt-1">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>

                {/* Pending Bookings */}
                <Card className="p-6 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Pending Booking Requests</h3>
                    <span className="text-sm text-gray-600">{pendingBookings.length} requests</span>
                  </div>
                  <div className="space-y-4">
                    {pendingBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-800">{booking.rukoName}</h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {booking.tenantName} • {booking.tenantEmail}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-blue-600">{formatCurrency(booking.totalPrice)}</p>
                            <p className="text-sm text-gray-600">{booking.duration}</p>
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <div className="text-sm text-gray-600">
                            <span>
                              {booking.startDate} - {booking.endDate}
                            </span>
                            <span className="mx-2">•</span>
                            <span className="capitalize">{booking.paymentMethod}</span>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="text-red-600 hover:bg-red-50 border-red-200"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                            <Button
                              size="sm"
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Accept
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* My Rukos Tab */}
            {activeTab === "my-rukos" && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myRukos.map((ruko) => (
                  <Card
                    key={ruko.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
                  >
                    <div className="relative h-48">
                      <img
                        src={ruko.image}
                        alt={ruko.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-3 right-3">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(ruko.status)}`}>{ruko.status === "rented" ? "Rented" : "Available"}</span>
                      </div>
                      {ruko.discount > 0 && (
                        <div className="absolute top-3 left-3">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">{ruko.discount}% OFF</span>
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-semibold text-gray-800 mb-2">{ruko.name}</h3>
                      <div className="flex items-center text-sm text-gray-600 mb-2">
                        <MapPin className="h-4 w-4 mr-1" />
                        {ruko.address}
                      </div>
                      <div className="flex items-center text-sm text-gray-600 mb-3">
                        <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                        {ruko.rating} ({ruko.reviews} reviews)
                      </div>
                      <div className="border-t pt-3 mb-3">
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600">Monthly:</span>
                          <span className="font-semibold text-gray-800">{formatCurrency(ruko.priceMonthly)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-600">Yearly:</span>
                          <span className="font-semibold text-gray-800">{formatCurrency(ruko.priceYearly)}</span>
                        </div>
                      </div>
                      {ruko.currentTenant && (
                        <div className="bg-blue-50 p-2 rounded mb-3 text-sm">
                          <p className="text-gray-600">Current Tenant:</p>
                          <p className="font-medium text-gray-800">{ruko.currentTenant}</p>
                          <p className="text-gray-600 text-xs mt-1">Until: {ruko.rentalEnd}</p>
                        </div>
                      )}
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
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-red-600 hover:bg-red-50 border-red-200"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === "bookings" && (
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">All Bookings</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Ruko</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Tenant</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Period</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-800">Ruko Green Valley Premium</td>
                        <td className="px-4 py-4 text-sm text-gray-800">Budi Santoso</td>
                        <td className="px-4 py-4 text-sm text-gray-600">2025-01-10 - 2025-12-10</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800">{formatCurrency(30000000)}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600">Active</span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </td>
                      </tr>
                      <tr className="hover:bg-gray-50">
                        <td className="px-4 py-4 text-sm text-gray-800">Ruko Sudirman Center</td>
                        <td className="px-4 py-4 text-sm text-gray-800">Rina Oktaviani</td>
                        <td className="px-4 py-4 text-sm text-gray-600">2024-11-05 - 2026-11-05</td>
                        <td className="px-4 py-4 text-sm font-medium text-gray-800">{formatCurrency(55000000)}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className="px-2 py-1 rounded text-xs font-medium bg-blue-100 text-blue-600">Active</span>
                        </td>
                        <td className="px-4 py-4 text-sm">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50"
                          >
                            <Eye className="h-4 w-4 text-blue-600" />
                          </Button>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Analytics Tab */}
            {activeTab === "analytics" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Income by Ruko</h3>
                    <ResponsiveContainer
                      width="100%"
                      height={300}
                    >
                      <BarChart
                        data={[
                          { name: "Green Valley", income: 3000000 },
                          { name: "Sudirman", income: 5000000 },
                          { name: "Grand Blvd", income: 0 },
                          { name: "Business Park", income: 0 },
                        ]}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar
                          dataKey="income"
                          fill="#3b82f6"
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </Card>

                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Occupancy Rate</span>
                          <span className="text-sm font-semibold text-gray-800">{ownerStats.occupancyRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${ownerStats.occupancyRate}%` }}
                          ></div>
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Average Rating</span>
                          <span className="text-sm font-semibold text-gray-800">{ownerStats.averageRating}/5.0</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-yellow-500 h-2 rounded-full"
                            style={{ width: `${(ownerStats.averageRating / 5) * 100}%` }}
                          ></div>
                        </div>
                      </div>
                      <div className="pt-4 space-y-3">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="text-sm text-gray-600">Total Earnings (All Time)</span>
                          <span className="font-semibold text-gray-800">{formatCurrency(ownerStats.totalEarnings)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="text-sm text-gray-600">Total Reviews</span>
                          <span className="font-semibold text-gray-800">{ownerStats.totalReviews}</span>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default OwnerDashboard;
