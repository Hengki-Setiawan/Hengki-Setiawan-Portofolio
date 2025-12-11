import React from 'react';

interface SkeletonProps {
    className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className = '' }) => (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} />
);

export const CardSkeleton: React.FC = () => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-lg" />
            <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-1/2" />
                <Skeleton className="h-3 w-1/4" />
            </div>
        </div>
        <Skeleton className="h-3 w-full" />
        <Skeleton className="h-3 w-3/4" />
    </div>
);

export const TableRowSkeleton: React.FC = () => (
    <tr>
        <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
        <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
        <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
    </tr>
);

export const StatCardSkeleton: React.FC = () => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <div className="flex items-center gap-4">
            <Skeleton className="w-12 h-12 rounded-xl" />
            <div className="space-y-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-8 w-12" />
            </div>
        </div>
    </div>
);

export const FormSkeleton: React.FC = () => (
    <div className="space-y-4">
        <div>
            <Skeleton className="h-4 w-20 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div>
            <Skeleton className="h-4 w-24 mb-2" />
            <Skeleton className="h-10 w-full rounded-lg" />
        </div>
        <div>
            <Skeleton className="h-4 w-16 mb-2" />
            <Skeleton className="h-24 w-full rounded-lg" />
        </div>
    </div>
);

export default Skeleton;
