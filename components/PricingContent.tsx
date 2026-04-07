"use client";

import { useState } from "react";

interface Props {
  currentPlan: string | null;
  onSelectPlan: (plan: string) => void;
}

const FEATURES = [
  "Full credit rollover",
  "Game Fusion",
  "Theme Fusion",
  "Random Generator",
  "Weekly curated ideas",
  "Monthly market reports",
  "Multi-seat access",
  "Priority support",
];

const PLANS = [
  {
    id: "Starter",
    label: "Starter",
    tagline: "For solo creators just starting out",
    monthlyPrice: 25,
    yearlyPrice: 20,
    yearlyTotal: 240,
    credits: "30",
    dark: false,
    featured: false,
    features: {
      "Full credit rollover": true,
      "Game Fusion": true,
      "Theme Fusion": true,
      "Random Generator": true,
      "Weekly curated ideas": false,
      "Monthly market reports": false,
      "Multi-seat access": false,
      "Priority support": false,
    },
  },
  {
    id: "Pro",
    label: "Pro",
    tagline: "For growing studios shipping ideas fast",
    monthlyPrice: 50,
    yearlyPrice: 40,
    yearlyTotal: 480,
    credits: "70",
    dark: false,
    featured: true,
    features: {
      "Full credit rollover": true,
      "Game Fusion": true,
      "Theme Fusion": true,
      "Random Generator": true,
      "Weekly curated ideas": false,
      "Monthly market reports": false,
      "Multi-seat access": false,
      "Priority support": false,
    },
  },
  {
    id: "Studio",
    label: "Studio",
    tagline: "For professional teams with market insight",
    monthlyPrice: 100,
    yearlyPrice: 80,
    yearlyTotal: 960,
    credits: "150",
    dark: false,
    featured: false,
    features: {
      "Full credit rollover": true,
      "Game Fusion": true,
      "Theme Fusion": true,
      "Random Generator": true,
      "Weekly curated ideas": false,
      "Monthly market reports": true,
      "Multi-seat access": false,
      "Priority support": true,
    },
  },
  {
    id: "Enterprise",
    label: "Enterprise",
    tagline: "For large orgs with custom needs",
    monthlyPrice: null,
    yearlyPrice: null,
    yearlyTotal: null,
    credits: "∞",
    dark: true,
    featured: false,
    features: {
      "Full credit rollover": true,
      "Game Fusion": true,
      "Theme Fusion": true,
      "Random Generator": true,
      "Weekly curated ideas": true,
      "Monthly market reports": true,
      "Multi-seat access": true,
      "Priority support": true,
    },
  },
];

