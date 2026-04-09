import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabase';
import { Play, Pause, ExternalLink, Loader2, Film, Image as ImageIcon } from 'lucide-react';
import Reveal from './Reveal';

interface MediaItem {
    id: string;
    title: string;
    description: string;
    media_type: 'video' | 'gif' | 'image';
    media_url: string;
    thumbnail_url: string | null;
    platform: string;
    external_link: string | null;
    order_index: number;
}

const defaultMedia: MediaItem[] = [
    {
        id: '1',
        title: 'Konten Kreatif',
        description: 'Video showcase konten viral',
        media_type: 'video',
        media_url: '/videos/sample.mp4',
        thumbnail_url: null,
        platform: 'tiktok',
        external_link: null,
        order_index: 1
    }
];

const platformColors: Record<string, string> = {
    tiktok: 'from-slate-800 to-pink-500',
    instagram: 'from-purple-500 to-pink-500',
    youtube: 'from-red-500 to-red-600',
    shopee: 'from-orange-500 to-red-500',
    tokopedia: 'from-green-500 to-green-600',
    default: 'from-primary to-secondary',
};

const MediaShowcase: React.FC = () => {
    const [mediaItems, setMediaItems] = useState<MediaItem[]>(defaultMedia);
    const [loading, setLoading] = useState(true);
    const [activeVideo, setActiveVideo] = useState<string | null>(null);
    const videoRefs = useRef<{ [key: string]: HTMLVideoElement | null }>({});

    useEffect(() => {
        const fetchMedia = async () => {
            try {
                const { data, error } = await supabase
                    .from('media_showcase')
                    .select('*')
                    .eq('is_active', true)
                    .order('order_index', { ascending: true });

                if (error) throw error;

                if (data && data.length > 0) {
                    setMediaItems(data);
                }
            } catch (error) {
                console.error('Error fetching media:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMedia();
    }, []);

    const toggleVideo = (id: string) => {
        const video = videoRefs.current[id];
        if (video) {
            if (activeVideo === id) {
                video.pause();
                setActiveVideo(null);
            } else {
                // Pause other videos
                Object.values(videoRefs.current).forEach((v: HTMLVideoElement | null) => v?.pause());
                video.play();
                setActiveVideo(id);
            }
        }
    };

    if (loading) {
        return (
            <section className="py-16 bg-dark">
                <div className="flex justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
            </section>
        );
    }

    if (mediaItems.length === 0) {
        return null;
    }

    return (
        <section id="media-showcase" className="py-20 bg-gradient-to-b from-surface to-dark relative overflow-hidden">
            {/* Background */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[200px]" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <Reveal width="100%">
                    <div className="text-center mb-12">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 text-accent text-sm font-medium mb-4">
                            <Film className="w-4 h-4" />
                            Media Showcase
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold text-textMain mb-4">
                            Lihat <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent to-primary">Karya</span> Saya
                        </h2>
                        <p className="text-textMuted max-w-2xl mx-auto">
                            Video, GIF, dan konten kreatif yang menunjukkan perjalanan saya sebagai digital creator.
                        </p>
                    </div>
                </Reveal>

                <Reveal width="100%">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {mediaItems.map((item) => {
                            const gradientColor = platformColors[item.platform] || platformColors.default;

                            return (
                                <div
                                    key={item.id}
                                    className="group relative bg-surface/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-primary/10"
                                >
                                    {/* Media Container */}
                                    <div className="relative aspect-video bg-slate-900 overflow-hidden">
                                        {item.media_type === 'video' ? (
                                            <>
                                                <video
                                                    ref={(el) => { videoRefs.current[item.id] = el; }}
                                                    src={item.media_url}
                                                    poster={item.thumbnail_url || undefined}
                                                    className="w-full h-full object-cover"
                                                    loop
                                                    muted
                                                    playsInline
                                                />
                                                <button
                                                    onClick={() => toggleVideo(item.id)}
                                                    className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/20 transition-colors"
                                                >
                                                    <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${gradientColor} flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform`}>
                                                        {activeVideo === item.id ? (
                                                            <Pause className="w-6 h-6 text-white" />
                                                        ) : (
                                                            <Play className="w-6 h-6 text-white ml-1" />
                                                        )}
                                                    </div>
                                                </button>
                                            </>
                                        ) : item.media_type === 'gif' ? (
                                            <img
                                                src={item.media_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <img
                                                src={item.media_url}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        )}

                                        {/* Platform badge */}
                                        <div className={`absolute top-3 left-3 px-3 py-1 rounded-full bg-gradient-to-r ${gradientColor} text-white text-xs font-medium uppercase`}>
                                            {item.platform}
                                        </div>

                                        {/* Media type badge */}
                                        <div className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white">
                                            {item.media_type === 'video' ? (
                                                <Film className="w-4 h-4" />
                                            ) : (
                                                <ImageIcon className="w-4 h-4" />
                                            )}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-5 bg-white/10 dark:bg-transparent">
                                        <h3 className="text-lg font-bold text-textMain mb-2">{item.title}</h3>
                                        <p className="text-textMuted text-sm mb-4 line-clamp-2">{item.description}</p>

                                        {item.external_link && (
                                            <a
                                                href={item.external_link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${gradientColor} text-white text-sm font-medium hover:shadow-lg transition-shadow`}
                                            >
                                                Lihat di {item.platform}
                                                <ExternalLink className="w-4 h-4" />
                                            </a>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </Reveal>
            </div>
        </section>
    );
};

export default MediaShowcase;
