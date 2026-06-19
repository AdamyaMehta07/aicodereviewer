import {
  Radar,
  RadarChart as ReRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

export default function RadarChart({ data }) {
  return (
    <div className="h-72 w-full sm:h-80 lg:h-96">
      <ResponsiveContainer width="100%" height="100%">
        <ReRadarChart data={data} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
          <PolarGrid stroke="#1E2740" />
          <PolarAngleAxis
            dataKey="category"
            tick={{ fill: '#B7C0D8', fontSize: 11 }}
          />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#7C5CFF"
            fill="#7C5CFF"
            fillOpacity={0.35}
          />
        </ReRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
