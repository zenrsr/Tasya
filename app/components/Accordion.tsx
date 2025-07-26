import type { ReactNode } from "react";
import React, { createContext, useContext, useState } from "react";
import { cn } from "~/lib/utils";

interface AccordionContextType {
    activeItems: string[];
    toggleItem: (id: string) => void;
    isItemActive: (id: string) => boolean;
}

const AccordionContext = createContext<AccordionContextType | undefined>(
    undefined
);

const useAccordion = () => {
    const context = useContext(AccordionContext);
    if (!context) {
        throw new Error("Accordion components must be used within an Accordion");
    }
    return context;
};

interface AccordionProps {
    children: ReactNode;
    defaultOpen?: string;
    allowMultiple?: boolean;
    className?: string;
}

export const Accordion: React.FC<AccordionProps> = ({
    children,
    defaultOpen,
    allowMultiple = false,
    className = "",
}) => {
    const [activeItems, setActiveItems] = useState<string[]>(
        defaultOpen ? [defaultOpen] : []
    );

    const toggleItem = (id: string) => {
        setActiveItems((prev) => {
            if (allowMultiple) {
                return prev.includes(id)
                    ? prev.filter((item) => item !== id)
                    : [...prev, id];
            } else {
                return prev.includes(id) ? [] : [id];
            }
        });
    };

    const isItemActive = (id: string) => activeItems.includes(id);

    return (
        <AccordionContext.Provider
            value={{ activeItems, toggleItem, isItemActive }}
        >
            <div className={`space-y-3 ${className}`}>{children}</div>
        </AccordionContext.Provider>
    );
};

interface AccordionItemProps {
    id: string;
    children: ReactNode;
    className?: string;
}

export const AccordionItem: React.FC<AccordionItemProps> = ({
    id,
    children,
    className = "",
}) => {
    const { isItemActive } = useAccordion();
    const isActive = isItemActive(id);
    
    return (
        <div className={`
            overflow-hidden 
            gradient-border 
            transition-all duration-300 
            hover:border-silver-400/30
            ${isActive ? 'border-accent-blue/30 bg-dark-800/50' : 'bg-dark-900/30'} 
            ${className}
        `}>
            {children}
        </div>
    );
};

interface AccordionHeaderProps {
    itemId: string;
    children: ReactNode;
    className?: string;
    icon?: ReactNode;
    iconPosition?: "left" | "right";
}

export const AccordionHeader: React.FC<AccordionHeaderProps> = ({
    itemId,
    children,
    className = "",
    icon,
    iconPosition = "right",
}) => {
    const { toggleItem, isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    const defaultIcon = (
        <div className="relative">
            <div className={cn(
                "w-6 h-6 rounded-full border border-dark-600 flex items-center justify-center transition-all duration-300",
                isActive 
                    ? "border-accent-blue/50 bg-accent-blue/10" 
                    : "hover:border-silver-400/50 hover:bg-dark-700"
            )}>
                <svg
                    className={cn("w-3 h-3 transition-transform duration-300 text-silver-300", {
                        "rotate-180": isActive,
                    })}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    );

    const handleClick = () => {
        toggleItem(itemId);
    };

    return (
        <button
            onClick={handleClick}
            className={cn(
                "w-full px-6 py-5 text-left group",
                "focus:outline-none",
                "transition-all duration-300 flex items-center justify-between cursor-pointer",
                "hover:bg-dark-800/50",
                isActive && "bg-dark-800/30",
                className
            )}
        >
            <div className="flex items-center space-x-4 flex-1">
                {iconPosition === "left" && (icon || defaultIcon)}
                <div className="flex-1">
                    <div className="flex items-center gap-3">
                        <div className={cn(
                            "w-1 h-6 rounded-full transition-all duration-300",
                            isActive 
                                ? "bg-gradient-to-b from-accent-blue to-accent-purple" 
                                : "bg-dark-600 group-hover:bg-dark-500"
                        )}></div>
                        {children}
                    </div>
                </div>
            </div>
            {iconPosition === "right" && (icon || defaultIcon)}
        </button>
    );
};

interface AccordionContentProps {
    itemId: string;
    children: ReactNode;
    className?: string;
}

export const AccordionContent: React.FC<AccordionContentProps> = ({
    itemId,
    children,
    className = "",
}) => {
    const { isItemActive } = useAccordion();
    const isActive = isItemActive(itemId);

    return (
        <div
            className={cn(
                "overflow-hidden transition-all duration-500 ease-in-out",
                isActive ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0",
                className
            )}
        >
            <div className="px-6 py-5 border-t border-dark-700/50 bg-dark-900/20 animate-fade-in">
                {children}
            </div>
        </div>
    );
};
