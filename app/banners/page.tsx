"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Layout } from "@/components/layout/layout";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2, Edit, Loader2 } from "lucide-react";
import { Pagination } from "@/components/products/pagination";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import axios from "axios";

interface Banner {
  id: string;
  banner: string;
}

export default function BannerPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSaving, setIsSaving] = useState(false); // ✅ loading holati
  const fileInputRef = useRef<HTMLInputElement>(null);
  const ITEMS_PER_PAGE = 10;

  const baseURL = "https://horeca.felixits.uz/api/v1/admin";
  const token =
    typeof window !== "undefined" ? localStorage.getItem("agroAdminToken") : null;

  const api = axios.create({ baseURL });

  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  }

  // ✅ Bannerlarni olish
  const fetchBanners = async () => {
    try {
      const { data } = await api.get("/banner/list/");
      if (Array.isArray(data.results)) {
        setBanners(data.results);
      } else {
        setBanners([]);
      }
    } catch (error) {
      console.error("Error fetching banners:", error);
      toast.error("Failed to load banners");
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const paginatedBanners = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return banners.slice(start, start + ITEMS_PER_PAGE);
  }, [banners, currentPage]);

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    setSelectedFile(file);
  };

  const handleFormSubmit = async () => {
    if (!selectedFile && !editingBanner) {
      toast.error("Please select an image");
      return;
    }

    if (!token) {
      toast.error("Authentication required");
      return;
    }

    const formData = new FormData();
    if (selectedFile) {
      formData.append("banner", selectedFile);
    }

    try {
      setIsSaving(true); // ✅ loading start

      if (editingBanner) {
        // ✅ PATCH ishlatyapmiz
        await api.patch(`/banner/${editingBanner.id}/update/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Banner updated successfully");
      } else {
        await api.post("/banner/create/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Banner added successfully");
      }

      await fetchBanners();
      handleFormClose();
    } catch (error: any) {
      console.error("Error saving banner:", error.response?.data || error.message);

      if (error.response?.data?.banner) {
        toast.error(error.response.data.banner[0]);
      } else {
        toast.error("Failed to save banner");
      }
    } finally {
      setIsSaving(false); // ✅ loading stop
    }
  };

  const handleDeleteBanner = async (id: string) => {
    if (!token) {
      toast.error("Authentication required");
      return;
    }

    try {
      await api.delete(`/banner/${id}/delete/`);
      setBanners(banners.filter((b) => b.id !== id));
      toast.success("Banner deleted");
    } catch (error) {
      console.error("Error deleting banner:", error);
      toast.error("Failed to delete banner");
    }
  };

  const handleEditBanner = (banner: Banner) => {
    setEditingBanner(banner);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setEditingBanner(null);
    setSelectedFile(null);
    setIsFormOpen(false);
    setIsSaving(false);
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">Banners</h1>
              <p className="text-muted-foreground">Manage your page banners</p>
            </div>
            <Button
              onClick={() => setIsFormOpen(true)}
              className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" /> Add Banner
            </Button>
          </div>

          {/* Table */}
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>№</TableHead>
                  <TableHead>Banner</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBanners.map((banner, index) => (
                  <TableRow key={banner.id}>
                    <TableCell className="font-medium">
                      {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                    </TableCell>
                    <TableCell>
                      <img
                        src={`https://horeca.felixits.uz${banner.banner}`}
                        alt={`Banner`}
                        className="h-24 object-contain"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditBanner(banner)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteBanner(banner.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {Math.ceil(banners.length / ITEMS_PER_PAGE) > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={Math.ceil(banners.length / ITEMS_PER_PAGE)}
              onPageChange={setCurrentPage}
            />
          )}

          {/* Modal Form */}
          <AnimatePresence>
            {isFormOpen && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 flex items-center justify-center bg-black/20 z-50"
              >
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="bg-white p-6 rounded-lg w-96"
                >
                  <h2 className="text-xl font-bold mb-4">
                    {editingBanner ? "Edit Banner" : "Add Banner"}
                  </h2>

                  {/* File Upload Box */}
                  <div
                    onClick={() => fileInputRef.current?.click()}
                    className="border-2 border-dashed border-green-600 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-green-50 transition-colors mb-4"
                  >
                    {!selectedFile && editingBanner ? (
                      <img
                        src={`https://horeca.felixits.uz${editingBanner.banner}`}
                        alt="Current Banner"
                        className="h-32 object-contain w-full"
                      />
                    ) : !selectedFile ? (
                      <>
                        <Plus className="h-8 w-8 text-green-600 mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload image
                        </p>
                      </>
                    ) : (
                      <img
                        src={URL.createObjectURL(selectedFile)}
                        alt="Preview"
                        className="h-32 object-contain w-full"
                      />
                    )}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && handleFileChange(e.target.files[0])
                      }
                      className="hidden"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={handleFormClose}
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-green-600 hover:bg-green-700 flex items-center gap-2"
                      onClick={handleFormSubmit}
                      disabled={isSaving}
                    >
                      {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </Layout>
    </ProtectedRoute>
  );
}
