import React, { useMemo } from 'react';
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';
import { ChipRecord } from '@/types/tournament';
import { format } from 'date-fns';

interface TournamentChartProps {
    records: ChipRecord[];
    startChips: number;
}

export const TournamentChart: React.FC<TournamentChartProps> = ({ records, startChips }) => {
    // Generate chart data including start point and records
    const chartData = useMemo(() => {
        // Start point
        const startPoint = {
            time: 'Start',
            timestamp: records.length > 0 ? records[0].timestamp.getTime() - 1000 : Date.now(),
            chips: startChips,
            bb: records.length > 0 && records[0].bb > 0 ? Math.round(startChips / records[0].bb) : 0,
        };

        const recordsData = records.map(r => ({
            time: format(r.timestamp, 'HH:mm'),
            timestamp: r.timestamp.getTime(),
            chips: r.chipCount,
            bb: Math.round(r.chipCount / r.bb),
        }));

        return [startPoint, ...recordsData];
    }, [records, startChips]);

    if (records.length === 0) {
        return <div className="p-8 text-center text-gray-400">データがありません</div>;
    }

    return (
        <div className="h-[300px] w-full bg-white p-4 rounded-lg border shadow-sm">
            <ResponsiveContainer width="100%" height="100%">
                <LineChart
                    data={chartData}
                    margin={{
                        top: 5,
                        right: 10,
                        left: 0,
                        bottom: 5,
                    }}
                >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line yAxisId="left" type="monotone" dataKey="chips" stroke="#8884d8" name="Chip Count" activeDot={{ r: 8 }} />
                    <Line yAxisId="right" type="monotone" dataKey="bb" stroke="#82ca9d" name="BB Equivalent" />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
};
