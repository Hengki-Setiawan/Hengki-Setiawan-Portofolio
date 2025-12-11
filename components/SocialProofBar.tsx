import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Users, ShoppingBag, Star, TrendingUp } from 'lucide-react';

interface ProofItem {
    value: string;
    label: string;
    icon: string;
}

const defaultProofItems: ProofItem[] = [
    { value: '365K+', label: 'Anggota Komunitas', icon: '👥' },
    { value: '1,250+', label: 'Produk Terjual', icon: '🛒' },
    { value: 'Star Seller', label: 'Tokopedia', icon: '⭐' },
];

const SocialProofBar: React.FC = () => {
    const [proofItems, setProofItems] = useState<ProofItem[]>(defaultProofItems);
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show after scrolling 300px
            setIsVisible(window.scrollY > 300);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const fetchProofData = async () => {
            try {
                const { data, error } = await supabase
                    .from('achievements')
                    .select('value, title, icon')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true })
                    .limit(4);

                if (error) throw error;

                if (data && data.length > 0) {
                    setProofItems(data.map(d => ({
                        value: d.value,
                        label: d.title,
                        icon: d.icon,
                    })));
                }
            } catch (error) {
                console.error('Error fetching proof data:', error);
            }
        };

        fetchProofData();
    }, []);

    return (
        <div
            className={`fixed bottom-0 left-0 right-0 z-30 bg-gradient-to-r from-dark via-surface to-dark border-t border-white/10 backdrop-blur-lg transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                }`}
        >
            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-center gap-6 md:gap-12 flex-wrap">
                    {proofItems.map((item, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm">
                            <span className="text-lg">{item.icon}</span>
                            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">
                                {item.value}
                            </span>
                            <span className="text-slate-400 hidden sm:inline">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default SocialProofBar;
