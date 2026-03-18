'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw,
  TrendingUp,
  TrendingDown,
  ArrowRightLeft,
  AlertCircle,
  Loader2,
  DollarSign,
  Calculator,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface CryptoPriceData {
  usd: number;
  inr: number;
  npr: number;
  usd_24h_change: number;
}

interface PriceMap {
  [coinId: string]: CryptoPriceData;
}

type TabId = 'converter' | 'profit' | 'dca';
type ConvertDirection = 'cryptoToFiat' | 'fiatToCrypto';
type FiatCurrency = 'usd' | 'inr' | 'npr';
type DcaFrequency = 'daily' | 'weekly' | 'monthly';

// ---------------------------------------------------------------------------
// Crypto catalogue
// ---------------------------------------------------------------------------

interface CoinInfo {
  id: string;
  name: string;
  symbol: string;
  avatar: string;
}

const COINS: CoinInfo[] = [
  { id: 'bitcoin',           name: 'Bitcoin',           symbol: 'BTC',  avatar: '\u20BF' },
  { id: 'ethereum',          name: 'Ethereum',          symbol: 'ETH',  avatar: '\u039E' },
  { id: 'binancecoin',       name: 'BNB',               symbol: 'BNB',  avatar: 'B'  },
  { id: 'solana',            name: 'Solana',            symbol: 'SOL',  avatar: 'S'  },
  { id: 'cardano',           name: 'Cardano',           symbol: 'ADA',  avatar: 'A'  },
  { id: 'ripple',            name: 'XRP',               symbol: 'XRP',  avatar: 'X'  },
  { id: 'dogecoin',          name: 'Dogecoin',          symbol: 'DOGE', avatar: 'D'  },
  { id: 'polkadot',          name: 'Polkadot',          symbol: 'DOT',  avatar: '\u25C9' },
  { id: 'avalanche-2',       name: 'Avalanche',         symbol: 'AVAX', avatar: 'A'  },
  { id: 'chainlink',         name: 'Chainlink',         symbol: 'LINK', avatar: '\u2B21' },
  { id: 'litecoin',          name: 'Litecoin',          symbol: 'LTC',  avatar: '\u0141' },
  { id: 'tron',              name: 'TRON',              symbol: 'TRX',  avatar: 'T'  },
  { id: 'stellar',           name: 'Stellar',           symbol: 'XLM',  avatar: '*'  },
  { id: 'monero',            name: 'Monero',            symbol: 'XMR',  avatar: 'M'  },
  { id: 'cosmos',            name: 'Cosmos',            symbol: 'ATOM', avatar: '\u2699' },
  { id: 'near',              name: 'NEAR Protocol',     symbol: 'NEAR', avatar: 'N'  },
  { id: 'algorand',          name: 'Algorand',          symbol: 'ALGO', avatar: 'A'  },
  { id: 'vechain',           name: 'VeChain',           symbol: 'VET',  avatar: 'V'  },
  { id: 'filecoin',          name: 'Filecoin',          symbol: 'FIL',  avatar: 'F'  },
  { id: 'internet-computer', name: 'Internet Computer', symbol: 'ICP',  avatar: 'I'  },
];

const COIN_IDS = COINS.map((c) => c.id).join(',');

const FIAT_LABELS: Record<FiatCurrency, string> = {
  usd: 'USD',
  inr: 'INR',
  npr: 'NPR',
};

