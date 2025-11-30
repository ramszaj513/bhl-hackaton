import { Recycle, Smartphone, Tv, Pill, MapPin } from 'lucide-react';

interface CategoryIconProps {
    category: string;
    className?: string;
}

export default function CategoryIcon({ category, className }: CategoryIconProps) {
    const getIconByCategory = (category: string) => {
        switch (category) {
            case 'pszok':
                return <Recycle className="w-4 h-4 text-white" />;
            case 'small_electronics':
                return <Smartphone className="w-4 h-4 text-white" />;
            case 'electronics':
                return <Tv className="w-4 h-4 text-white" />;
            case 'expired_medications':
                return <Pill className="w-4 h-4 text-white" />;
            default:
                return <MapPin className="w-4 h-4 text-white" />;
        }
    };

    const getBackgroundColorByCategory = (category: string) => {
        switch (category) {
            case 'pszok':
                return 'bg-green-500';
            case 'small_electronics':
                return 'bg-blue-500';
            case 'electronics':
                return 'bg-purple-500';
            case 'expired_medications':
                return 'bg-red-500';
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div
            className={`w-6 h-6 ${getBackgroundColorByCategory(category)} rounded-full border-2 border-white flex items-center justify-center shadow-lg ${className}`}
        >
            {getIconByCategory(category)}
        </div>
    );
}
