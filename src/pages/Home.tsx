import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Search, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { discogsService, type DiscogsSearchResult } from "@/lib/discogs";

export default function Home() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<DiscogsSearchResult[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                setLoading(true);
                try {
                    const searchResults = await discogsService.searchReleases(query);
                    setResults(searchResults);
                } catch (error) {
                    console.error("Search failed:", error);
                } finally {
                    setLoading(false);
                }
            } else {
                // Load trending/fallback when query is empty
                setLoading(true);
                try {
                    const trending = await discogsService.getTrending();
                    setResults(trending);
                } catch (error) {
                    console.error("Trending fetch failed:", error);
                } finally {
                    setLoading(false);
                }
            }
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="space-y-8">
            <div className="relative">
                {loading ? (
                    <Loader2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
                ) : (
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                )}
                <Input
                    className="pl-10 bg-surface-dark border-gray-800 text-white placeholder:text-gray-500 h-12 text-lg focus-visible:ring-primary"
                    placeholder="Search for artists, albums, or tracks..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
            </div>

            <section>
                <h2 className="text-2xl font-display font-bold text-white mb-6">
                    {query ? `Search results for "${query}"` : "Trending Releases"}
                </h2>

                {loading && results.length === 0 ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="h-10 w-10 text-primary animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                        {results.map((album) => (
                            <Link key={album.id} to={`/album/${album.id}`} className="group block">
                                <Card className="bg-transparent border-0 shadow-none">
                                    <CardContent className="p-0">
                                        <div className="aspect-square rounded-xl overflow-hidden mb-3 relative bg-surface-dark">
                                            <img
                                                src={album.cover_image || album.thumb}
                                                alt={album.title}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://placehold.co/400x400/121212/FFFFFF?text=No+Cover";
                                                }}
                                            />
                                        </div>
                                        <h3 className="text-white font-bold text-sm truncate">{album.title}</h3>
                                        <p className="text-gray-500 text-xs">{album.year || "N/A"}</p>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                )}

                {!loading && results.length === 0 && query && (
                    <p className="text-center text-gray-500 py-10">No results found for your search.</p>
                )}
            </section>
        </div>
    );
}
