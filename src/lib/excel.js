import { read, utils } from 'xlsx';
import { CATEGORIES, BASE_PRICES } from '../data/players';

export const parseExcelData = async (file) => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (e) => {
            try {
                const data = e.target.result;
                const workbook = read(data, { type: 'array' });
                const sheetName = workbook.SheetNames[0]; // Assume first sheet
                const sheet = workbook.Sheets[sheetName];
                const jsonData = utils.sheet_to_json(sheet);

                // Map Excel columns to our Player structure
                // Expected Columns: Name, Category, Country, Base Price (or similar)
                // We'll try to be flexible with column names
                const players = jsonData.map((row, index) => {
                    // Normalized keys
                    const keys = Object.keys(row);
                    const getVal = (keyPart) => row[keys.find(k => k.toLowerCase().includes(keyPart.toLowerCase()))];

                    const name = getVal('name') || `Player ${index + 1}`;
                    const categoryRaw = getVal('category') || 'Batsman';
                    const countryRaw = getVal('country') || 'India';
                    const basePriceRaw = getVal('price') || getVal('amount') || '2000000';

                    // Normalize Category
                    let category = CATEGORIES.BATSMAN;
                    if (categoryRaw.toLowerCase().includes('bowl')) category = CATEGORIES.BOWLER;
                    if (categoryRaw.toLowerCase().includes('all')) category = CATEGORIES.ALL_ROUNDER;
                    if (categoryRaw.toLowerCase().includes('keep') || categoryRaw.toLowerCase().includes('wk')) category = CATEGORIES.WICKET_KEEPER;

                    // Normalize Base Price
                    let basePrice = 2000000;
                    const priceStr = String(basePriceRaw).toLowerCase();
                    if (priceStr.includes('2')) basePrice = BASE_PRICES.CR2;
                    else if (priceStr.includes('1') && !priceStr.includes('0')) basePrice = BASE_PRICES.CR1; // tricky, improved parsing below

                    // Better price parsing if it's raw numbers
                    const numericPrice = Number(basePriceRaw.toString().replace(/[^0-9]/g, ''));
                    if (numericPrice > 100) basePrice = numericPrice; // Assume if > 100 it's full value

                    // Normalize Country
                    const country = countryRaw.toLowerCase().includes('india') ? 'India' : 'Overseas';

                    return {
                        id: index + 1,
                        name,
                        category,
                        country,
                        basePrice,
                        isUncapped: basePrice === 2000000 && country === 'India', // Assumption
                        status: 'Available',
                        soldTo: null,
                        soldPrice: 0,
                        rating: Math.floor(Math.random() * 20) + 70, // Random rating if not in excel
                    };
                });

                resolve(players);
            } catch (err) {
                reject(err);
            }
        };

        reader.onerror = (err) => reject(err);
        reader.readAsArrayBuffer(file);
    });
};
