import React from 'react';
import { Mail, Linkedin, Github, Instagram, MessageCircle, ArrowRight, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const socialLinks = [
    {
        name: 'LinkedIn',
        icon: Linkedin,
        url: 'https://www.linkedin.com/in/hengki-setiawan-8064a6353',
        color: 'hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50',
    },
    {
        name: 'GitHub',
        icon: Github,
        url: 'https://github.com/Hengki-Setiawan',
        color: 'hover:text-slate-900 hover:border-slate-400 hover:bg-slate-100',
    },
    {
        name: 'Instagram',
        icon: Instagram,
        url: 'https://www.instagram.com/hengkimiau',
        color: 'hover:text-pink-600 hover:border-pink-300 hover:bg-pink-50',
    },
    {
        name: 'Email',
        icon: Mail,
        url: 'mailto:hengkisetiawan461@gmail.com',
        color: 'hover:text-primary hover:border-primary/30 hover:bg-primary/5',
    },
    {
        name: 'WhatsApp',
        icon: Phone,
        url: 'https://wa.me/6289580346303',
        color: 'hover:text-green-600 hover:border-green-300 hover:bg-green-50',
    },
];

const ContactCTA: React.FC = () => {
    return (
        <section id="contact" className="py-24 bg-dark relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-primary/5 blur-[150px] rounded-full pointer-events-none" />

            <div className="max-w-3xl mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center"
                >
                    {/* Badge */}
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                        <MessageCircle className="w-4 h-4" />
                        Open for Opportunities
                    </span>

                    <h2 className="text-4xl md:text-5xl font-display font-bold text-textMain">
                        Let's Work{' '}
                        <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                            Together
                        </span>
                    </h2>

                    <p className="text-textMuted mt-4 text-lg max-w-lg mx-auto">
                        Tertarik berkolaborasi, punya ide proyek, atau ingin sekadar menyapa? Saya senang mendengarnya.
                    </p>

                    {/* Contact Info */}
                    <div className="mt-8 space-y-2 text-textMuted">
                        <p className="text-sm">📧 hengkisetiawan461@gmail.com</p>
                        <p className="text-sm">📱 +62 895-8034-63032</p>
                        <p className="text-sm">🌐 hengkisetiawan.my.id</p>
                    </div>

                    {/* CTA Button */}
                    <div className="mt-8">
                        <Link
                            to="/contact"
                            className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-primary to-primaryDark text-white font-semibold text-lg hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-0.5 transition-all duration-300"
                        >
                            Get in Touch
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Social Links */}
                    <div className="flex items-center justify-center gap-4 mt-10">
                        {socialLinks.map((link) => (
                            <a
                                key={link.name}
                                href={link.url}
                                target="_blank"
                                rel="noreferrer"
                                className={`w-12 h-12 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center text-textMuted transition-all duration-300 ${link.color}`}
                                title={link.name}
                            >
                                <link.icon className="w-5 h-5" />
                            </a>
                        ))}
                    </div>

                    <p className="text-textMuted/50 text-sm mt-8">
                        Typically responds within 24 hours
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default ContactCTA;
