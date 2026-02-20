import { Card } from "@/components/ui/card";
import { Users } from "lucide-react";

export default function CommunityManager() {
    return (
        <div className="space-y-10">
            <header>
                <h1 className="text-5xl font-display font-black text-white tracking-tightest">
                    Comunidad
                </h1>
                <p className="text-gray-500 mt-2 font-medium">
                    Gestión de usuarios y collectors (Próximamente).
                </p>
            </header>

            <div className="py-32 flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-[2rem] space-y-4 text-center">
                <Users className="h-12 w-12 text-gray-700" />
                <p className="text-xl font-display font-medium text-gray-500">
                    Módulo en construcción.
                </p>
            </div>
        </div>
    );
}
