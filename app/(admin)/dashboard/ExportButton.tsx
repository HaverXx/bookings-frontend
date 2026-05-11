// ExportButton.tsx
"use client";

export function ExportButton() {
    function exportar() {
        alert("Hola Mundo");
    }
    return (
        <button className="primary-btn" type="button" onClick={exportar}>
            Export report
        </button>
    );
}