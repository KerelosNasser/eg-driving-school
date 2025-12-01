"use client";

import { useState, useEffect } from "react";
import { Plus, Trash2, AlertCircle, Copy } from "lucide-react";
import {
  Tier,
  InvitationCode,
  CreateTierInput,
  CreateInvitationCodeInput,
} from "@/types/tier";
import { tierService } from "@/lib/services/tier-service";
import { useAuth } from "@/components/providers/AuthProvider";

export function TierListTab() {
  const { profile } = useAuth();
  const [tiers, setTiers] = useState<Tier[]>([]);
  const [codes, setCodes] = useState<InvitationCode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Tier Form State
  const [showTierForm, setShowTierForm] = useState(false);
  const [newTier, setNewTier] = useState<CreateTierInput>({
    name: "",
    rank: 1,
    discountPercentage: 0,
    active: true,
  });

  // Code Form State
  const [showCodeForm, setShowCodeForm] = useState(false);
  const [newCode, setNewCode] = useState<CreateInvitationCodeInput>({
    code: "",
    tierId: "",
    active: true,
  });

  const isAdmin = profile?.role === "admin";

  const fetchData = async () => {
    try {
      setLoading(true);
      const [tiersData, codesData] = await Promise.all([
        tierService.getAllTiers(),
        tierService.getAllCodes(),
      ]);
      setTiers(tiersData);
      setCodes(codesData);
    } catch (err) {
      setError("Failed to load data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) {
      fetchData();
    }
  }, [isAdmin]);

  const handleCreateTier = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tierService.createTier(newTier);
      setShowTierForm(false);
      setNewTier({ name: "", rank: 1, discountPercentage: 0, active: true });
      fetchData();
    } catch (err) {
      setError("Failed to create tier");
    }
  };

  const handleCreateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await tierService.createCode(newCode);
      setShowCodeForm(false);
      setNewCode({ code: "", tierId: "", active: true });
      fetchData();
    } catch (err) {
      setError("Failed to create code");
    }
  };

  const handleDeleteTier = async (id: string) => {
    if (!confirm("Are you sure? This might break linked codes.")) return;
    try {
      await tierService.deleteTier(id);
      fetchData();
    } catch (err) {
      setError("Failed to delete tier");
    }
  };

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Code copied!");
  };

  if (!isAdmin) return <div>Access Denied</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-center gap-2">
          <AlertCircle size={20} />
          {error}
        </div>
      )}

      {/* Tiers Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Tiers</h2>
          <button
            onClick={() => setShowTierForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus size={20} /> Add Tier
          </button>
        </div>

        {showTierForm && (
          <form
            onSubmit={handleCreateTier}
            className="bg-gray-50 p-6 rounded-xl space-y-4 border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Tier Name (e.g. Gold)"
                value={newTier.name}
                onChange={(e) =>
                  setNewTier({ ...newTier, name: e.target.value })
                }
                className="bg-white border border-gray-300 rounded-lg p-3 text-gray-900"
                required
              />
              <input
                type="number"
                placeholder="Discount %"
                value={newTier.discountPercentage}
                onChange={(e) =>
                  setNewTier({
                    ...newTier,
                    discountPercentage: Number(e.target.value),
                  })
                }
                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                required
              />
              <input
                type="number"
                placeholder="Rank (Higher = Better)"
                value={newTier.rank}
                onChange={(e) =>
                  setNewTier({ ...newTier, rank: Number(e.target.value) })
                }
                className="bg-black/50 border border-white/10 rounded-lg p-3 text-white"
                required
              />
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowTierForm(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-(--primary) text-black font-bold rounded-lg"
              >
                Create Tier
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {tiers.map((tier) => (
            <div
              key={tier.id}
              className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-bold text-gray-900">{tier.name}</h3>
                <p className="text-gray-600 text-sm">
                  {tier.discountPercentage}% Discount • Rank {tier.rank}
                </p>
              </div>
              <button
                onClick={() => handleDeleteTier(tier.id)}
                className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Invitation Codes Section */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Invitation Codes</h2>
          <button
            onClick={() => setShowCodeForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors"
          >
            <Plus size={20} /> Generate Code
          </button>
        </div>

        {showCodeForm && (
          <form
            onSubmit={handleCreateCode}
            className="bg-gray-50 p-6 rounded-xl space-y-4 border border-gray-200"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Code (e.g. SUMMER2024)"
                value={newCode.code}
                onChange={(e) =>
                  setNewCode({ ...newCode, code: e.target.value.toUpperCase() })
                }
                className="bg-white border border-gray-300 rounded-lg p-3 text-gray-900"
                required
              />
              <select
                value={newCode.tierId}
                onChange={(e) =>
                  setNewCode({ ...newCode, tierId: e.target.value })
                }
                className="bg-white border border-gray-300 rounded-lg p-3 text-gray-900"
                required
              >
                <option value="">Select Tier</option>
                {tiers.map((tier) => (
                  <option key={tier.id} value={tier.id}>
                    {tier.name} ({tier.discountPercentage}%)
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setShowCodeForm(false)}
                className="px-4 py-2 text-gray-500 hover:text-gray-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-(--primary) text-black font-bold rounded-lg"
              >
                Create Code
              </button>
            </div>
          </form>
        )}

        <div className="grid gap-4">
          {codes.map((code) => {
            const tier = tiers.find((t) => t.id === code.tierId);
            return (
              <div
                key={code.id}
                className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex justify-between items-center"
              >
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-bold text-gray-900 font-mono">
                      {code.code}
                    </h3>
                    <button
                      onClick={() => copyCode(code.code)}
                      className="text-gray-400 hover:text-gray-900"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                  <p className="text-gray-600 text-sm">
                    {tier?.name || "Unknown Tier"} • Used {code.usageCount}{" "}
                    times
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs border ${
                      code.active
                        ? "bg-green-500/20 text-green-400 border-green-500/30"
                        : "bg-red-500/20 text-red-400 border-red-500/30"
                    }`}
                  >
                    {code.active ? "Active" : "Inactive"}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
