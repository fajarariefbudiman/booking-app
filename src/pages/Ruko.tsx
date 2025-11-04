import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import RukoCard from "../components/RukoCard";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
import rukoSmall from "../assets/ruko5.jpeg";
import rukoMedium from "../assets/ruko1.jpeg";
import rukoLarge from "../assets/ruko6.jpeg";

const Rukos = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const allRukos = [
    {
      id: "1",
      name: "Ruko Green Valley",
      image: rukoSmall,
      price_monthly: 3000000,
      price_yearly: 30000000,
      size: "small",
      location: "Tangerang",
      rating: 4.6,
      discount: 10,
      available: true,
    },
    {
      id: "2",
      name: "Ruko Sudirman Center",
      image: rukoMedium,
      price_monthly: 5000000,
      price_yearly: 55000000,
      size: "medium",
      location: "Jakarta Pusat",
      rating: 4.8,
      discount: 0,
      available: false, 
    },
    {
      id: "3",
      name: "Ruko Grand Boulevard",
      image: rukoLarge,
      price_monthly: 8500000,
      price_yearly: 95000000,
      size: "large",
      location: "Bekasi",
      rating: 4.9,
      discount: 15,
      available: true,
    },
    {
      id: "4",
      name: "Ruko Ciledug Business Park",
      image: rukoMedium,
      price_monthly: 4000000,
      price_yearly: 42000000,
      size: "medium",
      location: "Ciledug",
      rating: 4.5,
      discount: 0,
      available: true,
    },
  ];

  const filteredRukos = allRukos.filter((ruko) => {
    const matchesSearch = ruko.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSize = selectedSize === "all" || ruko.size === selectedSize;
    const matchesPrice =
      selectedPrice === "all" || (selectedPrice === "under5" && ruko.price_monthly < 5000000) || (selectedPrice === "5-8" && ruko.price_monthly >= 5000000 && ruko.price_monthly <= 8000000) || (selectedPrice === "above8" && ruko.price_monthly > 8000000);

    return matchesSearch && matchesSize && matchesPrice;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4 animate-fade-in">Daftar Ruko Disewakan</h1>
          <p className="text-lg text-muted-foreground animate-slide-up">Temukan ruko terbaik untuk usaha Anda — sewa bulanan atau tahunan</p>
        </div>
      </section>

      {/* Search & Filter */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Cari ruko..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12"
            />
          </div>
          <Button
            variant="outline"
            className="border-primary text-primary hover:bg-primary hover:text-white w-full md:w-auto"
          >
            <SlidersHorizontal className="h-4 w-4 mr-2" />
            Filter
          </Button>
        </div>

        {/* Filter Buttons */}
        <div className="flex gap-2 mt-4 flex-wrap">
          {/* Filter Ukuran */}
          {[
            { label: "Semua Ukuran", value: "all" },
            { label: "Kecil", value: "small" },
            { label: "Sedang", value: "medium" },
            { label: "Besar", value: "large" },
          ].map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant="outline"
              className={`rounded-full ${
                selectedSize === item.value
                  ? "bg-sky-300 text-white border-sky-blue" 
                  : "bg-white text-gray-700 border-gray-300 hover:bg-sky-300"
              }`}
              onClick={() => setSelectedSize(item.value)}
            >
              {item.label}
            </Button>
          ))}

          {/* Filter Harga */}
          {[
            { label: "Di bawah 5jt/bln", value: "under5" },
            { label: "5–8jt/bln", value: "5-8" },
            { label: "Di atas 8jt/bln", value: "above8" },
          ].map((item) => (
            <Button
              key={item.value}
              size="sm"
              variant="outline"
              className={`rounded-full ${
                selectedPrice === item.value
                  ? "bg-sky-blue text-white border-sky-blue"
                  : "bg-sky-blue text-gray-700 border-gray-300 hover:bg-sky-300"
              }`}
              onClick={() => setSelectedPrice(item.value)}
            >
              {item.label}
            </Button>
          ))}
        </div>
      </section>

      {/* Ruko Grid */}
      <section className="container mx-auto px-4 pb-20">
        <div className="mb-6">
          <p className="text-muted-foreground">
            Menampilkan <span className="font-semibold text-secondary">{filteredRukos.length}</span> ruko
          </p>
        </div>

        {filteredRukos.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredRukos.map((ruko) => (
              <RukoCard
                key={ruko.id}
                {...ruko}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">Tidak ada ruko yang cocok dengan filter.</p>
            <Button
              onClick={() => {
                setSearchTerm("");
                setSelectedSize("all");
                setSelectedPrice("all");
              }}
              className="mt-4 bg-sky-blue hover:bg-sky-blue/90 text-white"
            >
              Reset Filter
            </Button>
          </div>
        )}
      </section>

      <Footer />
    </div>
  );
};

export default Rukos;
