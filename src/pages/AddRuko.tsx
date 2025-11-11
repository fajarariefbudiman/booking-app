import React, { useState } from "react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Building, ArrowLeft, MapPin, DollarSign, Image, Percent, Home, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../hooks/use-toast";
import axios from "axios";

const AddRuko = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    address: "",
    city: "",
    latitude: "",
    longitude: "",
    price: "",
    discount_percent: "0",
    rental_type: "monthly",
    image: "",
  });

  const API_BASE = "https://booking-api-production-8f43.up.railway.app/api";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      const userStr = localStorage.getItem("user");

      if (!token || !userStr) {
        toast({
          title: "Error",
          description: "Please login first.",
          variant: "destructive",
        });
        navigate("/login");
        return;
      }

      const user = JSON.parse(userStr);
      const ownerId = user?.id || user?._id;

      // Validate user role
      if (user.role !== "owner" && user.role !== "admin") {
        toast({
          title: "Access Denied",
          description: "Only owners can add rukos.",
          variant: "destructive",
        });
        navigate("/");
        return;
      }

      // Prepare data sesuai backend requirement
      const rukoData = {
        owner_id: ownerId,
        name: formData.name,
        description: formData.description,
        address: formData.address,
        city: formData.city,
        latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
        price: parseFloat(formData.price),
        discount_percent: parseFloat(formData.discount_percent),
        rental_type: formData.rental_type,
        image: formData.image,
      };

      console.log("Sending ruko data:", rukoData);

      const response = await axios.post(`${API_BASE}/ruko`, rukoData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data) {
        toast({
          title: "Success!",
          description: "Ruko has been added successfully.",
        });

        // Reset form
        setFormData({
          name: "",
          description: "",
          address: "",
          city: "",
          latitude: "",
          longitude: "",
          price: "",
          discount_percent: "0",
          rental_type: "monthly",
          image: "",
        });

        // Redirect to owner dashboard after 1 second
        setTimeout(() => {
          navigate("/dashboard-owner");
        }, 1000);
      }
    } catch (error: any) {
      console.error("Add ruko error:", error);

      let errorMessage = "Failed to add ruko. Please try again.";

      if (error.response?.status === 401) {
        errorMessage = "Session expired. Please login again.";
        setTimeout(() => navigate("/login"), 2000);
      } else if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      }

      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              onClick={() => navigate("/dashboard-owner")}
              className="hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Dashboard
            </Button>
            <div className="flex items-center gap-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <Building className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Add New Ruko</h1>
                <p className="text-gray-600 text-sm">Fill in the details to list your property</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* Basic Information */}
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Basic Information</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Ruko Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="e.g. Ruko Green Valley Premium"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Describe your ruko property..."
                    rows={4}
                  />
                  <p className="text-xs text-gray-500 mt-1">Provide details about the property, facilities, and features</p>
                </div>
              </div>
            </Card>

            {/* Location */}
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MapPin className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Location Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address *</label>
                  <input
                    type="text"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Jl. Example Street No. 123"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Jakarta"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Rental Type *</label>
                  <select
                    name="rental_type"
                    value={formData.rental_type}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  >
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Latitude (Optional)</label>
                  <input
                    type="number"
                    name="latitude"
                    step="any"
                    value={formData.latitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="-6.200000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Longitude (Optional)</label>
                  <input
                    type="number"
                    name="longitude"
                    step="any"
                    value={formData.longitude}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="106.816666"
                  />
                </div>
              </div>
            </Card>

            {/* Pricing */}
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <DollarSign className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Pricing & Discount</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rp) *</label>
                  <input
                    type="number"
                    name="price"
                    required
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="5000000"
                  />
                  <p className="text-xs text-gray-500 mt-1">Price per {formData.rental_type === "monthly" ? "month" : "year"}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Percent className="h-4 w-4" />
                    Discount Percent (%)
                  </label>
                  <input
                    type="number"
                    name="discount_percent"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.discount_percent}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0"
                  />
                  <p className="text-xs text-gray-500 mt-1">Optional discount for promotional purposes</p>
                </div>
              </div>

              {/* Price Preview */}
              {formData.price && parseFloat(formData.discount_percent) > 0 && (
                <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Price Preview:</p>
                  <div className="flex items-center gap-3">
                    <span className="text-lg line-through text-gray-400">Rp {parseFloat(formData.price).toLocaleString("id-ID")}</span>
                    <span className="text-2xl font-bold text-blue-600">Rp {(parseFloat(formData.price) * (1 - parseFloat(formData.discount_percent) / 100)).toLocaleString("id-ID")}</span>
                    <span className="text-sm bg-red-500 text-white px-2 py-1 rounded">{formData.discount_percent}% OFF</span>
                  </div>
                </div>
              )}
            </Card>

            {/* Image */}
            <Card className="p-6 bg-white">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-blue-100 p-2 rounded-lg">
                  <Image className="h-5 w-5 text-blue-600" />
                </div>
                <h2 className="text-xl font-semibold text-gray-800">Property Image</h2>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Image URL</label>
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="https://example.com/ruko-image.jpg"
                />
                <p className="text-xs text-gray-500 mt-1">Provide a URL to an image of your property</p>
              </div>

              {/* Image Preview */}
              {formData.image && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Preview:</p>
                  <div className="relative w-full h-64 bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={formData.image}
                      alt="Ruko preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "";
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  </div>
                </div>
              )}
            </Card>

            {/* Submit Buttons */}
            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate("/dashboard-owner")}
                className="flex-1 border-gray-300 hover:bg-gray-50"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Adding Ruko...
                  </>
                ) : (
                  <>
                    <Building className="h-5 w-5 mr-2" />
                    Add Ruko
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRuko;
