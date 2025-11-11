import React, { useState, useEffect } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building, DollarSign, Calendar, Search, MapPin, Star, Clock, FileText, CreditCard, AlertCircle, LayoutDashboard, LogOut, Settings, Menu, X, Bell, Heart, Download, CheckCircle, XCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

const TenantDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // State untuk data dari API
  const [myBookings, setMyBookings] = useState([]);
  const [myPayments, setMyPayments] = useState([]);
  const [stats, setStats] = useState({
    activeRentals: 0,
    totalSpent: 0,
    upcomingPayments: 0,
    savedRukos: 0,
  });

  const API_BASE = "https://booking-api-production-8f43.up.railway.app/api";

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        toast({
          title: "Error",
          description: "Silakan login terlebih dahulu.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const user = JSON.parse(userStr);
      const userId = user?.id || user?._id;

      // Fetch bookings untuk tenant ini
      const bookingsRes = await axios.get(`${API_BASE}/bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // Filter bookings milik user ini
      const userBookings = bookingsRes.data.filter((b: any) => b.tenant_id === userId);

      setMyBookings(userBookings);

      // Hitung stats
      const activeCount = userBookings.filter((b: any) => b.booking_status === "confirmed" && b.payment_status === "paid").length;

      const totalSpent = userBookings.filter((b: any) => b.payment_status === "paid").reduce((sum: number, b: any) => sum + b.total_price, 0);

      const pendingCount = userBookings.filter((b: any) => b.payment_status === "pending").length;

      setStats({
        activeRentals: activeCount,
        totalSpent: totalSpent,
        upcomingPayments: pendingCount,
        savedRukos: 0, // Implement wishlist later
      });

      setLoading(false);
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);

      if (error.response?.status === 401) {
        toast({
          title: "Error",
          description: "Sesi Anda telah berakhir. Silakan login kembali.",
          variant: "destructive",
        });
        navigate("/login");
      } else {
        toast({
          title: "Error",
          description: "Gagal memuat data dashboard.",
          variant: "destructive",
        });
      }
      setLoading(false);
    }
  };

  const sidebarMenu = [
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "my-rentals", label: "My Rentals", icon: Building },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "saved", label: "Saved Rukos", icon: Heart },
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
      paid: "bg-green-100 text-green-600",
      pending: "bg-yellow-100 text-yellow-600",
      waiting: "bg-orange-100 text-orange-600",
      cancelled: "bg-red-100 text-red-600",
      rejected: "bg-red-100 text-red-600",
    };
    return styles[status] || "bg-gray-100 text-gray-600";
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari akun.",
    });
    navigate("/login");
  };

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

  const confirmedBookings = myBookings.filter((b: any) => b.booking_status === "confirmed" && b.payment_status === "paid");

  const pendingBookings = myBookings.filter((b: any) => b.payment_status === "pending");

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
                  <h1 className="text-2xl font-bold text-gray-800">Tenant Dashboard</h1>
                  <p className="text-gray-600 text-sm">Manage your rentals and payments</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {pendingBookings.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>}
                </button>
                <Button
                  onClick={() => navigate("/ruko")}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
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
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.activeRentals}</h3>
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
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalSpent > 0 ? formatCurrency(stats.totalSpent).split(",")[0].slice(0, -3) + "jt" : "Rp0"}</h3>
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
                    <p className="text-gray-600 text-sm font-medium">Pending Payments</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.upcomingPayments}</h3>
                    <p className="text-orange-600 text-sm mt-2">Need attention</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <Clock className="h-6 w-6 text-orange-600" />
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-lg transition-shadow bg-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-gray-600 text-sm font-medium">Total Bookings</p>
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{myBookings.length}</h3>
                    <p className="text-gray-600 text-sm mt-2">All status</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Overview Tab */}
            {activeTab === "overview" && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Welcome back!</h3>
                      <p className="text-blue-100">
                        You have {stats.activeRentals} active rental{stats.activeRentals !== 1 ? "s" : ""} and {stats.upcomingPayments} pending payment{stats.upcomingPayments !== 1 ? "s" : ""}.
                      </p>
                    </div>
                    <Button
                      onClick={() => setActiveTab("my-rentals")}
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>

                {/* Pending Payments Alert */}
                {pendingBookings.length > 0 && (
                  <Card className="p-6 bg-white border-l-4 border-orange-500">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-lg">
                        <AlertCircle className="h-6 w-6 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-800 mb-3">Pending Payments</h3>
                        <div className="space-y-3">
                          {pendingBookings.map((booking: any) => (
                            <div
                              key={booking.id}
                              className="flex justify-between items-center p-3 bg-orange-50 rounded-lg"
                            >
                              <div>
                                <p className="text-gray-800 font-medium">Booking #{booking.id.slice(-8)}</p>
                                <p className="text-sm text-gray-600">
                                  {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                                </p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-gray-800">{formatCurrency(booking.total_price)}</p>
                                <Button
                                  size="sm"
                                  onClick={() => navigate(`/payment?booking=${booking.id}`)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white mt-2"
                                >
                                  Pay Now
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Active Rentals */}
                {confirmedBookings.length > 0 && (
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">My Active Rentals</h3>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setActiveTab("my-rentals")}
                        className="border-blue-600 text-blue-600 hover:bg-blue-50"
                      >
                        View All
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {confirmedBookings.slice(0, 2).map((booking: any) => (
                        <Card
                          key={booking.id}
                          className="p-4 hover:shadow-lg transition-shadow bg-white"
                        >
                          <div className="flex justify-between items-start mb-3">
                            <div>
                              <h4 className="font-semibold text-gray-800">Booking #{booking.id.slice(-8)}</h4>
                              <p className="text-sm text-gray-600 mt-1">Ruko ID: {booking.ruko_id}</p>
                            </div>
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.booking_status)}`}>{booking.booking_status}</span>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center text-gray-600">
                              <Calendar className="h-4 w-4 mr-2" />
                              {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                            </div>
                            <div className="flex justify-between items-center pt-2 border-t">
                              <span className="text-gray-600">Total Price:</span>
                              <span className="font-semibold text-blue-600">{formatCurrency(booking.total_price)}</span>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty State */}
                {myBookings.length === 0 && (
                  <Card className="p-12 text-center bg-white">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Yet</h3>
                    <p className="text-gray-600 mb-6">Start exploring and book your first ruko!</p>
                    <Button
                      onClick={() => navigate("/ruko")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Search className="h-4 w-4 mr-2" />
                      Browse Rukos
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* My Rentals Tab */}
            {activeTab === "my-rentals" && (
              <div className="space-y-6">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">All My Bookings</h3>
                  <p className="text-gray-600 text-sm">View all your rental bookings</p>
                </div>

                {myBookings.length === 0 ? (
                  <Card className="p-12 text-center bg-white">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Bookings Found</h3>
                    <p className="text-gray-600 mb-6">You haven't made any bookings yet.</p>
                    <Button
                      onClick={() => navigate("/ruko")}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Browse Rukos
                    </Button>
                  </Card>
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {myBookings.map((booking: any) => (
                      <Card
                        key={booking.id}
                        className="p-6 bg-white hover:shadow-lg transition-shadow"
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h4 className="text-xl font-bold text-gray-800">Booking #{booking.id.slice(-8)}</h4>
                            <p className="text-sm text-gray-600 mt-1">Ruko ID: {booking.ruko_id}</p>
                          </div>
                          <div className="flex gap-2">
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.booking_status)}`}>{booking.booking_status}</span>
                            <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadge(booking.payment_status)}`}>{booking.payment_status}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Start Date</p>
                            <p className="font-medium text-gray-800">{formatDate(booking.start_date)}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">End Date</p>
                            <p className="font-medium text-gray-800">{formatDate(booking.end_date)}</p>
                          </div>
                          <div className="bg-blue-50 p-3 rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Total Price</p>
                            <p className="font-medium text-gray-800">{formatCurrency(booking.total_price)}</p>
                          </div>
                        </div>

                        <div className="flex gap-3">
                          {booking.payment_status === "pending" && (
                            <Button
                              onClick={() => navigate(`/payment?booking=${booking.id}`)}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <CreditCard className="h-4 w-4 mr-2" />
                              Make Payment
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            className="border-blue-600 text-blue-600 hover:bg-blue-50"
                          >
                            <FileText className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
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
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Booking ID</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Period</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Amount</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Payment</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y">
                      {myBookings.map((booking: any) => (
                        <tr
                          key={booking.id}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">#{booking.id.slice(-8)}</td>
                          <td className="px-4 py-4 text-sm text-gray-600">
                            {formatDate(booking.start_date)} - {formatDate(booking.end_date)}
                          </td>
                          <td className="px-4 py-4 text-sm font-medium text-gray-800">{formatCurrency(booking.total_price)}</td>
                          <td className="px-4 py-4 text-sm text-gray-600 capitalize">{booking.payment_method}</td>
                          <td className="px-4 py-4 text-sm">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusBadge(booking.payment_status)}`}>{booking.payment_status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {myBookings.length === 0 && <div className="text-center py-8 text-gray-500">No payment history found</div>}
                </div>
              </Card>
            )}

            {/* Saved Rukos Tab */}
            {activeTab === "saved" && (
              <Card className="p-12 text-center bg-white">
                <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-800 mb-2">No Saved Rukos</h3>
                <p className="text-gray-600 mb-6">Save your favorite rukos for quick access.</p>
                <Button
                  onClick={() => navigate("/ruko")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Browse Rukos
                </Button>
              </Card>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default TenantDashboard;