const TRUST = [
  {
    icon: (
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    ),
    label: "7-day free trial",
  },
  {
    icon: (
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
    label: "No credit card required",
  },
  {
    icon: (
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
      </svg>
    ),
    label: "Cancel anytime",
  },
  {
    icon: (
      <svg width="13" height="13" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    label: "SOC 2 compliant",
  },
];

export default function PricingContent({ currentPlan, onSelectPlan }: Props) {
  const [yearly, setYearly] = useState(true);

  return (
    <main className="flex-1 min-h-full relative overflow-hidden" style={{ background: "#f5f6fa" }}>

      {/* ── Background radial glow ── */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full opacity-30"
          style={{ background: "radial-gradient(ellipse at center, #fbbf24 0%, transparent 70%)" }} />
        <div className="absolute top-0 left-0 right-0 bottom-0 opacity-[0.025]"
          style={{ backgroundImage: "radial-gradient(circle, #6b7280 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
      </div>

      <div className="relative z-10 px-8 py-10">

        {/* ── Hero ── */}
        <div className="text-center mb-10">
          <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-amber-700 bg-amber-100 border border-amber-200 px-3 py-1 rounded-full uppercase tracking-widest mb-4">
            <svg width="10" height="10" fill="currentColor" viewBox="0 0 24 24"><path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" /></svg>
            Pricing
          </span>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">Choose your plan</h1>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Start free, scale as your studio grows. Every plan includes access to Game Fusion, Theme Fusion, and the Random Generator.
          </p>

          {/* ── Segmented billing toggle ── */}
          <div className="inline-flex items-center mt-7 bg-white border border-gray-200 rounded-xl p-1 shadow-sm gap-1">
            <button
              onClick={() => setYearly(false)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                !yearly ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setYearly(true)}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                yearly ? "bg-gray-900 text-white shadow-sm" : "text-gray-500 hover:text-gray-700"
              }`}
            >
              Yearly
              <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full transition-all ${
                yearly ? "bg-green-400 text-white" : "bg-green-100 text-green-700"
              }`}>
                Save 20%
              </span>
            </button>
          </div>
        </div>

        {/* ── Plan cards ── */}
        <div className="max-w-5xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-stretch">
          {PLANS.map((plan) => {
            const isCurrent = currentPlan === plan.id;
            const price = yearly ? plan.yearlyPrice : plan.monthlyPrice;
            const originalPrice = yearly ? plan.monthlyPrice : null;
            const yearlySavings = plan.monthlyPrice && plan.yearlyPrice
              ? (plan.monthlyPrice - plan.yearlyPrice) * 12
              : null;

            if (plan.featured) {
              // ── Pro card — elevated amber treatment ──
              return (
                <div key={plan.id} className={`relative flex flex-col rounded-2xl overflow-hidden shadow-2xl shadow-amber-200/70 ${isCurrent ? "ring-2 ring-green-400 ring-offset-2" : ""}`}>

                  {/* Amber header block */}
                  <div className="px-6 pt-6 pb-5" style={{ background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)" }}>
                    <div className="flex items-center justify-between mb-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-extrabold px-2.5 py-1 rounded-full bg-white/25 text-white uppercase tracking-wide">
                        🔥 Most Popular
                      </span>
                      {isCurrent && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500 text-white">
                          Current
                        </span>
                      )}
                    </div>
                    <p className="text-white font-bold text-lg leading-none mb-0.5">{plan.label}</p>
                    <p className="text-amber-100 text-[11px] leading-snug mb-4">{plan.tagline}</p>

                    {/* Credits highlight */}
                    <div className="flex items-center gap-2 bg-white/20 rounded-xl px-3 py-2 mb-4">
                      <span className="text-lg">⚡</span>
                      <span className="text-white font-extrabold text-sm">{plan.credits} credits/mo</span>
                    </div>

                    {/* Price */}
                    <div>
                      {originalPrice && yearly && (
                        <p className="text-amber-200 text-xs line-through">${originalPrice}/mo</p>
                      )}
                      <div className="flex items-end gap-1">
                        <span className="text-4xl font-extrabold text-white leading-none">${price}</span>
                        <span className="text-amber-200 text-sm mb-1">/mo</span>
                      </div>
                      {yearly && plan.yearlyTotal ? (
                        <p className="text-amber-100 text-[11px] mt-1">billed annually · ${plan.yearlyTotal}/yr</p>
                      ) : (
                        <p className="text-amber-100 text-[11px] mt-1">billed monthly</p>
                      )}
                      {yearly && yearlySavings && (
                        <span className="inline-flex items-center mt-2 text-[10px] font-bold text-green-900 bg-green-300 px-2 py-0.5 rounded-full">
                          You save ${yearlySavings}/yr
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Feature list */}
                  <div className="flex-1 flex flex-col bg-white px-6 pt-5 pb-6">
                    <ul className="flex flex-col gap-2.5 flex-1 mb-5">
                      {FEATURES.map((feature) => {
                        const enabled = plan.features[feature as keyof typeof plan.features] as boolean;
                        return (
                          <li key={feature} className="flex items-start gap-2">
                            {enabled ? (
                              <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-amber-100 flex items-center justify-center">
                                <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#d97706" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                              </span>
                            ) : (
                              <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red-50 flex items-center justify-center">
                                <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                              </span>
                            )}
                            <span className={`text-[13px] leading-snug ${enabled ? "text-gray-800 font-medium" : "text-gray-400"}`}>
                              {feature}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      onClick={() => { if (!isCurrent) onSelectPlan(plan.id); }}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isCurrent
                          ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                          : "bg-amber-500 hover:bg-amber-600 active:scale-95 text-white shadow-lg shadow-amber-200"
                      }`}
                    >
                      {isCurrent ? "Current Plan" : currentPlan ? "Switch to Pro" : "Get Started"}
                    </button>
                  </div>
                </div>
              );
            }

            if (plan.dark) {
              // ── Enterprise card — dark premium treatment ──
              return (
                <div key={plan.id} className={`relative flex flex-col rounded-2xl overflow-hidden shadow-lg ${isCurrent ? "ring-2 ring-green-400 ring-offset-2" : ""}`}
                  style={{ background: "linear-gradient(160deg, #1f2937 0%, #111827 100%)" }}>
                  {isCurrent && (
                    <div className="absolute -top-3 right-4">
                      <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500 text-white shadow-sm">Current Plan</span>
                    </div>
                  )}
                  <div className="px-6 pt-6 pb-5 border-b border-white/10">
                    <p className="text-white font-bold text-lg leading-none mb-0.5">{plan.label}</p>
                    <p className="text-gray-400 text-[11px] leading-snug mb-4">{plan.tagline}</p>

                    {/* Credits */}
                    <div className="flex items-center gap-2 bg-white/10 rounded-xl px-3 py-2 mb-4">
                      <span className="text-lg">⚡</span>
                      <span className="text-white font-extrabold text-sm">{plan.credits} credits/mo</span>
                    </div>

                    <div className="flex items-end gap-1">
                      <span className="text-3xl font-extrabold text-white leading-none">Custom</span>
                    </div>
                    <p className="text-gray-500 text-[11px] mt-1">annual contract</p>
                  </div>

                  <div className="flex-1 flex flex-col px-6 pt-5 pb-6">
                    <ul className="flex flex-col gap-2.5 flex-1 mb-5">
                      {FEATURES.map((feature) => {
                        const enabled = plan.features[feature as keyof typeof plan.features] as boolean;
                        return (
                          <li key={feature} className="flex items-start gap-2">
                            {enabled ? (
                              <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-white/10 flex items-center justify-center">
                                <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#4ade80" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                              </span>
                            ) : (
                              <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-red-900/30 flex items-center justify-center">
                                <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#f87171" strokeWidth={3}>
                                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </span>
                            )}
                            <span className={`text-[13px] leading-snug ${enabled ? "text-gray-200 font-medium" : "text-gray-500"}`}>
                              {feature}
                            </span>
                          </li>
                        );
                      })}
                    </ul>
                    <button
                      onClick={() => { if (!isCurrent) onSelectPlan(plan.id); }}
                      className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all ${
                        isCurrent
                          ? "bg-green-900/50 text-green-400 border border-green-700 cursor-default"
                          : "bg-white hover:bg-gray-100 active:scale-95 text-gray-900 shadow-sm"
                      }`}
                    >
                      {isCurrent ? "Current Plan" : "Contact Us"}
                    </button>
                  </div>
                </div>
              );
            }

            // ── Standard card (Starter & Studio) ──
            return (
              <div key={plan.id} className={`relative flex flex-col bg-white rounded-2xl overflow-hidden border transition-all hover:shadow-lg ${
                isCurrent ? "border-green-300 ring-2 ring-green-400 ring-offset-2 shadow-md" : "border-gray-200 shadow-sm"
              }`}>
                {isCurrent && (
                  <div className="absolute -top-3 right-4 z-10">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500 text-white shadow-sm">Current Plan</span>
                  </div>
                )}

                <div className="px-6 pt-6 pb-5 border-b border-gray-100">
                  <p className="text-gray-900 font-bold text-lg leading-none mb-0.5">{plan.label}</p>
                  <p className="text-gray-400 text-[11px] leading-snug mb-4">{plan.tagline}</p>

                  {/* Credits highlight */}
                  <div className="flex items-center gap-2 bg-amber-50 border border-amber-100 rounded-xl px-3 py-2 mb-4">
                    <span className="text-base">⚡</span>
                    <span className="text-amber-800 font-extrabold text-sm">{plan.credits} credits/mo</span>
                  </div>

                  {/* Price */}
                  <div>
                    {originalPrice && yearly && (
                      <p className="text-gray-400 text-xs line-through">${originalPrice}/mo</p>
                    )}
                    <div className="flex items-end gap-1 mt-0.5">
                      <span className="text-3xl font-extrabold text-gray-900 leading-none">${price}</span>
                      <span className="text-gray-400 text-sm mb-0.5">/mo</span>
                    </div>
                    {yearly && plan.yearlyTotal ? (
                      <p className="text-gray-400 text-[11px] mt-1">billed annually · ${plan.yearlyTotal}/yr</p>
                    ) : (
                      <p className="text-gray-400 text-[11px] mt-1">billed monthly</p>
                    )}
                    {yearly && yearlySavings && (
                      <span className="inline-flex items-center mt-2 text-[10px] font-bold text-green-700 bg-green-100 border border-green-200 px-2 py-0.5 rounded-full">
                        You save ${yearlySavings}/yr
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 flex flex-col px-6 pt-5 pb-6">
                  <ul className="flex flex-col gap-2.5 flex-1 mb-5">
                    {FEATURES.map((feature) => {
                      const enabled = plan.features[feature as keyof typeof plan.features] as boolean;
                      return (
                        <li key={feature} className="flex items-start gap-2">
                          {enabled ? (
                            <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-green-100 flex items-center justify-center">
                              <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="#16a34a" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                            </span>
                          ) : (
                            <span className="flex-shrink-0 mt-0.5 w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center">
                              <svg width="7" height="7" fill="none" viewBox="0 0 24 24" stroke="#d1d5db" strokeWidth={3}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                            </span>
                          )}
                          <span className={`text-[13px] leading-snug ${enabled ? "text-gray-700 font-medium" : "text-gray-400"}`}>
                            {feature}
                          </span>
                        </li>
                      );
                    })}
                  </ul>
                  <button
                    onClick={() => { if (!isCurrent) onSelectPlan(plan.id); }}
                    className={`w-full py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                      isCurrent
                        ? "bg-green-50 text-green-600 border border-green-200 cursor-default"
                        : "bg-white hover:bg-gray-50 text-gray-900 border-2 border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    {isCurrent ? "Current Plan" : currentPlan ? `Switch to ${plan.label}` : "Subscribe"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Trust strip ── */}
        <div className="flex items-center justify-center gap-1 flex-wrap mt-8">
          {TRUST.map((item, i) => (
            <span key={i} className="flex items-center gap-1.5 text-[12px] font-medium text-gray-500 bg-white border border-gray-200 rounded-full px-3.5 py-1.5 shadow-sm">
              <span className="text-gray-400">{item.icon}</span>
              {item.label}
            </span>
          ))}
        </div>

      </div>
    </main>
  );
}
