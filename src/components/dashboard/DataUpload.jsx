import React, { useState } from 'react';
import { useAuction } from '../../context/AuctionContext';
import { parseExcelData } from '../../lib/excel';
import { Upload, CheckCircle, AlertCircle } from 'lucide-react';

const DataUpload = () => {
    const { loadPlayers, state } = useAuction();
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            setError('');
            setSuccess('');
            const players = await parseExcelData(file);
            if (players.length === 0) throw new Error("No players found in file");

            loadPlayers(players);
            setSuccess(`Successfully loaded ${players.length} players!`);
        } catch (err) {
            console.error(err);
            setError("Failed to parse Excel file. Ensure it has Name, Category, Country columns.");
        }
    };

    return (
        <div className="p-4 bg-white/5 rounded-2xl border border-white/10">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Upload className="w-5 h-5 text-blue-400" />
                Import Players
            </h3>

            <div className="flex flex-col gap-4">
                <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-600 rounded-xl cursor-pointer hover:bg-white/5 hover:border-slate-500 transition-colors">
                    <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <Upload className="w-8 h-8 mb-3 text-slate-400" />
                        <p className="mb-2 text-sm text-slate-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        <p className="text-xs text-slate-500">XLSX or XLS file</p>
                    </div>
                    <input type="file" className="hidden" accept=".xlsx, .xls" onChange={handleFileUpload} />
                </label>

                {error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg text-sm flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" />
                        {error}
                    </div>
                )}

                {success && (
                    <div className="p-3 bg-green-500/10 border border-green-500/20 text-green-400 rounded-lg text-sm flex items-center gap-2">
                        <CheckCircle className="w-4 h-4" />
                        {success}
                    </div>
                )}

                <div className="text-xs text-slate-500 mt-2">
                    Current Pool Size: <span className="text-white font-mono">{state.players.length}</span> players
                </div>
            </div>
        </div>
    );
};

export default DataUpload;
