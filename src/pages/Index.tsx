import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Search, Calendar, Users, Star, Shield, Clock, Building } from "lucide-react";
import heroImage from "../assets/ruko2.jpeg";
import rukoSmall from "../assets/ruko3.jpeg";
import rukoMedium from "../assets/ruko4.jpeg";
import axios from "axios";
import rukoLarge from "../assets/ruko5.jpeg";
import RukoCard from "../components/RukoCard";
import { useEffect, useState } from "react";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSize, setSelectedSize] = useState("all");
  const [selectedPrice, setSelectedPrice] = useState("all");

  const [allRukos, setAllRukos] = useState([]);

  useEffect(() => {
    const fetchRukos = async () => {
      try {
        const res = await axios.get("https://booking-api-production-8f43.up.railway.app/api/ruko");
        setAllRukos(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchRukos();
  }, []);

  const filteredRukos = allRukos
    .filter((ruko) => {
      const matchesSearch = ruko.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSize = selectedSize === "all" || ruko.size === selectedSize;
      const matchesPrice = selectedPrice === "all" || (selectedPrice === "under5" && ruko.price < 5000000) || (selectedPrice === "5-8" && ruko.price >= 5000000 && ruko.price <= 8000000) || (selectedPrice === "above8" && ruko.price > 8000000);

      return matchesSearch && matchesSize && matchesPrice;
    })
    .slice(0, 9);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[500px] sm:h-[600px] md:h-[700px] flex items-center justify-center overflow-hidden">
        <img
          src={heroImage}
          alt="Modern commercial ruko building"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-secondary/80 to-secondary/40" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center text-white animate-fade-in">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 leading-tight">
            Temukan Ruko Impianmu di <span className="text-primary">RukoSpace</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-6 sm:mb-8 text-white/90 max-w-2xl mx-auto px-4">Platform modern untuk sewa ruko bulanan atau tahunan — praktis, aman, dan transparan.</p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center px-4">
            <Link
              to="/ruko"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white shadow-hover text-base sm:text-lg px-6 sm:px-8 sm:py-2 h-12 sm:h-auto"
              >
                Cari Ruko
              </Button>
            </Link>
            <Link
              to="/about"
              className="w-full sm:w-auto"
            >
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto bg-white/10 backdrop-blur-sm border-white text-white hover:bg-white hover:text-secondary text-base sm:text-lg px-6 sm:px-8 sm:py-1.5 h-12 sm:h-auto"
              >
                Pelajari Lebih Lanjut
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Quick Search Bar */}
      <section className="container mx-auto px-4 sm:px-6 -mt-12 sm:-mt-16 relative z-20 mb-8 sm:mb-0">
        <Card className="p-4 sm:p-6 shadow-hover bg-white">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-secondary flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                Tanggal Mulai
              </label>
              <input
                type="date"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-smooth"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-secondary flex items-center gap-2">
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                Durasi Sewa
              </label>
              <select className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-smooth">
                <option>1 Bulan</option>
                <option>3 Bulan</option>
                <option>6 Bulan</option>
                <option>1 Tahun</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs sm:text-sm font-medium text-secondary flex items-center gap-2">
                <Search className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                Lokasi
              </label>
              <input
                type="text"
                placeholder="Masukkan kota atau area"
                className="w-full px-3 sm:px-4 py-2 text-sm sm:text-base border border-border rounded-lg focus:ring-2 focus:ring-primary outline-none transition-smooth"
              />
            </div>
            <div className="flex items-end">
              <Link
                to="/ruko"
                className="w-full"
              >
                <Button className="w-full bg-primary hover:bg-primary/90 text-white h-[42px] text-sm sm:text-base">
                  <Search className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                  Cari Ruko
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12 animate-slide-up">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-3 sm:mb-4">Kenapa Pilih RukoSpace?</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl mx-auto px-4">Platform penyewaan ruko terpercaya dengan proses cepat dan dukungan penuh bagi pemilik maupun penyewa.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <Card className="p-6 sm:p-8 text-center hover:shadow-hover transition-smooth animate-scale-in">
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Building className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-2 sm:mb-3">Ruko Berkualitas</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Ruko modern dengan lokasi strategis dan fasilitas lengkap siap mendukung bisnismu.</p>
          </Card>

          <Card
            className="p-6 sm:p-8 text-center hover:shadow-hover transition-smooth animate-scale-in"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-2 sm:mb-3">Transaksi Aman</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Semua transaksi tercatat dan terverifikasi, bisa bayar online maupun offline.</p>
          </Card>

          <Card
            className="p-6 sm:p-8 text-center hover:shadow-hover transition-smooth animate-scale-in sm:col-span-2 lg:col-span-1"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
              <Clock className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
            </div>
            <h3 className="text-lg sm:text-xl font-semibold text-secondary mb-2 sm:mb-3">Dukungan 24/7</h3>
            <p className="text-sm sm:text-base text-muted-foreground">Tim kami siap membantu kapan pun kamu butuh informasi atau bantuan teknis.</p>
          </Card>
        </div>
      </section>

      {/* Featured Ruko Section */}
      <section className="bg-muted py-12 sm:py-16 md:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-3 sm:mb-4">Ruko Unggulan</h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">Temukan ruko pilihan terbaik dengan harga menarik</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
            {filteredRukos.map((ruko) => (
              <RukoCard
                key={ruko.id}
                {...ruko}
              />
            ))}
          </div>

          <div className="text-center">
            <Link to="/ruko">
              <Button
                size="lg"
                variant="outline"
                className="border-primary text-primary hover:bg-primary hover:text-white text-sm sm:text-base px-6 sm:px-8"
              >
                Lihat Semua Ruko
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="container mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-20">
        <div className="text-center mb-8 sm:mb-12">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-secondary mb-3 sm:mb-4">Ulasan Penyewa</h2>
          <p className="text-sm sm:text-base md:text-lg text-muted-foreground px-4">Cerita sukses dari penyewa yang telah menggunakan RukoSpace</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {[
            {
              name: "Budi Santoso",
              rating: 5,
              comment: "Proses sewa sangat cepat dan transparan. Lokasi rukonya strategis banget untuk usaha saya!",
            },
            {
              name: "Rina Oktaviani",
              rating: 5,
              comment: "Platform yang sangat membantu! Saya bisa temukan ruko sesuai budget dan durasi sewa fleksibel.",
            },
            {
              name: "Andi Wirawan",
              rating: 5,
              comment: "Pembayaran mudah, dukungan tim cepat, dan rukonya sesuai foto. Sangat recommended!",
            },
          ].map((review, index) => (
            <Card
              key={index}
              className="p-5 sm:p-6 hover:shadow-hover transition-smooth"
            >
              <div className="flex gap-1 mb-3">
                {[...Array(review.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 sm:h-5 sm:w-5 fill-yellow-400 text-yellow-400"
                  />
                ))}
              </div>
              <p className="text-sm sm:text-base text-muted-foreground mb-3 sm:mb-4 italic leading-relaxed">"{review.comment}"</p>
              <p className="text-sm sm:text-base font-semibold text-secondary">{review.name}</p>
            </Card>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
