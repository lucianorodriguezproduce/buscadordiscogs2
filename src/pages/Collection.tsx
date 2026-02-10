import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Grid2X2, List } from "lucide-react";
import { Link } from "react-router-dom";
import { discogsService } from "@/lib/discogs";

export default function Collection() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [collection, setCollection] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchCollection() {
            try {
                // Using getTrending as a placeholder for "collection" data 
                // since we don't have user authentication for the specific collection API yet
                const data = await discogsService.getTrending();
                setCollection(data);
            } catch (error) {
                console.error("Failed to fetch collection:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchCollection();
    }, []);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white tracking-tight">My Collection</h1>
                    <p className="text-gray-500 mt-1">Manage and explore your curated vinyl library.</p>
                </div>
                <div className="flex items-center gap-2 bg-surface-dark p-1 rounded-lg border border-gray-800">
                    <button className="p-2 bg-gray-800 text-primary rounded-md shadow-sm">
                        <Grid2X2 className="h-4 w-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-white transition-colors">
                        <List className="h-4 w-4" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                {loading ? (
                    Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="space-y-3 animate-pulse">
                            <div className="aspect-square bg-surface-dark rounded-xl" />
                            <div className="h-4 bg-surface-dark rounded w-3/4" />
                            <div className="h-3 bg-surface-dark rounded w-1/2" />
                        </div>
                    ))
                ) : (
                    collection.map((item) => (
                        <Link key={item.id} to={`/album/${item.id}`} className="group block">
                            <Card className="bg-transparent border-0 shadow-none">
                                <CardContent className="p-0">
                                    <div className="aspect-square rounded-xl overflow-hidden mb-3 relative bg-surface-dark ring-offset-background transition-colors group-hover:ring-2 group-hover:ring-primary group-hover:ring-offset-2 ring-offset-black">
                                        <img
                                            src={item.cover_image || item.thumb}
                                            alt={item.title}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://placehold.co/400x400/121212/FFFFFF?text=No+Cover";
                                            }}
                                        />
                                        <div className="absolute top-2 right-2">
                                            <Badge className="bg-black/60 backdrop-blur-md border border-white/10 text-[10px] font-bold">VG+</Badge>
                                        </div>
                                    </div>
                                    <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
                                    <p className="text-gray-500 text-xs">{item.label?.[0] || "Label N/A"}</p>
                                </CardContent>
                            </Card>
                        </Link>
                    ))
                )}
            </div>

            {collection.length === 0 && !loading && (
                <div className="text-center py-20 border-2 border-dashed border-gray-800 rounded-3xl">
                    <p className="text-gray-500 mb-4">Your collection is empty.</p>
                    <Link to="/">
                        <button className="text-primary hover:underline">Start exploring releases</button>
                    </Link>
                </div>
            )}
        </div>
    );
}
