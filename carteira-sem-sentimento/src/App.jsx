import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Trash2, Plus, RefreshCw, DollarSign, TrendingUp, AlertTriangle, ArrowRight, Wallet, Bitcoin, PieChart as PieIcon, XCircle, CheckCircle, Calendar, Target, Settings, Lock, Wifi, WifiOff, Edit3, Cloud, Save, Key, LogOut } from 'lucide-react';
import { initializeApp } from "firebase/app";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";

// --- SEU PROJETO FIREBASE VAI AQUI ---
// Substitua este bloco inteiro pelo que você copiou do Console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAWWvVr-pj_kuOx98sUoKrle5Ef_DiN6FM",
  authDomain: "carteirasemsentimento.firebaseapp.com",
  projectId: "carteirasemsentimento",
  storageBucket: "carteirasemsentimento.firebasestorage.app",
  messagingSenderId: "432622069700",
  appId: "1:432622069700:web:7093754da7d19645f4a691",
  measurementId: "G-2KV42NHVF4"
};
// -------------------------------------

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// --- Utilitários ---
const formatCurrency = (value) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatPercent = (value) => {
  return `${(value).toFixed(1)}%`;
};

const DEFAULT_TOKEN = '9hswna31dg3kbFBsY889Rg'; 

// --- Componentes ---

