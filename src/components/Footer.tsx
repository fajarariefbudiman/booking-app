import { Link } from "react-router-dom";
import { Building2, Mail, MapPin, Phone, Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-secondary text-white mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="text-xl font-bold">RukoSpace</span>
            </div>
            <p className="text-white/70 text-sm">Platform manajemen ruko modern untuk pemilik dan penyewa. Kelola, sewa, dan bayar dengan mudah — online maupun offline.</p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigasi Cepat</h3>
            <div className="space-y-2">
              <Link
                to="/"
                className="block text-white/70 hover:text-primary transition-colors text-sm"
              >
                Beranda
              </Link>
              <Link
                to="/ruko"
                className="block text-white/70 hover:text-primary transition-colors text-sm"
              >
                Daftar Ruko
              </Link>
              <Link
                to="/tentang"
                className="block text-white/70 hover:text-primary transition-colors text-sm"
              >
                Tentang Kami
              </Link>
              <Link
                to="/kontak"
                className="block text-white/70 hover:text-primary transition-colors text-sm"
              >
                Kontak
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold mb-4">Kontak Kami</h3>
            <div className="space-y-3">
              <div className="flex items-start gap-2 text-sm text-white/70">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>Jl. Bisnis Raya No. 88, Jakarta Selatan, Indonesia</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <span>+62 812 3456 7890</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-white/70">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <span>support@RukoSpace.com</span>
              </div>
            </div>
          </div>

          {/* Social Media */}
          <div>
            <h3 className="font-semibold mb-4">Ikuti Kami</h3>
            <div className="flex gap-3">
              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="p-2 bg-white/10 rounded-lg hover:bg-primary transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="h-5 w-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 text-center text-sm text-white/70">
          <p>&copy; {new Date().getFullYear()} RukoSpace. Semua hak cipta dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
