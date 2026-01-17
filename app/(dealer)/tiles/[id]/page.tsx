"use client";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
import TileNotFound from "./not-found";
import {
  ChevronLeft,
  Box,
  Layers,
  Maximize,
  Sparkles,
  FileDown,
  CheckCircle2,
  Info,
  PhoneCall,
} from "lucide-react";
import { api } from "@/lib/api";

const SingleTile = () => {
  const params = useParams();
  const id = params?.id;

  const [tile, setTile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeImg, setActiveImg] = useState(0);
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (id) {
      setLoading(true);
      api
        .get(`/admin/tiles/${id}`)
        .then((res) => {
          setTile(res.data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err.message);
          setLoading(false);
        });
    }
  }, [id]);

  const handleDownloadCatalog = async () => {
    if (!tile?.pdfUrl) {
      alert(
        "Technical specifications for this series are being generated. Please contact support."
      );
      return;
    }

    setDownloading(true);
    try {
      const link = document.createElement("a");
      link.href = tile.pdfUrl;
      link.target = "_blank";
      // This attribute encourages downloading over opening in-tab
      link.setAttribute("download", `${tile.name}-Catalog.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Download failed", err);
    } finally {
      // Small delay for UX so the loading state doesn't just flash
      setTimeout(() => setDownloading(false), 1000);
    }
  };

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );

  if (error || !tile) return <TileNotFound />;
  console.log(tile);
  return (
    <div className="max-w-7xl mx-auto p-4 md:p-12 bg-white min-h-screen">
      {/* Navigation */}
      <div className="mb-10">
        <Link
          href="/tiles"
          className="inline-flex items-center text-xs font-bold tracking-widest uppercase text-gray-400 hover:text-black transition-colors"
        >
          <ChevronLeft className="w-4 h-4 mr-1" /> Back to Collection
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-20">
        {/* Left: Premium Gallery */}
        <div className="lg:col-span-7 space-y-6">
          <div className="relative aspect-[5/4] bg-gray-50 rounded-3xl overflow-hidden group">
            {tile.images?.[activeImg] ? (
              <img
                src={tile.images[activeImg].imageUrl}
                alt={tile.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-300 italic">
                Image Coming Soon
              </div>
            )}
            <div className="absolute top-6 left-6">
              <span className="px-4 py-1.5 bg-black text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full">
                {tile.category}
              </span>
            </div>
          </div>

          <div className="flex gap-4 overflow-x-auto no-scrollbar">
            {tile.images?.map((img: any, idx: number) => (
              <button
                key={idx}
                onClick={() => setActiveImg(idx)}
                className={`relative flex-shrink-0 w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300 ${
                  activeImg === idx
                    ? "ring-2 ring-black ring-offset-2 scale-95"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <img
                  src={img.imageUrl}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Right: Product Details & CTA */}
        <div className="lg:col-span-5 flex flex-col justify-center">
          <div className="space-y-8">
            <div>
              <p className="text-sm font-medium text-gray-400 mb-2">
                {tile.material} Series
              </p>
              <h1 className="text-4xl md:text-5xl font-light text-gray-900 leading-tight mb-4 tracking-tight">
                {tile.name}
              </h1>
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="text-3xl font-medium text-gray-900">
                    ${tile.pricePerSqft}
                  </span>
                  <span className="text-gray-400 text-sm">/sq.ft</span>
                </div>
                {tile.stock > 0 && (
                  <span className="flex items-center text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 px-3 py-1 rounded-full">
                    <CheckCircle2 className="w-3 h-3 mr-1" /> Ready to Ship
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-500 leading-relaxed text-lg font-light">
              {tile.description}
            </p>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4 border-y border-gray-100 py-10">
              <DetailItem
                icon={<Layers className="w-5 h-5" />}
                label="Surface"
                value={tile.finish}
              />
              <DetailItem
                icon={<Maximize className="w-5 h-5" />}
                label="Size"
                value={tile.size}
              />
              <DetailItem
                icon={<Sparkles className="w-5 h-5" />}
                label="Material"
                value={tile.material}
              />
              <DetailItem
                icon={<Info className="w-5 h-5" />}
                label="Series"
                value={tile.sku.split("-")[0]}
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex-1 bg-black text-white px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-800 transition-all flex items-center justify-center gap-2">
                <PhoneCall className="w-4 h-4" /> Inquiry Now
              </button>
              <button
                onClick={handleDownloadCatalog}
                className="flex-1 bg-white text-black border border-gray-200 px-8 py-4 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-gray-50 transition-all flex items-center justify-center gap-2"
              >
                <FileDown className="w-4 h-4" /> Catalog PDF
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DetailItem = ({
  icon,
  label,
  value,
}: {
  icon: any;
  label: string;
  value: string;
}) => (
  <div className="flex items-center gap-4">
    <div className="text-gray-300">{icon}</div>
    <div>
      <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-gray-400 mb-0.5">
        {label}
      </p>
      <p className="text-sm font-medium text-gray-900">{value}</p>
    </div>
  </div>
);

export default SingleTile;
