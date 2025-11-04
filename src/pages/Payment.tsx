import { useSearchParams, useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Button } from "../components/ui/button";
import { Card } from "../components/ui/card";
import { Banknote, Wallet, X, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";

const Payment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const rukoId = searchParams.get("ruko") || "1";
  const bookingData = JSON.parse(sessionStorage.getItem("bookingData") || "{}");
  const total = bookingData.total || 0;
  const duration = bookingData.duration || 1;
  const durationType = bookingData.durationType || "bulan";
  const ruko = bookingData.ruko || { name: "Ruko Default", image: "" };

  const [selectedMethod, setSelectedMethod] = useState<string>("");
  const [showModal, setShowModal] = useState(false);
  const [accountNumber, setAccountNumber] = useState("");
  const [userBalance, setUserBalance] = useState<number | null>(null);
  const [statusModal, setStatusModal] = useState<"success" | "failed" | null>(null);

  const paymentOptions = [
    { id: "bca", name: "Transfer Bank BCA", type: "bank", icon: <Banknote className="h-5 w-5 text-sky-blue" /> },
    { id: "bni", name: "Transfer Bank BNI", type: "bank", icon: <Banknote className="h-5 w-5 text-sky-blue" /> },
    { id: "mandiri", name: "Transfer Bank Mandiri", type: "bank", icon: <Banknote className="h-5 w-5 text-sky-blue" /> },
    { id: "bri", name: "Transfer Bank BRI", type: "bank", icon: <Banknote className="h-5 w-5 text-sky-blue" /> },
    { id: "dana", name: "E-Wallet DANA", type: "ewallet", icon: <Wallet className="h-5 w-5 text-sky-blue" /> },
    { id: "ovo", name: "E-Wallet OVO", type: "ewallet", icon: <Wallet className="h-5 w-5 text-sky-blue" /> },
    { id: "gopay", name: "E-Wallet GoPay", type: "ewallet", icon: <Wallet className="h-5 w-5 text-sky-blue" /> },
    { id: "shopeepay", name: "E-Wallet ShopeePay", type: "ewallet", icon: <Wallet className="h-5 w-5 text-sky-blue" /> },
  ];

  const adminFee = Math.floor(total * 0.015);
  const totalWithFee = total + adminFee;

  const handleSelectMethod = (method: string) => {
    setSelectedMethod(method);
    setShowModal(true);
  };

  const handleConfirmPayment = () => {
    if (!accountNumber) {
      alert("Harap isi nomor rekening atau nomor HP!");
      return;
    }

    const simulatedBalance = Math.floor(Math.random() * 15000000);
    setUserBalance(simulatedBalance);

    setTimeout(() => {
      if (simulatedBalance < totalWithFee) {
        setStatusModal("failed");
        return;
      }

      sessionStorage.setItem(
        "paymentInfo",
        JSON.stringify({
          method: selectedMethod,
          accountNumber,
          total: totalWithFee,
        })
      );

      setStatusModal("success");

      // Toast dan redirect ke home setelah sukses
      setTimeout(() => {
        toast.success("Pembayaran berhasil! Silakan cek email untuk bukti pembayaran 📧", {
          duration: 5000,
        });
        navigate("/");
      }, 2500);
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <section className="flex-1 py-16 px-4 bg-gradient-hero">
        <div className="container mx-auto max-w-3xl">
          <Card className="p-8 md:p-10 shadow-hover">
            <h1 className="text-3xl md:text-4xl font-bold text-navy-blue mb-2">Pembayaran Sewa Ruko</h1>
            <p className="text-muted-foreground mb-8">Pilih metode pembayaran untuk menyelesaikan transaksi.</p>

            {/* Detail Booking */}
            <Card className="p-6 bg-gray-50 mb-8">
              <div className="flex gap-4 mb-4">
                {ruko.image && (
                  <img
                    src={ruko.image}
                    alt={ruko.name}
                    className="w-28 h-28 object-cover rounded-lg"
                  />
                )}
                <div>
                  <h3 className="font-semibold text-lg">{ruko.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Durasi: {duration} {durationType}
                  </p>
                </div>
              </div>

              <div className="flex justify-between border-t pt-3">
                <span className="font-semibold text-navy-blue">Total Bayar</span>
                <span className="font-bold text-xl text-sky-600">Rp{total.toLocaleString("id-ID")}</span>
              </div>
            </Card>

            {/* Metode Pembayaran */}
            <h2 className="text-xl font-semibold text-navy-blue mb-4">Pilih Metode Pembayaran</h2>
            <div className="space-y-3 mb-8">
              {paymentOptions.map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => handleSelectMethod(opt.id)}
                  className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-sky-400 hover:scale-[1.02] transition-transform duration-200"
                >
                  {opt.icon}
                  <div>
                    <p className="font-semibold text-navy-blue">{opt.name}</p>
                    <p className="text-sm text-muted-foreground capitalize">{opt.type === "ewallet" ? "Gunakan nomor HP terdaftar" : "Transfer melalui rekening bank"}</p>
                  </div>
                </div>
              ))}
            </div>

            <Button
              variant="outline"
              onClick={() => navigate(-1)}
              className="w-full mt-2 border-sky-300 text-sky-600"
            >
              Kembali
            </Button>
          </Card>
        </div>
      </section>

      {/* Modal Input */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-lg w-[90%] max-w-md p-6 relative animate-scaleIn">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setShowModal(false)}
            >
              <X className="h-5 w-5" />
            </button>

            <h2 className="text-xl font-semibold text-navy-blue mb-3">{selectedMethod.startsWith("b") ? "Transfer Bank" : "E-Wallet"}</h2>

            <p className="text-sm text-muted-foreground mb-4">Masukkan {selectedMethod.startsWith("b") ? "nomor rekening kamu" : "nomor HP terdaftar"} untuk melanjutkan pembayaran.</p>

            <input
              type="text"
              placeholder={selectedMethod.startsWith("b") ? "Masukkan nomor rekening" : "Masukkan nomor HP (08xx...)"}
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              className="w-full border rounded-md px-3 py-2 mb-4 focus:ring-2 focus:ring-sky-400 outline-none"
            />

            <div className="border-t pt-3 text-sm space-y-1 mb-3">
              <div className="flex justify-between">
                <span>Total Sewa</span>
                <span>Rp{total.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between">
                <span>Biaya Admin (1.5%)</span>
                <span>Rp{adminFee.toLocaleString("id-ID")}</span>
              </div>
              <div className="flex justify-between font-semibold text-navy-blue border-t pt-2">
                <span>Total Bayar</span>
                <span>Rp{totalWithFee.toLocaleString("id-ID")}</span>
              </div>
            </div>

            {userBalance !== null && <div className="text-sm text-gray-700 mb-2">Saldo kamu: Rp{userBalance.toLocaleString("id-ID")}</div>}

            <Button
              onClick={handleConfirmPayment}
              className="w-full bg-sky-600 hover:bg-sky-700 text-white transition-all duration-200"
            >
              Konfirmasi Pembayaran
            </Button>
          </div>
        </div>
      )}

      {/* Modal Status */}
      {statusModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 animate-fadeIn">
          <div className="bg-white rounded-xl shadow-xl w-[90%] max-w-sm p-8 text-center animate-popIn">
            {statusModal === "success" ? (
              <>
                <CheckCircle2 className="w-20 h-20 text-green-500 mx-auto mb-4 animate-bounceIn" />
                <h3 className="text-xl font-semibold text-green-600 animate-fadeSlideDown">Pembayaran Berhasil!</h3>
                <p className="text-sm text-gray-600 mt-2 animate-fadeSlideUp">Terima kasih, pembayaran kamu sudah dikonfirmasi.</p>
              </>
            ) : (
              <>
                <XCircle className="w-20 h-20 text-red-500 mx-auto mb-4 animate-bounceIn" />
                <h3 className="text-xl font-semibold text-red-600 animate-fadeSlideDown">Pembayaran Gagal!</h3>
                <p className="text-sm text-gray-600 mt-2 animate-fadeSlideUp">Saldo kamu tidak mencukupi. Silakan coba lagi.</p>
                <Button
                  onClick={() => setStatusModal(null)}
                  className="mt-4 bg-red-500 hover:bg-red-600 text-white transition-all duration-200"
                >
                  Coba Lagi
                </Button>
              </>
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
};

export default Payment;
