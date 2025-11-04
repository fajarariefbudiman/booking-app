import { useState } from "react";
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
import ruko1 from "../assets/room-deluxe.jpg";
import ruko2 from "../assets/room-single.jpg";
import ruko3 from "../assets/room-suite.jpg";

const BookingRuko = () => {
  const [searchParams] = useSearchParams();
  const rukoId = searchParams.get("ruko") || "1";
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    startDate: "",
    endDate: "",
    durationType: "bulan",
    fullName: "",
    email: "",
    phone: "",
    specialRequests: "",
    discountCode: "",
  });

  // Dummy data Ruko
  const rukoData = {
    "1": { name: "Ruko Harmoni Business Center", image: ruko1, price: 5000000 },
    "2": { name: "Ruko Sudirman Park", image: ruko2, price: 8500000 },
    "3": { name: "Ruko Melati Square", image: ruko3, price: 7000000 },
  };

  const ruko = rukoData[rukoId as keyof typeof rukoData];

  // Hitung durasi sewa
  const calculateMonths = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diff = end.getFullYear() * 12 + end.getMonth() - (start.getFullYear() * 12 + start.getMonth());
    return Math.max(0, diff);
  };

  const duration = calculateMonths();
  const subtotal = ruko.price * (formData.durationType === "tahun" ? duration / 12 : duration);
  const tax = subtotal * 0.1;

  // Diskon jika kode cocok
  const discountPercent = formData.discountCode.toUpperCase() === "PROMO10" ? 0.1 : 0;
  const discountAmount = subtotal * discountPercent;
  const total = subtotal + tax - discountAmount;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

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

    sessionStorage.setItem(
      "bookingData",
      JSON.stringify({
        ...formData,
        ruko,
        duration,
        subtotal,
        tax,
        discountAmount,
        total,
      })
    );

    navigate(`/payment?ruko=${rukoId}`);
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
                  <div>
                    <Label htmlFor="startDate">Mulai Sewa *</Label>
                    <Input
                      id="startDate"
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                      className="mt-1"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="endDate">Akhir Sewa *</Label>
                    <Input
                      id="endDate"
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                      className="mt-1"
                      min={formData.startDate || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                  <div>
                    <Label htmlFor="durationType">Tipe Sewa *</Label>
                    <select
                      id="durationType"
                      value={formData.durationType}
                      onChange={(e) => setFormData({ ...formData, durationType: e.target.value })}
                      className="border rounded-md w-full h-10 px-2 mt-1"
                    >
                      <option value="bulan">Per Bulan</option>
                      <option value="tahun">Per Tahun</option>
                    </select>
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
              >
                Lanjut ke Pembayaran
              </Button>
            </form>
          </div>

          {/* Ringkasan Booking */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-hover">
              <h2 className="text-xl font-semibold text-navy-blue mb-4">Ringkasan Sewa</h2>

              <div className="mb-4">
                <img
                  src={ruko.image}
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
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BookingRuko;
