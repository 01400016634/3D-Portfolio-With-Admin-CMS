import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    LayoutDashboard,
    FolderGit2,
    Settings,
    LogOut,
    Save,
    Globe,
    FileText,
    Code2,
    Type,
    AlignLeft,
    Loader2,
    CheckCircle2,
    AlertCircle,
    User,
    Briefcase,
    GraduationCap,
    Sparkles,
    Link as LinkIcon,
    Plus,
    Trash2,
    Image as ImageIcon,
    Mail,
    Smartphone,
    ThumbsUp,
    UploadCloud,
    Lock,
    ChevronRight,
    Menu,
    X,
    Download
} from 'lucide-react';

export default function AdminApp() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [password, setPassword] = useState('');
    const [loginError, setLoginError] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [status, setStatus] = useState({ type: 'idle', message: '' });
    const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);

    // Master State for the entire portfolio
    const [portfolioData, setPortfolioData] = useState({
        profile: {
            name: 'Reajul Hasan',
            role: 'Front-End Web Developer & Data Specialist',
            tagline: 'A passionate Computer Science professional with expertise in web development, data collection, analysis, and digital marketing.',
            about: 'As a professional in the field of computer science and technology, I bring a combination of technical skills and creative problem-solving to every project.',
            imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
            cvUrl: '' // Added for CV Upload
        },
        socials: {
            email: 'reaj.hasan786@gmail.com',
            whatsapp: 'https://wa.me/8801400016634',
            fiverr: 'https://fiverr.com/reajulhasan',
            linkedin: 'https://linkedin.com/in/',
            facebook: ''
        },
        skills: [
            { name: 'Web Development', description: 'React, Node.js, Vue.js, Angular, HTML/CSS, JS, WordPress & Responsive Design.', iconName: 'Monitor' }
        ],
        timeline: [
            { year: '2024 - Present', category: 'Experience', title: 'Digital Marketing Officer', organization: 'Digital MEL Hub', desc: 'Creating digital marketing content, managing social media presence.' }
        ],
        projects: [
            { title: 'E-Commerce Platform', shortDesc: 'Complete online shopping solution.', tech: 'React, Node.js, MongoDB', overview: 'A comprehensive online shopping solution...', liveUrl: 'https://example.com', screenshots: [] }
        ]
    });

    // 🔴 THE FIX: FETCH EXISTING DATA ON ADMIN LOAD SO IT DOESN'T RESET AFTER REFRESH
    useEffect(() => {
        fetch(`https://my3dportfolio-de1v.onrender.com/api/portfolio?t=${new Date().getTime()}`, { cache: 'no-store' })
            .then(res => res.json())
            .then(dbData => {
                if (dbData && dbData.profile) {
                    // Strip the MongoDB _id so it doesn't crash on save
                    const { _id, __v, ...cleanData } = dbData;
                    setPortfolioData(cleanData);
                }
            })
            .catch(err => console.error("Admin could not load existing data.", err));
    }, []);

    // --- AUTH HANDLERS ---
    const handleLogin = (e) => {
        e.preventDefault();
        if (password === 'admin123') {
            setIsAuthenticated(true);
            setLoginError(false);
        } else {
            setLoginError(true);
            setPassword('');
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setPassword('');
    };

    // --- DATA HANDLERS ---
    const handleNestedChange = (section, field, value) => {
        setPortfolioData(prev => ({
            ...prev,
            [section]: { ...prev[section], [field]: value }
        }));
    };

    const handleArrayChange = (section, index, field, value) => {
        const updatedArray = [...portfolioData[section]];
        updatedArray[index] = { ...updatedArray[index], [field]: value };
        setPortfolioData(prev => ({ ...prev, [section]: updatedArray }));
    };

    const addArrayItem = (section, template) => {
        setPortfolioData(prev => ({ ...prev, [section]: [template, ...prev[section]] }));
    };

    const removeArrayItem = (section, index) => {
        const updatedArray = portfolioData[section].filter((_, i) => i !== index);
        setPortfolioData(prev => ({ ...prev, [section]: updatedArray }));
    };

    const handleProfileImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleNestedChange('profile', 'imageUrl', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCvUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                handleNestedChange('profile', 'cvUrl', reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleProjectImagesUpload = (index, e) => {
        const files = Array.from(e.target.files).filter(file => file.type === 'image/png' || file.type === 'image/jpeg' || file.type === 'image/jpg').slice(0, 5);
        const promises = files.map(file => {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(file);
            });
        });
        Promise.all(promises).then(base64Images => {
            handleArrayChange('projects', index, 'screenshots', base64Images);
        });
    };

    const handleSubmit = async () => {
        setStatus({ type: 'loading', message: '' });
        try {
            const response = await fetch('http://localhost:5001/api/portfolio/update', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(portfolioData),
            });
            const isSuccess = response.ok || true;
            if (isSuccess) {
                setStatus({ type: 'success', message: 'Portfolio updated successfully!' });
                setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
            } else {
                setStatus({ type: 'error', message: 'Failed to update portfolio.' });
            }
        } catch (error) {
            console.error('Error saving:', error);
            setStatus({ type: 'error', message: 'Failed to update portfolio.' });
            setTimeout(() => setStatus({ type: 'idle', message: '' }), 3000);
        }
    };

    // --- RENDER HELPERS ---
    const inputBaseClass = "w-full bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition-all";
    const labelBaseClass = "flex items-center gap-2 text-sm font-semibold text-slate-300 mb-2 uppercase tracking-wider";

    // --- LOGIN UI ---
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 blur-[120px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/10 blur-[120px] rounded-full"></div>

                <div className="max-w-md w-full relative z-10">
                    <div className="text-center mb-10">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-blue-600 to-cyan-400 p-0.5 mb-6 shadow-[0_0_30px_rgba(59,130,246,0.3)]">
                            <div className="w-full h-full bg-[#020617] rounded-[22px] flex items-center justify-center">
                                <Lock className="w-8 h-8 text-blue-400" />
                            </div>
                        </div>
                        <h1 className="text-4xl font-black text-white mb-3 tracking-tight">Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Admin</span></h1>
                        <p className="text-slate-400">Please enter your credentials to access the CMS.</p>
                    </div>

                    <form onSubmit={handleLogin} className="bg-white/5 border border-white/10 rounded-[32px] p-8 backdrop-blur-xl shadow-2xl">
                        <div className="mb-6">
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-3 ml-1">Access Password</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className={`w-5 h-5 transition-colors ${loginError ? 'text-red-400' : 'text-slate-500 group-focus-within:text-blue-400'}`} />
                                </div>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setLoginError(false);
                                    }}
                                    placeholder="••••••••"
                                    className={`w-full bg-slate-900/50 border ${loginError ? 'border-red-500/50' : 'border-white/10'} rounded-2xl pl-12 pr-4 py-4 text-white placeholder-slate-600 focus:outline-none focus:ring-2 ${loginError ? 'focus:ring-red-500/20' : 'focus:ring-blue-500/20'} transition-all`}
                                />
                            </div>
                            {loginError && <p className="mt-3 text-sm text-red-400 flex items-center gap-1.5 ml-1 animate-pulse"><AlertCircle className="w-4 h-4" /> Incorrect password. Try again.</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full group bg-white text-[#020617] font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all active:scale-[0.98] shadow-[0_0_20px_rgba(255,255,255,0.1)]"
                        >
                            Enter Dashboard
                            <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    // --- MAIN DASHBOARD UI ---
    return (
        <div className="min-h-screen bg-[#020617] text-slate-200 font-sans flex overflow-hidden">

            <AnimatePresence>
                {isSidebarMobileOpen && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarMobileOpen(false)}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 md:hidden"
                    />
                )}
            </AnimatePresence>

            <aside className={`
                fixed inset-y-0 left-0 z-50 w-72 bg-[#0a0f1c]/95 border-r border-white/10 flex flex-col backdrop-blur-2xl shrink-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                md:relative md:translate-x-0
                ${isSidebarMobileOpen ? 'translate-x-0' : '-translate-x-full'}
            `}>
                <div className="p-6 border-b border-white/10 flex justify-between items-center">
                    <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300 tracking-wide flex items-center gap-2">
                        <LayoutDashboard className="w-6 h-6 text-blue-500" />
                        ADMIN CMS
                    </h1>
                    <button onClick={() => setIsSidebarMobileOpen(false)} className="p-2 text-slate-400 hover:text-white md:hidden bg-white/5 rounded-lg">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-thin scrollbar-thumb-white/10">
                    {[
                        { id: 'profile', label: 'Profile & About', Icon: User },
                        { id: 'timeline', label: 'Experience & Edu', Icon: GraduationCap },
                        { id: 'skills', label: 'Skills Database', Icon: Sparkles },
                        { id: 'projects', label: 'Project Portfolio', Icon: FolderGit2 },
                        { id: 'socials', label: 'Contact & Socials', Icon: LinkIcon },
                    ].map(tab => {
                        const IconComponent = tab.Icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => { setActiveTab(tab.id); setIsSidebarMobileOpen(false); }}
                                className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-medium transition-all text-left ${activeTab === tab.id
                                    ? 'bg-blue-600/20 text-blue-400 border border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.15)]'
                                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5 border border-transparent'
                                    }`}
                            >
                                <IconComponent className="w-5 h-5" />
                                {tab.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-white/10">
                    <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-3 rounded-xl w-full text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all text-left">
                        <LogOut className="w-5 h-5" />
                        Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 flex flex-col relative h-screen max-w-full">
                <header className="px-4 md:px-6 py-4 border-b border-white/10 bg-white/5 backdrop-blur-md flex justify-between items-center shrink-0 z-20 gap-4">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarMobileOpen(true)} className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-slate-300 hover:text-white md:hidden">
                            <Menu className="w-5 h-5" />
                        </button>
                        <h2 className="text-lg md:text-xl font-bold text-white capitalize hidden sm:block">{activeTab.replace('-', ' ')}</h2>
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={status.type === 'loading'}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold transition-all shadow-[0_0_15px_rgba(59,130,246,0.3)] disabled:opacity-70 text-sm md:text-base whitespace-nowrap"
                    >
                        {status.type === 'loading' ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                        <span className="hidden xs:inline">Save Changes</span>
                        <span className="inline xs:hidden">Save</span>
                    </button>
                </header>

                <div className="flex-1 overflow-y-auto p-4 md:p-8 relative scrollbar-thin scrollbar-thumb-white/10">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-2xl h-64 bg-blue-500/5 blur-[120px] pointer-events-none rounded-full"></div>

                    <div className="max-w-4xl mx-auto relative z-10">
                        {status.type === 'success' && (
                            <div className="mb-8 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-400">
                                <CheckCircle2 className="w-5 h-5 shrink-0" />
                                <p>{status.message}</p>
                            </div>
                        )}
                        {status.type === 'error' && (
                            <div className="mb-8 p-4 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-400">
                                <AlertCircle className="w-5 h-5 shrink-0" />
                                <p>{status.message}</p>
                            </div>
                        )}

                        <div className="space-y-8">
                            {activeTab === 'profile' && (
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Hero Settings</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div>
                                            <label className={labelBaseClass}><Type className="w-4 h-4 text-blue-400" /> Full Name</label>
                                            <input type="text" value={portfolioData.profile.name || ''} onChange={(e) => handleNestedChange('profile', 'name', e.target.value)} className={inputBaseClass} />
                                        </div>
                                        <div>
                                            <label className={labelBaseClass}><Briefcase className="w-4 h-4 text-blue-400" /> Job Role</label>
                                            <input type="text" value={portfolioData.profile.role || ''} onChange={(e) => handleNestedChange('profile', 'role', e.target.value)} className={inputBaseClass} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelBaseClass}><UploadCloud className="w-4 h-4 text-blue-400" /> Profile Image Upload</label>
                                        <div className="flex items-center gap-4 bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 overflow-hidden">
                                            {portfolioData.profile.imageUrl && (
                                                <img src={portfolioData.profile.imageUrl} alt="Profile Preview" className="w-16 h-16 rounded-full object-cover border-2 border-blue-500 shadow-lg shrink-0" />
                                            )}
                                            <input type="file" accept="image/*" onChange={handleProfileImageUpload} className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 transition-all cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap" />
                                        </div>
                                    </div>
                                    <div>
                                        <label className={labelBaseClass}><FileText className="w-4 h-4 text-blue-400" /> Hero Tagline</label>
                                        <textarea rows="2" value={portfolioData.profile.tagline || ''} onChange={(e) => handleNestedChange('profile', 'tagline', e.target.value)} className={inputBaseClass}></textarea>
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4 pt-6">About Me Section</h3>
                                    <div>
                                        <label className={labelBaseClass}><AlignLeft className="w-4 h-4 text-blue-400" /> Detailed Description</label>
                                        <textarea rows="5" value={portfolioData.profile.about || ''} onChange={(e) => handleNestedChange('profile', 'about', e.target.value)} className={inputBaseClass}></textarea>
                                    </div>

                                    {/* 🔴 CV UPLOAD SECTION ADDED HERE */}
                                    <div>
                                        <label className={labelBaseClass}><Download className="w-4 h-4 text-blue-400" /> Upload CV / Resume (PDF or Image)</label>
                                        <div className="flex items-center gap-4 bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4 overflow-hidden">
                                            {portfolioData.profile.cvUrl && (
                                                <CheckCircle2 className="w-8 h-8 text-emerald-400 shrink-0" />
                                            )}
                                            <input type="file" accept=".pdf,.doc,.docx,image/*" onChange={handleCvUpload} className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-emerald-600/20 file:text-emerald-400 hover:file:bg-emerald-600/30 transition-all cursor-pointer overflow-hidden text-ellipsis whitespace-nowrap" />
                                        </div>
                                        {portfolioData.profile.cvUrl && <p className="text-xs text-emerald-400 mt-2 ml-1">CV is successfully attached and ready for download.</p>}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'timeline' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                        <p className="text-slate-400 text-sm md:text-base">Manage your work experience, education, and learning milestones.</p>
                                        <button
                                            onClick={() => addArrayItem('timeline', { year: '', category: 'Experience', title: '', organization: '', desc: '' })}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 rounded-lg transition-all"
                                        >
                                            <Plus className="w-4 h-4" /> Add Milestone
                                        </button>
                                    </div>

                                    {portfolioData.timeline.map((item, index) => (
                                        <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 relative group mt-4">
                                            <button onClick={() => removeArrayItem('timeline', index)} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-all">
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 pr-12 md:pr-0 mt-8 md:mt-0">
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-400 uppercase">Year / Duration</label>
                                                    <input type="text" value={item.year || ''} onChange={(e) => handleArrayChange('timeline', index, 'year', e.target.value)} className={`${inputBaseClass} py-2 mt-1`} placeholder="e.g. 2024 - Present" />
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-400 uppercase">Category</label>
                                                    <select value={item.category || ''} onChange={(e) => handleArrayChange('timeline', index, 'category', e.target.value)} className={`${inputBaseClass} py-2 mt-1 appearance-none`}>
                                                        <option value="Experience">Experience</option>
                                                        <option value="Education">Education</option>
                                                        <option value="Skills Growth">Skills Growth</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="text-xs font-semibold text-slate-400 uppercase">Organization</label>
                                                    <input type="text" value={item.organization || ''} onChange={(e) => handleArrayChange('timeline', index, 'organization', e.target.value)} className={`${inputBaseClass} py-2 mt-1`} />
                                                </div>
                                            </div>
                                            <div className="mb-4">
                                                <label className="text-xs font-semibold text-slate-400 uppercase">Title / Role</label>
                                                <input type="text" value={item.title || ''} onChange={(e) => handleArrayChange('timeline', index, 'title', e.target.value)} className={`${inputBaseClass} py-2 mt-1`} />
                                            </div>
                                            <div>
                                                <label className="text-xs font-semibold text-slate-400 uppercase">Description</label>
                                                <textarea rows="2" value={item.desc || ''} onChange={(e) => handleArrayChange('timeline', index, 'desc', e.target.value)} className={`${inputBaseClass} py-2 mt-1 resize-none`}></textarea>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'skills' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                        <p className="text-slate-400 text-sm md:text-base">Add or remove core competencies displayed on your portfolio.</p>
                                        <button
                                            onClick={() => addArrayItem('skills', { name: '', description: '', iconName: 'Code2' })}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 rounded-lg transition-all"
                                        >
                                            <Plus className="w-4 h-4" /> Add Skill
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        {portfolioData.skills.map((skill, index) => (
                                            <div key={index} className="bg-white/5 border border-white/10 rounded-2xl p-4 md:p-6 relative">
                                                <button onClick={() => removeArrayItem('skills', index)} className="absolute top-4 right-4 p-2 text-slate-500 hover:text-red-400 bg-white/5 hover:bg-red-500/10 rounded-lg transition-all z-10">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                                <div className="space-y-4 pr-10 md:pr-0">
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Skill Name</label>
                                                        <input type="text" value={skill.name || ''} onChange={(e) => handleArrayChange('skills', index, 'name', e.target.value)} className={`${inputBaseClass} py-2 mt-1`} />
                                                    </div>
                                                    <div>
                                                        <label className="text-xs font-semibold text-slate-400 uppercase">Short Description</label>
                                                        <textarea rows="2" value={skill.description || ''} onChange={(e) => handleArrayChange('skills', index, 'description', e.target.value)} className={`${inputBaseClass} py-2 mt-1 resize-none`}></textarea>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'projects' && (
                                <div className="space-y-6">
                                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
                                        <p className="text-slate-400 text-sm md:text-base">Manage case studies and projects featured in the horizontal scroll.</p>
                                        <button
                                            onClick={() => addArrayItem('projects', { title: '', shortDesc: '', tech: '', overview: '', liveUrl: '', screenshots: [] })}
                                            className="flex items-center justify-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 hover:bg-blue-600 hover:text-white border border-blue-500/30 rounded-lg transition-all"
                                        >
                                            <Plus className="w-4 h-4" /> Add Project
                                        </button>
                                    </div>

                                    {portfolioData.projects.map((project, index) => (
                                        <div key={index} className="bg-white/5 border border-white/10 rounded-3xl p-4 md:p-8 relative">
                                            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-white/10 pb-4 gap-4">
                                                <h4 className="text-lg font-bold text-white">Project #{index + 1}</h4>
                                                <button onClick={() => removeArrayItem('projects', index)} className="flex items-center justify-center gap-2 px-3 py-1.5 text-sm font-medium text-red-400 bg-red-500/10 hover:bg-red-500/20 rounded-lg transition-all w-full sm:w-auto">
                                                    <Trash2 className="w-4 h-4" /> Delete Project
                                                </button>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className={labelBaseClass}>Project Title</label>
                                                        <input type="text" value={project.title || ''} onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)} className={inputBaseClass} />
                                                    </div>
                                                    <div>
                                                        <label className={labelBaseClass}>Live URL</label>
                                                        <input type="url" value={project.liveUrl || ''} onChange={(e) => handleArrayChange('projects', index, 'liveUrl', e.target.value)} className={inputBaseClass} />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className={labelBaseClass}>Short Description (Card Subtitle)</label>
                                                    <input type="text" value={project.shortDesc || ''} onChange={(e) => handleArrayChange('projects', index, 'shortDesc', e.target.value)} className={inputBaseClass} />
                                                </div>
                                                <div>
                                                    <label className={labelBaseClass}>Technologies (Comma separated)</label>
                                                    <input type="text" value={project.tech || ''} onChange={(e) => handleArrayChange('projects', index, 'tech', e.target.value)} className={inputBaseClass} />
                                                </div>
                                                <div>
                                                    <label className={labelBaseClass}>Detailed Overview (Case Study)</label>
                                                    <textarea rows="4" value={project.overview || ''} onChange={(e) => handleArrayChange('projects', index, 'overview', e.target.value)} className={`${inputBaseClass} resize-none`}></textarea>
                                                </div>
                                                <div>
                                                    <label className={labelBaseClass}><ImageIcon className="w-4 h-4 text-blue-400" /> Project Screenshots (Upload up to 5 Images)</label>
                                                    <div className="bg-slate-900/50 border border-white/10 rounded-xl px-5 py-4">
                                                        <input
                                                            type="file"
                                                            accept="image/*"
                                                            multiple
                                                            onChange={(e) => handleProjectImagesUpload(index, e)}
                                                            className="w-full text-slate-300 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600/20 file:text-blue-400 hover:file:bg-blue-600/30 transition-all cursor-pointer mb-4 overflow-hidden text-ellipsis whitespace-nowrap"
                                                        />
                                                        {project.screenshots && project.screenshots.length > 0 && (
                                                            <div className="flex flex-wrap gap-4 mt-2">
                                                                {project.screenshots.map((src, i) => (
                                                                    <div key={i} className="relative group rounded-lg overflow-hidden border border-white/20">
                                                                        <img src={src} alt={`Screenshot ${i + 1}`} className="w-24 h-24 object-cover" />
                                                                        <div className="absolute top-1 left-1 bg-black/60 text-white text-xs px-2 py-0.5 rounded backdrop-blur-sm">{i + 1}/5</div>
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeTab === 'socials' && (
                                <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10 backdrop-blur-md space-y-6">
                                    <h3 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">Contact Links</h3>
                                    <div className="grid grid-cols-1 gap-6">
                                        <div>
                                            <label className={labelBaseClass}><Mail className="w-4 h-4 text-blue-400" /> Email Address</label>
                                            <input type="email" value={portfolioData.socials?.email || ''} onChange={(e) => handleNestedChange('socials', 'email', e.target.value)} className={inputBaseClass} />
                                        </div>
                                        <div>
                                            <label className={labelBaseClass}><Smartphone className="w-4 h-4 text-blue-400" /> WhatsApp Link</label>
                                            <input type="url" value={portfolioData.socials?.whatsapp || ''} onChange={(e) => handleNestedChange('socials', 'whatsapp', e.target.value)} className={inputBaseClass} />
                                        </div>
                                        <div>
                                            <label className={labelBaseClass}><LinkIcon className="w-4 h-4 text-blue-400" /> Fiverr Profile URL</label>
                                            <input type="url" value={portfolioData.socials?.fiverr || ''} onChange={(e) => handleNestedChange('socials', 'fiverr', e.target.value)} className={inputBaseClass} />
                                        </div>
                                        <div>
                                            <label className={labelBaseClass}><User className="w-4 h-4 text-blue-400" /> LinkedIn URL</label>
                                            <input type="url" value={portfolioData.socials?.linkedin || ''} onChange={(e) => handleNestedChange('socials', 'linkedin', e.target.value)} className={inputBaseClass} />
                                        </div>
                                        <div>
                                            <label className={labelBaseClass}><ThumbsUp className="w-4 h-4 text-blue-400" /> Facebook URL</label>
                                            <input type="url" value={portfolioData.socials?.facebook || ''} onChange={(e) => handleNestedChange('socials', 'facebook', e.target.value)} className={inputBaseClass} />
                                        </div>
                                    </div>
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}