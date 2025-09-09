import React, { useState } from "react";

const tabOptions = [
    { label: "Length", units: ["Millimeter", "Centimeter", "Meter", "Kilometer", "Inch", "Foot", "Yard", "Mile"] },
    { label: "Weight", units: ["Milligram", "Gram", "Kilogram","Ounce", "Pound"] },
    { label: "Temperature", units: ["Celsius", "Fahrenheit", "Kelvin"] },
];

export default function UnitConverter() {
    const [activeTab, setActiveTab] = useState(0);
    const [value, setValue] = useState("");
    const [fromUnit, setFromUnit] = useState("");
    const [toUnit, setToUnit] = useState("");
    const [result, setResult] = useState("");

    const handleTabClick = (idx) => {
        setActiveTab(idx);
        setValue("");
        setFromUnit("");
        setToUnit("");
        setResult("");
    };

    const handleConvert = async(e) => {
        e.preventDefault();
        // Conversion logic placeholder
               console.log(value, fromUnit, toUnit, tabOptions[activeTab].label);

            const res = await fetch('http://localhost:3022/convert', {
                method: 'POST',
                body: JSON.stringify(
                    { 
                        "value": Number(value), 
                        "fromUnit": fromUnit, 
                        "toUnit": toUnit, 
                        "type": tabOptions[activeTab].label 
                    }
                ),
                headers: { 'Content-Type': 'application/json'}
       });
        const data = await res.json();
        setResult("The answer is " + data.result + " " + toUnit);
       
    };

    const { label, units } = tabOptions[activeTab];

    return (
        <div style={{ maxWidth: 400, margin: "40px auto", fontFamily: "sans-serif" }}>
            <div style={{ display: "flex", borderBottom: "1px solid #ccc" }}>
                {tabOptions.map((tab, idx) => (
                    <button
                        key={tab.label}
                        onClick={() => handleTabClick(idx)}
                        style={{
                            flex: 1,
                            padding: "12px 0",
                            border: "none",
                            borderBottom: activeTab === idx ? "2px solid #007bff" : "none",
                            background: "none",
                            fontWeight: activeTab === idx ? "bold" : "normal",
                            cursor: "pointer"
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <form onSubmit={handleConvert} style={{ marginTop: 32 }}>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Enter the {label.toLowerCase()} to convert:
                        <input
                            type="number"
                            value={value}
                            onChange={e => setValue(e.target.value)}
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                            required
                        />
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Unit to convert from:
                        <select
                            value={fromUnit}
                            onChange={e => setFromUnit(e.target.value)}
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                            required
                        >
                            <option value="">Select unit</option>
                            {units.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <div style={{ marginBottom: 16 }}>
                    <label>
                        Unit to convert to:
                        <select
                            value={toUnit}
                            onChange={e => setToUnit(e.target.value)}
                            style={{ width: "100%", padding: 8, marginTop: 4 }}
                            required
                        >
                            <option value="">Select unit</option>
                            {units.map(unit => (
                                <option key={unit} value={unit}>{unit}</option>
                            ))}
                        </select>
                    </label>
                </div>
                <button type="submit" style={{ padding: "10px 24px", background: "#007bff", color: "#fff", border: "none", borderRadius: 4 }}>
                    Convert
                </button>
            </form>
            {result && (
                <div style={{ marginTop: 24, padding: 12, background: "#f5f5f5", borderRadius: 4 }}>
                    {result}
                </div>
            )}
        </div>
    );
}