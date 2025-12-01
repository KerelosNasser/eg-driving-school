"use client";

import { useState } from "react";
import { Send, Loader2, CheckCircle, AlertCircle } from "lucide-react";
import { sendAnnouncementAction } from "@/app/actions/admin-actions";

export default function AnnouncementsTab() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const result = await sendAnnouncementAction(formData);
      if (result.success) {
        setSuccess(`Announcement sent successfully to ${result.count} users.`);
        // Reset form
        const form = document.getElementById(
          "announcement-form"
        ) as HTMLFormElement;
        form.reset();
      } else {
        setError(result.error || "Failed to send announcement.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Announcements</h2>
      </div>

      <div className="bg-gray-100 border border-gray-200 rounded-xl p-6">
        <p className="text-gray-600 mb-6">
          Send an email announcement to all registered users. Please use this
          feature responsibly.
        </p>

        <form
          id="announcement-form"
          action={handleSubmit}
          className="space-y-6"
        >
          <div className="space-y-2">
            <label
              htmlFor="subject"
              className="block text-sm font-medium text-gray-700"
            >
              Email Subject
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              placeholder="e.g., Important Update: New Packages Available"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-(--primary) transition-colors"
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-sm font-medium text-gray-700"
            >
              Message Body (HTML supported)
            </label>
            <textarea
              id="message"
              name="message"
              required
              rows={8}
              placeholder="<p>Dear Students,</p><p>We are excited to announce...</p>"
              className="w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-(--primary) transition-colors font-mono text-sm"
            />
            <p className="text-xs text-gray-500">
              You can use basic HTML tags for formatting.
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 flex items-center gap-3 text-red-400">
              <AlertCircle size={20} />
              <p>{error}</p>
            </div>
          )}

          {success && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4 flex items-center gap-3 text-green-400">
              <CheckCircle size={20} />
              <p>{success}</p>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-(--primary) text-black font-bold rounded-lg hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send size={20} />
                  Send Announcement
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
