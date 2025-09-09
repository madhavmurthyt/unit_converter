import express from 'express';
import cors from 'cors';
const app = express();
const port = 3022;
app.use(express.json());
app.use(cors());
// Conversion factors
const lengthFactors = {
    Millimeter: 0.001,
    Centimeter: 0.01,
    Meter: 1,
    Kilometer: 1000,
    Inch: 0.0254,
    Foot: 0.3048,
    Yard: 0.9144,
    Mile: 1609.34
};

const weightFactors = {
    Milligram: 0.000001,
    Gram: 0.001,
    Kilogram: 1,
    Ounce: 0.0283495,
    Pound: 0.453592
};

// Temperature conversion functions
const convertTemperature = (value, fromUnit, toUnit) => {
    let tempInCelsius;

    // Convert from the source unit to Celsius
    switch (fromUnit) {
        case 'Celsius':
            tempInCelsius = value;
            break;
        case 'Fahrenheit':
            tempInCelsius = (value - 32) * 5 / 9;
            break;
        case 'Kelvin':
            tempInCelsius = value - 273.15;
            break;
        default:
            throw new Error(`Unsupported temperature unit: ${fromUnit}`);
    }

    // Convert from Celsius to the target unit
    switch (toUnit) {
        case 'Celsius':
            return tempInCelsius;
        case 'Fahrenheit':
            return (tempInCelsius * 9 / 5) + 32;
        case 'Kelvin':
            return tempInCelsius + 273.15;
        default:
            throw new Error(`Unsupported temperature unit: ${toUnit}`);
    }
};

app.post('/convert', (req, res) => {
    const { value, fromUnit, toUnit, type } = req.body;

    if (typeof value !== 'number' || isNaN(value)) {
        return res.status(400).json({ error: 'Invalid value. Must be a number.' });
    }

    let result;

    try {
        switch (type) {
            case 'Length':
                if (!lengthFactors[fromUnit] || !lengthFactors[toUnit]) {
                    throw new Error('Unsupported length unit');
                }
                result = (value * lengthFactors[fromUnit]) / lengthFactors[toUnit];
                break;
            case 'Weight':
                if (!weightFactors[fromUnit] || !weightFactors[toUnit]) {
                    throw new Error('Unsupported weight unit');
                }
                result = (value * weightFactors[fromUnit]) / weightFactors[toUnit];
                break;
            case 'Temperature':
                result = convertTemperature(value, fromUnit, toUnit);
                break;
            default:
                return res.status(400).json({ error: 'Unsupported conversion type' });
        }

        res.json({ result });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.listen(port, () => {
    console.log(`Conversion server running at http://localhost:${port}`);
});
