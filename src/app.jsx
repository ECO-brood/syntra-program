import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { DollarSign, Users, Server, Activity, Shield, Cpu, Heart } from 'lucide-react';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg p-6 ${className}`}>
    {children}
  </div>
);

const Slider = ({ label, value, onChange, min, max, step = 1, unit = "" }) => (
  <div className="mb-4">
    <div className="flex justify-between mb-1">
      <span className="text-sm font-medium text-slate-600">{label}</span>
      <span className="text-sm font-bold text-slate-800">{unit}{value.toLocaleString()}</span>
    </div>
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
    />
  </div>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('startup');

  // State Variables
  const [devComplexity, setDevComplexity] = useState(2); // 1: MVP, 2: Mid, 3: High
  const [users, setUsers] = useState(1000);
  const [psychiatrists, setPsychiatrists] = useState(5);
  const [premiumPrice, setPremiumPrice] = useState(19.99);
  const [conversionRate, setConversionRate] = useState(5); // Percent of users on Premium
  const [aiHeavy, setAiHeavy] = useState(true); // Is the AI doing deep analysis?

  // Derived Calculations
  const devCost = devComplexity === 1 ? 75000 : devComplexity === 2 ? 150000 : 350000;
  const legalCost = 25000 + (psychiatrists * 500); // Base legal + onboarding
  const marketingCost = users * 15; // CAC estimate

  const totalStartup = devCost + legalCost + marketingCost + 20000; // 20k contingency

  // Monthly Costs
  // AI Cost: 1000 users * 30 days * 20 msgs * $0.002 per msg (blended)
  const aiCostPerUser = aiHeavy ? 1.50 : 0.50;
  const serverBase = 500;
  const serverCost = serverBase + (users * 0.10) + (users * aiCostPerUser);
  
  // Psychiatrist: Assuming platform takes 20%, we don't pay them salary, we pay them per session.
  // But we need a retainer or verification admin cost.
  const psychAdminCost = psychiatrists * 300; 
  
  const totalMonthlyBurn = serverCost + psychAdminCost + 5000; // 5k generic opex

  // Revenue
  const premiumUsers = Math.floor(users * (conversionRate / 100));
  const monthlyRevenue = premiumUsers * premiumPrice;
  
  const profit = monthlyRevenue - totalMonthlyBurn;

  // Chart Data
  const startupData = [
    { name: 'Development', value: devCost },
    { name: 'Legal & Compliance', value: legalCost },
    { name: 'Marketing (Launch)', value: marketingCost },
    { name: 'Contingency', value: 20000 },
  ];

  const burnData = [
    { name: 'AI & Server', value: serverCost },
    { name: 'Psych Network Admin', value: psychAdminCost },
    { name: 'Operations', value: 5000 },
  ];

  // Break-even projection
  const generateProjection = () => {
    const data = [];
    for (let i = 0; i <= 12; i++) {
      const u = users + (i * (users * 0.15)); // 15% growth
      const pUsers = Math.floor(u * (conversionRate / 100));
      const rev = pUsers * premiumPrice;
      const cost = 5500 + (u * 0.10) + (u * aiCostPerUser) + psychAdminCost;
      data.push({
        month: `Month ${i}`,
        Revenue: Math.round(rev),
        Cost: Math.round(cost),
        Profit: Math.round(rev - cost)
      });
    }
    return data;
  };

  const projectionData = generateProjection();

  return (
    <div className="min-h-screen bg-slate-50 p-6 font-sans text-slate-800">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 flex items-center gap-2">
          <Activity className="text-blue-600" /> Syntra Financial Command
        </h1>
        <p className="text-slate-600 mt-2">Estimate costs for the "Social Catalyst" rollout.</p>
      </header>

      {/* Navigation */}
      <div className="flex gap-4 mb-8">
        <button 
          onClick={() => setActiveTab('startup')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'startup' ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          Startup CapEx
        </button>
        <button 
          onClick={() => setActiveTab('operational')}
          className={`px-6 py-2 rounded-full font-medium transition-all ${activeTab === 'operational' ? 'bg-green-600 text-white shadow-md' : 'bg-white text-slate-600 hover:bg-slate-100'}`}
        >
          Monthly OpEx & Profit
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Controls Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <h3 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Cpu className="w-5 h-5 text-purple-500" /> Configuration
            </h3>
            
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Development Scale</label>
                <div className="flex gap-2 text-xs mb-2">
                  <span className={`flex-1 p-2 rounded cursor-pointer text-center border ${devComplexity === 1 ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-slate-200'}`} onClick={() => setDevComplexity(1)}>MVP</span>
                  <span className={`flex-1 p-2 rounded cursor-pointer text-center border ${devComplexity === 2 ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-slate-200'}`} onClick={() => setDevComplexity(2)}>Standard</span>
                  <span className={`flex-1 p-2 rounded cursor-pointer text-center border ${devComplexity === 3 ? 'bg-blue-100 border-blue-500 text-blue-700' : 'border-slate-200'}`} onClick={() => setDevComplexity(3)}>Enterprise</span>
                </div>
                <p className="text-xs text-slate-500">
                  {devComplexity === 1 ? "Basic Chat + Profile" : devComplexity === 2 ? "Video + AI Matches + Payments" : "Full VR/AR + Advanced Clinical Tools"}
                </p>
              </div>

              <Slider label="Initial Users" value={users} onChange={setUsers} min={500} max={50000} step={500} />
              <Slider label="Active Psychiatrists" value={psychiatrists} onChange={setPsychiatrists} min={0} max={50} step={1} />
              
              <div className="pt-4 border-t border-slate-100">
                <h4 className="text-sm font-bold text-slate-900 mb-4">Premium Strategy</h4>
                <Slider label="Subscription Price" value={premiumPrice} onChange={setPremiumPrice} min={4.99} max={49.99} step={1} unit="$" />
                <Slider label="Conversion Rate" value={conversionRate} onChange={setConversionRate} min={1} max={20} step={0.5} unit="%" />
                
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm font-medium text-slate-700">Deep AI Matching</span>
                  <button 
                    onClick={() => setAiHeavy(!aiHeavy)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${aiHeavy ? 'bg-blue-600' : 'bg-slate-300'}`}
                  >
                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${aiHeavy ? 'translate-x-6' : 'translate-x-1'}`} />
                  </button>
                </div>
                <p className="text-xs text-slate-500 mt-2">
                  Enables the "Soul-Sync" feature (higher server cost).
                </p>
              </div>
            </div>
          </Card>

          {/* KPI Card */}
          <div className="grid grid-cols-2 gap-4">
             <Card className="flex flex-col items-center justify-center p-4">
                <span className="text-slate-500 text-xs uppercase font-bold">Premium Users</span>
                <span className="text-2xl font-bold text-blue-600">{premiumUsers.toLocaleString()}</span>
             </Card>
             <Card className="flex flex-col items-center justify-center p-4">
                <span className="text-slate-500 text-xs uppercase font-bold">Monthly Burn</span>
                <span className="text-2xl font-bold text-red-500">${Math.round(totalMonthlyBurn).toLocaleString()}</span>
             </Card>
          </div>
        </div>

        {/* Charts Panel */}
        <div className="lg:col-span-2 space-y-6">
          
          {activeTab === 'startup' && (
            <Card>
              <h3 className="text-xl font-bold mb-4 flex justify-between">
                <span>Total Capital Required</span>
                <span className="text-blue-600">${totalStartup.toLocaleString()}</span>
              </h3>
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={startupData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {startupData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-bold text-sm text-slate-500">Legal Note</div>
                  <p className="text-xs mt-1">Includes initial HIPAA audit and GDPR setup. Does not include defense litigation fund.</p>
                </div>
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="font-bold text-sm text-slate-500">Dev Note</div>
                  <p className="text-xs mt-1">
                    {devComplexity === 3 ? "Includes Native iOS/Android apps + Web." : "React Native / Cross-platform approach."}
                  </p>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'operational' && (
            <>
              <Card>
                <div className="flex justify-between items-end mb-4">
                    <div>
                        <h3 className="text-xl font-bold">12-Month Projection</h3>
                        <p className="text-sm text-slate-500">Revenue vs Costs based on organic growth</p>
                    </div>
                    <div className="text-right">
                        <div className="text-sm text-slate-500">Projected MRR (Month 12)</div>
                        <div className="text-2xl font-bold text-green-600">${projectionData[12].Revenue.toLocaleString()}</div>
                    </div>
                </div>
                <div className="h-64 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={projectionData}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                      <XAxis dataKey="month" hide />
                      <YAxis />
                      <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                      <Legend />
                      <Line type="monotone" dataKey="Revenue" stroke="#10b981" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="Cost" stroke="#ef4444" strokeWidth={3} dot={false} />
                      <Line type="monotone" dataKey="Profit" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <Card>
                    <h4 className="font-bold text-slate-700 mb-4">Monthly Burn Breakdown</h4>
                    <div className="h-40">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={burnData} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                            <XAxis type="number" hide />
                            <YAxis dataKey="name" type="category" width={100} tick={{fontSize: 10}} />
                            <Tooltip formatter={(value) => `$${value.toLocaleString()}`} />
                            <Bar dataKey="value" fill="#ef4444" radius={[0, 4, 4, 0]} />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                 </Card>
                 <Card className="bg-gradient-to-br from-indigo-600 to-purple-700 text-white">
                    <h4 className="font-bold opacity-90 mb-2 flex items-center gap-2">
                        <Heart className="w-4 h-4" /> The "Social Catalyst"
                    </h4>
                    <p className="text-sm opacity-80 mb-4">
                        Cost per premium user calculation:
                    </p>
                    <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-white/20 pb-1">
                            <span>Deep Match Processing</span>
                            <span>${aiHeavy ? '1.20' : '0.20'}</span>
                        </div>
                        <div className="flex justify-between border-b border-white/20 pb-1">
                            <span>Chat Storage</span>
                            <span>$0.15</span>
                        </div>
                        <div className="flex justify-between font-bold pt-1">
                            <span>Margin @ ${premiumPrice}</span>
                            <span>{Math.round(((premiumPrice - (aiHeavy ? 1.35 : 0.35)) / premiumPrice) * 100)}%</span>
                        </div>
                    </div>
                 </Card>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
