import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building, DollarSign, Calendar, Search, MapPin, Star, Clock, FileText, CreditCard, AlertCircle, LayoutDashboard, LogOut, Settings, Menu, X, Bell, Heart, Download, CheckCircle, XCircle, Home } from "lucide-react";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data - replace with actual API calls
  const tenantStats = {
    activeRentals: 2,
    totalSpent: 85000000,
    upcomingPayments: 1,
    savedRukos: 5,
    daysUntilRenewal: 45,
  };

  const myRentals = [
    {
      id: "1",
      rukoName: "Ruko Green Valley Premium",
      image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=400",
      address: "Jl. Raya Tangerang No. 45",
      city: "Tangerang",
      owner: "PT. Properti Jaya",
      startDate: "2025-01-10",
      endDate: "2025-12-10",
      monthlyPrice: 3000000,
      status: "active",
      paymentStatus: "paid",
      rating: 4.6,
    },
    {
      id: "2",
      rukoName: "Ruko Sudirman Center",
      image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
      address: "Jl. Sudirman Kav. 12",
      city: "Jakarta Pusat",
      owner: "CV. Maju Bersama",
      startDate: "2024-11-05",
      endDate: "2026-11-05",
      monthlyPrice: 5000000,
      status: "active",
      paymentStatus: "paid",
      rating: 4.8,
    },
  ];

  const paymentHistory = [
    {
      id: "1",
      rukoName: "Ruko Green Valley Premium",
      amount: 3000000,
      date: "2025-10-10",
      status: "paid",
      method: "Transfer Bank",
      invoice: "INV-2025-001",
    },
    {
      id: "2",
      rukoName: "Ruko Sudirman Center",
      amount: 5000000,
      date: "2025-10-05",
      status: "paid",
      method: "Transfer Bank",
      invoice: "INV-2025-002",
    },
    {
      id: "3",
      rukoName: "Ruko Green Valley Premium",
      amount: 3000000,
      date: "2025-09-10",
      status: "paid",
      method: "Credit Card",
      invoice: "INV-2025-003",
    },
  ];

  const upcomingPayments = [
    {
      id: "1",
      rukoName: "Ruko Green Valley Premium",
      amount: 3000000,
      dueDate: "2025-11-10",
      daysLeft: 5,
    },
  ];

  const savedRukos = [
    {
      id: "1",
      name: "Ruko Grand Boulevard",
      image: "https://images.unsplash.com/photo-1560184897-ae75f418493e?w=400",
      address: "Jl. Boulevard Raya No. 88",
      city: "Bekasi",
      priceMonthly: 8500000,
      rating: 4.9,
      discount: 15,
    },
    {
      id: "2",
      name: "Ruko Business Park",
      image: "https://images.unsplash.com/photo-1582407947304-fd86f028f716?w=400",
      address: "Jl. Ciledug Raya No. 22",
      city: "Ciledug",
      priceMonthly: 4000000,
      rating: 4.5,
      discount: 0,
    },
  ];

  const sidebarMenu = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "my-rentals", label: "My Rentals", icon: Building },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "saved", label: "Saved Rukos", icon: Heart },
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
      active: "bg-blue-100 text-blue-600",
      paid: "bg-green-100 text-green-600",
      pending: "bg-yellow-100 text-yellow-600",
      overdue: "bg-red-100 text-red-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
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
                  <h1 className="text-2xl font-bold text-gray-800">Tenant Dashboard</h1>
                  <p className="text-gray-600 text-sm">Manage your rentals and payments</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2">
                  <Search className="h-4 w-4" />
                  Find Ruko
                </Button>
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
                    <p className="text-gray-600 text-sm font-medium">Active Rentals</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{tenantStats.activeRentals}</h3>
                    <p className="text-blue-600 text-sm mt-2">Currently renting</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Building className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Spent</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{formatCurrency(tenantStats.totalSpent).split(",")[0].slice(0, -3)}jt</h3>
                    <p className="text-gray-600 text-sm mt-2">All time</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <DollarSign className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Upcoming Payments</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{tenantStats.upcomingPayments}</h3>
                    <p className="text-orange-600 text-sm mt-2">Due soon</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Saved Rukos</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{tenantStats.savedRukos}</h3>
                    <p className="text-gray-600 text-sm mt-2">Favorites</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Heart className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Welcome back!</h3>
                      <p className="text-blue-100">
                        You have {tenantStats.upcomingPayments} upcoming payment. Next renewal in {tenantStats.daysUntilRenewal} days.
                      </p>
                    </div>
                    <Button className="bg-white text-blue-600 hover:bg-blue-50">View Details</Button>
                  </div>
                </Card>

                {/* Upcoming Payments Alert */}
                {upcomingPayments.length > 0 && (
                  <Card className="p-6 bg-white border-l-4 border-orange-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">Upcoming Payment</h3>
                        {upcomingPayments.map((payment) => (
                          <div
                            key={payment.id}
                            className="flex justify-between items-center"
                          >
                            <div>
                              <p className="text-gray-800 font-medium">{payment.rukoName}</p>
                              <p className="text-sm text-gray-600">
                                Due: {payment.dueDate} ({payment.daysLeft} days left)
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-800">{formatCurrency(payment.amount)}</p>
                              <Button
                                size="sm"
                                className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
                              >
                                Pay Now
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                )}

                {/* My Rentals Overview */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">My Current Rentals</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {myRentals.map((rental) => (
                      <Card
                        key={rental.id}
                        className="overflow-hidden hover:shadow-lg transition-shadow bg-white"
                      >
                        <div className="flex">
                          <img
                            src={rental.image}
                            alt={rental.rukoName}
                            className="w-32 h-32 object-cover"
                          />
                          <div className="flex-1 p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-semibold text-gray-800">{rental.rukoName}</h4>
                              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(rental.status)}`}>{rental.status}</span>
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {rental.city}
                            </div>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <Calendar className="h-4 w-4 mr-1" />
                              {rental.startDate} - {rental.endDate}
                            </div>
                            <div className="flex justify-between items-center mt-3">
                              <span className="font-semibold text-blue-600">{formatCurrency(rental.monthlyPrice)}/mo</span>
                              <Button
                                size="sm"
                                variant="outline"
                                className="border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                Details
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Recent Payments */}
                <Card className="p-6 bg-white">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-800">Recent Payments</h3>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-blue-600 text-blue-600 hover:bg-blue-50"
                    >
                      View All
                    </Button>
                  </div>
                  <div className="space-y-3">
                    {paymentHistory.slice(0, 3).map((payment) => (
                      <div
                        key={payment.id}
                        className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-2 rounded-lg">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{payment.rukoName}</p>
                            <p className="text-sm text-gray-600">
                              {payment.date} • {payment.method}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-gray-800">{formatCurrency(payment.amount)}</p>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusBadge(payment.status)}`}>{payment.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            )}

            {/* My Rentals Tab */}
            {activeTab === "my-rentals" && (
              <div className="space-y-6">
                {myRentals.map((rental) => (
                  <Card
                    key={rental.id}
                    className="overflow-hidden bg-white"
                  >
                    <div className="flex flex-col md:flex-row">
                      <img
                        src={rental.image}
                        alt={rental.rukoName}
                        className="w-full md:w-64 h-64 object-cover"
                      />
                      <div className="flex-1 p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">{rental.rukoName}</h3>
                            <div className="flex items-center text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {rental.address}, {rental.city}
                            </div>
                            <div className="flex items-center text-sm text-gray-600">
                              <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                              {rental.rating}
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(rental.status)}`}>{rental.status}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Owner</p>
                            <p className="font-medium text-gray-800">{rental.owner}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Monthly Price</p>
                            <p className="font-medium text-gray-800">{formatCurrency(rental.monthlyPrice)}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Start Date</p>
                            <p className="font-medium text-gray-800">{rental.startDate}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">End Date</p>
                            <p className="font-medium text-gray-800">{rental.endDate}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                            <CreditCard className="h-4 w-4 mr-2" />
                            Make Payment
                          </Button>
                          <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Contract
                          </Button>
                          <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            Contact Owner
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}

            {/* Payments Tab */}
            {activeTab === "payments" && (
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">Payment History</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Invoice</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Ruko</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Date</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Method</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Status</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {paymentHistory.map((payment) => (
                        <tr
                          key={payment.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">{payment.invoice}</td>
                          <td className="px-4 py-4 text-sm text-gray-800">{payment.rukoName}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{payment.date}</td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">{formatCurrency(payment.amount)}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">{payment.method}</td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(payment.status)}`}>{payment.status}</span>
                          </td>
                          <td className="px-4 py-4 text-sm">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-8 px-3 hover:bg-blue-50 text-blue-600"
                            >
                              <Download className="h-4 w-4 mr-1" />
                              Invoice
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            )}

            {/* Saved Rukos Tab */}
            {activeTab === "saved" && (
              <div>
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">Saved Rukos</h3>
                  <p className="text-gray-600 text-sm">Your favorite rukos for future reference</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {savedRukos.map((ruko) => (
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
                        {ruko.discount > 0 && (
                          <div className="absolute top-3 left-3">
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">{ruko.discount}% OFF</span>
                          </div>
                        )}
                        <button className="absolute top-3 right-3 bg-white p-2 rounded-full hover:bg-gray-100 transition-colors">
                          <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                        </button>
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">{ruko.name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mb-2">
                          <MapPin className="h-4 w-4 mr-1" />
                          {ruko.city}
                        </div>
                        <div className="flex items-center text-sm text-gray-600 mb-3">
                          <Star className="h-4 w-4 mr-1 fill-yellow-400 text-yellow-400" />
                          {ruko.rating}
                        </div>
                        <div className="flex justify-between items-center mb-3">
                          <span className="font-semibold text-blue-600">{formatCurrency(ruko.priceMonthly)}/mo</span>
                        </div>
                        <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
