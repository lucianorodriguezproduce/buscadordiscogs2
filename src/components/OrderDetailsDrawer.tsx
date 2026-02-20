import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface OrderDetailsDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
}

export default function OrderDetailsDrawer({ isOpen, onClose, title, children, footer }: OrderDetailsDrawerProps) {
    // Lock body scroll when open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "";
        }
        return () => { document.body.style.overflow = ""; };
    }, [isOpen]);

    // Close on Escape
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
        };
        if (isOpen) window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[70]"
                        onClick={onClose}
                    />

                    {/* Panel */}
                    <motion.div
                        initial={{ x: "100%" }}
                        animate={{ x: 0 }}
                        exit={{ x: "100%" }}
                        transition={{ type: "spring", damping: 30, stiffness: 300 }}
                        className="fixed top-0 right-0 h-full w-full sm:w-[480px] md:w-[520px] bg-neutral-950 border-l border-white/5 z-[80] flex flex-col shadow-[-20px_0_60px_rgba(0,0,0,0.8)]"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-6 md:px-8 py-5 border-b border-white/5 flex-shrink-0">
                            <span className="text-sm font-mono font-bold text-gray-400 uppercase tracking-widest truncate">
                                {title || "Detalle de Pedido"}
                            </span>
                            <button
                                onClick={onClose}
                                className="p-2 text-gray-600 hover:text-white hover:bg-white/5 rounded-xl transition-all"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        {/* Body — scrollable */}
                        <div className="flex-1 overflow-y-auto px-6 md:px-8 py-6 space-y-8">
                            {children}
                        </div>

                        {/* Footer — fixed bottom */}
                        {footer && (
                            <div className="px-6 md:px-8 py-5 border-t border-white/5 flex-shrink-0 space-y-3">
                                {footer}
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
}
