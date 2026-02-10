import { Card, CardContent } from "@/components/ui/card";
import { Grid2X2, List, TrendingUp, Box, Hash } from "lucide-react";
import { Link } from "react-router-dom";
import { discogsService } from "@/lib/discogs";
import { motion } from "framer-motion";
import { AlbumCardSkeleton } from "@/components/ui/Skeleton";
import { useQuery } from "@tanstack/react-query";

export default function Collection() {
    const { data: collection, isLoading } = useQuery({
        queryKey: ["collection"],
        queryFn: () => discogsService.getTrending(), // Placeholder for real user collection
    });

    const stats = [
        { label: "Total Items", value: collection?.length || 0, icon: Box, color: "text-primary" },
        { label: "Est. Value", value: "$1,420.50", icon: TrendingUp, color: "text-secondary" },
        { label: "Wantlist", value: "84", icon: Hash, color: "text-blue-400" },
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: { staggerChildren: 0.05 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.95 },
        show: { opacity: 1, scale: 1 }
    };

    return (
        <div className="space-y-12">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col md:flex-row md:items-end justify-between gap-8"
            >
                <div className="space-y-2">
                    <h1 className="text-6xl font-display font-bold text-white tracking-tightest">Archive</h1>
                    <p className="text-gray-500 font-medium max-w-md">Your curated physical collection, synchronized with global market values.</p>
                </div>

                <div className="flex gap-4">
                    {stats.map((stat) => (
                        <div key={stat.label} className="bg-white/5 border border-white/5 rounded-2xl p-6 min-w-[140px] backdrop-blur-xl group hover:border-white/10 transition-all">
                            <stat.icon className={`h-5 w-5 ${stat.color} mb-4`} />
                            <div className="text-2xl font-bold font-mono text-white mb-1 tracking-tighter">{stat.value}</div>
                            <div className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </motion.div>

            <div className="h-px bg-white/5 w-full" />

            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                    <button className="text-primary font-bold border-b-2 border-primary pb-2 px-2 text-sm uppercase tracking-widest">All Items</button>
                    <button className="text-gray-500 font-bold hover:text-white pb-2 px-2 text-sm uppercase tracking-widest transition-colors">By Artist</button>
                    <button className="text-gray-500 font-bold hover:text-white pb-2 px-2 text-sm uppercase tracking-widest transition-colors">By Format</button>
                </div>
                <div className="flex items-center gap-2 bg-white/5 p-1 rounded-xl border border-white/5">
                    <button className="p-2 bg-white/10 text-primary rounded-lg shadow-sm">
                        <Grid2X2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-500 hover:text-white transition-colors">
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="show"
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-8"
            >
                {isLoading ? (
                    Array.from({ length: 12 }).map((_, i) => (
                        <AlbumCardSkeleton key={i} />
                    ))
                ) : (
                    collection?.map((item) => (
                        <motion.div key={item.id} variants={itemVariants}>
                            <Link to={`/album/${item.id}`} className="group block">
                                <Card className="bg-transparent border-0 shadow-none">
                                    <CardContent className="p-0">
                                        <div className="aspect-square rounded-[2rem] overflow-hidden mb-4 relative bg-surface-dark shadow-2xl transition-all duration-700 ring-offset-4 ring-offset-black group-hover:ring-2 group-hover:ring-primary/40 group-hover:scale-[1.02]">
                                            <img
                                                src={item.cover_image || item.thumb}
                                                alt={item.title}
                                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://placehold.co/600x600/121212/FFFFFF?text=No+Cover";
                                                }}
                                            />
                                            <div className="absolute top-4 right-4 translate-y-[-10px] opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                                                <span className="bg-black/80 backdrop-blur-md border border-white/10 text-[10px] font-black text-primary px-3 py-1.5 rounded-full shadow-2xl">MINT</span>
                                            </div>
                                        </div>
                                        <div className="space-y-1">
                                            <h3 className="text-white font-bold text-sm truncate group-hover:text-primary transition-colors">{item.title}</h3>
                                            <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">{item.label?.[0] || "Label N/A"}</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        </motion.div>
                    ))
                )}
            </motion.div>

            {(!collection || collection.length === 0) && !isLoading && (
                <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-[3rem] bg-white/[0.01]">
                    <p className="text-gray-500 mb-6 font-medium">Your archive is currently silent.</p>
                    <Link to="/">
                        <button className="text-primary font-bold hover:underline underline-offset-8">Discover releases to add</button>
                    </Link>
                </div>
            )}
        </div>
    );
}
