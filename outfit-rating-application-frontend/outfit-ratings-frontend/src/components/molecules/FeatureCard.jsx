import React from "react";

export default function FeatureCard({ Icon, title, children }) {
  return (
    <div className="p-6 bg-(--lgray) rounded-2xl shadow">
      <div className="w-12 h-12 rounded-full bg-(--dpink) text-white flex items-center justify-center font-bold mb-4">
        {Icon ? <Icon /> : null}
      </div>
      <h4 className="text-lg font-semibold text-(--gray)">{title}</h4>
      <p className="mt-2 text-sm text-(--gray)">{children}</p>
    </div>
  );
}
