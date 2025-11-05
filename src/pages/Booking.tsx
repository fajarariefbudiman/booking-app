import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { Calendar, Building2, Tag } from "lucide-react";
import { useToast } from "../hooks/use-toast";
import ruko1 from "../assets/ruko1.jpeg";
import axios from "axios";

const BookingRuko = () => {
  const [searchParams] = useSearchParams();
  const rukoId = searchParams.get("ruko") || "1";
  const navigate = useNavigate();
  const { toast } = useToast();
  const img = ruko1;

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    durationType: "bulan",
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
    discountCode: "",
    paymentMethod: "online", // online atau offline
  });

  const [ruko, setRuko] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchRuko = async () => {
      try {
        const res = await axios.get(`https://booking-api-production-8f43.up.railway.app/api/ruko/${rukoId}`);
        setRuko(res.data);
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Gagal memuat data ruko.",
          variant: "destructive",
        });
      }
    };
    fetchRuko();
  }, [rukoId]);

  if (!ruko) {
    return <div className="min-h-screen flex items-center justify-center">Loading ruko...</div>;
  }

  // Hitung durasi sewa
  const calculateMonths = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = end.getFullYear() * 12 + end.getMonth() - (start.getFullYear() * 12 + start.getMonth());
    return Math.max(0, diff);
  };

  const duration = calculateMonths();
  const price = ruko?.price || 0;
  const subtotal = price * (formData.durationType === "tahun" ? duration / 12 : duration);

  const tax = subtotal * 0.1;

  // Diskon jika kode cocok
  const discountPercent = formData.discountCode.toUpperCase() === "PROMO10" ? 0.1 : 0;
  const discountAmount = subtotal * discountPercent;
  const total = subtotal + tax - discountAmount;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    function diffMonths(start: string, end: string) {
      const s = new Date(start);
      const e = new Date(end);
      return (e.getFullYear() - s.getFullYear()) * 12 + (e.getMonth() - s.getMonth());
    }

    function diffYears(start: string, end: string) {
      return new Date(end).getFullYear() - new Date(start).getFullYear();
    }

    const months = diffMonths(formData.startDate, formData.endDate);
    const years = diffYears(formData.startDate, formData.endDate);

    // rule validate
    if (ruko.rental_type === "monthly" && months < 1) {
      toast({
        title: "Durasi sewa tidak valid",
        description: "Minimal sewa 1 bulan untuk tipe sewa bulanan.",
        variant: "destructive",
      });
      return;
    }

    if (ruko.rental_type === "yearly" && years < 1) {
      toast({
        title: "Durasi sewa tidak valid",
        description: "Minimal sewa 1 tahun untuk tipe sewa tahunan.",
        variant: "destructive",
      });
      return;
    }

    // Validasi form
    if (!formData.startDate || !formData.endDate) {
      toast({
        title: "Error",
        description: "Silakan pilih tanggal mulai dan berakhir sewa.",
        variant: "destructive",
      });
      return;
    }

    if (new Date(formData.startDate) >= new Date(formData.endDate)) {
      toast({
        title: "Error",
        description: "Tanggal selesai harus setelah tanggal mulai.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.fullName || !formData.email || !formData.phone) {
      toast({
        title: "Error",
        description: "Isi semua data penyewa dengan lengkap.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Get token from localStorage
      const token = localStorage.getItem("token");
      if (!token) {
        toast({
          title: "Error",
          description: "Anda harus login terlebih dahulu.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      // Prepare booking data
      // const bookingData = {
      //   ruko_id: rukoId,
      //   start_date: new Date(formData.startDate).toISOString(),
      //   end_date: new Date(formData.endDate).toISOString(),
      //   total_price: total,
      //   payment_status: "pending",
      //   booking_status: "waiting",
      //   payment_method: formData.paymentMethod,
      // };
      // ambil user untuk tenant id
      // const user = JSON.parse(localStorage.getItem("user") || "{}");
      const rawUser = localStorage.getItem("user");
      const user = rawUser ? JSON.parse(rawUser) : null;

      if (!user) {
        toast({
          title: "Error",
          description: "User tidak ditemukan. Silakan login ulang.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      console.log("User from ls:", user);

      const bookingData = {
        ruko_id: rukoId,
        tenant_id: user.id, // sekarang pasti ada id mongo nya
        start_date: formData.startDate, // yyyy-mm-dd
        end_date: formData.endDate,
        payment_method: formData.paymentMethod,
        discount_code: formData.discountCode || null,
      };

      // Call API to create booking
      const response = await axios.post("https://booking-api-production-8f43.up.railway.app/api/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        // Simpan data booking ke sessionStorage untuk halaman payment
        sessionStorage.setItem(
          "bookingData",
          JSON.stringify({
            ...formData,
            bookingId: response.data.id,
            ruko,
            duration,
            subtotal,
            tax,
            discountAmount,
            total,
          })
        );

        toast({
          title: "Booking Berhasil!",
          description: "Silakan lanjutkan ke pembayaran.",
        });

        // Navigate ke halaman payment
        navigate(`/payment?booking=${response.data.id}`);
      }
    } catch (error: any) {
      console.error("Booking error:", error);

      let errorMessage = "Gagal membuat booking. Silakan coba lagi.";

      if (error.response?.status === 401) {
        errorMessage = "Sesi Anda telah berakhir. Silakan login kembali.";
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-hero py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-navy-blue mb-2">Booking Ruko</h1>
          <p className="text-muted-foreground">Lengkapi data untuk menyewa ruko pilihanmu</p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Booking */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >
              {/* Detail Waktu Sewa */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-navy-blue mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-sky-blue" />
                  Detail Waktu Sewa
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* <div>
                    <Label htmlFor="startDate">Mulai Sewa *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="mt-1"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-secondary flex items-center gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      Mulai Sewa
                    </label>
                    <input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      min={new Date().toISOString().split("T")[0]}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-smooth"
                    />
                  </div>

                  {/* <div>
                    <Label htmlFor="endDate">Akhir Sewa *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="mt-1"
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                    />
                  </div> */}
                  <div className="space-y-2">
                    <label className="text-xs sm:text-sm font-medium text-secondary flex items-center gap-2">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                      Akhir Sewa
                    </label>
                    <input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-smooth"
                    />
                  </div>

                  <div>
                    <Label>Tipe Sewa</Label>
                    <Input
                      value={ruko.rental_type === "monthly" ? "Per Bulan" : "Per Tahun"}
                      className="mt-1"
                      disabled
                    />
                  </div>
                </div>
              </Card>

              {/* Data Penyewa */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-navy-blue mb-4 flex items-center gap-2">
                  <Building2 className="h-5 w-5 text-sky-blue" />
                  Data Penyewa
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <Label htmlFor="fullName">Nama Lengkap *</Label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="Masukkan nama lengkap"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="emailkamu@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone">Nomor Telepon *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="+62 812-xxxx-xxxx"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="specialRequests">Catatan Tambahan</Label>
                    <Textarea
                      id="specialRequests"
                      placeholder="Tambahkan catatan jika ada permintaan khusus..."
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialRequests: e.target.value,
                        })
                      }
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              </Card>

              {/* Payment Method */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-navy-blue mb-4">Metode Pembayaran</h2>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="online"
                      checked={formData.paymentMethod === "online"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    />
                    <span>Online (Transfer Bank / E-Wallet)</span>
                  </label>
                  {/* <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="offline"
                      checked={formData.paymentMethod === "offline"}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                    />
                    <span>Offline (Bayar di Tempat)</span>
                  </label> */}
                </div>
              </Card>

              {/* Diskon */}
              <Card className="p-6">
                <h2 className="text-xl font-semibold text-navy-blue mb-4 flex items-center gap-2">
                  <Tag className="h-5 w-5 text-sky-blue" />
                  Kode Promo / Diskon
                </h2>
                <div className="flex gap-2">
                  <Input
                    placeholder="Masukkan kode promo"
                    value={formData.discountCode}
                    onChange={(e) => setFormData({ ...formData, discountCode: e.target.value })}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      if (formData.discountCode.toUpperCase() === "PROMO10") {
                        toast({
                          title: "Diskon berhasil diterapkan!",
                          description: "Anda mendapatkan potongan 10%.",
                        });
                      } else {
                        toast({
                          title: "Kode tidak valid",
                          description: "Gunakan kode promo yang benar.",
                          variant: "destructive",
                        });
                      }
                    }}
                  >
                    Terapkan
                  </Button>
                </div>
              </Card>

              <Button
                type="submit"
                className="w-full bg-sky-blue hover:bg-sky-blue/90 text-white h-12 text-lg"
                disabled={loading}
              >
                {loading ? "Memproses..." : "Lanjut ke Pembayaran"}
              </Button>
            </form>
          </div>

          {/* Ringkasan Booking */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-hover">
              <h2 className="text-xl font-semibold text-navy-blue mb-4">Ringkasan Sewa</h2>

              <div className="mb-4">
                <img
                  src={img}
                  alt={ruko.name}
                  className="w-full h-40 object-cover rounded-lg mb-3"
                />
                <h3 className="font-semibold text-lg">{ruko.name}</h3>
              </div>

              <div className="space-y-3 border-t pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mulai</span>
                  <span>{formData.startDate || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selesai</span>
                  <span>{formData.endDate || "-"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Durasi</span>
                  <span>
                    {duration} {formData.durationType}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Metode Bayar</span>
                  <span className="capitalize">{formData.paymentMethod}</span>
                </div>
              </div>

              <div className="space-y-2 border-t mt-4 pt-4">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>Rp{subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Pajak (10%)</span>
                  <span>Rp{tax.toLocaleString()}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600">
                    <span>Diskon (10%)</span>
                    <span>-Rp{discountAmount.toLocaleString()}</span>
                  </div>
                )}
                <div className="flex justify-between text-lg font-bold text-navy-blue border-t pt-2">
                  <span>Total</span>
                  <span>Rp{total.toLocaleString()}</span>
                </div>
              </div>

              {/* Tombol Submit Tambahan */}
              <Button
                type="button"
                className="w-full bg-primary hover:bg-primary/90 text-white mt-4"
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? "Memproses..." : "Lanjut ke Pembayaran"}
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingRuko;
