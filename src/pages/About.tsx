import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Card } from "../components/ui/card";
import { Building, Users, Award, Handshake } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4 animate-fade-in">
            Tentang <span className="text-primary">RukoSpace</span>
          </h1>
          <p className="text-lg text-muted-foreground animate-slide-up max-w-2xl">Platform modern untuk sewa dan pengelolaan ruko secara mudah, aman, dan transparan.</p>
        </div>
      </section>

      {/* Story Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-secondary mb-6">Cerita Kami</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed">
            <p>
              Didirikan pada tahun 2023, <strong>RukoSpace</strong> hadir sebagai solusi digital untuk membantu pemilik ruko dan penyewa bertemu dalam satu platform yang efisien.
            </p>
            <p>Kami memahami tantangan dalam mencari tempat usaha yang strategis dan terpercaya. Karena itu, kami membangun sistem yang memudahkan proses sewa — dari pencarian, pemesanan, hingga pembayaran, semuanya bisa dilakukan secara online.</p>
            <p>
              Kini, lebih dari <strong>ratusan ruko</strong> di berbagai kota sudah bergabung dengan kami untuk mempercepat pertumbuhan bisnis lokal dan UMKM.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card className="p-8 text-center hover:shadow-hover transition-smooth">
              <Building className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-secondary mb-2">500+</div>
              <p className="text-muted-foreground">Ruko Terdaftar</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-hover transition-smooth">
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-secondary mb-2">1.200+</div>
              <p className="text-muted-foreground">Penyewa Aktif</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-hover transition-smooth">
              <Award className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-secondary mb-2">98%</div>
              <p className="text-muted-foreground">Kepuasan Pengguna</p>
            </Card>

            <Card className="p-8 text-center hover:shadow-hover transition-smooth">
              <Handshake className="h-12 w-12 text-primary mx-auto mb-4" />
              <div className="text-4xl font-bold text-secondary mb-2">30+</div>
              <p className="text-muted-foreground">Mitra Properti</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold text-secondary mb-12 text-center">Nilai Kami</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Kolaboratif</h3>
            <p className="text-muted-foreground">Kami percaya bahwa kemajuan bisnis tercipta lewat kerja sama antara pemilik dan penyewa.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Award className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Profesional</h3>
            <p className="text-muted-foreground">Kami menjaga kepercayaan dengan layanan cepat, transparan, dan berintegritas tinggi.</p>
          </div>

          <div className="text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Building className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold text-secondary mb-3">Inovatif</h3>
            <p className="text-muted-foreground">Kami terus berinovasi untuk menghadirkan solusi digital terbaik di dunia properti komersial.</p>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default About;
