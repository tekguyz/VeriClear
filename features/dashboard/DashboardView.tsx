
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, TrendingDown, Minus, CheckCircle, Smile, UserCheck, BarChart, LineChart } from 'lucide-react';
import type { AnalyticsMetrics, MetricCardData } from '../../types';
import InfoPopover from '../../components/common/InfoPopover';
import { useAppStore } from '../../store/appStore';

const MetricCard: React.FC<{ data: MetricCardData; icon: React.ElementType, children?: React.ReactNode }> = ({ data, icon: Icon, children }) => {
  const TrendIcon = data.changeType === 'increase' ? TrendingUp : data.changeType === 'decrease' ? TrendingDown : Minus;
  const trendColor = data.changeType === 'increase' ? 'text-green-400' : data.changeType === 'decrease' ? 'text-red-400' : 'text-gray-400';

  return (
    <div className="bg-panel-background border border-border-color rounded-2xl p-6 relative flex flex-col">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <p className="text-gray-400 text-sm mb-1">{data.label}</p>
            {children}
          </div>
          <p className="text-3xl font-bold text-text-primary">{data.value}</p>
        </div>
        {data.progress !== undefined ? (
          <div className="relative w-16 h-16">
            <svg className="w-full h-full" viewBox="0 0 36 36">
              <path
                className="text-border-color"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" strokeWidth="3"
              />
              <path
                className="text-accent-primary"
                strokeDasharray={`${data.progress}, 100`}
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <Icon className="text-gray-400" size={24} />
            </div>
          </div>
        ) : (
          <div className="p-3 bg-gray-800/50 rounded-lg">
            <Icon className="text-gray-400" size={24} />
          </div>
        )}
      </div>
      <div className="mt-auto pt-4 flex items-center">
        <TrendIcon size={16} className={`mr-1 ${trendColor}`} />
        <span className={`text-sm ${trendColor}`}>{data.change.toFixed(1)}%</span>
        <span className="text-sm text-gray-500 ml-1">vs last period</span>
      </div>
    </div>
  );
};

const ChartPlaceholder: React.FC<{ title: string; icon: React.ElementType }> = ({ title, icon: Icon }) => (
    <div className="bg-panel-background border border-border-color rounded-2xl p-6 flex flex-col items-center justify-center text-center">
        <div className="p-4 bg-gray-800/50 rounded-full mb-4">
            <Icon className="text-gray-400" size={32} />
        </div>
        <h3 className="text-lg font-semibold text-text-primary mb-1">{title}</h3>
        <p className="text-gray-500 text-sm">Chart implementation is pending.</p>
    </div>
);

const DashboardContent: React.FC<{ metrics: AnalyticsMetrics }> = ({ metrics }) => {
    const navigate = useNavigate();
    return (
      <div className="animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6 mb-6">
            <div role="button" className="cursor-pointer card-glow rounded-2xl" onClick={() => navigate('/reviews')} title="View all reviews">
              <MetricCard data={metrics.totalCalls} icon={BarChart} />
            </div>
            <MetricCard data={metrics.complianceRate} icon={CheckCircle}>
              <InfoPopover content="The percentage of reviews that passed all quality and script checks." />
            </MetricCard>
            <MetricCard data={metrics.averageSentiment} icon={Smile} />
            <MetricCard data={metrics.agentPerformance} icon={UserCheck} />
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartPlaceholder title="Call Volume Over Time" icon={LineChart} />
            <ChartPlaceholder title="Pass Rate Trends" icon={BarChart} />
        </div>
      </div>
    );
};

const AnalyticsViewAppMode: React.FC = () => {
    const [liveMetrics, setLiveMetrics] = useState<AnalyticsMetrics | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        const fetchMetrics = async () => {
            if (!isMounted) return;
            try {
                const response = await fetch('/.netlify/functions/getDashboardMetrics');
                if (!response.ok) {
                    throw new Error(`Failed to fetch dashboard metrics. Status: ${response.status}`);
                }
                const data: AnalyticsMetrics = await response.json();
                if (isMounted) {
                    setLiveMetrics(data);
                    setError(null);
                }
            } catch (err) {
                if (isMounted) {
                    setError(err instanceof Error ? err.message : 'An unknown error occurred.');
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        };

        setLoading(true);
        fetchMetrics();
        const intervalId = setInterval(fetchMetrics, 30000);

        return () => {
            isMounted = false;
            clearInterval(intervalId);
        };
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-400">Error: {error}</div>;
    }
    
    if (!liveMetrics) {
        return <div className="text-center text-gray-400">No dashboard data available.</div>;
    }

    return <DashboardContent metrics={liveMetrics} />;
};


const AnalyticsViewDemoMode: React.FC = () => {
    const metrics = useAppStore(state => state.analyticsMetrics);

    if (!metrics) {
        return (
            <div className="flex justify-center items-center h-full">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
                <p className="ml-4">Loading Demo Data...</p>
            </div>
        );
    }

    return <DashboardContent metrics={metrics} />;
};

const AnalyticsView: React.FC = () => {
    const appMode = useAppStore(state => state.appMode);

    if (appMode === 'demo') {
        return <AnalyticsViewDemoMode />;
    }
    
    // Default to app mode for safety, although appMode should never be null here.
    return <AnalyticsViewAppMode />;
};

export default AnalyticsView;
