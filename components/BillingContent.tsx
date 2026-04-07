"use client";

import { useState } from "react";

interface Props {
  currentPlan: string | null;
  planStatus: "active" | "cancelled" | null;
  planExpiry: string | null;
  onCancelPlan: () => void;
  onAdjustPlan: () => void;
}

const PLAN_META: Record<string, { label: string; price: number; credits: string }> = {
  Starter:    { label: "Starter",    price: 25,  credits: "30" },
  Pro:        { label: "Pro",        price: 50,  credits: "70" },
  Studio:     { label: "Studio",     price: 100, credits: "150" },
  Enterprise: { label: "Enterprise", price: 0,   credits: "∞" },
};

const PURCHASE_DATE = "Apr 7, 2026";

export default function BillingContent({ currentPlan, planStatus, planExpiry, onCancelPlan, onAdjustPlan }: Props) {
  const [cancelConfirm, setCancelConfirm] = useState(false);
  const [invoiceRequested, setInvoiceRequested] = useState(false);

  const meta = currentPlan ? PLAN_META[currentPlan] : null;
  const isCancelled = planStatus === "cancelled";

  function handleCancel() {
    if (!cancelConfirm) { setCancelConfirm(true); return; }
    onCancelPlan();
    setCancelConfirm(false);
  }

  function handleRequestInvoice() {
    setInvoiceRequested(true);
    setTimeout(() => setInvoiceRequested(false), 3000);
  }

  return (
    <main className="flex-1 min-h-full bg-[#f5f6fa]">
      <div className="max-w-2xl mx-auto px-6 py-10">

        {/* Page title */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-gray-900 tracking-tight">Billing</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your plan, payment method, and invoices.</p>
        </div>

        {/* ── Current Plan ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="px-6 py-5 flex items-center gap-4">
            {/* Icon */}
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border ${isCancelled ? "bg-gray-50 border-gray-200" : "bg-amber-50 border-amber-100"}`}>
              <svg width="22" height="22" fill="none" viewBox="0 0 24 24" stroke={isCancelled ? "#9ca3af" : "#d97706"} strokeWidth={1.8}>
                <path strokeLinecap="round" strokeLinejoin="round"
                  d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              {meta ? (
                <>
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-[15px] font-bold text-gray-900">{meta.label} plan</p>
                    {isCancelled ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-red-100 text-red-600 border border-red-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        Cancelled
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-green-100 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    )}
                  </div>
                  <p className="text-[13px] text-gray-500 mt-0.5">Monthly · {meta.credits} credits/mo</p>
                  {isCancelled && planExpiry ? (
                    <p className="text-[12px] text-orange-500 font-medium mt-0.5">
                      Access expires on {planExpiry} — no further charges.
                    </p>
                  ) : planExpiry ? (
                    <p className="text-[12px] text-gray-400 mt-0.5">
                      Next renewal on {planExpiry}.
                    </p>
                  ) : null}
                </>
              ) : (
                <>
                  <p className="text-[15px] font-bold text-gray-900">No active plan</p>
                  <p className="text-[13px] text-gray-500 mt-0.5">Choose a plan to get started.</p>
                </>
              )}
            </div>

            {/* Action — hide Adjust if cancelled */}
            {!isCancelled && (
              <button
                onClick={onAdjustPlan}
                className="flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 transition"
              >
                {meta ? "Adjust plan" : "Choose plan"}
              </button>
            )}
          </div>
        </section>

        {/* ── Payment ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Payment</p>
          </div>
          <div className="px-6 py-4 flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-[#00D632] flex items-center justify-center flex-shrink-0">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-[14px] font-medium text-gray-800 flex-1">Link by Stripe</span>
            <button className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 transition">
              Update
            </button>
          </div>
        </section>

        {/* ── Invoices ── */}
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden mb-4">
          <div className="px-6 py-4 border-b border-gray-100">
            <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Invoices</p>
          </div>

          {meta ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  {["Date", "Plan", "Total", "Status", "Actions"].map((col) => (
                    <th key={col} className="px-6 py-3 text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr className="hover:bg-gray-50/60 transition-colors">
                  <td className="px-6 py-3.5 text-[13px] text-gray-700">{PURCHASE_DATE}</td>
                  <td className="px-6 py-3.5 text-[13px] text-gray-700 font-medium">{meta.label}</td>
                  <td className="px-6 py-3.5 text-[13px] text-gray-700">
                    {meta.price > 0 ? `US$${meta.price}.00` : "Custom"}
                  </td>
                  <td className="px-6 py-3.5">
                    <span className="inline-flex items-center gap-1.5 text-[12px] font-semibold text-green-700 bg-green-50 border border-green-200 px-2.5 py-0.5 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      Paid
                    </span>
                  </td>
                  <td className="px-6 py-3.5">
                    <button
                      onClick={handleRequestInvoice}
                      className={`text-[12px] font-semibold transition px-3 py-1 rounded-lg border ${
                        invoiceRequested
                          ? "bg-green-50 text-green-600 border-green-200 cursor-default"
                          : "bg-white text-amber-600 border-amber-200 hover:bg-amber-50"
                      }`}
                    >
                      {invoiceRequested ? "✓ Sent" : "Request invoice"}
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          ) : (
            <div className="px-6 py-8 text-center">
              <svg width="32" height="32" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth={1.5} className="mx-auto mb-3">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <p className="text-[13px] text-gray-400">No invoices yet. Subscribe to a plan to see your billing history.</p>
            </div>
          )}
        </section>

        {/* ── Cancellation ── */}
        {meta && !isCancelled && (
          <section className="bg-white rounded-2xl border border-red-100 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100">
              <p className="text-[13px] font-bold text-gray-500 uppercase tracking-wider">Cancellation</p>
            </div>
            <div className="px-6 py-5">
              <div className="flex items-start gap-4">
                <div className="flex-1">
                  <p className="text-[14px] font-semibold text-gray-800">Cancel plan</p>
                  <p className="text-[12px] text-gray-400 mt-0.5">
                    You can cancel anytime. Your access continues until the end of the billing period.
                  </p>
                  {cancelConfirm && planExpiry && (
                    <div className="mt-3 flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl px-3 py-2.5">
                      <svg width="14" height="14" fill="none" viewBox="0 0 24 24" stroke="#ef4444" strokeWidth={2} className="flex-shrink-0 mt-0.5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <p className="text-[12px] text-red-600 leading-snug">
                        Your <span className="font-bold">{meta.label} plan</span> will remain active until{" "}
                        <span className="font-bold">{planExpiry}</span>. After that, access will be removed and you won't be charged again.
                      </p>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  {cancelConfirm && (
                    <button
                      onClick={() => setCancelConfirm(false)}
                      className="px-4 py-2 rounded-xl text-sm font-semibold border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 transition"
                    >
                      Keep plan
                    </button>
                  )}
                  <button
                    onClick={handleCancel}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                      cancelConfirm
                        ? "bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-200"
                        : "bg-red-500 hover:bg-red-600 text-white shadow-sm shadow-red-200"
                    }`}
                  >
                    {cancelConfirm ? "Confirm cancel" : "Cancel plan"}
                  </button>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* ── Already cancelled notice ── */}
        {meta && isCancelled && planExpiry && (
          <section className="bg-orange-50 rounded-2xl border border-orange-200 shadow-sm overflow-hidden">
            <div className="px-6 py-5 flex items-start gap-3">
              <svg width="18" height="18" fill="none" viewBox="0 0 24 24" stroke="#f97316" strokeWidth={2} className="flex-shrink-0 mt-0.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div className="flex-1">
                <p className="text-[14px] font-bold text-orange-800">Subscription cancelled</p>
                <p className="text-[12px] text-orange-600 mt-0.5 leading-snug">
                  Your <span className="font-semibold">{meta.label} plan</span> is still active until{" "}
                  <span className="font-semibold">{planExpiry}</span>. After this date your access will end and no further charges will apply.
                </p>
              </div>
              <button
                onClick={onAdjustPlan}
                className="flex-shrink-0 px-3 py-1.5 rounded-lg text-[12px] font-bold bg-orange-500 hover:bg-orange-600 text-white transition"
              >
                Resubscribe
              </button>
            </div>
          </section>
        )}

      </div>
    </main>
  );
}
