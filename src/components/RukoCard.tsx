import { useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import { Card, CardContent } from "./ui/card";
import { MapPin, Maximize2, Star, Tag } from "lucide-react";
import ruko1 from "../assets/ruko1.jpeg";
import ruko2 from "../assets/ruko2.jpeg";
import ruko3 from "../assets/ruko3.jpeg";
import ruko4 from "../assets/ruko4.jpeg";
import ruko5 from "../assets/ruko5.jpeg";
import ruko6 from "../assets/ruko6.jpeg";

interface RukoCardProps {
  id: string;
  name: string;
  city: string;
  image: string;
  price_monthly: number;
  price_yearly: number;
  size: string;
  address: string;
  rating: number;
  discount?: number;
  is_available?: boolean;
}

const RukoCard = ({ id, name, city,image, price, size, address, rating, discount = 0, is_available = true }: any) => {
  const rukoImages = [ruko1, ruko2, ruko3, ruko4, ruko5, ruko6];
  const randomImage = rukoImages[Math.floor(Math.random() * rukoImages.length)];

  const price_monthly = price ?? 0;
  const price_yearly = price_monthly * 12;

  const navigate = useNavigate();

  // hitung harga setelah diskon (kalau ada)
  const finalPrice = discount > 0 ? price_monthly - (price_monthly * discount) / 100 : price_monthly;

  return (
    <Card className={`group overflow-hidden transition-smooth relative ${!is_available ? "opacity-70" : "hover:shadow-hover"}`}>
      {/* Gambar */}
      <div className="relative overflow-hidden aspect-[4/3]">
        {/* <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        /> */}
        <img
          src={randomImage}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />

        {/* Badge Diskon */}
        {discount > 0 && <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold">-{discount}%</div>}

        {/* Badge Rating */}
        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium">{rating}</span>
        </div>

        {/* Status Ruko */}
        {!is_available && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Sudah Disewa Offline</span>
          </div>
        )}
      </div>

      {/* Konten */}
      <CardContent className="p-5">
        <h3 className="text-xl font-semibold text-secondary mb-2">{name}</h3>

        <div className="flex items-center gap-2 text-muted-foreground mb-3">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">{address}</span>
        </div>

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          <div className="flex items-center gap-1">
            <Maximize2 className="h-4 w-4" />
            <span>{city}</span>
          </div>
          <div className="flex items-center gap-1">
            <Tag className="h-4 w-4" />
            <span>{discount > 0 ? "Diskon Tersedia" : "Harga Normal"}</span>
          </div>
        </div>

        {/* Harga */}
        <div className="mb-4">
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-primary">Rp {finalPrice.toLocaleString("id-ID")}</span>
            <span className="text-sm text-muted-foreground">/bulan</span>
          </div>
          <div className="text-sm text-muted-foreground">atau Rp {price_yearly.toLocaleString("id-ID")} /tahun</div>
        </div>

        {/* Tombol */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1 border-sky-blue text-sky-blue hover:bg-sky-blue hover:text-black"
            onClick={() => navigate(`/ruko/${id}`)}
          >
            Lihat Detail
          </Button>
          <Button
            disabled={!is_available}
            className="flex-1 bg-sky-blue hover:bg-sky-blue/90 text-black"
            onClick={() => navigate(`/booking?ruko=${id}`)}
          >
            {is_available == true ? "Sewa Sekarang" : "Tidak Tersedia"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default RukoCard;
