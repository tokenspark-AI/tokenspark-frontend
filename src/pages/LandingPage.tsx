import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Zap, Cpu, Wallet, ArrowRight, ChevronRight, CheckCircle2,
  TrendingUp, Shield, Globe, Code2, Bot, Activity, Clock,
  DollarSign, User, Users, Menu, X, Sparkles,
} from 'lucide-react'

function LandingPage() {
  const navigate = useNavigate()
  const [scrollY, setScrollY] = useState(0)
  const [activeFlowStep, setActiveFlowStep] = useState(0)
  const [hoveredModel, setHoveredModel] = useState<string | null>(null)
  const [demoInput, setDemoInput] = useState('claude-3-opus')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const interval = setInterval(() => setActiveFlowStep((prev) => (prev + 1) % 7), 2000)
    return () => clearInterval(interval)
  }, [])

  const models = [
    { name: 'GPT-4.1', input: '$12', output: '$36', latency: '1.2s', reliability: '99.9%', provider: 'OpenAI', status: 'healthy' },
    { name: 'Claude 3 Opus', input: '$15', output: '$75', latency: '1.8s', reliability: '99.7%', provider: 'Anthropic', status: 'healthy' },
    { name: 'Gemini Ultra', input: '$10', output: '$30', latency: '0.9s', reliability: '99.5%', provider: 'Google', status: 'healthy' },
    { name: 'Llama 3.1 405B', input: '$4', output: '$12', latency: '2.1s', reliability: '98.9%', provider: 'Meta', status: 'degraded' },
    { name: 'Mistral Large', input: '$8', output: '$24', latency: '1.1s', reliability: '99.8%', provider: 'Mistral', status: 'healthy' },
    { name: 'DeepSeek V3', input: '$2', output: '$6', latency: '1.5s', reliability: '99.2%', provider: 'DeepSeek', status: 'healthy' },
  ]

  const agents = [
    { name: 'Code Agent', desc: 'Code generation & review', price: '$0.02/exec', success: '98.5%', time: '3.2s', users: '12.4k' },
    { name: 'Research Agent', desc: 'Deep research & analysis', price: '$0.05/task', success: '96.8%', time: '45s', users: '8.7k' },
    { name: 'Marketing Agent', desc: 'Content & campaign creation', price: '$0.03/task', success: '97.2%', time: '12s', users: '6.3k' },
    { name: 'Data Agent', desc: 'ETL & data pipeline', price: '$0.04/job', success: '99.1%', time: '8s', users: '5.1k' },
  ]

  const flowSteps = [
    { icon: User, label: 'Request', color: '#7C5CFF' },
    { icon: ArrowRight, label: 'Route', color: '#7C5CFF' },
    { icon: Zap, label: 'Model', color: '#00D4FF' },
    { icon: Bot, label: 'Execute', color: '#00D4FF' },
    { icon: DollarSign, label: 'Bill', color: '#10B981' },
    { icon: Activity, label: 'Ledger', color: '#10B981' },
    { icon: CheckCircle2, label: 'Settle', color: '#10B981' },
  ]

  return (
    <div className="min-h-screen bg-[#05070B] text-[#EDEDED] overflow-hidden">
      {/* Background grid */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03]">
        <div className="absolute inset-0" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />
      </div>

      {/* Glow orbs */}
      <div className="fixed top-0 left-1/4 w-96 h-96 bg-[#7C5CFF]/10 rounded-full blur-[128px] pointer-events-none" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-[#00D4FF]/10 rounded-full blur-[128px] pointer-events-none" />

      {/* NAV */}
      <nav className="relative z-50 flex justify-between items-center px-6 lg:px-12 py-4 border-b border-white/[0.06] backdrop-blur-xl bg-[#05070B]/70 sticky top-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center"><Zap className="h-4 w-4 text-white" /></div>
          <span className="text-lg font-semibold tracking-tight">词元闪耀</span>
        </div>
        <div className="hidden md:flex gap-8 text-sm text-white/50">
          <a href="#models" className="hover:text-white transition-colors">Models</a>
          <a href="#agents" className="hover:text-white transition-colors">Agents</a>
          <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
          <a href="#docs" className="hover:text-white transition-colors">Docs</a>
        </div>
        <div className="hidden md:flex gap-3">
          <button onClick={() => navigate('/login')} className="px-4 py-2 text-sm text-white/70 hover:text-white transition-colors">Login</button>
          <button onClick={() => navigate('/register')} className="px-5 py-2 text-sm bg-white text-[#05070B] rounded-md font-medium hover:bg-white/90 transition-all">Get Started</button>
        </div>
        <button className="md:hidden p-2 text-white/70 hover:text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-[#05070B]/95 backdrop-blur-xl md:hidden pt-20 px-6">
          <div className="flex flex-col gap-6 text-lg">
            <a href="#models" className="text-white/70 hover:text-white py-3 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>Models</a>
            <a href="#agents" className="text-white/70 hover:text-white py-3 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>Agents</a>
            <a href="#pricing" className="text-white/70 hover:text-white py-3 border-b border-white/10" onClick={() => setMobileMenuOpen(false)}>Pricing</a>
            <button onClick={() => { navigate('/login'); setMobileMenuOpen(false) }} className="text-left text-white/70 hover:text-white py-3 border-b border-white/10">Login</button>
            <button onClick={() => { navigate('/register'); setMobileMenuOpen(false) }} className="mt-4 px-6 py-3 bg-white text-[#05070B] rounded-lg font-medium">Get Started</button>
          </div>
        </div>
      )}

      {/* HERO */}
      <section className="relative py-32 lg:py-44 px-6 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/5 text-xs text-[#7C5CFF] mb-8">
            <Activity className="h-3 w-3" /> AI Infrastructure
          </div>
          <h1 className="text-5xl lg:text-7xl font-semibold leading-[1.1] tracking-tight">
            The unified AI infrastructure<br />
            <span className="bg-gradient-to-r from-[#7C5CFF] to-[#00D4FF] bg-clip-text text-transparent">for models and agents.</span>
          </h1>
          <p className="text-white/50 mt-8 text-lg lg:text-xl max-w-2xl mx-auto leading-relaxed">
            One API to access every model. One system to run every AI agent. One economy layer to connect them.
          </p>
          <div className="mt-12 flex justify-center gap-3 max-w-xl mx-auto">
            <div className="flex-1 relative">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-xs text-white/30 font-mono">POST /v1/chat</div>
              <input value={demoInput} onChange={(e) => setDemoInput(e.target.value)} className="w-full pl-28 pr-4 py-3.5 rounded-lg bg-white/[0.04] border border-white/[0.08] text-sm font-mono focus:outline-none focus:border-[#7C5CFF]/50 transition-colors" placeholder='model: "claude-3-opus"' />
            </div>
            <button className="px-6 py-3.5 bg-[#7C5CFF] rounded-lg font-medium hover:bg-[#7C5CFF]/90 transition-all hover:shadow-[0_0_20px_rgba(124,92,255,0.3)] whitespace-nowrap">Run API</button>
          </div>
          <div className="mt-8 flex justify-center gap-4">
            <button className="px-6 py-2.5 border border-white/10 rounded-md text-sm text-white/70 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"><Code2 className="h-4 w-4" /> View Models</button>
            <button className="px-6 py-2.5 border border-white/10 rounded-md text-sm text-white/70 hover:text-white hover:border-white/20 transition-all flex items-center gap-2"><Bot className="h-4 w-4" /> Explore Agents</button>
          </div>

          {/* 3-Panel Product Mockup */}
          <div className="mt-20 grid grid-cols-1 lg:grid-cols-3 gap-4 max-w-5xl mx-auto">
            <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-xs text-white/40 font-mono">Model Router</span></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">GPT-4.1</span><span className="text-xs text-emerald-400 font-mono">12ms</span></div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">Claude 3</span><span className="text-xs text-emerald-400 font-mono">18ms</span></div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">Gemini Ultra</span><span className="text-xs text-amber-400 font-mono">45ms</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06]"><p className="text-xs text-white/30">Auto-routing by cost & latency</p></div>
            </div>
            <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4"><Bot className="h-3 w-3 text-[#00D4FF]" /><span className="text-xs text-white/40 font-mono">Agent Marketplace</span></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">Code Agent</span><span className="text-xs text-white/30">$0.02/exec</span></div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">Research</span><span className="text-xs text-white/30">$0.05/task</span></div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">Marketing</span><span className="text-xs text-white/30">$0.03/task</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06]"><p className="text-xs text-white/30">Deploy agents in 1 click</p></div>
            </div>
            <div className="p-5 rounded-xl border border-white/[0.08] bg-white/[0.02] backdrop-blur-sm">
              <div className="flex items-center gap-2 mb-4"><Wallet className="h-3 w-3 text-[#10B981]" /><span className="text-xs text-white/40 font-mono">Billing & Ledger</span></div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">Balance</span><span className="text-xs text-emerald-400 font-mono">$2,847</span></div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">Today</span><span className="text-xs font-mono">$42.50</span></div>
                <div className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.04]"><span className="text-xs">Settled</span><span className="text-xs text-[#7C5CFF] font-mono">T+0</span></div>
              </div>
              <div className="mt-4 pt-3 border-t border-white/[0.06]"><p className="text-xs text-white/30">Real-time double-entry ledger</p></div>
            </div>
          </div>
        </div>
      </section>

      {/* THREE CORE LAYERS */}
      <section className="px-8 lg:px-16 py-24">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-5">
          <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#7C5CFF]/30 transition-all duration-500 hover:bg-white/[0.04]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#7C5CFF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-[#7C5CFF]/10 flex items-center justify-center mb-6"><Cpu className="h-5 w-5 text-[#7C5CFF]" /></div>
              <h3 className="text-lg font-semibold mb-3">Model Layer</h3>
              <p className="text-white/50 text-sm leading-relaxed">GPT / Claude / Gemini unified API with automatic routing, fallback system, and real-time pricing.</p>
              <div className="mt-6 flex flex-wrap gap-2">{['OpenAI', 'Anthropic', 'Google', 'Meta'].map((p) => (<span key={p} className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-white/40">{p}</span>))}</div>
            </div>
          </div>
          <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#00D4FF]/30 transition-all duration-500 hover:bg-white/[0.04]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#00D4FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center mb-6"><Bot className="h-5 w-5 text-[#00D4FF]" /></div>
              <h3 className="text-lg font-semibold mb-3">Agent Layer</h3>
              <p className="text-white/50 text-sm leading-relaxed">Agent marketplace with task execution, agent-to-agent calls, and automated workflow orchestration.</p>
              <div className="mt-6 flex flex-wrap gap-2">{['Code', 'Research', 'Marketing', 'Data'].map((a) => (<span key={a} className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-white/40">{a}</span>))}</div>
            </div>
          </div>
          <div className="group relative p-8 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-[#10B981]/30 transition-all duration-500 hover:bg-white/[0.04]">
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#10B981]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-10 h-10 rounded-lg bg-[#10B981]/10 flex items-center justify-center mb-6"><Wallet className="h-5 w-5 text-[#10B981]" /></div>
              <h3 className="text-lg font-semibold mb-3">Financial Layer</h3>
              <p className="text-white/50 text-sm leading-relaxed">Wallet, billing, double-entry ledger and settlement system. Every transaction is traceable.</p>
              <div className="mt-6 flex flex-wrap gap-2">{['Wallet', 'Ledger', 'Settlement', 'Stripe'].map((f) => (<span key={f} className="px-2.5 py-1 rounded-md bg-white/[0.04] text-xs text-white/40">{f}</span>))}</div>
            </div>
          </div>
        </div>
      </section>

      {/* TAGLINE */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-3xl lg:text-4xl font-semibold leading-tight tracking-tight">
            TokenSpark is the <span className="bg-gradient-to-r from-[#7C5CFF] via-[#00D4FF] to-[#10B981] bg-clip-text text-transparent">operating system</span><br />for the AI economy.
          </p>
        </div>
      </section>

      {/* LOGO STRIP */}
      <section className="py-16 px-6 border-y border-white/[0.06] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <p className="text-center text-xs text-white/30 uppercase tracking-widest mb-10">Trusted by AI teams building with</p>
          <div className="flex flex-wrap justify-center items-center gap-8 lg:gap-16 opacity-40">
            {['OpenAI', 'Anthropic', 'Google', 'Meta', 'Mistral', 'DeepSeek', 'Cohere', 'Groq'].map((brand) => (<div key={brand} className="text-sm font-semibold tracking-wider text-white/60 hover:text-white/80 transition-colors cursor-default">{brand}</div>))}
          </div>
        </div>
      </section>

      {/* STATS */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { value: '150+', label: 'Models Available', icon: Cpu },
            { value: '50K+', label: 'API Calls / Day', icon: Activity },
            { value: '99.9%', label: 'Uptime SLA', icon: Shield },
            { value: '12K+', label: 'Active Developers', icon: Users },
          ].map((stat, i) => {
            const Icon = stat.icon
            return (
              <div key={i} className="text-center">
                <Icon className="h-5 w-5 text-[#7C5CFF] mx-auto mb-3 opacity-60" />
                <p className="text-3xl lg:text-4xl font-semibold">{stat.value}</p>
                <p className="text-xs text-white/40 mt-2">{stat.label}</p>
              </div>
            )
          })}
        </div>
      </section>

      {/* FLOW ANIMATION */}
      <section className="py-20 px-8 lg:px-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm text-white/40 uppercase tracking-wider mb-2">How it works</p>
            <h2 className="text-2xl font-semibold">From Request to Settlement</h2>
          </div>
          <div className="flex items-center justify-between gap-2 lg:gap-4">
            {flowSteps.map((step, i) => {
              const Icon = step.icon
              const isActive = i === activeFlowStep
              const isCompleted = i < activeFlowStep
              return (
                <div key={i} className={`flex flex-col items-center transition-all duration-500 ${isActive ? 'scale-110' : 'scale-100'}`}>
                  <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl flex items-center justify-center transition-all duration-500 ${isActive ? 'shadow-lg' : isCompleted ? 'opacity-70' : 'opacity-30'}`} style={{ background: isActive ? `${step.color}20` : 'rgba(255,255,255,0.03)', border: `1px solid ${isActive ? step.color + '50' : 'rgba(255,255,255,0.06)'}`, boxShadow: isActive ? `0 0 20px ${step.color}30` : 'none' }}>
                    <Icon className="h-5 w-5 lg:h-6 lg:w-6" style={{ color: isActive ? step.color : 'rgba(255,255,255,0.4)' }} />
                  </div>
                  <span className={`mt-3 text-xs font-medium transition-colors ${isActive ? 'text-white' : 'text-white/30'}`}>{step.label}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* MODELS SECTION */}
      <section id="models" className="py-24 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div><p className="text-sm text-white/40 uppercase tracking-wider mb-2">Model Marketplace</p><h2 className="text-2xl font-semibold">Unified Model Access</h2></div>
            <button className="text-sm text-[#7C5CFF] hover:text-[#7C5CFF]/80 transition-colors flex items-center gap-1">View all models <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {models.map((model) => (
              <div key={model.name} onMouseEnter={() => setHoveredModel(model.name)} onMouseLeave={() => setHoveredModel(null)} className={`p-5 rounded-xl border transition-all duration-300 cursor-pointer ${hoveredModel === model.name ? 'border-[#7C5CFF]/30 bg-[#7C5CFF]/5' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-white/[0.06] flex items-center justify-center"><Cpu className="h-4 w-4 text-white/50" /></div>
                    <div><p className="text-sm font-medium">{model.name}</p><p className="text-xs text-white/40">{model.provider}</p></div>
                  </div>
                  <div className={`w-2 h-2 rounded-full ${model.status === 'healthy' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                </div>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div><p className="text-white/30 mb-0.5">Input</p><p className="font-mono">{model.input} / 1M</p></div>
                  <div><p className="text-white/30 mb-0.5">Output</p><p className="font-mono">{model.output} / 1M</p></div>
                  <div><p className="text-white/30 mb-0.5">Latency</p><p className="font-mono">{model.latency}</p></div>
                  <div><p className="text-white/30 mb-0.5">Reliability</p><p className="font-mono">{model.reliability}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AGENTS SECTION */}
      <section id="agents" className="py-24 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-end justify-between mb-10">
            <div><p className="text-sm text-white/40 uppercase tracking-wider mb-2">Agent Marketplace</p><h2 className="text-2xl font-semibold">AI Agents Ready to Deploy</h2></div>
            <button className="text-sm text-[#00D4FF] hover:text-[#00D4FF]/80 transition-colors flex items-center gap-1">Browse agents <ChevronRight className="h-4 w-4" /></button>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {agents.map((agent) => (
              <div key={agent.name} className="group p-5 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-[#00D4FF]/30 hover:bg-[#00D4FF]/5 transition-all duration-300 cursor-pointer">
                <div className="w-10 h-10 rounded-lg bg-white/[0.06] flex items-center justify-center mb-4 group-hover:bg-[#00D4FF]/10 transition-colors"><Bot className="h-5 w-5 text-white/50 group-hover:text-[#00D4FF] transition-colors" /></div>
                <p className="text-sm font-medium mb-1">{agent.name}</p>
                <p className="text-xs text-white/40 mb-4">{agent.desc}</p>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span className="text-white/30">Price</span><span className="font-mono text-white/70">{agent.price}</span></div>
                  <div className="flex justify-between"><span className="text-white/30">Success</span><span className="font-mono text-emerald-400">{agent.success}</span></div>
                  <div className="flex justify-between"><span className="text-white/30">Avg Time</span><span className="font-mono text-white/70">{agent.time}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNER / DISTRIBUTION SECTION */}
      <section className="py-24 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-10 lg:p-16 rounded-3xl border border-white/[0.06] bg-gradient-to-br from-[#7C5CFF]/5 via-transparent to-[#00D4FF]/5 overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFF]/10 rounded-full blur-[100px]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4"><Globe className="h-5 w-5 text-[#7C5CFF]" /><p className="text-sm text-white/40 uppercase tracking-wider">Partner Network</p></div>
              <h2 className="text-3xl lg:text-4xl font-semibold mb-4">Build your own AI revenue network.</h2>
              <p className="text-white/50 text-lg mb-10 max-w-xl">Invite users, earn commission. Multi-level partner system with real-time settlement.</p>
              <div className="grid sm:grid-cols-3 gap-6 mb-10">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#7C5CFF]/10 flex items-center justify-center flex-shrink-0"><TrendingUp className="h-4 w-4 text-[#7C5CFF]" /></div>
                  <div><p className="text-sm font-medium mb-1">Consume to Earn</p><p className="text-xs text-white/40">Commission based on real usage, not referrals</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#00D4FF]/10 flex items-center justify-center flex-shrink-0"><Shield className="h-4 w-4 text-[#00D4FF]" /></div>
                  <div><p className="text-sm font-medium mb-1">Multi-Level</p><p className="text-xs text-white/40">L1 Partner (10-20%) + L2 Sub Partner (3-8%)</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#10B981]/10 flex items-center justify-center flex-shrink-0"><Clock className="h-4 w-4 text-[#10B981]" /></div>
                  <div><p className="text-sm font-medium mb-1">T+0 Settlement</p><p className="text-xs text-white/40">Real-time payout via Stripe / Alipay / USDT</p></div>
                </div>
              </div>
              <button className="px-6 py-3 bg-[#7C5CFF] rounded-lg font-medium hover:bg-[#7C5CFF]/90 transition-all hover:shadow-[0_0_20px_rgba(124,92,255,0.3)] flex items-center gap-2">Become a Partner <ArrowRight className="h-4 w-4" /></button>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-sm text-white/40 uppercase tracking-wider mb-2">Pricing</p>
          <h2 className="text-2xl font-semibold mb-4">Transparent Pricing</h2>
          <p className="text-white/50 max-w-xl mx-auto mb-12">Pay only for what you use. No subscriptions, no hidden fees. Unified rate card across all models and agents.</p>
          <div className="grid md:grid-cols-3 gap-4 text-left">
            {[
              { tier: 'Free', price: '$0', tokens: '1M tokens/mo', features: ['Community models', 'Basic routing', 'Email support'] },
              { tier: 'Pro', price: 'Pay-as-you-go', tokens: 'All models', features: ['Priority routing', 'Fallback system', 'Agent access', 'Analytics'], popular: true },
              { tier: 'Enterprise', price: 'Custom', tokens: 'Volume pricing', features: ['Dedicated support', 'SLA guarantee', 'White-label', 'Custom billing'] },
            ].map((plan) => (
              <div key={plan.tier} className={`p-6 rounded-xl border transition-all ${plan.popular ? 'border-[#7C5CFF]/30 bg-[#7C5CFF]/5' : 'border-white/[0.06] bg-white/[0.02]'}`}>
                {plan.popular && <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#7C5CFF]/20 text-xs text-[#7C5CFF] mb-3">Popular</span>}
                <p className="text-lg font-semibold">{plan.tier}</p>
                <p className="text-2xl font-semibold mt-2 mb-1">{plan.price}</p>
                <p className="text-xs text-white/40 mb-6">{plan.tokens}</p>
                <ul className="space-y-2">
                  {plan.features.map((f) => (<li key={f} className="flex items-center gap-2 text-sm text-white/60"><CheckCircle2 className="h-4 w-4 text-[#7C5CFF] flex-shrink-0" />{f}</li>))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-8 lg:px-16">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl lg:text-4xl font-semibold mb-4">开始使用词元闪耀</h2>
          <p className="text-white/50 text-lg mb-8">一个 API 密钥，所有模型，所有智能体。</p>
          <div className="flex justify-center gap-4">
            <button onClick={() => navigate('/register')} className="px-8 py-3.5 bg-white text-[#05070B] rounded-lg font-medium hover:bg-white/90 transition-all">免费开始</button>
            <button className="px-8 py-3.5 border border-white/10 rounded-lg text-sm text-white/70 hover:text-white hover:border-white/20 transition-all">阅读文档</button>
          </div>
        </div>
      </section>

      {/* PARTNER APPLY MODULE - Footer Section */}
      <section className="py-16 px-8 lg:px-16 border-t border-white/[0.06]">
        <div className="max-w-4xl mx-auto">
          <div className="relative p-10 lg:p-14 rounded-2xl border border-[#7C5CFF]/20 bg-gradient-to-br from-[#7C5CFF]/5 via-transparent to-[#00D4FF]/5">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#7C5CFF]/10 rounded-full blur-[100px]" />
            <div className="relative">
              <div className="flex items-center gap-2 mb-4"><Globe className="h-5 w-5 text-[#7C5CFF]" /><p className="text-sm text-[#7C5CFF]/70 uppercase tracking-wider">合作伙伴计划</p></div>
              <h2 className="text-2xl lg:text-3xl font-semibold mb-3">成为 Partner（代理计划）</h2>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#7C5CFF]/30 bg-[#7C5CFF]/10 text-sm text-[#7C5CFF] mb-6">
                <span className="font-semibold">$10</span> 一次性激活费
              </div>
              <p className="text-white/50 text-sm mb-8">适合开发者、工作室、AI 应用团队，将 AI 能力变现。</p>

              <div className="grid sm:grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white/80 flex items-center gap-2"><CheckCircle2 className="h-4 w-4 text-emerald-400" />你将获得</h3>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-start gap-2"><span className="text-[#7C5CFF] mt-0.5">•</span>Reseller API 权限</li>
                    <li className="flex items-start gap-2"><span className="text-[#7C5CFF] mt-0.5">•</span>独立控制台（Partner Dashboard）</li>
                    <li className="flex items-start gap-2"><span className="text-[#7C5CFF] mt-0.5">•</span>自定义 API 加价能力（Markup）</li>
                    <li className="flex items-start gap-2"><span className="text-[#7C5CFF] mt-0.5">•</span>可创建下级代理（可选）</li>
                    <li className="flex items-start gap-2"><span className="text-[#7C5CFF] mt-0.5">•</span>实时收益统计</li>
                    <li className="flex items-start gap-2"><span className="text-[#7C5CFF] mt-0.5">•</span>利润分账系统</li>
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-semibold mb-3 text-white/80 flex items-center gap-2"><TrendingUp className="h-4 w-4 text-[#00D4FF]" />收益模式</h3>
                  <ul className="space-y-2 text-sm text-white/50">
                    <li className="flex items-start gap-2"><span className="text-[#00D4FF] mt-0.5">•</span>以平台成本价采购 Token</li>
                    <li className="flex items-start gap-2"><span className="text-[#00D4FF] mt-0.5">•</span>自行定价对外销售</li>
                    <li className="flex items-start gap-2"><span className="text-[#00D4FF] mt-0.5">•</span>赚取中间差价</li>
                    <li className="flex items-start gap-2"><span className="text-[#00D4FF] mt-0.5">•</span>下级使用可获得分成</li>
                  </ul>
                  <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-xs text-white/40 mb-2 font-medium">示例：</p>
                    <div className="space-y-1 text-xs font-mono">
                      <div className="flex justify-between"><span className="text-white/40">平台成本</span><span>$1 / 100万 tokens</span></div>
                      <div className="flex justify-between"><span className="text-white/40">你的售价</span><span className="text-[#00D4FF]">$2.5 / 100万 tokens</span></div>
                      <div className="flex justify-between border-t border-white/[0.06] pt-1"><span className="text-white/60">利润</span><span className="text-emerald-400 font-semibold">$1.5 / 100万 tokens</span></div>
                    </div>
                  </div>
                </div>
              </div>

              <button className="w-full sm:w-auto px-8 py-3.5 bg-[#7C5CFF] rounded-lg font-medium hover:bg-[#7C5CFF]/90 transition-all hover:shadow-[0_0_20px_rgba(124,92,255,0.3)] flex items-center justify-center gap-2">
                立即申请 Partner 权限 <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-white/[0.06] py-12 px-8 lg:px-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-10">
            <div><p className="text-sm font-medium mb-4">产品</p><ul className="space-y-2 text-xs text-white/40"><li><a href="#" className="hover:text-white/60 transition-colors">模型市场</a></li><li><a href="#" className="hover:text-white/60 transition-colors">智能体</a></li><li><a href="#" className="hover:text-white/60 transition-colors">定价</a></li><li><a href="#" className="hover:text-white/60 transition-colors">更新日志</a></li></ul></div>
            <div><p className="text-sm font-medium mb-4">资源</p><ul className="space-y-2 text-xs text-white/40"><li><a href="#" className="hover:text-white/60 transition-colors">API 文档</a></li><li><a href="#" className="hover:text-white/60 transition-colors">SDK</a></li><li><a href="#" className="hover:text-white/60 transition-colors">指南</a></li><li><a href="#" className="hover:text-white/60 transition-colors">博客</a></li></ul></div>
            <div><p className="text-sm font-medium mb-4">公司</p><ul className="space-y-2 text-xs text-white/40"><li><a href="#" className="hover:text-white/60 transition-colors">关于我们</a></li><li><a href="#" className="hover:text-white/60 transition-colors">招聘</a></li><li><a href="#" className="hover:text-white/60 transition-colors">合作伙伴</a></li><li><a href="#" className="hover:text-white/60 transition-colors">联系我们</a></li></ul></div>
            <div><p className="text-sm font-medium mb-4">法律</p><ul className="space-y-2 text-xs text-white/40"><li><a href="#" className="hover:text-white/60 transition-colors">隐私政策</a></li><li><a href="#" className="hover:text-white/60 transition-colors">服务条款</a></li><li><a href="#" className="hover:text-white/60 transition-colors">安全</a></li><li><a href="#" className="hover:text-white/60 transition-colors">服务状态</a></li></ul></div>
          </div>
          <div className="border-t border-white/[0.06] pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-[#7C5CFF]" /><span className="text-sm font-medium">词元闪耀</span></div>
            <p className="text-xs text-white/30">© 2026 词元闪耀. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
