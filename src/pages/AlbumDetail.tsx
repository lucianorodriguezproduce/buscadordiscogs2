import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Loader2, Heart, Library, PlayCircle, Store, ChevronRight } from "lucide-react";
import { discogsService } from "@/lib/discogs";

export default function AlbumDetail() {
    const { id } = useParams<{ id: string }>();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [album, setAlbum] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchDetails() {
            if (!id) return;
            setLoading(true);
            setError(null);
            try {
                const data = await discogsService.getReleaseDetails(id);
                setAlbum(data);
            } catch (err) {
                console.error("Failed to fetch album details:", err);
                setError("Could not load album details. Please try again later.");
            } finally {
                setLoading(false);
            }
        }

        fetchDetails();
    }, [id]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
                <Loader2 className="h-12 w-12 text-primary animate-spin" />
                <p className="text-gray-500 font-medium">Fetching release details...</p>
            </div>
        );
    }

    if (error || !album) {
        return (
            <div className="text-center py-20">
                <p className="text-red-500 mb-4">{error || "Release not found."}</p>
                <Link to="/">
                    <Button variant="outline">Back to Search</Button>
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <nav className="flex mb-8 text-sm text-gray-500">
                <ol className="flex items-center space-x-2">
                    <li><Link to="/" className="hover:text-primary transition-colors">Discover</Link></li>
                    <li><ChevronRight className="h-4 w-4" /></li>
                    <li>{album.artists?.[0]?.name || "Artist"}</li>
                    <li><ChevronRight className="h-4 w-4" /></li>
                    <li className="text-white truncate max-w-[200px]">{album.title}</li>
                </ol>
            </nav>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Cover & Actions */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="relative group aspect-square rounded-2xl overflow-hidden border border-gray-800 bg-surface-dark shadow-2xl">
                        <img
                            src={album.images?.[0]?.uri || album.thumb}
                            alt={album.title}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                (e.target as HTMLImageElement).src = "https://placehold.co/600x600/121212/FFFFFF?text=No+Cover";
                            }}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <Button className="h-14 text-base font-bold bg-primary text-black hover:bg-[#ccee00] rounded-xl">
                            <Library className="mr-2 h-5 w-5" />
                            Add to Collection
                        </Button>
                        <Button variant="outline" className="h-14 text-base font-bold text-secondary border-secondary hover:bg-secondary hover:text-black rounded-xl bg-transparent">
                            <Heart className="mr-2 h-5 w-5" />
                            Wantlist
                        </Button>
                    </div>

                    <div className="bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-2xl">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Store className="h-5 w-5 text-secondary" /> Marketplace
                            </h3>
                            <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 rounded font-mono">LIVE</Badge>
                        </div>
                        <div className="space-y-4 font-mono">
                            <div className="flex justify-between items-end border-b border-gray-800 pb-3">
                                <span className="text-gray-400 text-sm">Lowest Price</span>
                                <span className="text-2xl font-bold text-white">
                                    {album.lowest_price ? `$${album.lowest_price.toFixed(2)}` : "N/A"}
                                </span>
                            </div>
                            <div className="flex justify-between items-end border-b border-gray-800 pb-3">
                                <span className="text-gray-400 text-sm">Community Rating</span>
                                <span className="text-2xl font-bold text-primary">
                                    {album.community?.rating?.average?.toFixed(1) || "5.0"}
                                </span>
                            </div>
                        </div>
                        <a href={album.uri} target="_blank" rel="noopener noreferrer" className="block w-full">
                            <Button variant="outline" className="w-full mt-5 border-gray-700 text-gray-300 hover:text-white hover:border-gray-500">
                                View on Discogs
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Right Column: Details & Tracklist */}
                <div className="lg:col-span-7 space-y-8">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <Badge variant="secondary" className="bg-secondary/10 text-secondary border-secondary/20 rounded-full">
                                {album.formats?.[0]?.name || "Album"}
                            </Badge>
                            <Badge variant="outline" className="bg-gray-800 text-gray-400 border-gray-700 rounded-full">
                                {album.released_formatted || album.year}
                            </Badge>
                        </div>
                        <h1 className="text-4xl md:text-6xl font-display font-bold text-white mb-2 leading-tight">{album.title}</h1>
                        <h2 className="text-2xl text-primary font-medium mb-6">{album.artists?.[0]?.name}</h2>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 bg-surface-dark rounded-2xl border border-gray-800">
                            <div>
                                <span className="block text-xs text-gray-500 uppercase mb-1">Label</span>
                                <span className="block text-white font-medium truncate">{album.labels?.[0]?.name}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 uppercase mb-1">Catalog #</span>
                                <span className="block text-white font-medium truncate">{album.labels?.[0]?.catno}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 uppercase mb-1">Genre</span>
                                <span className="block text-white font-medium truncate">{album.genres?.[0]}</span>
                            </div>
                            <div>
                                <span className="block text-xs text-gray-500 uppercase mb-1">Country</span>
                                <span className="block text-white font-medium truncate">{album.country}</span>
                            </div>
                        </div>

                        {album.notes && (
                            <p className="text-gray-400 leading-relaxed mt-6">
                                {album.notes}
                            </p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white">Tracklist</h3>
                            <span className="text-sm text-gray-500">{album.tracklist?.length || 0} Tracks</span>
                        </div>
                        <div className="space-y-1">
                            {album.tracklist?.map((track: any, index: number) => (
                                <div key={index} className="group flex items-center p-3 rounded-lg hover:bg-white/5 transition-colors border border-transparent hover:border-gray-800 cursor-pointer">
                                    <span className="w-8 text-gray-600 font-mono text-sm group-hover:text-primary">{track.position || index + 1}</span>
                                    <div className="flex-grow">
                                        <div className="text-white font-medium">{track.title}</div>
                                    </div>
                                    <span className="text-gray-500 font-mono text-sm">{track.duration}</span>
                                    <div className="w-12 flex justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                        <PlayCircle className="text-gray-400 hover:text-white h-6 w-6" />
                                    </div>
                                </div>
                            ))}
                            {(!album.tracklist || album.tracklist.length === 0) && (
                                <p className="text-gray-500">No tracklist available.</p>
                            )}
                        </div>
                    </div>

                    <Separator className="bg-gray-800 my-8" />

                    <div className="flex flex-col md:flex-row gap-8 text-sm text-gray-500">
                        <div className="flex-1">
                            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Styles</h4>
                            <div className="flex flex-wrap gap-2">
                                {album.styles?.map((style: string) => (
                                    <Badge key={style} variant="outline" className="text-gray-400 border-gray-800">{style}</Badge>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-xs">Community</h4>
                            <p><strong className="text-gray-400">Have:</strong> {album.community?.have || 0}</p>
                            <p><strong className="text-gray-400">Want:</strong> {album.community?.want || 0}</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
