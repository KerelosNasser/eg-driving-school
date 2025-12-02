"use client";

import { useEffect, useState } from "react";

import { ArrowRight, Loader2 } from "lucide-react";
import { packageService } from "@/lib/services/package-service";
import { DrivingPackage } from "@/types/package";
import QuickBookWizard from "@/components/booking/QuickBookWizard";

export default function PriceListSection() {
  const [packages, setPackages] = useState<DrivingPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isWizardOpen, setIsWizardOpen] = useState(false);

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const data = await packageService.getActivePackages();
        setPackages(data);
      } catch (error) {
        console.error("Failed to fetch packages:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  if (loading) {
    return (
      <section className="py-16 md:py-24 bg-white flex justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-black" />
      </section>
    );
  }

  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container max-w-5xl mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-6 text-black">
          Menu / Price List
        </h2>
        <h3 className="text-2xl font-bold text-center text-black mb-8">
          Driving Lessons & Packages
        </h3>
        <p className="text-center text-gray-500 mb-16 font-light">
          Choose the package that suits your needs
        </p>

        {/* Grid View: 2 columns, minimal design with separators */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-10 md:gap-x-12 md:gap-y-16">
          {packages.map((pkg) => (
            <div
              key={pkg.id}
              className="flex flex-col border-b border-gray-200 pb-8 md:pb-10"
            >
              <div className="mb-4 grow">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2 mb-3">
                  <h4 className="text-black text-lg md:text-xl font-medium leading-tight">
                    {pkg.name}
                  </h4>
                  <div className="text-xl md:text-2xl font-bold text-black">
                    ${pkg.price}
                  </div>
                </div>

                {/* Description */}
                {pkg.description && (
                  <p className="text-gray-500 text-xs md:text-sm leading-relaxed mb-4 font-light whitespace-pre-line">
                    {pkg.description}
                  </p>
                )}

                {/* Warning Note */}
                {pkg.warning && (
                  <div className="mt-2 p-3 bg-red-50 border border-red-100 rounded-lg">
                    <p className="text-red-600 text-[10px] md:text-xs font-bold uppercase leading-tight tracking-wide">
                      {pkg.warning}
                    </p>
                  </div>
                )}
              </div>

              <div className="mt-auto">
                <button
                  onClick={() => setIsWizardOpen(true)}
                  className="w-full md:w-auto inline-flex items-center justify-center bg-black text-white px-6 py-3 rounded-xl text-sm font-bold hover:bg-gray-800 transition-colors gap-2 group"
                >
                  Book Now
                  <ArrowRight
                    size={16}
                    className="group-hover:translate-x-1 transition-transform"
                  />
                </button>
              </div>
            </div>
          ))}

          {packages.length === 0 && (
            <div className="col-span-full text-center text-gray-400 py-12">
              No packages available at the moment.
            </div>
          )}
        </div>

        <p className="text-center text-gray-400 mt-12 text-xs font-light">
          Prices are subject to change without notice.
        </p>
      </div>

      <QuickBookWizard
        isOpen={isWizardOpen}
        onClose={() => setIsWizardOpen(false)}
      />
    </section>
  );
}
