import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Card } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { MapPin, Phone, Mail, Clock } from "lucide-react";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Contact form submitted:", formData);
    alert("Terima kasih! Pesan Anda telah kami terima, kami akan segera menghubungi Anda.");
    setFormData({ name: "", email: "", subject: "", message: "" });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      {/* Header */}
      <section className="bg-gradient-hero py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold text-secondary mb-4 animate-fade-in">Hubungi Kami</h1>
          <p className="text-lg text-muted-foreground animate-slide-up">Kami siap membantu Anda dalam urusan sewa dan pemasangan iklan ruko</p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6">Kirim Pesan</h2>
            <Card className="p-6 shadow-soft">
              <form
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <div className="space-y-2">
                  <Label htmlFor="name">Nama</Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Nama lengkap Anda"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="emailanda@gmail.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subjek</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="Tentang apa pesan Anda?"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Pesan</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Tulis pesan Anda di sini..."
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-white"
                >
                  Kirim Pesan
                </Button>
              </form>
            </Card>
          </div>

          {/* Contact Information */}
          <div>
            <h2 className="text-2xl font-bold text-secondary mb-6">Informasi Kontak</h2>
            <div className="space-y-6">
              <Card className="p-6 hover:shadow-hover transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <MapPin className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Alamat Kantor</h3>
                    <p className="text-muted-foreground">
                      Jl. Bisnis Raya No. 45
                      <br />
                      Tangerang Selatan, Banten 15412
                      <br />
                      Indonesia
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-hover transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Phone className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Telepon</h3>
                    <p className="text-muted-foreground">
                      Admin: +62 812-3456-7890
                      <br />
                      CS RukoHub: +62 811-2222-3333
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-hover transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Mail className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Email</h3>
                    <p className="text-muted-foreground">
                      Umum: info@rukohub.id
                      <br />
                      Bantuan: support@rukohub.id
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6 hover:shadow-hover transition-smooth">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Clock className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-secondary mb-1">Jam Operasional</h3>
                    <p className="text-muted-foreground">
                      Senin - Jumat: 08.00 - 20.00
                      <br />
                      Sabtu: 09.00 - 17.00
                      <br />
                      Minggu & Hari Libur: Tutup
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Contact;
