import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { 
  Building, DollarSign, TrendingUp, Calendar, 
  Plus, Edit, Trash2, Eye, MapPin, Star,
  CheckCircle, XCircle, Clock, AlertCircle,
  Users, BarChart3, Settings, BellRing,
  LayoutDashboard, LogOut, Menu, X, Bell
} from 'lucide-react';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import { useToast } from '../hooks/use-toast';
import axios from 'axios';

const OwnerDashboard = () => {
  const [selectedPeriod, setSelectedPeriod] = useState('month');
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showAddRukoModal, setShowAddRukoModal] = useState(false);
  const [addRukoForm, setAddRukoForm] = useState({
    name: '',
    description: '',
    address: '',
    city: '',
    price: '',
    rental_type: 'monthly',
    discount_percent: '0',
    image: ''
  });
  const navigate = useNavigate();
  const { toast } = useToast();

  // State untuk data dari API
  const [myRukos, setMyRukos] = useState([]);
  const [myBookings, setMyBookings] = useState([]);
  const [stats, setStats] = useState({
    totalRukos: 0,
    activeRentals: 0,
    monthlyIncome: 0,
    pendingBookings: 0,
    totalEarnings: 0,
    occupancyRate: 0
  });

  const API_BASE = 'https://booking-api-production-8f43.up.railway.app/api';

  useEffect(() => {
    checkOwnerAccess();
    fetchDashboardData();
  }, []);

  const checkOwnerAccess = () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr);
      if (user.role !== 'owner') {
        toast({
          title: 'Access Denied',
          description: 'You do not have owner privileges.',
          variant: 'destructive',
        });
        navigate('/');
      }
    }
  };

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      
      if (!token || !userStr) {
        toast({
          title: 'Error',
          description: 'Please login first.',
          variant: 'destructive',
        });
        navigate('/login');
        return;
      }

      const user = JSON.parse(userStr);
      const ownerId = user?.id || user?._id;

      // Fetch rukos milik owner ini
      const rukosRes = await axios.get(`${API_BASE}/ruko`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Filter rukos milik owner
      const ownerRukos = rukosRes.data.filter(
        (r: any) => r.owner_id === ownerId
      );

      setMyRukos(ownerRukos);

      // Fetch all bookings untuk filter yang terkait rukos owner
      const bookingsRes = await axios.get(`${API_BASE}/bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const rukoIds = ownerRukos.map((r: any) => r.id);
      const ownerBookings = bookingsRes.data.filter(
        (b: any) => rukoIds.includes(b.ruko_id)
      );

      setMyBookings(ownerBookings);

      // Calculate stats
      const totalRukos = ownerRukos.length;
      
      const activeRentals = ownerBookings.filter(
        (b: any) => b.booking_status === 'confirmed' && b.payment_status === 'paid'
      ).length;

      const monthlyIncome = ownerBookings
        .filter((b: any) => {
          const createdDate = new Date(b.created_at);
          const now = new Date();
          return createdDate.getMonth() === now.getMonth() &&
                 createdDate.getFullYear() === now.getFullYear() &&
                 b.payment_status === 'paid';
        })
        .reduce((sum: number, b: any) => sum + b.total_price, 0);

      const pendingCount = ownerBookings.filter(
        (b: any) => b.booking_status === 'waiting'
      ).length;

      const totalEarnings = ownerBookings
        .filter((b: any) => b.payment_status === 'paid')
        .reduce((sum: number, b: any) => sum + b.total_price, 0);

      const occupancyRate = totalRukos > 0 ? (activeRentals / totalRukos) * 100 : 0;

      setStats({
        totalRukos,
        activeRentals,
        monthlyIncome,
        pendingBookings: pendingCount,
        totalEarnings,
        occupancyRate: Math.round(occupancyRate * 10) / 10
      });

      setLoading(false);
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      
      if (error.response?.status === 401) {
        toast({
          title: 'Error',
          description: 'Session expired. Please login again.',
          variant: 'destructive',
        });
        navigate('/login');
      } else {
        toast({
          title: 'Error',
          description: 'Failed to load dashboard data.',
          variant: 'destructive',
        });
      }
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      // Use correct endpoint: PUT /bookings/:id/accept
      await axios.put(
        `${API_BASE}/bookings/${bookingId}/accept`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Success',
        description: 'Booking accepted successfully.',
      });

      // Refresh data
      fetchDashboardData();
    } catch (error: any) {
      console.error('Accept booking error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to accept booking.',
        variant: 'destructive',
      });
    }
  };

  const handleRejectBooking = async (bookingId: string) => {
    try {
      const token = localStorage.getItem('token');
      // Use correct endpoint: PUT /bookings/:id/reject
      await axios.put(
        `${API_BASE}/bookings/${bookingId}/reject`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Success',
        description: 'Booking rejected.',
      });

      fetchDashboardData();
    } catch (error: any) {
      console.error('Reject booking error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to reject booking.',
        variant: 'destructive',
      });
    }
  };

  const sidebarMenu = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'my-rukos', label: 'My Rukos', icon: Building },
    { id: 'bookings', label: 'Bookings', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
  ];

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    return status === 'rented' || !status ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600';
  };

  const getStatusBadge = (status: string) => {
    const styles: any = {
      confirmed: 'bg-blue-100 text-blue-600',
      waiting: 'bg-yellow-100 text-yellow-600',
      rejected: 'bg-red-100 text-red-600',
      cancelled: 'bg-red-100 text-red-600',
      paid: 'bg-green-100 text-green-600',
      pending: 'bg-orange-100 text-orange-600'
    };
    return styles[status] || 'bg-gray-100 text-gray-600';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    toast({
      title: 'Logout Successful',
      description: 'You have been logged out.',
    });
    navigate('/login');
  };

  const handleAddRuko = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = JSON.parse(userStr || '{}');
      const ownerId = user?.id || user?._id;

      const rukoData = {
        owner_id: ownerId,
        name: addRukoForm.name,
        description: addRukoForm.description,
        address: addRukoForm.address,
        city: addRukoForm.city,
        price: parseFloat(addRukoForm.price),
        rental_type: addRukoForm.rental_type,
        discount_percent: parseFloat(addRukoForm.discount_percent),
        is_available: true,
        rented_offline: false,
        image: addRukoForm.image
      };

      await axios.post(
        `${API_BASE}/ruko`,
        rukoData,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast({
        title: 'Success',
        description: 'Ruko added successfully!',
      });

      // Reset form
      setAddRukoForm({
        name: '',
        description: '',
        address: '',
        city: '',
        price: '',
        rental_type: 'monthly',
        discount_percent: '0',
        image: ''
      });

      setShowAddRukoModal(false);
      fetchDashboardData();
    } catch (error: any) {
      console.error('Add ruko error:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to add ruko.',
        variant: 'destructive',
      });
    }
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

  const pendingBookings = myBookings.filter((b: any) => b.booking_status === 'waiting');
  const confirmedBookings = myBookings.filter((b: any) => b.booking_status === 'confirmed');

  // Prepare income data for chart
  const incomeByRuko = myRukos.map((ruko: any) => {
    const rukoBookings = myBookings.filter(
      (b: any) => b.ruko_id === ruko.id && b.payment_status === 'paid'
    );
    const totalIncome = rukoBookings.reduce((sum: number, b: any) => sum + b.total_price, 0);
    return {
      name: ruko.name.substring(0, 15),
      income: totalIncome
    };
  });

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-blue-600 text-white transition-all duration-300 flex-shrink-0 overflow-hidden`}>
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
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-white text-blue-600'
                      : 'text-white hover:bg-blue-700'
                  }`}
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
                  <h1 className="text-2xl font-bold text-gray-800">Owner Dashboard</h1>
                  <p className="text-gray-600 text-sm">Manage your rukos and track your income</p>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                  <Bell className="h-5 w-5 text-gray-600" />
                  {pendingBookings.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                  )}
                </button>
                <Button 
                  onClick={() => navigate('/add-ruko')}
                  className="bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2"
                >
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
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.totalRukos}</h3>
                    <p className="text-blue-600 text-sm mt-2">{stats.activeRentals} Active Rentals</p>
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
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">
                      {stats.monthlyIncome > 0 ? formatCurrency(stats.monthlyIncome).split(',')[0].slice(0, -3) + 'jt' : 'Rp0'}
                    </h3>
                    <p className="text-blue-600 text-sm mt-2 flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      This month
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
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.pendingBookings}</h3>
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
                    <h3 className="text-3xl font-bold text-gray-800 mt-2">{stats.occupancyRate}%</h3>
                    <p className="text-gray-600 text-sm mt-2">
                      {stats.activeRentals}/{stats.totalRukos} rukos rented
                    </p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <BarChart3 className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </Card>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-6">
                {/* Welcome Banner */}
                <Card className="p-6 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="text-lg font-semibold mb-2">Welcome back!</h3>
                      <p className="text-blue-100">
                        You have {stats.pendingBookings} pending booking request{stats.pendingBookings !== 1 ? 's' : ''}.
                      </p>
                    </div>
                    <Button 
                      onClick={() => setActiveTab('bookings')}
                      className="bg-white text-blue-600 hover:bg-blue-50"
                    >
                      View Details
                    </Button>
                  </div>
                </Card>

                {/* Pending Bookings */}
                {pendingBookings.length > 0 && (
                  <Card className="p-6 bg-white">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Pending Booking Requests</h3>
                      <span className="text-sm text-gray-600">{pendingBookings.length} requests</span>
                    </div>
                    <div className="space-y-4">
                      {pendingBookings.map((booking: any) => {
                        const ruko = myRukos.find((r: any) => r.id === booking.ruko_id);
                        return (
                          <div key={booking.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-800">{ruko?.name || 'Ruko'}</h4>
                                <p className="text-sm text-gray-600 mt-1">Booking #{booking.id.slice(-8)}</p>
                              </div>
                              <div className="text-right">
                                <p className="font-semibold text-blue-600">{formatCurrency(booking.total_price)}</p>
                                <p className="text-sm text-gray-600 capitalize">{booking.payment_method}</p>
                              </div>
                            </div>
                            <div className="flex justify-between items-center">
                              <div className="text-sm text-gray-600">
                                <span>{formatDate(booking.start_date)} - {formatDate(booking.end_date)}</span>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => handleRejectBooking(booking.id)}
                                  className="text-red-600 hover:bg-red-50 border-red-200"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleAcceptBooking(booking.id)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Accept
                                </Button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                )}

                {/* Empty State */}
                {myRukos.length === 0 && (
                  <Card className="p-12 text-center bg-white">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rukos Yet</h3>
                    <p className="text-gray-600 mb-6">Start by adding your first ruko property.</p>
                    <Button 
                      onClick={() => navigate('/add-ruko')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ruko
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* My Rukos Tab */}
            {activeTab === 'my-rukos' && (
              <div>
                {myRukos.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myRukos.map((ruko: any) => {
                      const rukoBooking = confirmedBookings.find((b: any) => b.ruko_id === ruko.id);
                      return (
                        <Card key={ruko.id} className="overflow-hidden hover:shadow-lg transition-shadow bg-white">
                          <div className="relative h-48">
                            {ruko.image ? (
                              <img src={ruko.image} alt={ruko.name} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                <Building className="h-16 w-16 text-gray-400" />
                              </div>
                            )}
                            <div className="absolute top-3 right-3">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                ruko.is_available ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                              }`}>
                                {ruko.is_available ? 'Available' : 'Rented'}
                              </span>
                            </div>
                            {ruko.discount_percent > 0 && (
                              <div className="absolute top-3 left-3">
                                <span className="px-3 py-1 rounded-full text-xs font-medium bg-red-500 text-white">
                                  {ruko.discount_percent}% OFF
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="p-4">
                            <h3 className="font-semibold text-gray-800 mb-2">{ruko.name}</h3>
                            <div className="flex items-center text-sm text-gray-600 mb-2">
                              <MapPin className="h-4 w-4 mr-1" />
                              {ruko.city || ruko.address}
                            </div>
                            <div className="border-t pt-3 mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-gray-600">Price:</span>
                                <span className="font-semibold text-gray-800">
                                  {formatCurrency(ruko.price)}/{ruko.rental_type === 'monthly' ? 'mo' : 'yr'}
                                </span>
                              </div>
                            </div>
                            {!ruko.is_available && rukoBooking && (
                              <div className="bg-blue-50 p-2 rounded mb-3 text-sm">
                                <p className="text-gray-600">Currently Rented</p>
                                <p className="text-gray-600 text-xs mt-1">
                                  Until: {formatDate(rukoBooking.end_date)}
                                </p>
                              </div>
                            )}
                            <div className="flex gap-2">
                              <Button variant="outline" size="sm" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50">
                                <Eye className="h-4 w-4 mr-1" />
                                View
                              </Button>
                              <Button variant="outline" size="sm" className="flex-1 border-blue-600 text-blue-600 hover:bg-blue-50">
                                <Edit className="h-4 w-4 mr-1" />
                                Edit
                              </Button>
                            </div>
                          </div>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card className="p-12 text-center bg-white">
                    <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Rukos Found</h3>
                    <p className="text-gray-600 mb-6">Start adding your ruko properties.</p>
                    <Button 
                      onClick={() => navigate('/add-ruko')}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Ruko
                    </Button>
                  </Card>
                )}
              </div>
            )}

            {/* Bookings Tab */}
            {activeTab === 'bookings' && (
              <Card className="p-6 bg-white">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">All Bookings ({myBookings.length})</h3>
                {myBookings.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-blue-50">
                        <tr>
                          <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Ruko</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Period</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Amount</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Payment</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Status</th>
                          <th className="px-4 py-3 text-left text-sm font-medium text-blue-600">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {myBookings.map((booking: any) => {
                          const ruko = myRukos.find((r: any) => r.id === booking.ruko_id);
                          return (
                            <tr key={booking.id} className="hover:bg-gray-50">
                              <td className="px-4 py-4 text-sm">
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-blue-50">
                                  <Eye className="h-4 w-4 text-blue-600" />
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">No bookings yet</p>
                  </div>
                )}
              </Card>
            )}

            {/* Analytics Tab */}
            {activeTab === 'analytics' && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Income by Ruko</h3>
                    {incomeByRuko.length > 0 ? (
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={incomeByRuko}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="name" />
                          <YAxis />
                          <Tooltip formatter={(value) => formatCurrency(value as number)} />
                          <Bar dataKey="income" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-[300px] flex items-center justify-center text-gray-500">
                        No income data available
                      </div>
                    )}
                  </Card>

                  <Card className="p-6 bg-white">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-sm text-gray-600">Occupancy Rate</span>
                          <span className="text-sm font-semibold text-gray-800">{stats.occupancyRate}%</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${stats.occupancyRate}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <div className="pt-4 space-y-3">
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="text-sm text-gray-600">Total Earnings (All Time)</span>
                          <span className="font-semibold text-gray-800">{formatCurrency(stats.totalEarnings)}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="text-sm text-gray-600">Total Rukos</span>
                          <span className="font-semibold text-gray-800">{stats.totalRukos}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="text-sm text-gray-600">Active Rentals</span>
                          <span className="font-semibold text-gray-800">{stats.activeRentals}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-blue-50 rounded">
                          <span className="text-sm text-gray-600">Total Bookings</span>
                          <span className="font-semibold text-gray-800">{myBookings.length}</span>
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