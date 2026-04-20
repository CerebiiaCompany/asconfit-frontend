import { useState, useRef, useEffect } from "react";
import { Subtarea } from "../types/auditoria";

export function useActividadDropdown(allSubtareas: Subtarea[]) {
    const [actividadSearch, setActividadSearch] = useState("");
    const [actividadOpen, setActividadOpen] = useState(false);
    const actividadRef = useRef<HTMLDivElement>(null);

    const filteredSubtareas = actividadSearch.trim()
        ? allSubtareas.filter((s) =>
            s.nombre.toLowerCase().includes(actividadSearch.toLowerCase())
        )
        : allSubtareas.slice(0, 5);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (actividadRef.current && !actividadRef.current.contains(e.target as Node)) {
                setActividadOpen(false);
            }
        };
        if (actividadOpen) document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, [actividadOpen]);

    const openDropdown = () => {
        setActividadOpen((o) => !o);
        setActividadSearch("");
    };

    const closeDropdown = () => {
        setActividadOpen(false);
        setActividadSearch("");
    };

    return {
        actividadSearch,
        setActividadSearch,
        actividadOpen,
        actividadRef,
        filteredSubtareas,
        openDropdown,
        closeDropdown,
    };
}
