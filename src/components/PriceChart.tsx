'use client';

import { useEffect, useMemo, useState } from 'react';
import { scaleLinear, scaleTime } from '@visx/scale';
import { AreaClosed } from '@visx/shape';
import { LinearGradient } from '@visx/gradient';
import { withTooltip, Tooltip, defaultStyles } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { createClient } from '@supabase/supabase-js';

type Datum = { date: Date; value: number };

type Props = {
  inventoryId: string;
  width?: number;
  height?: number;
  color?: string;
};

const tooltipStyles = {
  ...defaultStyles,
  background: '#0f0f0f',
  color: '#fff',
  border: '1px solid #00FF94',
  borderRadius: 0,
  fontFamily: 'var(--font-space-mono), monospace',
};

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

function ChartInner({
  inventoryId,
  width = 320,
  height = 160,
  color = '#00FF94',
  showTooltip,
  hideTooltip,
  tooltipData,
  tooltipLeft,
  tooltipTop,
}: any) {
  const [data, setData] = useState<Datum[]>([
    { date: new Date(Date.now() - 6 * 24 * 3600 * 1000), value: 80 },
    { date: new Date(Date.now() - 5 * 24 * 3600 * 1000), value: 85 },
    { date: new Date(Date.now() - 4 * 24 * 3600 * 1000), value: 90 },
    { date: new Date(Date.now() - 3 * 24 * 3600 * 1000), value: 95 },
    { date: new Date(Date.now() - 2 * 24 * 3600 * 1000), value: 105 },
    { date: new Date(Date.now() - 1 * 24 * 3600 * 1000), value: 110 },
    { date: new Date(), value: 100 },
  ]);

  useEffect(() => {
    const load = async () => {
      const { data: history, error } = await supabase
        .from('price_history')
        .select('price, recorded_at')
        .eq('inventory_id', inventoryId)
        .order('recorded_at', { ascending: true })
        .limit(60);

      if (error || !history || history.length === 0) {
        return;
      }

      const mapped = history.map((row: any) => ({
        date: new Date(row.recorded_at),
        value: row.price,
      }));

      setData(mapped);
    };
    load();
  }, [inventoryId]);

  const margin = { top: 10, right: 10, bottom: 20, left: 10 };
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const xScale = useMemo(
    () =>
      scaleTime({
        range: [0, innerWidth],
        domain: [Math.min(...data.map((d: Datum) => d.date.getTime())), Math.max(...data.map((d: Datum) => d.date.getTime()))],
      }),
    [data, innerWidth]
  );

  const yScale = useMemo(
    () =>
      scaleLinear({
        range: [innerHeight, 0],
        domain: [Math.min(...data.map((d: Datum) => d.value)) * 0.95, Math.max(...data.map((d: Datum) => d.value)) * 1.05],
      }),
    [data, innerHeight]
  );

  const handleTooltip = (event: any) => {
    const point = localPoint(event);
    if (!point) return;
    const x0 = xScale.invert(point.x - margin.left).getTime();
    const closest = data.reduce((prev: Datum, curr: Datum) =>
      Math.abs(curr.date.getTime() - x0) < Math.abs(prev.date.getTime() - x0) ? curr : prev
    );

    showTooltip({
      tooltipData: closest,
      tooltipLeft: xScale(closest.date),
      tooltipTop: yScale(closest.value),
    });

    // subtle haptic tick
    Haptics.impact({ style: ImpactStyle.Light }).catch(() => {});
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <LinearGradient id="area-gradient" from={`${color}66`} to="#00000000" />
        <g transform={`translate(${margin.left},${margin.top})`}>
          <AreaClosed
            data={data}
            x={(d: Datum) => xScale(d.date) || 0}
            y={(d: Datum) => yScale(d.value) || 0}
            yScale={yScale}
            stroke={color}
            strokeWidth={2}
            fill="url(#area-gradient)"
            curve={undefined}
          />
          <rect
            x={0}
            y={0}
            width={innerWidth}
            height={innerHeight}
            fill="transparent"
            onMouseMove={handleTooltip}
            onTouchMove={handleTooltip}
            onMouseLeave={hideTooltip}
            onTouchEnd={hideTooltip}
          />
        </g>
      </svg>

      {tooltipData && (
        <Tooltip top={(tooltipTop || 0) + 8} left={(tooltipLeft || 0) + margin.left} style={tooltipStyles}>
          <div>{tooltipData.date.toLocaleDateString()}</div>
          <div className="text-accent font-bold">{tooltipData.value.toFixed(0)} $</div>
        </Tooltip>
      )}
    </div>
  );
}

export const PriceChart = withTooltip(ChartInner);

