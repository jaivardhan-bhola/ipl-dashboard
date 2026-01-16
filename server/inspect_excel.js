const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../IPL_Auction_Players_List_2026.xlsx');
const workbook = XLSX.readFile(filePath);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Get first 5 rows as arrays
const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1, limit: 5 });
console.log(JSON.stringify(rows, null, 2));