const AssetSection = ({ title, icon, assets, type, onAdd, onRemove, onUpdatePrice, onUpdateQty }) => {
  const [newTicker, setNewTicker] = useState('');

  const handleAdd = () => {
    if (!newTicker) return;
    onAdd(type, {
      id: Date.now(),
      ticker: newTicker.toUpperCase().trim(), 
      qty: 0, 
      price: 0, 
    });
    setNewTicker('');
  };

  const totalValue = assets.reduce((acc, curr) => acc + (curr.qty * curr.price), 0);

  return (
    <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <div className="flex items-center gap-2 text-slate-100 font-semibold text-lg">
          {React.createElement(icon, { className: "w-5 h-5 text-emerald-400" })}
          <h3>{title}</h3>
        </div>
        <span className="text-emerald-400 font-bold">{formatCurrency(totalValue)}</span>
      </div>

      <div className="overflow-x-auto mb-4 flex-grow relative z-10">
        <table className="w-full text-sm text-left text-slate-300">
          <thead className="text-xs text-slate-400 uppercase bg-slate-950">
            <tr>
              <th className="px-2 py-2">Ativo</th>
              <th className="px-2 py-2 text-center">Qtd</th>
              <th className="px-2 py-2 text-center">Preço Atual</th>
              <th className="px-2 py-2 text-right">Total</th>
              <th className="px-2 py-2 text-right">Peso</th>
              <th className="px-2 py-2 text-right"></th>
            </tr>
          </thead>
          <tbody>
            {assets.map((asset) => {
              const assetTotal = asset.qty * asset.price;
              const weight = totalValue > 0 ? (assetTotal / totalValue) * 100 : 0;
              const targetWeight = assets.length > 0 ? 100 / assets.length : 0;
              const isOverweight = weight > targetWeight * 1.1; 

              return (
                <tr key={asset.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                  <td className="px-2 py-2 font-medium text-slate-100">{asset.ticker}</td>
                  <td className="px-2 py-2 text-center">
                   <input 
                    type="number" 
                    value={asset.qty}
                    onChange={(e) => onUpdateQty(type, asset.id, e.target.value)}
                    className="w-16 bg-transparent border-b border-slate-700 focus:border-emerald-400 outline-none text-center"
                  />
                  </td>
                  <td className="px-2 py-2 text-center">
                    <div className="relative group">
                      <input 
                          type="number" 
                          value={asset.price}
                          onChange={(e) => onUpdatePrice(type, asset.id, e.target.value)}
                          className="w-20 bg-transparent border-b border-slate-700 focus:border-emerald-400 outline-none text-center"
                      />
                    </div>
                  </td>
                  <td className="px-2 py-2 text-right font-mono">{formatCurrency(assetTotal)}</td>
                  <td className="px-2 py-2 text-right">
                    <span className={`text-xs ${isOverweight ? 'text-yellow-500' : 'text-slate-400'}`}>
                        {weight.toFixed(1)}%
                    </span>
                  </td>
                  <td className="px-2 py-2 text-right">
                    <button 
                      onClick={() => onRemove(type, asset.id)}
                      className="text-red-400 hover:text-red-300 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex gap-2 bg-slate-950 p-3 rounded-lg border border-slate-800 mt-auto relative z-10">
        <div className="flex-grow">
            <input
            type="text"
            placeholder="Novo Ticker (ex: WEGE3)"
            className="w-full bg-slate-900 border border-slate-700 rounded px-4 py-2 text-slate-100 text-sm focus:border-emerald-500 outline-none"
            value={newTicker}
            onChange={(e) => setNewTicker(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
        </div>
        <button
          onClick={handleAdd}
          className="bg-emerald-600 hover:bg-emerald-500 text-white rounded px-6 py-2 flex items-center justify-center gap-2 text-sm font-bold transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> Add
        </button>
      </div>
    </div>
  );
};

const SimpleAssetInput = ({ title, icon, onChangePrice, onChangeQty, price, qty, isCurrency = false }) => {
    const total = price * qty;
    return (
        <div className="bg-slate-900 rounded-lg p-4 mb-4 border border-slate-800 shadow-sm relative overflow-hidden">
             <div className="flex items-center justify-between mb-4 relative z-10">
                <div className="flex items-center gap-2 text-slate-100 font-semibold text-lg">
                {React.createElement(icon, { className: "w-5 h-5 text-amber-400" })}
                <h3>{title}</h3>
                </div>
                <span className="text-amber-400 font-bold">{formatCurrency(total)}</span>
            </div>
            <div className="grid grid-cols-2 gap-4 relative z-10">
                <div>
                    <label className="text-xs text-slate-400 block mb-1">{isCurrency ? 'Valor Disponível' : 'Quantidade'}</label>
                    <input 
                        type="number" 
                        value={qty}
                        onChange={(e) => onChangeQty(Number(e.target.value))}
                        className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 outline-none"
                    />
                </div>
                {!isCurrency && (
                     <div>
                        <label className="text-xs text-slate-400 block mb-1 flex items-center gap-1">
                            Preço Atual (R$)
                        </label>
                        <input 
                            type="number" 
                            value={price}
                            onChange={(e) => onChangePrice(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:border-amber-500 outline-none"
                        />
                    </div>
                )}
            </div>
        </div>
    )
}

// --- App Principal ---

export default function PortfolioManager() {
  // State
  const [stocks, setStocks] = useState([]);
  const [bitcoin, setBitcoin] = useState({ qty: 0, price: 0 }); 
  const [reserve, setReserve] = useState({ qty: 0, price: 1 }); 
  const [contribution, setContribution] = useState('');
  const [plan, setPlan] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [isDataSimulated, setIsDataSimulated] = useState(false);
  
  // Cloud & Auth
  const [user, setUser] = useState(null);
  const [walletId, setWalletId] = useState(''); // ID da Carteira para Sync
  const [inputWalletId, setInputWalletId] = useState(''); // Input do usuário
  const [isCloudSaving, setIsCloudSaving] = useState(false);
  const [dataLoaded, setDataLoaded] = useState(false);

  // API Config
  const [apiToken, setApiToken] = useState(DEFAULT_TOKEN);
  const [showConfig, setShowConfig] = useState(false);

  // --- FIREBASE AUTH ---
  useEffect(() => {
    const initAuth = async () => {
        await signInAnonymously(auth);
    };
    initAuth();

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // --- LOAD DATA FROM SHARED WALLET ID ---
  useEffect(() => {
    // Só carrega se tiver usuário e uma Wallet ID definida
    if (!user || !walletId) return;

    const loadData = async () => {
        setDataLoaded(false); // Reset load state
        try {
            // Caminho público para compartilhamento simplificado
            const docRef = doc(db, 'portfolios', walletId);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const data = docSnap.data();
                setStocks(data.stocks || []);
                setBitcoin(data.bitcoin || { qty: 0, price: 0 });
                setReserve(data.reserve || { qty: 0, price: 1 });
                if (data.apiToken) setApiToken(data.apiToken);
                if (data.lastUpdate) setLastUpdate(new Date(data.lastUpdate));
            } else {
                // Nova carteira, inicia zerada
                setStocks([]);
                setBitcoin({ qty: 0, price: 0 });
                setReserve({ qty: 0, price: 1 });
                setApiToken(DEFAULT_TOKEN);
            }
        } catch (e) {
            console.error("Erro ao carregar da nuvem:", e);
            alert("Erro ao acessar carteira. Verifique se sua configuração do Firebase permite leitura/escrita.");
        } finally {
            setDataLoaded(true);
        }
    };

    loadData();
  }, [user, walletId]);

  // --- AUTO-SAVE (DEBOUNCED) ---
  useEffect(() => {
    if (!user || !walletId || !dataLoaded) return;

    const saveData = async () => {
        setIsCloudSaving(true);
        try {
            const docRef = doc(db, 'portfolios', walletId);
            await setDoc(docRef, {
                stocks,
                bitcoin,
                reserve,
                apiToken,
                lastUpdate: lastUpdate ? lastUpdate.toISOString() : null
            });
        } catch (e) {
            console.error("Erro ao salvar na nuvem:", e);
        } finally {
            setTimeout(() => setIsCloudSaving(false), 500);
        }
    };

    const timer = setTimeout(saveData, 2000);
    return () => clearTimeout(timer);

  }, [stocks, bitcoin, reserve, apiToken, lastUpdate, user, walletId, dataLoaded]);


  // Actions
  const addStock = (type, asset) => setStocks([...stocks, asset]);
  const removeStock = (type, id) => setStocks(stocks.filter(s => s.id !== id));
  const updateStockPrice = (type, id, val) => setStocks(stocks.map(s => s.id === id ? { ...s, price: Number(val) } : s));
  const updateStockQty = (type, id, val) => setStocks(stocks.map(s => s.id === id ? { ...s, qty: Number(val) } : s));

  // --- FETCH API ---
  const fetchMarketPrices = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setIsDataSimulated(false);
    let errorOccurred = false;

    try {
        const btcResponse = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=brl');
        const btcData = await btcResponse.json();
        if (btcData.bitcoin && btcData.bitcoin.brl) {
            setBitcoin(prev => ({ ...prev, price: btcData.bitcoin.brl }));
        }
    } catch (e) {
        console.warn("Falha ao buscar BTC:", e);
    }

    if (stocks.length > 0) {
        const safeToken = apiToken.trim();
        const newStocks = [...stocks]; 
        
        for (let i = 0; i < newStocks.length; i++) {
            const stock = newStocks[i];
            if (!stock.ticker) continue;

            try {
                const cleanTicker = stock.ticker.trim().toUpperCase();
                let url = `https://brapi.dev/api/quote/${cleanTicker}`;
                if (safeToken.length > 0) {
                    url += `?token=${safeToken}`;
                }

                const response = await fetch(url);
                
                if (!response.ok) {
                    if (response.status === 429) errorOccurred = true;
                    continue; 
                }
                
                const data = await response.json();
                
                if (data.results && data.results.length > 0) {
                    const result = data.results[0];
                    const realPrice = result.regularMarketPrice || result.price;
                    if (realPrice) {
                        newStocks[i] = { ...stock, price: realPrice };
                    }
                }
            } catch (e) {
                console.error(`Falha ao buscar ${stock.ticker}:`, e);
                errorOccurred = true;
            }
        }
        
        setStocks(newStocks);
    }

    if (errorOccurred) {
        setIsDataSimulated(true); 
        setIsLoading(false);
        setLastUpdate(new Date());
        alert("Atenção: Algumas cotações falharam ou a API limitou o acesso (429). Tente novamente em instantes.");
    } else {
        setIsLoading(false);
        setLastUpdate(new Date());
    }
  };

  useEffect(() => {
    if (dataLoaded && stocks.length > 0) {
        fetchMarketPrices();
    }
  }, [dataLoaded]); 

  const stockTotal = stocks.reduce((acc, s) => acc + (s.qty * s.price), 0);
  const btcTotal = bitcoin.qty * bitcoin.price;
  const reserveTotal = reserve.qty * reserve.price;
  const totalPortfolio = stockTotal + btcTotal + reserveTotal;

  const data = [
    { name: 'Bitcoin', value: btcTotal, color: '#F7931A' },
    { name: 'Ações', value: stockTotal, color: '#10B981' }, 
    { name: 'Reserva', value: reserveTotal, color: '#64748B' }, 
  ];

  const calculateContribution = () => {
    const amount = Number(contribution);
    if (!amount || amount <= 0) return;

    const futureTotal = totalPortfolio + amount;
    const targetPerClass = futureTotal / 3;

    const classGaps = [
      { id: 'btc', name: 'Bitcoin', current: btcTotal, deficit: targetPerClass - btcTotal },
      { id: 'stocks', name: 'Ações', current: stockTotal, deficit: targetPerClass - stockTotal },
      { id: 'reserve', name: 'Reserva', current: reserveTotal, deficit: targetPerClass - reserveTotal },
    ];

    classGaps.sort((a, b) => b.deficit - a.deficit);
    const top2 = classGaps.slice(0, 2);
    const halfContribution = amount / 2;

    const recommendations = top2.map(category => {
        let details = [];
        let allocatedAmount = halfContribution;

        if (category.deficit < 0) allocatedAmount = 0; 

        if (category.id === 'stocks' && allocatedAmount > 0) {
            if (stocks.length === 0) {
                details.push({ id: 'new', ticker: "Adicione Ativos", valueToBuy: allocatedAmount, currentPrice: 0 });
            } else {
                const futureStockTotal = stockTotal + allocatedAmount;
                const idealValuePerAsset = futureStockTotal / stocks.length;

                const stockDeficits = stocks.map(s => {
                    const currentVal = s.qty * s.price;
                    const deficit = Math.max(0, idealValuePerAsset - currentVal);
                    return { ...s, deficit, currentVal };
                });

                const totalDeficitSum = stockDeficits.reduce((acc, s) => acc + s.deficit, 0);

                details = stockDeficits.map(s => {
                    let valueToBuy = 0;
                    if (totalDeficitSum > 0) {
                        valueToBuy = Number(((s.deficit / totalDeficitSum) * allocatedAmount).toFixed(2));
                    } else {
                        valueToBuy = Number((allocatedAmount / stocks.length).toFixed(2));
                    }

                    return {
                        id: s.id,
                        ticker: s.ticker,
                        valueToBuy: valueToBuy,
                        currentPrice: s.price
                    };
                });
            }

        } else if (category.id === 'btc' && allocatedAmount > 0) {
            details.push({ id: 'btc', ticker: 'BTC', valueToBuy: Number(allocatedAmount.toFixed(2)), currentPrice: bitcoin.price });
        } else if (category.id === 'reserve' && allocatedAmount > 0) {
            details.push({ id: 'res', ticker: 'Caixa', valueToBuy: Number(allocatedAmount.toFixed(2)), currentPrice: 1 });
        }

        if (allocatedAmount > 0 && details.length === 0 && category.id === 'stocks') {
             details.push({ id: 'info', ticker: "Rebalanceado", valueToBuy: 0, currentPrice: 0 });
        }

        return {
            id: category.id,
            category: category.name,
            totalAmount: Number(allocatedAmount.toFixed(2)),
            details: details
        };
    });

    setPlan(recommendations);
  };

  const updatePlanValue = (catIdx, detailIdx, newVal) => {
    const newPlan = [...plan];
    const val = Number(newVal);
    newPlan[catIdx].details[detailIdx].valueToBuy = val;
    newPlan[catIdx].totalAmount = Number(newPlan[catIdx].details.reduce((acc, item) => acc + item.valueToBuy, 0).toFixed(2));
    setPlan(newPlan);
  };

  const removePlanDetail = (catIdx, detailIdx) => {
    const newPlan = [...plan];
    newPlan[catIdx].details.splice(detailIdx, 1);
    newPlan[catIdx].totalAmount = Number(newPlan[catIdx].details.reduce((acc, item) => acc + item.valueToBuy, 0).toFixed(2));
    setPlan(newPlan);
  };

  const removePlanCategory = (catIdx) => {
    const newPlan = plan.filter((_, idx) => idx !== catIdx);
    setPlan(newPlan);
  };

  const executeOrders = () => {
    if (!plan) return;

    let newStocks = [...stocks];
    let newBitcoin = { ...bitcoin };
    let newReserve = { ...reserve };

    plan.forEach(cat => {
        cat.details.forEach(order => {
            if (order.valueToBuy <= 0) return;

            if (cat.id === 'stocks') {
                const stockIndex = newStocks.findIndex(s => s.ticker === order.ticker);
                if (stockIndex >= 0) {
                    const price = newStocks[stockIndex].price;
                    if (price > 0) {
                        const qtyBought = Math.floor(order.valueToBuy / price);
                        newStocks[stockIndex].qty += qtyBought;
                    }
                }
            } else if (cat.id === 'btc') {
                if (newBitcoin.price > 0) {
                    const qtyBought = order.valueToBuy / newBitcoin.price;
                    newBitcoin.qty = Number((newBitcoin.qty + qtyBought).toFixed(8)); 
                }
            } else if (cat.id === 'reserve') {
                newReserve.qty += order.valueToBuy;
            }
        });
    });

    setStocks(newStocks);
    setBitcoin(newBitcoin);
    setReserve(newReserve);
    setPlan(null);
    setContribution('');
    alert("Ordens Executadas com Sucesso. Portfólio Atualizado e Salvo.");
  };

  const handleLogin = () => {
      if(inputWalletId.trim().length < 4) {
          alert("Crie uma chave com pelo menos 4 caracteres para segurança mínima.");
          return;
      }
      setWalletId(inputWalletId.trim());
  };

  // --- TELA DE LOGIN (CARTEIRA ID) ---
  if (!walletId) {
      return (
          <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 text-slate-200 font-sans">
              <div className="w-full max-w-md bg-slate-900 p-8 rounded-2xl border border-slate-800 shadow-2xl">
                  <div className="flex justify-center mb-6">
                      <div className="bg-emerald-500/10 p-4 rounded-full">
                          <Lock className="w-10 h-10 text-emerald-500" />
                      </div>
                  </div>
                  <h1 className="text-2xl font-bold text-center text-white mb-2">Acesso à Carteira</h1>
                  <p className="text-slate-400 text-center mb-8 text-sm">
                      Para acessar seus dados em qualquer dispositivo, crie ou digite uma <strong>Chave Única</strong>.
                  </p>
                  
                  <div className="space-y-4">
                      <div>
                          <label className="text-xs uppercase font-bold text-slate-500 mb-2 block">Sua Chave Secreta</label>
                          <div className="relative">
                              <Key className="w-5 h-5 text-slate-500 absolute left-3 top-3" />
                              <input 
                                  type="text" 
                                  value={inputWalletId}
                                  onChange={(e) => setInputWalletId(e.target.value)}
                                  onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
                                  placeholder="Ex: pedro-invest-2025"
                                  className="w-full bg-slate-950 border border-slate-700 rounded-lg py-3 pl-10 pr-4 text-white focus:border-emerald-500 outline-none font-mono"
                              />
                          </div>
                      </div>
                      
                      <button 
                          onClick={handleLogin}
                          className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95"
                      >
                          Acessar Dashboard
                      </button>
                  </div>

                  <div className="mt-6 pt-6 border-t border-slate-800 text-center">
                      <p className="text-xs text-slate-500 flex items-center justify-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-yellow-600" />
                          <span>Atenção: Quem tiver esta chave acessa seus dados.</span>
                      </p>
                  </div>
              </div>
          </div>
      );
  }

  // --- TELA DE LOADING ---
  if (!dataLoaded) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center text-slate-400">
            <RefreshCw className="w-8 h-8 animate-spin text-emerald-500 mb-4" />
            <p>Sincronizando Carteira Brutal...</p>
        </div>
      );
  }

  // --- DASHBOARD ---
  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-emerald-500/30">
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b border-slate-800 pb-6 relative">
          <div>
            <div className="flex items-center gap-3 mb-1">
                <h1 className="text-3xl font-bold text-slate-100 tracking-tight">Triângulo de Fogo</h1>
                <span className="text-xs bg-slate-800 text-slate-400 px-2 py-1 rounded font-mono border border-slate-700 flex items-center gap-1">
                    <Key className="w-3 h-3" /> {walletId}
                </span>
            </div>
            <div className="flex items-center gap-3 mt-1">
                <p className="text-slate-500 text-sm">Conselheiro Brutal</p>
                {isCloudSaving ? (
                    <span className="text-[10px] text-emerald-500 flex items-center gap-1 animate-pulse"><RefreshCw className="w-3 h-3"/> Salvando...</span>
                ) : (
                    <span className="text-[10px] text-slate-600 flex items-center gap-1"><Cloud className="w-3 h-3"/> Salvo</span>
                )}
            </div>
          </div>
          <div className="mt-4 md:mt-0 flex items-center gap-2">
            <div className="flex gap-2">
                <button 
                    onClick={() => setShowConfig(!showConfig)}
                    className={`p-2 rounded-lg transition-all ${showConfig ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'}`}
                    title="Configurar API Token"
                >
                    <Settings className="w-4 h-4" />
                </button>
                <button 
                    onClick={fetchMarketPrices}
                    disabled={isLoading}
                    className="bg-slate-800 p-2 rounded-lg hover:bg-slate-700 hover:text-emerald-400 transition-all disabled:opacity-50 flex items-center gap-2 text-sm px-3 text-white font-medium"
                    title="Buscar Dados Reais"
                >
                    <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
                    {isLoading ? 'Buscando...' : 'Atualizar Agora'}
                </button>
                <button 
                    onClick={() => { setWalletId(''); setDataLoaded(false); }}
                    className="bg-slate-800 p-2 rounded-lg hover:bg-red-900/30 hover:text-red-400 transition-all text-slate-400"
                    title="Sair / Trocar Carteira"
                >
                    <LogOut className="w-4 h-4" />
                </button>
            </div>
          </div>

          {/* Config Panel Overlay */}
          {showConfig && (
            <div className="absolute top-full right-0 mt-2 p-4 bg-slate-900 border border-slate-700 rounded-lg shadow-xl z-50 w-80 animate-in fade-in slide-in-from-top-2">
                <h4 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                    <Lock className="w-4 h-4 text-emerald-500" /> Configuração API
                </h4>
                <p className="text-xs text-slate-400 mb-3 leading-relaxed">
                    Token Brapi para cotações de ações.
                </p>
                <input 
                    type="text" 
                    value={apiToken}
                    onChange={(e) => setApiToken(e.target.value)}
                    placeholder="Deixe vazio ou cole seu token"
                    className="w-full bg-slate-950 border border-slate-700 rounded px-3 py-2 text-slate-200 text-xs focus:border-emerald-500 outline-none font-mono"
                />
                <div className="mt-3 flex justify-end">
                    <button onClick={() => setShowConfig(false)} className="text-xs text-emerald-400 hover:text-emerald-300 font-bold">Salvar e Fechar</button>
                </div>
            </div>
          )}
        </header>

        {/* NEW: Summary & Quick Edit Section */}
        <div className="bg-slate-900 rounded-xl p-6 border border-emerald-500/20 shadow-lg mb-8 flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Total Portfolio */}
            <div className="flex-1 min-w-[200px]">
                <p className="text-xs text-slate-400 uppercase tracking-wider font-bold mb-1 flex items-center gap-2">
                    Patrimônio Total
                    {lastUpdate && (
                        <span className="text-[9px] font-normal text-slate-600 flex items-center gap-1">
                            {isDataSimulated ? <WifiOff className="w-3 h-3 text-yellow-600" /> : <Wifi className="w-3 h-3 text-emerald-600" />}
                            {lastUpdate.toLocaleTimeString().slice(0,5)}
                        </span>
                    )}
                </p>
                <p className="text-4xl font-bold text-white tracking-tight">{formatCurrency(totalPortfolio)}</p>
            </div>

            {/* Editable Fields Container */}
            <div className="flex-grow flex flex-wrap gap-4 justify-end">
                
                {/* Reserve (Editable) */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 min-w-[160px]">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <DollarSign className="w-3 h-3 text-blue-400" /> Caixa / Reserva
                        </label>
                        <Edit3 className="w-3 h-3 text-slate-600" />
                    </div>
                    <input 
                        type="number" 
                        value={reserve.qty}
                        onChange={(e) => setReserve({ ...reserve, qty: Number(e.target.value) })}
                        className="w-full bg-transparent text-white font-bold text-lg outline-none focus:border-b border-blue-500/50"
                    />
                </div>

                {/* BTC (Editable) */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 min-w-[160px]">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <Bitcoin className="w-3 h-3 text-amber-500" /> Qtd Bitcoin
                        </label>
                        <Edit3 className="w-3 h-3 text-slate-600" />
                    </div>
                    <input 
                        type="number" 
                        value={bitcoin.qty}
                        onChange={(e) => setBitcoin({ ...bitcoin, qty: Number(e.target.value) })}
                        className="w-full bg-transparent text-white font-bold text-lg outline-none focus:border-b border-amber-500/50"
                    />
                    <div className="text-[10px] text-slate-500 text-right mt-1">
                        = {formatCurrency(bitcoin.qty * bitcoin.price)}
                    </div>
                </div>

                {/* Stocks (Read Only) */}
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 min-w-[160px] opacity-80 cursor-not-allowed" title="Gerencie na lista abaixo">
                    <div className="flex justify-between items-center mb-1">
                        <label className="text-xs text-slate-400 font-medium flex items-center gap-1">
                            <TrendingUp className="w-3 h-3 text-emerald-500" /> Total Ações
                        </label>
                        <Lock className="w-3 h-3 text-slate-700" />
                    </div>
                    <div className="text-white font-bold text-lg py-0.5">
                        {formatCurrency(stockTotal)}
                    </div>
                </div>

            </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
          
          {/* 1. Alocação */}
          <div className="flex flex-col h-full">
            <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg h-full">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <PieIcon className="w-5 h-5 text-purple-400" /> Alocação Atual
              </h2>
              <div className="h-64 w-full relative">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={data}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {data.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                        contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', color: '#fff' }}
                        itemStyle={{ color: '#fff' }}
                        formatter={(value) => formatCurrency(value)}
                    />
                    <Legend verticalAlign="bottom" height={36}/>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none mb-8">
                    <span className="text-xs text-slate-500">Objetivo</span>
                    <div className="text-sm font-bold text-slate-300">33.3% Each</div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2">
                 {data.map(d => {
                     const pct = totalPortfolio > 0 ? (d.value / totalPortfolio) * 100 : 0;
                     const target = 33.33;
                     const diff = pct - target;
                     return (
                        <div key={d.name} className="flex flex-col items-center bg-slate-950 p-2 rounded border border-slate-800">
                            <span className="text-xs font-bold" style={{color: d.color}}>{d.name}</span>
                            <span className="text-slate-300 text-sm">{formatPercent(pct)}</span>
                            <span className={`text-[10px] px-1 rounded mt-1 ${Math.abs(diff) < 1 ? 'text-slate-500' : diff > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
                                {diff > 0 ? '+' : ''}{diff.toFixed(1)}%
                            </span>
                        </div>
                     )
                 })}
              </div>
            </div>
          </div>

          {/* 2. Ativos (Ações) */}
          <div className="flex flex-col h-full">
             <AssetSection 
                title="Ações (Stocks)" 
                icon={TrendingUp} 
                assets={stocks} 
                type="stocks" 
                onAdd={addStock}
                onRemove={removeStock}
                onUpdatePrice={updateStockPrice}
                onUpdateQty={updateStockQty}
             />
          </div>

          {/* 3. Aporte + Execução */}
          <div className="flex flex-col gap-4 h-full">
            
            {/* Se NÃO tiver plano, mostra input de aporte */}
            {!plan && (
                <div className="bg-gradient-to-br from-emerald-900/40 to-slate-900 rounded-xl p-6 border border-emerald-500/30 shadow-lg flex flex-col justify-center h-full">
                    <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-white">
                        <Wallet className="w-5 h-5 text-emerald-400" /> Novo Aporte Inteligente
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="text-sm text-slate-400 mb-1 block">Valor disponível para investir hoje</label>
                            <div className="relative">
                                <span className="absolute left-3 top-2.5 text-slate-500">R$</span>
                                <input 
                                    type="number" 
                                    value={contribution}
                                    onChange={(e) => setContribution(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg py-2 pl-10 pr-4 text-white focus:ring-2 focus:ring-emerald-500 outline-none text-lg font-mono"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                        <button 
                            onClick={calculateContribution}
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3 rounded-lg transition-all shadow-lg hover:shadow-emerald-500/20 active:scale-95 flex items-center justify-center gap-2"
                        >
                            <Target className="w-5 h-5" />
                            Calcular Rebalanceamento
                        </button>
                    </div>
                </div>
            )}

            {/* Se TIVER plano, mostra a Mesa de Operações */}
            {plan && (
                <div className="bg-slate-900 rounded-xl p-6 border-l-4 border-emerald-500 animate-in fade-in slide-in-from-top-4 duration-500 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div>
                             <h3 className="text-md font-bold text-white flex items-center gap-2">
                                <ArrowRight className="w-5 h-5 text-emerald-400" /> Mesa de Operações
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">Valores ajustados para forçar proporção igual.</p>
                        </div>
                       
                        <button onClick={() => setPlan(null)} className="text-slate-500 hover:text-slate-300 text-xs flex items-center gap-1">
                            <XCircle className="w-4 h-4"/> Cancelar
                        </button>
                    </div>
                    
                    <div className="space-y-4 overflow-y-auto flex-grow pr-1">
                        {plan.map((item, idx) => (
                            <div key={idx} className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                                <div className="flex justify-between items-center mb-2 pb-2 border-b border-slate-800">
                                    <span className="font-bold text-emerald-400 text-sm">{item.category}</span>
                                    <div className="flex items-center gap-3">
                                        <span className="text-white font-mono text-sm">{formatCurrency(item.totalAmount)}</span>
                                        <button 
                                            onClick={() => removePlanCategory(idx)}
                                            className="text-slate-600 hover:text-red-400"
                                            title="Remover Categoria Inteira"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    {item.details.map((detail, dIdx) => {
                                        const estimatedQty = detail.currentPrice > 0 ? detail.valueToBuy / detail.currentPrice : 0;
                                        const qtyDisplay = item.id === 'stocks' ? Math.floor(estimatedQty) : estimatedQty.toFixed(8);
                                        
                                        return (
                                            <div key={dIdx} className="flex justify-between text-xs items-center py-1 group hover:bg-slate-900/50 rounded">
                                                <span className={`w-16 ${detail.valueToBuy === 0 ? 'text-slate-600' : 'text-slate-300'}`}>
                                                    {detail.ticker}
                                                </span>
                                                <div className="flex-grow mx-2">
                                                    <div className="relative">
                                                        <span className="absolute left-1.5 top-1 text-slate-600 text-[10px]">R$</span>
                                                        <input 
                                                            type="number" 
                                                            value={detail.valueToBuy}
                                                            onChange={(e) => updatePlanValue(idx, dIdx, e.target.value)}
                                                            className={`w-full bg-slate-900 border border-slate-700 rounded px-1 pl-4 py-0.5 text-xs focus:border-emerald-500 outline-none ${detail.valueToBuy === 0 ? 'text-slate-600' : 'text-slate-200'}`}
                                                        />
                                                    </div>
                                                </div>
                                                <div className="text-right flex items-center gap-2">
                                                    <span className="text-slate-500 text-[10px] w-12 text-right">
                                                        ~{qtyDisplay} un
                                                    </span>
                                                    <button 
                                                        onClick={() => removePlanDetail(idx, dIdx)}
                                                        className="text-slate-700 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                                                    >
                                                        <XCircle className="w-3 h-3" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>

                    <button 
                        onClick={executeOrders}
                        className="w-full mt-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-2 rounded-lg transition-all flex items-center justify-center gap-2 text-sm"
                    >
                        <CheckCircle className="w-4 h-4" />
                        Confirmar e Executar Ordens
                    </button>
                </div>
            )}
          </div>

          {/* 4. Outros (BTC e Caixa) */}
          <div className="space-y-4 flex flex-col h-full">
             <div className="bg-slate-900 rounded-xl p-6 border border-slate-800 shadow-lg flex-grow">
                <h2 className="text-lg font-semibold mb-4 text-slate-100 flex items-center gap-2">
                    Outros Ativos
                </h2>
                <SimpleAssetInput 
                    title="Bitcoin" 
                    icon={Bitcoin}
                    qty={bitcoin.qty}
                    price={bitcoin.price}
                    onChangeQty={(v) => setBitcoin({...bitcoin, qty: v})}
                    onChangePrice={(v) => setBitcoin({...bitcoin, price: v})}
                />
                <SimpleAssetInput 
                    title="Reserva (Caixa)" 
                    icon={DollarSign}
                    qty={reserve.qty}
                    price={1}
                    onChangeQty={(v) => setReserve({...reserve, qty: v})}
                    onChangePrice={() => {}} 
                    isCurrency={true}
                />
             </div>
             
             <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-800 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 flex-shrink-0 mt-1" /> 
                <p className="text-xs text-slate-400 leading-relaxed">
                    <strong>Aviso:</strong> Para ações, é necessário inserir seu token da <a href="https://brapi.dev/" target="_blank" className="text-emerald-400 hover:underline">Brapi</a> no menu de configurações (ícone de engrenagem). Bitcoin usa API pública da CoinGecko.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}