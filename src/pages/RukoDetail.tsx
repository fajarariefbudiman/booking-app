import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import img from "../assets/ruko4.jpeg";
import { MapPin, Calendar, Tag, AlertCircle, Clock } from "lucide-react";

interface Ruko {
  id: string;
  owner_id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  price: number;
  discount_percent: number;
  rental_type: string;
  is_available: boolean;
  rented_offline: boolean;
  image: string;
  created_at: string;
  updated_at: string;
}

const RukoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [ruko, setRuko] = useState<Ruko | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRuko = async () => {
      try {
        const res = await fetch(`https://booking-api-production-8f43.up.railway.app/api/ruko/${id}`);
        if (!res.ok) throw new Error("Failed to fetch ruko");
        const data = await res.json();
        setRuko(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchRuko();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-blue mx-auto mb-4"></div>
            <p className="text-muted-foreground">Memuat data ruko...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error || !ruko) {
    return (
      <div className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <div className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="text-center max-w-md">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-navy-blue mb-2">Ruko Tidak Ditemukan</h2>
            <p className="text-muted-foreground mb-6">{error || "Ruko yang Anda cari tidak tersedia"}</p>
            <Button
              onClick={() => navigate("/search")}
              className="bg-sky-blue hover:bg-sky-blue/90"
            >
              Kembali ke Pencarian
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // const imgUrl = ruko.image ? `/ruko/${ruko.image}` : "/no-image.jpg";

  const discountedPrice = ruko.discount_percent > 0 ? ruko.price - (ruko.price * ruko.discount_percent) / 100 : ruko.price;

  const hasDiscount = ruko.discount_percent > 0;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />

      <main className="flex-1">
        {/* Hero Image Section */}
        <section className="w-full bg-white">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="relative w-full h-[300px] md:h-[500px] rounded-xl overflow-hidden shadow-lg">
              <img
                src={img}
                alt={ruko.name}
                className="w-full h-full object-cover"
              />

              {/* Overlay Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {hasDiscount && <Badge className="bg-red-500 text-white text-sm px-3 py-1 shadow-md">Diskon {ruko.discount_percent}%</Badge>}
                <Badge className={ruko.is_available ? "bg-green-500 text-white" : "bg-gray-500 text-white"}>{ruko.is_available ? "Tersedia" : "Tidak Tersedia"}</Badge>
              </div>

              {ruko.rented_offline && <Badge className="absolute top-4 right-4 bg-orange-500 text-white text-sm px-3 py-1 shadow-md">Disewa Offline</Badge>}
            </div>
          </div>
        </section>

        {/* Content Section */}
        <section className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Location */}
              <Card className="p-6 shadow-sm">
                <h1 className="text-2xl md:text-3xl font-bold text-navy-blue mb-4">{ruko.name}</h1>

                <div className="flex flex-wrap items-center gap-3 text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-sky-blue flex-shrink-0" />
                    <span className="text-sm md:text-base">{ruko.city}</span>
                  </div>
                </div>
              </Card>

              {/* Description */}
              <Card className="p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-navy-blue mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-sky-blue rounded"></div>
                  Deskripsi
                </h2>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base">{ruko.description || "Tidak ada deskripsi tersedia untuk properti ini."}</p>
              </Card>

              {/* Location Details */}
              <Card className="p-6 shadow-sm">
                <h2 className="text-xl font-semibold text-navy-blue mb-4 flex items-center gap-2">
                  <div className="h-1 w-8 bg-sky-blue rounded"></div>
                  Detail Lokasi
                </h2>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-sky-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-navy-blue">Alamat Lengkap</p>
                      <p className="text-sm text-muted-foreground">{ruko.address}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-sky-blue mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-navy-blue">Kota</p>
                      <p className="text-sm text-muted-foreground">{ruko.city}</p>
                    </div>
                  </div>
                  {ruko.latitude && ruko.longitude && (
                    <div className="flex items-start gap-3">
                      <MapPin className="h-5 w-5 text-sky-blue mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="text-sm font-medium text-navy-blue">Koordinat GPS</p>
                        <p className="text-sm text-muted-foreground font-mono">
                          {ruko.latitude.toFixed(6)}, {ruko.longitude.toFixed(6)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </Card>

              {/* Additional Info Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-sky-blue/10 rounded-lg">
                      <Tag className="h-5 w-5 text-sky-blue" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Tipe Sewa</span>
                  </div>
                  <p className="text-xl font-bold text-navy-blue capitalize">{ruko.rental_type === "monthly" ? "Bulanan" : "Tahunan"}</p>
                </Card>

                <Card className="p-5 shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 bg-sky-blue/10 rounded-lg">
                      <Calendar className="h-5 w-5 text-sky-blue" />
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Status Ketersediaan</span>
                  </div>
                  <Badge className={`${ruko.is_available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"} text-base px-3 py-1`}>{ruko.is_available ? "Tersedia" : "Tidak Tersedia"}</Badge>
                </Card>
              </div>
            </div>

            {/* Booking Sidebar */}
            <div className="lg:col-span-1">
              <Card className="p-6 shadow-lg">
                {/* Price Section */}
                <div className="mb-6 pb-6 border-b">
                  <div className="mb-3">
                    {hasDiscount && <span className="text-base text-muted-foreground line-through block mb-1">Rp {ruko.price.toLocaleString("id-ID")}</span>}
                    <div className="flex flex-wrap items-baseline gap-2">
                      <span className="text-3xl md:text-4xl font-bold text-navy-blue">Rp {discountedPrice.toLocaleString("id-ID")}</span>
                      <span className="text-muted-foreground text-base">/ {ruko.rental_type === "monthly" ? "bulan" : "tahun"}</span>
                    </div>
                  </div>
                  {hasDiscount && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                      <p className="text-sm font-semibold text-green-700">🎉 Hemat Rp {(ruko.price - discountedPrice).toLocaleString("id-ID")}</p>
                    </div>
                  )}
                </div>

                {/* Alert Section */}
                {ruko.rented_offline && (
                  <div className="mb-4 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                    <p className="text-sm text-orange-800 font-medium">⚠️ Properti ini telah disewa secara offline</p>
                  </div>
                )}

                {/* CTA Button */}
                <Button
                  disabled={!ruko.is_available || ruko.rented_offline}
                  className={`w-full h-12 text-base font-semibold mb-4 transition-all ${ruko.is_available && !ruko.rented_offline ? "bg-primary hover:bg-sky-blue/90 text-white shadow-md hover:shadow-lg" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                  onClick={() => navigate(`/booking?ruko=${id}`)}
                >
                  {ruko.is_available && !ruko.rented_offline ? "Sewa Sekarang" : "Tidak Tersedia"}
                </Button>

                {/* Last Updated */}
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  <span>
                    Update terakhir:{" "}
                    {new Date(ruko.updated_at).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>
              </Card>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default RukoDetail;
