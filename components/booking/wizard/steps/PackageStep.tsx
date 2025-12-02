"use client";

import React from "react";
import { Package, ChevronRight } from "lucide-react";
import { useWizard } from "../WizardContext";
import { Button } from "@/components/ui/button";
import { DrivingPackage } from "@/types/package";

export const PackageStep: React.FC = () => {
  const {
    availablePackages,
    userPackages,
    selectedPackage,
    setSelectedPackage,
    useExistingPackage,
    setUseExistingPackage,
    selectedUserPackageId,
    setSelectedUserPackageId,
    handlePackageContinue,
  } = useWizard();

  const handleSelectPackage = (pkg: DrivingPackage) => {
    setSelectedPackage(pkg);
    setUseExistingPackage(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
      {userPackages.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 text-lg">
            <Package size={20} className="text-(--primary)" />
            Use Existing Package
          </h3>
          <div className="space-y-2">
            {userPackages.map((pkg, index) => (
              <label
                key={pkg.id}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
                className="group flex items-center gap-4 p-4 bg-linear-to-br from-white to-gray-50 border-2 border-gray-200 rounded-xl hover:border-(--primary) cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 animate-in fade-in slide-in-from-left-2"
              >
                <input
                  type="radio"
                  name="package-choice"
                  checked={
                    useExistingPackage && selectedUserPackageId === pkg.id
                  }
                  onChange={() => {
                    setUseExistingPackage(true);
                    setSelectedUserPackageId(pkg.id);
                    setSelectedPackage(null);
                  }}
                  className="w-5 h-5 accent-(--primary) transition-transform duration-200 group-hover:scale-110"
                />
                <div className="flex-1">
                  <p className="font-semibold text-gray-900 text-base">
                    {pkg.packageName}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-(--primary) bg-opacity-20 text-(--primary-dark)">
                      {pkg.remainingHours} hours remaining
                    </span>
                  </div>
                </div>
                <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <ChevronRight size={20} className="text-(--primary)" />
                </div>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <h3 className="font-semibold text-gray-900 text-lg">Buy New Package</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {availablePackages.map((pkg) => (
            <label
              key={pkg.id}
              className={`group relative flex flex-col p-5 bg-linear-to-br from-white via-gray-50 to-white border-2 border-gray-200 rounded-xl cursor-pointer transition-all duration-200 hover:border-(--primary) hover:shadow-md
                ${
                  !useExistingPackage && selectedPackage?.id === pkg.id
                    ? "border-(--primary) ring-2 ring-(--primary) ring-opacity-20 shadow-md"
                    : "border-gray-200"
                }
              `}
            >
              <div className="relative flex items-start gap-3">
                <input
                  type="radio"
                  name="package-choice"
                  checked={
                    !useExistingPackage && selectedPackage?.id === pkg.id
                  }
                  onChange={() => handleSelectPackage(pkg)}
                  className="mt-1 w-5 h-5 accent-(--primary)"
                />
                <div className="flex-1">
                  <p className="font-bold text-gray-900 text-lg mb-1">
                    {pkg.name}
                  </p>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-3xl font-bold text-(--primary)">
                      ${pkg.price}
                    </span>
                    <span className="text-sm text-gray-500">
                      • {pkg.hours} hours
                    </span>
                  </div>
                  {pkg.description && (
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {pkg.description}
                    </p>
                  )}
                </div>
              </div>
            </label>
          ))}
        </div>
      </div>

      <Button
        onClick={handlePackageContinue}
        disabled={
          (!useExistingPackage && !selectedPackage) ||
          (useExistingPackage && !selectedUserPackageId)
        }
        className="w-full py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-[1.02]"
        size="lg"
      >
        Continue to {useExistingPackage ? "Calendar" : "Payment"}
        <ChevronRight size={20} className="ml-2" />
      </Button>
    </div>
  );
};
