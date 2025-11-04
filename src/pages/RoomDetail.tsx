import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Star, MapPin, Maximize, CheckCircle2 } from "lucide-react";
import ruko1 from "../assets/ruko1.jpeg";
import ruko2 from "../assets/ruko2.jpeg";
import ruko3 from "../assets/ruko6.jpeg";

const RukoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const rukosData = {
    "1": {
      name: "Ruko Green Valley",
      images: [ruko2, ruko1, ruko3],
      location: "Tangerang",
      price_monthly: 3000000,
      price_yearly: 30000000,
      size: "Small (45 m²)",
      rating: 4.6,
      available: true,
      description: "Ruko modern dengan desain minimalis di kawasan strategis Tangerang. Cocok untuk usaha kecil dan menengah.",
      facilities: ["Parkir Luas", "Listrik 2200W", "Air PDAM", "Keamanan 24 Jam", "Dekat Jalan Raya"],
    },
    "2": {
      name: "Ruko Sudirman Center",
      images: [ruko1, ruko3, ruko2],
      location: "Jakarta Pusat",
      price_monthly: 5000000,
      price_yearly: 55000000,
      size: "Medium (60 m²)",
      rating: 4.8,
      available: false,
      description: "Ruko elit di pusat bisnis Sudirman. Ideal untuk kantor, coffee shop, atau usaha retail premium.",
      facilities: ["Parkir Basement", "Lift", "Keamanan 24 Jam", "Air PAM", "Akses MRT"],
    },
    "3": {
      name: "Ruko Grand Boulevard",
      images: [ruko3, ruko1, ruko2],
      location: "Bekasi",
      price_monthly: 8500000,
      price_yearly: 95000000,
      size: "Large (90 m²)",
      rating: 4.9,
      available: true,
      description: "Ruko besar dengan area depan luas dan lokasi strategis dekat kawasan industri Bekasi.",
      facilities: ["Area Parkir Luas", "Akses Tol", "Toilet Dalam", "Air Bersih", "CCTV 24 Jam"],
    },
  };

  const ruko = rukosData[id as keyof typeof rukosData];

  if (!ruko) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4">Ruko Tidak Ditemukan</h1>
            <Button onClick={() => navigate("/rukos")}>Kembali ke Daftar Ruko</Button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="container mx-auto px-4 py-8">
        {/* Gallery */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img
            src={ruko.images[0]}
            alt={ruko.name}
            className="w-full h-[400px] object-cover rounded-lg shadow-soft"
          />
          <div className="grid grid-cols-2 gap-4">
            {ruko.images.slice(1).map((img, i) => (
              <img
                key={i}
                src={img}
                alt={`${ruko.name}-${i}`}
                className="w-full h-[192px] object-cover rounded-lg shadow-soft"
              />
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detail */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-navy-blue mb-2">{ruko.name}</h1>
            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{ruko.location}</span>
              <Maximize className="h-4 w-4" />
              <span>{ruko.size}</span>
              <Star className="h-4 w-4 fill-sky-blue text-sky-blue" />
              <span>{ruko.rating} Rating</span>
            </div>

            <p className="text-muted-foreground mb-6">{ruko.description}</p>

            {/* Fasilitas */}
            <Card className="p-6 mb-6">
              <h2 className="text-xl font-semibold text-navy-blue mb-4">Fasilitas</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {ruko.facilities.map((facility, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2"
                  >
                    <CheckCircle2 className="h-5 w-5 text-sky-blue" />
                    <span className="text-sm">{facility}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Booking Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-hover">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-navy-blue">Rp {ruko.price_monthly.toLocaleString("id-ID")}</span>
                  <span className="text-muted-foreground">/ bulan</span>
                </div>
                <p className="text-muted-foreground text-sm mb-2">Rp {ruko.price_yearly.toLocaleString("id-ID")} / tahun</p>
                <Badge className={ruko.available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}>{ruko.available ? "Tersedia" : "Disewa"}</Badge>
              </div>

              <Button
                disabled={!ruko.available}
                className={`w-full mb-4 ${ruko.available ? "bg-sky-blue hover:bg-sky-blue/90 text-white" : "bg-gray-400 cursor-not-allowed"}`}
                onClick={() => navigate(`/booking?ruko=${id}`)}
              >
                {ruko.available ? "Sewa Sekarang" : "Tidak Tersedia"}
              </Button>

              <div className="border-t pt-4 text-sm text-muted-foreground space-y-2">
                <div className="flex justify-between">
                  <span>Durasi minimum</span>
                  <span className="text-secondary font-medium">1 Bulan</span>
                </div>
                <div className="flex justify-between">
                  <span>Metode Pembayaran</span>
                  <span className="text-secondary font-medium">Transfer / Tunai</span>
                </div>
                <div className="flex justify-between">
                  <span>Diskon</span>
                  <span className="text-secondary font-medium">Tersedia promo</span>
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

export default RukoDetail;
