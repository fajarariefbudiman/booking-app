import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Badge } from "../components/ui/badge";
import { Card } from "../components/ui/card";
import { Star, MapPin, Maximize, CheckCircle2 } from "lucide-react";

const RukoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [ruko, setRuko] = useState<any>(null);

  useEffect(() => {
    const fetchRuko = async () => {
      try {
        const res = await fetch(`https://booking-api-production-8f43.up.railway.app/api/ruko/${id}`);
        const result = await res.json();
        if (!result.status) return;
        setRuko(result.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchRuko();
  }, [id]);

  if (!ruko) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  const imgUrl = ruko.image
    ? `/ruko/${ruko.image}` // nanti kamu buat public folder images /ruko/
    : "/no-image.jpg"; // fallback

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <img
            src={imgUrl}
            alt={ruko.name}
            className="w-full h-[400px] object-cover rounded-lg shadow-soft"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Detail */}
          <div className="lg:col-span-2">
            <h1 className="text-3xl font-bold text-navy-blue mb-2">{ruko.name}</h1>

            <div className="flex items-center gap-3 text-muted-foreground mb-4">
              <MapPin className="h-4 w-4" />
              <span>{ruko.city}</span>
              <Maximize className="h-4 w-4" />
              <span>{ruko.address}</span>
            </div>

            <p className="text-muted-foreground mb-6">{ruko.description}</p>
          </div>

          {/* Booking Info */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24 shadow-hover">
              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-2xl font-bold text-navy-blue">Rp {ruko.price.toLocaleString("id-ID")}</span>
                  <span className="text-muted-foreground">/ {ruko.rental_type === "monthly" ? "bulan" : "tahun"}</span>
                </div>
                <Badge className={ruko.is_available ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-600"}>{ruko.is_available ? "Tersedia" : "Disewa"}</Badge>
              </div>

              <Button
                disabled={!ruko.is_available}
                className={`w-full mb-4 ${ruko.is_available ? "bg-sky-blue hover:bg-sky-blue/90 text-white" : "bg-gray-400 cursor-not-allowed"}`}
                onClick={() => navigate(`/booking?ruko=${id}`)}
              >
                {ruko.is_available ? "Sewa Sekarang" : "Tidak Tersedia"}
              </Button>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RukoDetail;
