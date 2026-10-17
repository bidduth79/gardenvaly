/**
 * @file DashboardCharts.tsx
 * @description Lightweight, responsive SVG business charts for sales trends,
 * order status distribution, and payment breakdown.
 */

import React, { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { SalesTrendPoint, StatusDistributionPoint } from '../../types/admin';

interface SalesChartProps {
  data: SalesTrendPoint[];
}

export const SalesTrendChart: React.FC<SalesChartProps> = ({ data }) => {
  const { language } = useLanguage();
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  if (!data || data.length === 0) {
    return (
      <div className="h-64 flex items-center justify-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-stone-100">
        {language === 'bn' ? 'কোনো বিক্রয় ডেটা পাওয়া যায়নি।' : 'No sales data available for this range.'}
      </div>
    );
  }

  const maxSales = Math.max(...data.map((d) => d.sales), 100);
  const chartHeight = 180;
  const chartWidth = 600;
  const paddingX = 40;
  const paddingY = 20;

  const points = data.map((d, index) => {
    const x = paddingX + (index / Math.max(1, data.length - 1)) * (chartWidth - paddingX * 2);
    const y = chartHeight - paddingY - (d.sales / maxSales) * (chartHeight - paddingY * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, p, i) => `${acc} ${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`, '');
  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  return (
    <div className="relative w-full">
      <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-48 sm:h-56 overflow-visible">
        <defs>
          <linearGradient id="salesGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#174D35" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#174D35" stopOpacity="0.0" />
          </linearGradient>
        </defs>

        {/* Horizontal grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
          const y = chartHeight - paddingY - pct * (chartHeight - paddingY * 2);
          const val = Math.round(pct * maxSales);
          return (
            <g key={idx}>
              <line
                x1={paddingX}
                y1={y}
                x2={chartWidth - paddingX}
                y2={y}
                stroke="#E7E5E4"
                strokeDasharray="3 3"
                strokeWidth="1"
              />
              <text x={paddingX - 6} y={y + 3} textAnchor="end" fontSize="9" fill="#A8A29E" fontFamily="monospace">
                ৳{val}
              </text>
            </g>
          );
        })}

        {/* Gradient fill area */}
        <path d={areaD} fill="url(#salesGrad)" />

        {/* Primary Line */}
        <path d={pathD} fill="none" stroke="#174D35" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Interactive Data Points */}
        {points.map((p, i) => (
          <g key={i}>
            <circle
              cx={p.x}
              cy={p.y}
              r={hoveredIndex === i ? '5' : '3'}
              fill="#FFFFFF"
              stroke="#174D35"
              strokeWidth={hoveredIndex === i ? '2.5' : '1.5'}
              className="cursor-pointer transition-all"
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            />
          </g>
        ))}
      </svg>

      {/* Tooltip Popup */}
      {hoveredIndex !== null && points[hoveredIndex] && (
        <div
          className="absolute z-20 pointer-events-none transform -translate-x-1/2 bg-stone-900 text-white text-[11px] px-3 py-1.5 rounded-lg shadow-xl"
          style={{
            left: `${(points[hoveredIndex].x / chartWidth) * 100}%`,
            top: '10px',
          }}
        >
          <div className="font-semibold text-emerald-400">৳{points[hoveredIndex].sales.toLocaleString()}</div>
          <div className="text-stone-300 text-[10px]">
            {points[hoveredIndex].ordersCount} {language === 'bn' ? 'টি অর্ডার' : 'orders'} • {points[hoveredIndex].label}
          </div>
        </div>
      )}

      {/* Date Labels below chart */}
      <div className="flex justify-between text-[10px] text-stone-400 px-8 pt-1">
        <span>{data[0]?.label}</span>
        {data.length > 2 && <span>{data[Math.floor(data.length / 2)]?.label}</span>}
        <span>{data[data.length - 1]?.label}</span>
      </div>
    </div>
  );
};

interface StatusDistProps {
  data: StatusDistributionPoint[];
}

export const StatusDistributionChart: React.FC<StatusDistProps> = ({ data }) => {
  const { language } = useLanguage();
  const total = data.reduce((sum, d) => sum + d.count, 0);

  if (!data || data.length === 0 || total === 0) {
    return (
      <div className="h-48 flex items-center justify-center text-xs text-stone-400 bg-stone-50 rounded-2xl border border-stone-100">
        {language === 'bn' ? 'কোনো অর্ডার রেকর্ড নেই।' : 'No orders recorded yet.'}
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {data
        .filter((d) => d.count > 0)
        .map((d) => {
          const pct = Math.round((d.count / total) * 100);
          return (
            <div key={d.status} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-stone-700">
                  {language === 'bn' ? d.labelBn : d.labelEn}
                </span>
                <span className="font-semibold text-stone-900">
                  {d.count} <span className="text-stone-400 text-[10px]">({pct}%)</span>
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{
                    width: `${pct}%`,
                    backgroundColor: d.color,
                  }}
                />
              </div>
            </div>
          );
        })}
    </div>
  );
};
