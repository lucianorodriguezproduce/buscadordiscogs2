import { Bell, Disc, Search } from "lucide-react";
import { USER_PROFILE } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";

export function Navbar() {
    const location = useLocation();

    const navItems = [
        { name: "Discover", path: "/" },
        { name: "My Collection", path: "/collection" },
        { name: "Wantlist", path: "#" },
        { name: "Marketplace", path: "#" }
    ];

    return (
        <nav className="fixed w-full z-50 top-0 left-0 border-b border-white/[0.08] bg-black/60 backdrop-blur-2xl backdrop-saturate-[1.8] transition-all duration-500">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    <Link to="/" className="flex items-center gap-3 group">
                        <Disc className="h-8 w-8 text-primary group-hover:rotate-180 transition-transform duration-700" />
                        <span className="font-display font-bold text-2xl tracking-tighter text-white">
                            SonicVault
                        </span>
                    </Link>

                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-8">
                            {navItems.map((item) => (
                                <Link
                                    key={item.name}
                                    to={item.path}
                                    className={cn(
                                        "px-3 py-2 rounded-md text-sm font-medium transition-colors",
                                        location.pathname === item.path
                                            ? "text-primary bg-primary/5"
                                            : "text-gray-400 hover:text-primary hover:bg-white/5"
                                    )}
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                        >
                            <Search className="h-5 w-5" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="text-gray-400 hover:text-white hover:bg-white/10 rounded-full"
                        >
                            <Bell className="h-5 w-5" />
                        </Button>
                        <Link to="/login" className="h-10 w-10 rounded-full bg-gradient-to-tr from-primary to-secondary p-[2px] hover:scale-110 transition-transform">
                            <img
                                src={USER_PROFILE.avatar}
                                alt={USER_PROFILE.name}
                                className="h-full w-full rounded-full object-cover border-2 border-black"
                            />
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