const FIAT_SYMBOLS: Record<FiatCurrency, string> = {
  usd: '$',
  inr: '\u20B9',
  npr: 'Rs.',
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(
  value: number,
  maximumFractionDigits = 6,
  minimumFractionDigits = 2,
): string {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}

function fmtFiat(value: number): string {
  return value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function getCoin(id: string): CoinInfo {
  return COINS.find((c) => c.id === id) ?? COINS[0];
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl bg-slate-800 p-4 h-20 w-full" />
  );
}

function CoinAvatar({ coin, size = 'md' }: { coin: CoinInfo; size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-11 h-11 text-base',
  };
  return (
    <span
      className={`inline-flex items-center justify-center rounded-full bg-indigo-600 font-bold text-white flex-shrink-0 ${sizeClasses[size]}`}
    >
      {coin.avatar}
    </span>
  );
}

function ChangeBadge({ change }: { change: number }) {
  const positive = change >= 0;
  return (
    <span
      className={`inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-semibold ${
        positive
          ? 'bg-emerald-500/20 text-emerald-400'
          : 'bg-red-500/20 text-red-400'
      }`}
    >
      {positive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
      {positive ? '+' : ''}
      {change.toFixed(2)}%
    </span>
  );
}

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const TABS: { id: TabId; label: string; icon: React.ReactNode }[] = [
  { id: 'converter', label: 'Converter',        icon: <ArrowRightLeft className="w-4 h-4" /> },
  { id: 'profit',   label: 'Profit / Loss',     icon: <DollarSign className="w-4 h-4" />     },
  { id: 'dca',      label: 'DCA Calculator',    icon: <Calculator className="w-4 h-4" />      },
];

// ---------------------------------------------------------------------------
// Coin Dropdown (reusable)
// ---------------------------------------------------------------------------

function CoinDropdown({
  selectedCoin,
  onSelect,
  prices,
}: {
  selectedCoin: string;
  onSelect: (id: string) => void;
  prices: PriceMap;
}) {
  const [coinSearch, setCoinSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);

  const coin = getCoin(selectedCoin);
  const priceData = prices[selectedCoin];

  const filteredCoins = COINS.filter(
    (c) =>
      c.name.toLowerCase().includes(coinSearch.toLowerCase()) ||
      c.symbol.toLowerCase().includes(coinSearch.toLowerCase()),
  );

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-slate-300 mb-1">
        Select Cryptocurrency
      </label>
      <button
        type="button"
        onClick={() => setShowDropdown((v) => !v)}
        className="w-full flex items-center gap-3 rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-left hover:border-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <CoinAvatar coin={coin} size="sm" />
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-white truncate">{coin.name}</p>
          <p className="text-xs text-slate-400">{coin.symbol}</p>
        </div>
        {priceData && (
          <div className="text-right flex-shrink-0">
            <p className="text-sm font-semibold text-white">${fmtFiat(priceData.usd)}</p>
            <ChangeBadge change={priceData.usd_24h_change} />
          </div>
        )}
        <svg className="w-4 h-4 text-slate-400 ml-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 11.085l3.71-3.755a.75.75 0 111.08 1.04l-4.25 4.3a.75.75 0 01-1.08 0l-4.25-4.3a.75.75 0 01.02-1.06z" clipRule="evenodd" />
        </svg>
      </button>

      {showDropdown && (
        <div className="absolute z-20 mt-2 w-full rounded-xl bg-slate-800 border border-slate-700 shadow-2xl overflow-hidden">
          <div className="p-2 border-b border-slate-700">
            <input
              type="text"
              placeholder="Search coin..."
              value={coinSearch}
              onChange={(e) => setCoinSearch(e.target.value)}
              className="w-full rounded-lg bg-slate-700 px-3 py-2 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              autoFocus
            />
          </div>
          <ul className="max-h-64 overflow-y-auto">
            {filteredCoins.length === 0 && (
              <li className="px-4 py-3 text-sm text-slate-400">No coins found.</li>
            )}
            {filteredCoins.map((c) => {
              const pd = prices[c.id];
              return (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => {
                      onSelect(c.id);
                      setCoinSearch('');
                      setShowDropdown(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 hover:bg-slate-700 transition-colors text-left ${
                      selectedCoin === c.id ? 'bg-slate-700' : ''
                    }`}
                  >
                    <CoinAvatar coin={c} size="sm" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-white truncate">{c.name}</p>
                      <p className="text-xs text-slate-400">{c.symbol}</p>
                    </div>
                    {pd && (
                      <div className="text-right flex-shrink-0">
                        <p className="text-xs text-slate-300">${fmtFiat(pd.usd)}</p>
                        <ChangeBadge change={pd.usd_24h_change} />
                      </div>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Converter Tab
// ---------------------------------------------------------------------------

function ConverterTab({ prices }: { prices: PriceMap }) {
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [direction, setDirection] = useState<ConvertDirection>('cryptoToFiat');
  const [fiatCurrency, setFiatCurrency] = useState<FiatCurrency>('usd');
  const [cryptoAmount, setCryptoAmount] = useState<string>('1');
  const [fiatAmount, setFiatAmount] = useState<string>('');

  const coin = getCoin(selectedCoin);
  const priceData = prices[selectedCoin];

  const cryptoVal = parseFloat(cryptoAmount) || 0;
  const fiatVal = parseFloat(fiatAmount) || 0;
  const priceInFiat = priceData ? priceData[fiatCurrency] : 0;
  const computedCryptoFromFiat = priceInFiat > 0 ? fiatVal / priceInFiat : 0;

  return (
    <div className="space-y-6">
      <CoinDropdown selectedCoin={selectedCoin} onSelect={setSelectedCoin} prices={prices} />

      {/* Fiat currency selector */}
      <div>
        <label className="block text-sm font-medium text-slate-300 mb-1">Fiat Currency</label>
        <div className="flex gap-2">
          {(Object.keys(FIAT_LABELS) as FiatCurrency[]).map((fc) => (
            <button
              key={fc}
              type="button"
              onClick={() => setFiatCurrency(fc)}
              className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${
                fiatCurrency === fc
                  ? 'bg-indigo-600 text-white'
                  : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500'
              }`}
            >
              {FIAT_SYMBOLS[fc]} {FIAT_LABELS[fc]}
            </button>
          ))}
        </div>
      </div>

      {/* Input fields */}
      <div className="space-y-3">
        <div className={`rounded-xl border p-4 transition-colors ${direction === 'cryptoToFiat' ? 'border-indigo-500 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}>
          <label className="block text-xs font-medium text-slate-400 mb-1">{coin.symbol} Amount</label>
          <input
            type="number" min="0" step="any"
            value={cryptoAmount}
            onChange={(e) => { setCryptoAmount(e.target.value); setDirection('cryptoToFiat'); }}
            onFocus={() => setDirection('cryptoToFiat')}
            placeholder="0.00"
            className="w-full bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
          />
        </div>

        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setDirection((d) => (d === 'cryptoToFiat' ? 'fiatToCrypto' : 'cryptoToFiat'))}
            className="flex items-center gap-2 rounded-full bg-slate-800 border border-slate-700 px-4 py-1.5 text-sm text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors"
          >
            <ArrowRightLeft className="w-4 h-4" /> Swap
          </button>
        </div>

        <div className={`rounded-xl border p-4 transition-colors ${direction === 'fiatToCrypto' ? 'border-indigo-500 bg-slate-800' : 'border-slate-700 bg-slate-800/50'}`}>
          <label className="block text-xs font-medium text-slate-400 mb-1">{FIAT_LABELS[fiatCurrency]} Amount</label>
          <input
            type="number" min="0" step="any"
            value={fiatAmount}
            onChange={(e) => { setFiatAmount(e.target.value); setDirection('fiatToCrypto'); }}
            onFocus={() => setDirection('fiatToCrypto')}
            placeholder="0.00"
            className="w-full bg-transparent text-2xl font-bold text-white placeholder-slate-600 focus:outline-none"
          />
        </div>
      </div>

      {/* Results */}
      {priceData && (
        <div className="rounded-xl bg-gradient-to-br from-indigo-900/40 to-slate-800 border border-indigo-500/30 p-5 space-y-4">
          <p className="text-sm font-semibold text-indigo-400 uppercase tracking-wider">
            {direction === 'cryptoToFiat'
              ? `${fmt(cryptoVal, 8, 0)} ${coin.symbol} equals`
              : `${FIAT_SYMBOLS[fiatCurrency]}${fmtFiat(fiatVal)} ${FIAT_LABELS[fiatCurrency]} buys`}
          </p>

          {direction === 'cryptoToFiat' ? (
            <div className="space-y-3">
              {(['usd', 'inr', 'npr'] as FiatCurrency[]).map((fc) => (
                <div key={fc} className={`flex items-center justify-between rounded-lg px-4 py-2.5 ${fiatCurrency === fc ? 'bg-indigo-600/20 border border-indigo-500/40' : 'bg-slate-700/40'}`}>
                  <span className="text-sm font-medium text-slate-300">{FIAT_LABELS[fc]}</span>
                  <span className={`text-base font-bold ${fiatCurrency === fc ? 'text-indigo-300' : 'text-white'}`}>
                    {FIAT_SYMBOLS[fc]}{fmtFiat(cryptoVal * priceData[fc])}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-2">
              <p className="text-3xl font-extrabold text-white">
                {fmt(computedCryptoFromFiat, 8, 4)} {coin.symbol}
              </p>
              <p className="text-sm text-slate-400 mt-1">
                @ {FIAT_SYMBOLS[fiatCurrency]}{fmtFiat(priceInFiat)} per {coin.symbol}
              </p>
            </div>
          )}
        </div>
      )}

      {/* All-currency quick view */}
      {priceData && direction === 'cryptoToFiat' && (
        <div className="grid grid-cols-3 gap-3">
          {(Object.keys(FIAT_LABELS) as FiatCurrency[]).map((fc) => (
            <div key={fc} className="rounded-lg bg-slate-800 border border-slate-700 p-3 text-center">
              <p className="text-xs text-slate-400 mb-1">{FIAT_LABELS[fc]}</p>
              <p className="text-sm font-bold text-white">{FIAT_SYMBOLS[fc]}{fmtFiat(priceData[fc])}</p>
              <p className="text-xs text-slate-500 mt-0.5">per {coin.symbol}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Profit / Loss Tab
// ---------------------------------------------------------------------------

function ProfitLossTab({ prices }: { prices: PriceMap }) {
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [buyPrice, setBuyPrice] = useState<string>('');
  const [sellPrice, setSellPrice] = useState<string>('');
  const [quantity, setQuantity] = useState<string>('1');

  const coin = getCoin(selectedCoin);
  const priceData = prices[selectedCoin];

  function fillCurrentPrice(field: 'buy' | 'sell') {
    if (!priceData) return;
    if (field === 'buy') setBuyPrice(String(priceData.usd));
    else setSellPrice(String(priceData.usd));
  }

  const buy = parseFloat(buyPrice) || 0;
  const sell = parseFloat(sellPrice) || 0;
  const qty = parseFloat(quantity) || 0;

  const investedUSD = buy * qty;
  const currentValUSD = sell * qty;
  const profitUSD = currentValUSD - investedUSD;
  const roi = investedUSD > 0 ? (profitUSD / investedUSD) * 100 : 0;
  const isProfit = profitUSD >= 0;

  const inrRate = priceData ? priceData.inr / priceData.usd : 83;
  const profitINR = profitUSD * inrRate;
  const investedINR = investedUSD * inrRate;
  const currentValINR = currentValUSD * inrRate;

  const hasResult = buy > 0 && sell > 0 && qty > 0;

  return (
    <div className="space-y-5">
      <CoinDropdown selectedCoin={selectedCoin} onSelect={setSelectedCoin} prices={prices} />

      {/* Inputs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-400">Buy Price (USD)</label>
            <button type="button" onClick={() => fillCurrentPrice('buy')} className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">Use current</button>
          </div>
          <input type="number" min="0" step="any" value={buyPrice} onChange={(e) => setBuyPrice(e.target.value)} placeholder="e.g. 30000" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-medium text-slate-400">Sell Price (USD)</label>
            <button type="button" onClick={() => fillCurrentPrice('sell')} className="text-xs text-indigo-400 hover:text-indigo-300 underline underline-offset-2 transition-colors">Use current</button>
          </div>
          <input type="number" min="0" step="any" value={sellPrice} onChange={(e) => setSellPrice(e.target.value)} placeholder="e.g. 45000" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Quantity ({coin.symbol})</label>
          <input type="number" min="0" step="any" value={quantity} onChange={(e) => setQuantity(e.target.value)} placeholder="1" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>

      {/* Result card */}
      {hasResult && (
        <div className={`rounded-xl border p-5 space-y-4 ${isProfit ? 'border-emerald-500/40 bg-emerald-900/20' : 'border-red-500/40 bg-red-900/20'}`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isProfit ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
              {isProfit ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">{isProfit ? 'Profitable Trade' : 'Loss-Making Trade'}</p>
              <p className={`text-2xl font-extrabold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>{isProfit ? '+' : ''}{fmt(roi, 2, 2)}%</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatBox label="Investment" valueUSD={`$${fmtFiat(investedUSD)}`} valueINR={`\u20B9${fmtFiat(investedINR)}`} />
            <StatBox label="Current Value" valueUSD={`$${fmtFiat(currentValUSD)}`} valueINR={`\u20B9${fmtFiat(currentValINR)}`} />
            <StatBox label={isProfit ? 'Profit' : 'Loss'} valueUSD={`${isProfit ? '+' : ''}$${fmtFiat(Math.abs(profitUSD))}`} valueINR={`${isProfit ? '+' : ''}\u20B9${fmtFiat(Math.abs(profitINR))}`} highlight positive={isProfit} />
            <StatBox label="ROI" valueUSD={`${isProfit ? '+' : ''}${fmt(roi, 2, 2)}%`} valueINR="" highlight positive={isProfit} />
          </div>

          <div className="rounded-lg bg-slate-800/60 p-3 text-sm space-y-1.5">
            <PriceCompRow label="Buy price" val={`$${fmtFiat(buy)}`} />
            <PriceCompRow label="Sell price" val={`$${fmtFiat(sell)}`} />
            <PriceCompRow label="Quantity" val={`${fmt(qty, 8, 0)} ${coin.symbol}`} />
            <PriceCompRow label="Price change" val={`${isProfit ? '+' : ''}$${fmtFiat(sell - buy)} per coin`} />
          </div>
        </div>
      )}

      {!hasResult && (
        <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-500 text-sm">
          Fill in buy price, sell price, and quantity to see your profit/loss calculation.
        </div>
      )}
    </div>
  );
}

function StatBox({ label, valueUSD, valueINR, highlight, positive }: { label: string; valueUSD: string; valueINR: string; highlight?: boolean; positive?: boolean }) {
  const textColor = highlight ? (positive ? 'text-emerald-400' : 'text-red-400') : 'text-white';
  return (
    <div className="rounded-lg bg-slate-800/60 p-3">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-base font-bold ${textColor}`}>{valueUSD}</p>
      {valueINR && <p className="text-xs text-slate-400 mt-0.5">{valueINR}</p>}
    </div>
  );
}

function PriceCompRow({ label, val }: { label: string; val: string }) {
  return (
    <div className="flex justify-between">
      <span className="text-slate-400">{label}</span>
      <span className="text-white font-medium">{val}</span>
    </div>
  );
}

// ---------------------------------------------------------------------------
// DCA Tab
// ---------------------------------------------------------------------------

function DCATab({ prices }: { prices: PriceMap }) {
  const [selectedCoin, setSelectedCoin] = useState<string>('bitcoin');
  const [investAmount, setInvestAmount] = useState<string>('100');
  const [frequency, setFrequency] = useState<DcaFrequency>('weekly');
  const [numPeriods, setNumPeriods] = useState<string>('52');
  const [manualPrice, setManualPrice] = useState<string>('');
  const [useCurrentPrice, setUseCurrentPrice] = useState<boolean>(true);

  const coin = getCoin(selectedCoin);
  const priceData = prices[selectedCoin];

  useEffect(() => {
    setUseCurrentPrice(true);
    setManualPrice('');
  }, [selectedCoin]);

  const currentPrice = priceData?.usd ?? 0;
  const entryPrice = useCurrentPrice ? currentPrice : (parseFloat(manualPrice) || 0);
  const perPeriod = parseFloat(investAmount) || 0;
  const periods = parseInt(numPeriods, 10) || 0;
  const totalInvested = perPeriod * periods;
  const coinsPerPeriod = entryPrice > 0 ? perPeriod / entryPrice : 0;
  const totalCoins = coinsPerPeriod * periods;
  const avgBuyPrice = entryPrice;
  const currentValue = totalCoins * currentPrice;
  const profitLoss = currentValue - totalInvested;
  const roi = totalInvested > 0 ? (profitLoss / totalInvested) * 100 : 0;
  const isProfit = profitLoss >= 0;
  const inrRate = priceData ? priceData.inr / priceData.usd : 83;
  const totalInvestedINR = totalInvested * inrRate;
  const currentValueINR = currentValue * inrRate;
  const profitLossINR = profitLoss * inrRate;

  const FREQ_LABELS: Record<DcaFrequency, string> = { daily: 'Daily', weekly: 'Weekly', monthly: 'Monthly' };
  const FREQ_DEFAULTS: Record<DcaFrequency, string> = { daily: '365', weekly: '52', monthly: '12' };

  function handleFrequencyChange(f: DcaFrequency) {
    setFrequency(f);
    setNumPeriods(FREQ_DEFAULTS[f]);
  }

  const hasResult = perPeriod > 0 && periods > 0 && entryPrice > 0;

  return (
    <div className="space-y-5">
      <CoinDropdown selectedCoin={selectedCoin} onSelect={setSelectedCoin} prices={prices} />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Investment Per Period (USD)</label>
          <input type="number" min="0" step="any" value={investAmount} onChange={(e) => setInvestAmount(e.target.value)} placeholder="100" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-xs font-medium text-slate-400 mb-1">Number of Periods</label>
          <input type="number" min="1" step="1" value={numPeriods} onChange={(e) => setNumPeriods(e.target.value)} placeholder="52" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        </div>
      </div>

      <div>
        <label className="block text-xs font-medium text-slate-400 mb-2">Frequency</label>
        <div className="flex gap-2">
          {(Object.keys(FREQ_LABELS) as DcaFrequency[]).map((f) => (
            <button key={f} type="button" onClick={() => handleFrequencyChange(f)} className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${frequency === f ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-300 border border-slate-700 hover:border-indigo-500'}`}>
              {FREQ_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-medium text-slate-400">Entry Price (USD per {coin.symbol})</label>
          <button type="button" onClick={() => setUseCurrentPrice((v) => !v)} className={`text-xs font-medium transition-colors ${useCurrentPrice ? 'text-indigo-400' : 'text-slate-400 hover:text-slate-300'}`}>
            {useCurrentPrice ? '\u2713 Using live price' : 'Use live price'}
          </button>
        </div>
        {useCurrentPrice ? (
          <div className="rounded-xl bg-slate-800 border border-indigo-500/50 px-4 py-3 flex items-center justify-between">
            <span className="text-white font-semibold">${priceData ? fmtFiat(priceData.usd) : '\u2014'}</span>
            <span className="text-xs text-indigo-400">Live price</span>
          </div>
        ) : (
          <input type="number" min="0" step="any" value={manualPrice} onChange={(e) => setManualPrice(e.target.value)} placeholder="Enter price manually" className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent" />
        )}
      </div>

      {hasResult && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <SummaryCard label="Total Invested" value={`$${fmtFiat(totalInvested)}`} sub={`\u20B9${fmtFiat(totalInvestedINR)}`} />
            <SummaryCard label="Total Coins" value={fmt(totalCoins, 8, 4)} sub={coin.symbol} />
            <SummaryCard label="Avg Buy Price" value={`$${fmtFiat(avgBuyPrice)}`} sub="per coin" />
            <SummaryCard label="Current Value" value={`$${fmtFiat(currentValue)}`} sub={`\u20B9${fmtFiat(currentValueINR)}`} />
          </div>

          <div className={`rounded-xl p-5 flex flex-col sm:flex-row sm:items-center gap-4 ${isProfit ? 'bg-emerald-900/25 border border-emerald-500/30' : 'bg-red-900/25 border border-red-500/30'}`}>
            <div className="flex items-center gap-3 flex-1">
              <div className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center ${isProfit ? 'bg-emerald-500/20' : 'bg-red-500/20'}`}>
                {isProfit ? <TrendingUp className="w-5 h-5 text-emerald-400" /> : <TrendingDown className="w-5 h-5 text-red-400" />}
              </div>
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-wider">{isProfit ? 'Unrealised Gain' : 'Unrealised Loss'}</p>
                <p className={`text-xl font-extrabold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>{isProfit ? '+' : ''}${fmtFiat(profitLoss)}</p>
                <p className={`text-sm ${isProfit ? 'text-emerald-500' : 'text-red-500'}`}>{'\u20B9'}{fmtFiat(Math.abs(profitLossINR))} {isProfit ? 'profit' : 'loss'}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-400">ROI</p>
              <p className={`text-3xl font-extrabold ${isProfit ? 'text-emerald-400' : 'text-red-400'}`}>{isProfit ? '+' : ''}{fmt(roi, 2, 2)}%</p>
            </div>
          </div>

          <div className="rounded-xl bg-slate-800 border border-slate-700 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left">
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider">Metric</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">USD</th>
                  <th className="px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">INR</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/60">
                {[
                  { metric: `${FREQ_LABELS[frequency]} investment`, usd: `$${fmtFiat(perPeriod)}`, inr: `\u20B9${fmtFiat(perPeriod * inrRate)}` },
                  { metric: `Periods (${FREQ_LABELS[frequency].toLowerCase()})`, usd: String(periods), inr: '\u2014' },
                  { metric: 'Total invested', usd: `$${fmtFiat(totalInvested)}`, inr: `\u20B9${fmtFiat(totalInvestedINR)}` },
                  { metric: `${coin.symbol} per period`, usd: `${fmt(coinsPerPeriod, 8, 4)} ${coin.symbol}`, inr: '\u2014' },
                  { metric: `Total ${coin.symbol} accumulated`, usd: `${fmt(totalCoins, 8, 4)} ${coin.symbol}`, inr: '\u2014' },
                  { metric: 'Average buy price', usd: `$${fmtFiat(avgBuyPrice)}`, inr: `\u20B9${fmtFiat(avgBuyPrice * inrRate)}` },
                  { metric: 'Current price', usd: `$${fmtFiat(currentPrice)}`, inr: `\u20B9${fmtFiat(currentPrice * inrRate)}` },
                  { metric: 'Portfolio value', usd: `$${fmtFiat(currentValue)}`, inr: `\u20B9${fmtFiat(currentValueINR)}` },
                  { metric: isProfit ? 'Total profit' : 'Total loss', usd: `${isProfit ? '+' : ''}$${fmtFiat(Math.abs(profitLoss))}`, inr: `${isProfit ? '+' : ''}\u20B9${fmtFiat(Math.abs(profitLossINR))}`, colored: true },
                  { metric: 'ROI', usd: `${isProfit ? '+' : ''}${fmt(roi, 2, 2)}%`, inr: '\u2014', colored: true },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-700/30 transition-colors">
                    <td className="px-4 py-3 text-slate-300">{row.metric}</td>
                    <td className={`px-4 py-3 text-right font-medium ${row.colored ? (isProfit ? 'text-emerald-400' : 'text-red-400') : 'text-white'}`}>{row.usd}</td>
                    <td className={`px-4 py-3 text-right font-medium ${row.colored ? (isProfit ? 'text-emerald-400' : 'text-red-400') : 'text-slate-300'}`}>{row.inr}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-slate-500 text-center">
            * DCA results assume a constant entry price equal to the current live price. Actual returns vary as price changes between purchase periods. This is not financial advice.
          </p>
        </div>
      )}

      {!hasResult && (
        <div className="rounded-xl border border-dashed border-slate-700 p-6 text-center text-slate-500 text-sm">
          Fill in the investment amount and number of periods to see your DCA projection.
        </div>
      )}
    </div>
  );
}

function SummaryCard({ label, value, sub }: { label: string; value: string; sub: string }) {
  return (
    <div className="rounded-xl bg-slate-800 border border-slate-700 p-3">
      <p className="text-xs text-slate-400 mb-1 truncate">{label}</p>
      <p className="text-base font-bold text-white truncate">{value}</p>
      <p className="text-xs text-slate-500 mt-0.5 truncate">{sub}</p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Price strip
// ---------------------------------------------------------------------------

function PriceStrip({ prices }: { prices: PriceMap }) {
  return (
    <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">
      {COINS.slice(0, 8).map((coin) => {
        const pd = prices[coin.id];
        if (!pd) return null;
        return (
          <div key={coin.id} className="flex-shrink-0 flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2">
            <CoinAvatar coin={coin} size="sm" />
            <div>
              <p className="text-xs text-slate-400">{coin.symbol}</p>
              <p className="text-sm font-semibold text-white">${fmtFiat(pd.usd)}</p>
            </div>
            <ChangeBadge change={pd.usd_24h_change} />
          </div>
        );
      })}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function CryptocurrencyCalculatorTool() {
  const [activeTab, setActiveTab] = useState<TabId>('converter');
  const [prices, setPrices] = useState<PriceMap>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [secondsAgo, setSecondsAgo] = useState<number>(0);
  const [refreshing, setRefreshing] = useState<boolean>(false);

  const fetchPrices = useCallback(async () => {
    setRefreshing(true);
    setError(null);
    try {
      const url = `https://api.coingecko.com/api/v3/simple/price?ids=${COIN_IDS}&vs_currencies=usd,inr,npr&include_24hr_change=true`;
      const res = await fetch(url);
      if (!res.ok) throw new Error(`CoinGecko API error: ${res.status} ${res.statusText}`);
      const raw = await res.json();

      const normalised: PriceMap = {};
      for (const c of COINS) {
        const d = raw[c.id];
        if (d) {
          normalised[c.id] = {
            usd: d.usd ?? 0,
            inr: d.inr ?? 0,
            npr: d.npr ?? 0,
            usd_24h_change: d.usd_24h_change ?? 0,
          };
        }
      }
      setPrices(normalised);
      setLastUpdated(new Date());
      setSecondsAgo(0);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to fetch prices.';
      setError(msg);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { fetchPrices(); }, [fetchPrices]);

  useEffect(() => {
    if (!lastUpdated) return;
    const interval = setInterval(() => {
      setSecondsAgo(Math.floor((Date.now() - lastUpdated.getTime()) / 1000));
    }, 1000);
    return () => clearInterval(interval);
  }, [lastUpdated]);

  const hasPrices = Object.keys(prices).length > 0;

  return (
    <div className="w-full max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-400" />
            Cryptocurrency Calculator
          </h2>
          <p className="text-sm text-slate-400 mt-0.5">Live prices &middot; USD &middot; INR &middot; NPR</p>
        </div>
        <div className="flex items-center gap-3">
          {lastUpdated && !error && (
            <span className="text-xs text-slate-500">Updated {secondsAgo}s ago</span>
          )}
          <button
            type="button" onClick={fetchPrices} disabled={refreshing}
            className="flex items-center gap-2 rounded-lg bg-slate-800 border border-slate-700 px-3 py-2 text-sm font-medium text-slate-300 hover:border-indigo-500 hover:text-indigo-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
      </div>

      {/* Loading */}
      {loading && !hasPrices && (
        <div className="space-y-3">
          <div className="flex items-center gap-3 text-slate-400 text-sm">
            <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
            Fetching live prices from CoinGecko&hellip;
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="rounded-xl border border-red-500/40 bg-red-900/20 p-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-red-300">Failed to load prices</p>
            <p className="text-xs text-red-400 mt-0.5 break-all">{error}</p>
          </div>
          <button type="button" onClick={fetchPrices} className="flex-shrink-0 rounded-lg bg-red-500/20 border border-red-500/40 px-3 py-1.5 text-sm font-medium text-red-300 hover:bg-red-500/30 transition-colors">Retry</button>
        </div>
      )}

      {hasPrices && <PriceStrip prices={prices} />}

      {hasPrices && (
        <div className="space-y-5">
          <div className="flex rounded-xl bg-slate-800 border border-slate-700 p-1 gap-1">
            {TABS.map((tab) => (
              <button
                key={tab.id} type="button" onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 rounded-lg py-2 text-sm font-medium transition-all ${activeTab === tab.id ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400 hover:text-slate-200'}`}
              >
                {tab.icon}
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.id === 'converter' ? 'Convert' : tab.id === 'profit' ? 'P/L' : 'DCA'}</span>
              </button>
            ))}
          </div>
          <div className="rounded-xl bg-slate-900/60 border border-slate-800 p-5">
            {activeTab === 'converter' && <ConverterTab prices={prices} />}
            {activeTab === 'profit' && <ProfitLossTab prices={prices} />}
            {activeTab === 'dca' && <DCATab prices={prices} />}
          </div>
        </div>
      )}

      {hasPrices && (
        <p className="text-xs text-slate-600 text-center">
          Prices sourced from CoinGecko. This tool is for informational purposes only and does not constitute financial advice. Cryptocurrency investments are subject to high market risk.
        </p>
      )}
    </div>
  );
}
