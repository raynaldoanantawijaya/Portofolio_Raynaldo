import React, { useState, useEffect } from 'react';
import { getContentAsync, saveContentAsync } from '../utils/contentStore';

// @ts-ignore
import type { SiteContent, Project, Skill } from '../data/siteContent';
import ProjectEditor from './ProjectEditor';

const ICON_OPTIONS = [
    // Frontend
    { name: 'HTML5', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg' },
    { name: 'CSS3', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg' },
    { name: 'JavaScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg' },
    { name: 'TypeScript', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg' },
    { name: 'React', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Vue.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vuejs/vuejs-original.svg' },
    { name: 'Angular', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/angularjs/angularjs-original.svg' },
    { name: 'Svelte', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/svelte/svelte-original.svg' },
    { name: 'Next.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nextjs/nextjs-original.svg' },
    { name: 'Nuxt.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nuxtjs/nuxtjs-original.svg' },
    { name: 'Astro', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/astro/astro-original.svg' },
    { name: 'Tailwind', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg' },
    { name: 'Bootstrap', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/bootstrap/bootstrap-original.svg' },
    { name: 'Sass', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sass/sass-original.svg' },
    { name: 'jQuery', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jquery/jquery-original.svg' },
    // Backend
    { name: 'Node.js', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg' },
    { name: 'Express', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/express/express-original.svg' },
    { name: 'Python', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg' },
    { name: 'Django', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/django/django-plain.svg' },
    { name: 'Flask', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flask/flask-original.svg' },
    { name: 'FastAPI', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/fastapi/fastapi-original.svg' },
    { name: 'PHP', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/php/php-original.svg' },
    { name: 'Laravel', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/laravel/laravel-original.svg' },
    { name: 'Java', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg' },
    { name: 'Spring', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/spring/spring-original.svg' },
    { name: 'Go', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/go/go-original.svg' },
    { name: 'Ruby', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ruby/ruby-original.svg' },
    { name: 'Rails', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rails/rails-original-wordmark.svg' },
    { name: 'Rust', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/rust/rust-original.svg' },
    { name: 'C', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg' },
    { name: 'C++', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cplusplus/cplusplus-original.svg' },
    { name: 'C#', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/csharp/csharp-original.svg' },
    { name: '.NET', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dot-net/dot-net-original.svg' },
    { name: 'Kotlin', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg' },
    { name: 'Swift', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/swift/swift-original.svg' },
    // Database
    { name: 'MySQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mysql/mysql-original.svg' },
    { name: 'PostgreSQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postgresql/postgresql-original.svg' },
    { name: 'MongoDB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg' },
    { name: 'Redis', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/redis/redis-original.svg' },
    { name: 'Firebase', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/firebase/firebase-plain.svg' },
    { name: 'SQLite', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sqlite/sqlite-original.svg' },
    { name: 'Oracle', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/oracle/oracle-original.svg' },
    // Cloud & DevOps
    { name: 'AWS', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/amazonwebservices/amazonwebservices-original-wordmark.svg' },
    { name: 'Google Cloud', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/googlecloud/googlecloud-original.svg' },
    { name: 'Azure', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/azure/azure-original.svg' },
    { name: 'Vercel', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vercel/vercel-original.svg' },
    { name: 'Netlify', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/netlify/netlify-original.svg' },
    { name: 'Docker', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/docker/docker-original.svg' },
    { name: 'Kubernetes', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kubernetes/kubernetes-plain.svg' },
    { name: 'Nginx', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nginx/nginx-original.svg' },
    { name: 'Apache', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apache/apache-original.svg' },
    // Tools
    { name: 'Git', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg' },
    { name: 'GitHub', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/github/github-original.svg' },
    { name: 'GitLab', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/gitlab/gitlab-original.svg' },
    { name: 'VS Code', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/vscode/vscode-original.svg' },
    { name: 'Figma', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/figma/figma-original.svg' },
    { name: 'Photoshop', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/photoshop/photoshop-plain.svg' },
    { name: 'Illustrator', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
    { name: 'Canva', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/canva/canva-original.svg' },
    { name: 'Postman', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/postman/postman-original.svg' },
    { name: 'npm', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/npm/npm-original-wordmark.svg' },
    { name: 'Webpack', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/webpack/webpack-original.svg' },
    { name: 'Vite', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg' },
    // Hardware, Electronics, Robotics & IoT
    { name: 'Arduino', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/arduino/arduino-original.svg' },
    { name: 'Raspberry Pi', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/raspberrypi/raspberrypi-original.svg' },
    { name: 'LabVIEW', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/labview/labview-original.svg' },
    { name: 'MATLAB', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/matlab/matlab-original.svg' },
    { name: 'Embedded C', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/embeddedc/embeddedc-original.svg' },
    { name: 'Blender', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/blender/blender-original.svg' },
    { name: 'Unity', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unity/unity-original.svg' },
    { name: 'Unreal Engine', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/unrealengine/unrealengine-original.svg' },
    { name: 'OpenGL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opengl/opengl-original.svg' },
    { name: 'SDL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/sdl/sdl-original.svg' },
    { name: 'CMake', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/cmake/cmake-original.svg' },
    { name: 'QT', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/qt/qt-original.svg' },
    { name: 'Lua', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/lua/lua-original.svg' },
    { name: 'R', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/r/r-original.svg' },
    { name: 'Scala', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/scala/scala-original.svg' },
    { name: 'Perl', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/perl/perl-original.svg' },
    { name: 'Haskell', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/haskell/haskell-original.svg' },
    { name: 'Clojure', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/clojure/clojure-original.svg' },
    { name: 'Elixir', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/elixir/elixir-original.svg' },
    { name: 'Erlang', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/erlang/erlang-original.svg' },
    // AI & Data
    { name: 'TensorFlow', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/tensorflow/tensorflow-original.svg' },
    { name: 'PyTorch', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pytorch/pytorch-original.svg' },
    { name: 'Pandas', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/pandas/pandas-original.svg' },
    { name: 'NumPy', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/numpy/numpy-original.svg' },
    { name: 'OpenCV', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/opencv/opencv-original.svg' },
    { name: 'Jupyter', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/jupyter/jupyter-original.svg' },
    // Mobile
    { name: 'Flutter', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/flutter/flutter-original.svg' },
    { name: 'Dart', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/dart/dart-original.svg' },
    { name: 'React Native', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg' },
    { name: 'Android', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/android/android-original.svg' },
    { name: 'Apple', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/apple/apple-original.svg' },
    // OS & Others
    { name: 'Linux', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/linux/linux-original.svg' },
    { name: 'Ubuntu', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/ubuntu/ubuntu-plain.svg' },
    { name: 'Windows', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/windows8/windows8-original.svg' },
    { name: 'Markdown', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/markdown/markdown-original.svg' },
    { name: 'GraphQL', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/graphql/graphql-plain.svg' },
    { name: 'Electron', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/electron/electron-original.svg' },
];

export default function AdminDashboard() {
    const [content, setContent] = useState<SiteContent | null>(null);
    const [activeTab, setActiveTab] = useState('home');
    const [editingProject, setEditingProject] = useState<Project | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const cvInputRef = React.useRef<HTMLInputElement>(null);

    useEffect(() => {
        const load = async () => {
            const data = await getContentAsync();
            setContent(data);
        };
        load();
    }, []);

    const handleSave = async () => {
        if (!content) return;
        setIsSaving(true);
        const success = await saveContentAsync(content);
        if (success) {
            alert('Perubahan berhasil disimpan ke Firestore!');
        } else {
            alert('Gagal menyimpan perubahan. Cek koneksi internet atau izin.');
        }
        setIsSaving(false);
    };

    const handleChange = (section: keyof SiteContent, key: string, value: any, nestedKey?: string) => {
        if (!content) return;
        if (nestedKey) {
            setContent({
                ...content,
                [section]: {
                    ...(content[section] as any),
                    [key]: {
                        ...(content[section] as any)[key],
                        [nestedKey]: value
                    }
                }
            });
        } else if (typeof content[section] === 'object' && !Array.isArray(content[section])) {
            setContent({
                ...content,
                [section]: {
                    ...(content[section] as any),
                    [key]: value
                }
            });
        }
    };



    const handleProjectSave = (updatedProject: Project) => {
        if (!content) return;
        const newProjects = content.projects.map(p =>
            p.id === updatedProject.id ? updatedProject : p
        );
        const exists = content.projects.find(p => p.id === updatedProject.id);
        const finalProjects = exists ? newProjects : [...content.projects, updatedProject];

        const newContent = { ...content, projects: finalProjects };
        setContent(newContent);
        setEditingProject(null); // Close editor
        alert('Project diperbarui! Jangan lupa klik "Simpan Perubahan" di sidebar untuk menyimpan ke server.');
    };

    const handleAddNewProject = () => {
        const newProject: Project = {
            id: `project-${Date.now()}`,
            title: 'New Project Draft',
            coverImage: '',
            content: '<p>Start writing your project details...</p>',
            galleryImages: [],
            link: '#',
            tags: [],
            status: 'draft',
            author: 'Admin',
            publishDate: new Date().toISOString().split('T')[0]
        };
        // Add to list first then edit
        if (content) {
            const newContent = { ...content, projects: [...content.projects, newProject] };
            setContent(newContent);
            setEditingProject(newProject);
        }
    };

    const handleDeleteProject = (id: string, e: any) => {
        e.stopPropagation();
        if (confirm('Are you sure you want to delete this project?')) {
            if (content) {
                const newProjects = content.projects.filter(p => p.id !== id);
                const newContent = { ...content, projects: newProjects };
                setContent(newContent);
                setContent(newContent);
                // Auto-save removed - use Save button
            }
        }
    };

    // Skills Logic
    const handleSkillChange = (index: number, field: string, value: string) => {
        if (!content) return;
        const newSkills = [...content.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        setContent({ ...content, skills: newSkills });
    };

    const addSkill = () => {
        if (!content) return;
        const newSkill: Skill = { title: 'New Skill', desc: 'Description', icon: ICON_OPTIONS[0].url };
        setContent({ ...content, skills: [...content.skills, newSkill] });
    };

    const removeSkill = (index: number) => {
        if (!content) return;
        setContent({ ...content, skills: content.skills.filter((_, i) => i !== index) });
    };

    const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) { // 3MB limit
                alert('Ukuran file terlalu besar! Maksimal 3MB.');
                return;
            }

            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64File = reader.result as string;

                try {
                    // Upload to GitHub Repo via API
                    const response = await fetch('/api/github-cv', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ action: 'upload', file: base64File })
                    });

                    const data = await response.json();
                    if (!response.ok) throw new Error(data.error || 'Upload failed');

                    // Success
                    if (!content) return;
                    setContent({
                        ...content,
                        hero: {
                            ...content.hero,
                            cvFile: '/assets/cv.pdf' // Fixed path
                        }
                    });
                    alert('CV berhasil diupload ke GitHub! Perubahan akan muncul dalam 1-2 menit setelah Vercel selesai build ulang.');
                } catch (error: any) {
                    console.error('Upload error:', error);
                    alert(`Gagal mengupload CV: ${error.message}`);
                }
            };
            reader.onerror = (error) => {
                console.error('File reading error:', error);
                alert('Gagal membaca file.');
            };
        }
    };

    const handleCVDelete = async () => {
        if (!content?.hero.cvFile) return;

        if (!confirm('Apakah Anda yakin ingin menghapus CV ini dari Repository? Ini akan mentrigger build ulang.')) return;

        try {
            const response = await fetch('/api/github-cv', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'delete' })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Delete failed');

            setContent({
                ...content,
                hero: {
                    ...content.hero,
                    cvFile: ''
                }
            });
            alert('CV berhasil dihapus dari GitHub! Tunggu 1-2 menit untuk update.');
        } catch (error: any) {
            console.error('Delete error details:', error);
            alert(`Gagal menghapus CV: ${error.message || 'Unknown error'}`);
        }
    };



    if (!content) return <div className="flex items-center justify-center h-screen bg-[#121212] text-slate-400">Loading CMS...</div>;

    // IF EDITING A PROJECT, SHOW FULL SCREEN EDITOR
    if (editingProject) {
        return (
            <ProjectEditor
                project={editingProject}
                onSave={handleProjectSave}
                onCancel={() => setEditingProject(null)}
            />
        );
    }

    // NORMAL DASHBOARD VIEW
    return (
        <div className="flex h-screen bg-[#121212] font-display text-slate-300 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-64 bg-[#1e1e1e] border-r border-slate-800 flex flex-col z-10 relative">
                <div className="p-6 border-b border-slate-800 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg text-white">
                            <span className="material-symbols-outlined">dataset</span>
                        </div>
                        <h1 className="font-bold text-lg tracking-tight">CMS Admin</h1>
                    </div>

                    {/* Admin Status */}
                    <div className="text-xs text-slate-500 bg-slate-800/50 p-2 rounded border border-slate-700 flex items-center justify-between">
                        <span>Status: Cloud</span>
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full py-2 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${isSaving ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-500 text-white shadow-lg shadow-green-900/20'}`}
                    >
                        {isSaving ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Menyimpan...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i>
                                Simpan Perubahan
                            </>
                        )}
                    </button>
                </div>

                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {[
                        { id: 'home', label: 'Beranda', icon: 'home' },
                        { id: 'about', label: 'Tentang', icon: 'person' },
                        { id: 'skills', label: 'Skills', icon: 'code' },
                        { id: 'projects', label: 'Proyek', icon: 'folder' },
                        { id: 'global', label: 'Global', icon: 'settings' }
                    ].map(item => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id
                                ? 'bg-primary/10 text-primary'
                                : 'text-slate-400 hover:bg-slate-800 hover:text-primary'
                                }`}
                        >
                            <span className="material-symbols-outlined">{item.icon}</span>
                            {item.label}
                        </button>
                    ))}
                </nav>

                <div className="p-4 border-t border-slate-800 space-y-2">
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg font-semibold transition-all shadow-sm ${isSaving ? 'bg-slate-700 text-slate-400 cursor-not-allowed' : 'bg-primary text-white hover:bg-primary/90 shadow-primary/20'}`}
                    >
                        {isSaving ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i>
                                Saving...
                            </>
                        ) : (
                            <>
                                <span className="material-symbols-outlined text-[18px]">save</span>
                                Simpan (Bawah)
                            </>
                        )}
                    </button>
                    <button
                        onClick={async () => {
                            const { logoutAdmin } = await import('../lib/authService');
                            await logoutAdmin();
                        }}
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-900/10 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 p-8 bg-[#121212]">
                <div className="max-w-4xl mx-auto">
                    {/* Header Section */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">
                            {activeTab === 'home' && 'Edit Beranda'}
                            {activeTab === 'about' && 'Edit Tentang Saya'}
                            {activeTab === 'skills' && 'Manajemen Skill'}
                            {activeTab === 'projects' && 'Daftar Proyek'}
                            {activeTab === 'global' && 'Pengaturan Global'}
                        </h2>
                        <p className="text-slate-500 text-sm">Kelola konten website Anda dengan mudah dari sini.</p>
                    </div>

                    {/* Content Forms */}
                    <div className="bg-[#1e1e1e] rounded-xl border border-slate-800 shadow-xl overflow-hidden">

                        {activeTab === 'projects' && (
                            <div className="p-6">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="font-bold text-lg">Semua Proyek ({content.projects.length})</h3>
                                    <button
                                        onClick={handleAddNewProject}
                                        className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors text-sm font-medium"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">add</span>
                                        Tambah Proyek
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {content.projects.map((project) => (
                                        <div
                                            key={project.id}
                                            onClick={() => setEditingProject(project)}
                                            className="group relative bg-[#262626] border border-slate-800 rounded-xl overflow-hidden hover:shadow-lg hover:shadow-black/50 transition-all cursor-pointer hover:border-primary/50"
                                        >
                                            <div className="h-40 bg-[#1e1e1e] overflow-hidden relative">
                                                {project.coverImage ? (
                                                    <img src={project.coverImage} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-slate-600">
                                                        <span className="material-symbols-outlined text-4xl">image</span>
                                                    </div>
                                                )}
                                                <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 backdrop-blur text-white text-xs rounded-md">
                                                    {project.status === 'draft' ? 'Draft' : 'Published'}
                                                </div>
                                            </div>
                                            <div className="p-4">
                                                <h3 className="font-bold text-white mb-1 line-clamp-1">{project.title}</h3>
                                                <p className="text-xs text-slate-500 mb-4">{project.category || 'Uncategorized'}</p>

                                                <div className="flex justify-between items-center pt-2 border-t border-slate-700">
                                                    <span className="text-xs text-slate-400">{project.publishDate || 'No Date'}</span>
                                                    <button
                                                        onClick={(e) => handleDeleteProject(project.id, e)}
                                                        className="text-red-500 hover:text-red-400 p-1 rounded-md hover:bg-red-900/10 transition-colors"
                                                        title="Hapus Proyek"
                                                    >
                                                        <span className="material-symbols-outlined text-[18px]">delete</span>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {activeTab === 'home' && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Judul Utama (Hero Title)</label>
                                    <input
                                        type="text"
                                        value={content.hero.title}
                                        onChange={(e) => handleChange('hero', 'title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-[#262626] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Deskripsi</label>
                                    <textarea
                                        rows={4}
                                        value={content.hero.description}
                                        onChange={(e) => handleChange('hero', 'description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-[#262626] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all resize-y"
                                    />
                                </div>
                                <div className="p-4 bg-[#262626] rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-sm mb-4 text-slate-300 uppercase tracking-wide">File CV / Resume</h4>

                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-1">
                                                <label className="block text-xs text-slate-500 mb-2">Upload File PDF/Word (Max 3MB)</label>
                                                <input
                                                    type="file"
                                                    ref={cvInputRef}
                                                    accept=".pdf,.doc,.docx"
                                                    onChange={handleCVUpload}
                                                    className="hidden"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => cvInputRef.current?.click()}
                                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-[#1e1e1e] border border-dashed border-slate-600 rounded-lg text-slate-400 hover:bg-[#262626] hover:border-primary hover:text-white transition-all"
                                                >
                                                    <span className="material-symbols-outlined">upload_file</span>
                                                    <span className="text-sm font-medium">Pilih File CV</span>
                                                </button>
                                            </div>
                                        </div>

                                        {content.hero.cvFile ? (
                                            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20">
                                                <span className="material-symbols-outlined text-primary">description</span>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium text-white truncate">File CV Tersimpan</p>
                                                    <p className="text-xs text-primary truncate">Siap didownload</p>
                                                </div>
                                                <button
                                                    onClick={handleCVDelete}
                                                    className="text-slate-400 hover:text-red-500 transition-colors"
                                                    title="Hapus File & Hapus dari Cloudinary"
                                                >
                                                    <span className="material-symbols-outlined">delete</span>
                                                </button>
                                            </div>
                                        ) : (
                                            <p className="text-xs text-slate-500 italic">Belum ada file CV yang diupload. Tombol akan menggunakan link default.</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'about' && (
                            <div className="p-6 space-y-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Judul Section</label>
                                    <input
                                        type="text"
                                        value={content.about.title}
                                        onChange={(e) => handleChange('about', 'title', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-[#262626] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Deskripsi Panjang</label>
                                    <textarea
                                        rows={6}
                                        value={content.about.description}
                                        onChange={(e) => handleChange('about', 'description', e.target.value)}
                                        className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-[#262626] text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none resize-y"
                                    />
                                </div>
                                <div className="p-4 bg-[#262626] rounded-lg border border-slate-700">
                                    <h4 className="font-bold text-sm mb-4 text-slate-300 uppercase tracking-wide">Statistik</h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Angka Proyek</label>
                                            <input type="text" value={content.about.stats.projects} onChange={(e) => handleChange('about', 'stats', e.target.value, 'projects')} className="w-full px-3 py-2 rounded border border-slate-700 bg-[#1e1e1e] text-white text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Label Proyek</label>
                                            <input type="text" value={content.about.stats.projectsLabel} onChange={(e) => handleChange('about', 'stats', e.target.value, 'projectsLabel')} className="w-full px-3 py-2 rounded border border-slate-700 bg-[#1e1e1e] text-white text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Angka Pengalaman</label>
                                            <input type="text" value={content.about.stats.experience} onChange={(e) => handleChange('about', 'stats', e.target.value, 'experience')} className="w-full px-3 py-2 rounded border border-slate-700 bg-[#1e1e1e] text-white text-sm" />
                                        </div>
                                        <div>
                                            <label className="block text-xs text-slate-500 mb-1">Label Pengalaman</label>
                                            <input type="text" value={content.about.stats.experienceLabel} onChange={(e) => handleChange('about', 'stats', e.target.value, 'experienceLabel')} className="w-full px-3 py-2 rounded border border-slate-700 bg-[#1e1e1e] text-white text-sm" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'skills' && (
                            <div className="p-6">
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Judul Section Skills</label>
                                    <input type="text" value={content.about.skillsTitle} onChange={(e) => handleChange('about', 'skillsTitle', e.target.value)} className="w-full px-4 py-2 rounded-lg border border-slate-700 bg-[#262626] text-white outline-none" />
                                </div>

                                <div className="space-y-4 mb-6">
                                    {content.skills.map((skill, index) => (
                                        <div key={index} className="flex items-start gap-4 p-4 border border-slate-700 rounded-lg hover:bg-slate-800 transition-colors group">
                                            <div className="w-12 h-12 bg-[#262626] rounded-lg border border-slate-700 p-2 flex-shrink-0">
                                                <img src={skill.icon} alt="Icon" className="w-full h-full object-contain" />
                                            </div>
                                            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">Nama Skill</label>
                                                    <input type="text" value={skill.title} onChange={(e) => handleSkillChange(index, 'title', e.target.value)} className="w-full px-2 py-1 text-sm border-b border-slate-700 bg-transparent text-white outline-none focus:border-primary" />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-slate-400 mb-1">Deskripsi Singkat</label>
                                                    <input type="text" value={skill.desc} onChange={(e) => handleSkillChange(index, 'desc', e.target.value)} className="w-full px-2 py-1 text-sm border-b border-slate-700 bg-transparent text-white outline-none focus:border-primary" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs text-slate-400 mb-1">Icon</label>
                                                    <select
                                                        value={skill.icon}
                                                        onChange={(e) => {
                                                            if (e.target.value) handleSkillChange(index, 'icon', e.target.value);
                                                        }}
                                                        className="w-full px-2 py-1 text-sm bg-[#1e1e1e] border border-slate-700 rounded text-white outline-none focus:border-primary"
                                                    >
                                                        <option value="">Pilih Icon...</option>
                                                        {ICON_OPTIONS.map(opt => (
                                                            <option key={opt.name} value={opt.url}>{opt.name}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                            <button onClick={() => removeSkill(index)} className="p-2 text-slate-400 hover:text-red-500 transition-colors" title="Hapus Skill">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button onClick={addSkill} className="w-full py-3 border-2 border-dashed border-slate-700 rounded-lg text-slate-500 hover:text-primary hover:border-primary hover:bg-primary/5 transition-all font-medium flex items-center justify-center gap-2">
                                    <span className="material-symbols-outlined">add_circle</span>
                                    Tambah Skill Baru
                                </button>
                            </div>
                        )}

                        {activeTab === 'global' && (
                            <div className="p-6 space-y-8">
                                <div>
                                    <h3 className="font-bold text-lg mb-4 border-b border-slate-700 pb-2">Navigasi Menu</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        {Object.entries(content.header.nav).map(([key, value]) => (
                                            <div key={key}>
                                                <label className="block text-sm font-medium text-slate-400 capitalize mb-1">{key}</label>
                                                <input type="text" value={value as string} onChange={(e) => handleChange('header', 'nav', e.target.value, key)} className="w-full px-3 py-2 rounded border border-slate-700 bg-[#262626] text-white text-sm" />
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-4 border-b border-slate-700 pb-2">Footer</h3>
                                    <div>
                                        <label className="block text-sm font-medium text-slate-400 mb-1">Teks Copyright</label>
                                        <input type="text" value={content.footer.copyright} onChange={(e) => handleChange('footer', 'copyright', e.target.value)} className="w-full px-3 py-2 rounded border border-slate-700 bg-[#262626] text-white text-sm" />
                                    </div>
                                </div>

                                <div>
                                    <h3 className="font-bold text-lg mb-4 border-b border-slate-700 pb-2">🔗 Social Links</h3>
                                    <p className="text-slate-500 text-sm mb-4">Kelola link media sosial yang tampil di footer website.</p>
                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                <i className="fas fa-envelope mr-2"></i>Email
                                            </label>
                                            <input
                                                type="email"
                                                value={content.socialLinks?.email || ''}
                                                onChange={(e) => handleChange('socialLinks', 'email', e.target.value)}
                                                placeholder="contoh@gmail.com"
                                                className="w-full px-3 py-2 rounded border border-slate-700 bg-[#262626] text-white text-sm"
                                            />
                                            <p className="text-xs text-slate-600 mt-1">Klik akan membuka aplikasi email</p>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                <i className="fab fa-linkedin mr-2"></i>LinkedIn Username
                                            </label>
                                            <div className="flex">
                                                <span className="px-3 py-2 bg-[#1e1e1e] border border-r-0 border-slate-700 rounded-l text-slate-500 text-sm">linkedin.com/in/</span>
                                                <input
                                                    type="text"
                                                    value={content.socialLinks?.linkedin || ''}
                                                    onChange={(e) => handleChange('socialLinks', 'linkedin', e.target.value)}
                                                    placeholder="username-anda"
                                                    className="flex-1 px-3 py-2 rounded-r border border-slate-700 bg-[#262626] text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                <i className="fab fa-instagram mr-2"></i>Instagram Username
                                            </label>
                                            <div className="flex">
                                                <span className="px-3 py-2 bg-[#1e1e1e] border border-r-0 border-slate-700 rounded-l text-slate-500 text-sm">instagram.com/</span>
                                                <input
                                                    type="text"
                                                    value={content.socialLinks?.instagram || ''}
                                                    onChange={(e) => handleChange('socialLinks', 'instagram', e.target.value)}
                                                    placeholder="username_anda"
                                                    className="flex-1 px-3 py-2 rounded-r border border-slate-700 bg-[#262626] text-white text-sm"
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-slate-400 mb-1">
                                                <i className="fab fa-youtube mr-2"></i>YouTube Channel
                                            </label>
                                            <div className="flex">
                                                <span className="px-3 py-2 bg-[#1e1e1e] border border-r-0 border-slate-700 rounded-l text-slate-500 text-sm">youtube.com/</span>
                                                <input
                                                    type="text"
                                                    value={content.socialLinks?.youtube || ''}
                                                    onChange={(e) => handleChange('socialLinks', 'youtube', e.target.value)}
                                                    placeholder="@channel-anda"
                                                    className="flex-1 px-3 py-2 rounded-r border border-slate-700 bg-[#262626] text-white text-sm"
                                                />
                                            </div>
                                        </div>


                                        {/* Individual Icon Pickers */}
                                        <div className="mt-6 pt-6 border-t border-slate-700">
                                            <label className="block text-sm font-medium text-slate-400 mb-2">
                                                🎨 Pilih Icon untuk Setiap Media Sosial
                                            </label>
                                            <p className="text-xs text-slate-600 mb-4">Klik icon yang ingin digunakan (putih / berwarna)</p>

                                            {/* Email Icons */}
                                            <div className="mb-4">
                                                <p className="text-xs text-slate-500 mb-2">Email:</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {[
                                                        { icon: 'fas fa-envelope', color: '' },
                                                        { icon: 'far fa-envelope', color: '' },
                                                        { icon: 'fas fa-envelope-open', color: '' },
                                                        { icon: 'far fa-envelope-open', color: '' },
                                                        { icon: 'fas fa-at', color: '' },
                                                        { icon: 'fas fa-paper-plane', color: '' },
                                                        { icon: 'far fa-paper-plane', color: '' },
                                                        { icon: 'fas fa-inbox', color: '' },
                                                        { icon: 'fas fa-envelope-circle-check', color: '' },
                                                        { icon: 'fas fa-envelope', color: '#EA4335' },
                                                        { icon: 'fas fa-at', color: '#EA4335' },
                                                        { icon: 'fas fa-paper-plane', color: '#34A853' },
                                                        { icon: 'fas fa-envelope', color: '#4285F4' },
                                                        { icon: 'fas fa-inbox', color: '#FBBC05' },
                                                    ].map((item, idx) => (
                                                        <button
                                                            key={`email-${idx}`}
                                                            type="button"
                                                            onClick={() => handleChange('socialLinks', 'emailIcon', item.color ? `${item.icon}|${item.color}` : item.icon)}
                                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${content.socialLinks?.emailIcon === (item.color ? `${item.icon}|${item.color}` : item.icon) ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-slate-500'}`}
                                                        >
                                                            <i className={item.icon} style={{ color: item.color || '#fff' }}></i>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* LinkedIn Icons */}
                                            <div className="mb-4">
                                                <p className="text-xs text-slate-500 mb-2">LinkedIn:</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {[
                                                        { icon: 'fab fa-linkedin', color: '' },
                                                        { icon: 'fab fa-linkedin-in', color: '' },
                                                        { icon: 'fas fa-briefcase', color: '' },
                                                        { icon: 'fas fa-user-tie', color: '' },
                                                        { icon: 'fas fa-id-badge', color: '' },
                                                        { icon: 'fas fa-handshake', color: '' },
                                                        { icon: 'fas fa-building', color: '' },
                                                        { icon: 'fas fa-network-wired', color: '' },
                                                        { icon: 'fab fa-linkedin', color: '#0A66C2' },
                                                        { icon: 'fab fa-linkedin-in', color: '#0A66C2' },
                                                        { icon: 'fas fa-briefcase', color: '#0A66C2' },
                                                        { icon: 'fas fa-user-tie', color: '#0A66C2' },
                                                        { icon: 'fas fa-handshake', color: '#0A66C2' },
                                                    ].map((item, idx) => (
                                                        <button
                                                            key={`linkedin-${idx}`}
                                                            type="button"
                                                            onClick={() => handleChange('socialLinks', 'linkedinIcon', item.color ? `${item.icon}|${item.color}` : item.icon)}
                                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${content.socialLinks?.linkedinIcon === (item.color ? `${item.icon}|${item.color}` : item.icon) ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-slate-500'}`}
                                                        >
                                                            <i className={item.icon} style={{ color: item.color || '#fff' }}></i>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Instagram Icons */}
                                            <div className="mb-4">
                                                <p className="text-xs text-slate-500 mb-2">Instagram:</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {[
                                                        { icon: 'fab fa-instagram', color: '' },
                                                        { icon: 'fas fa-camera', color: '' },
                                                        { icon: 'fas fa-camera-retro', color: '' },
                                                        { icon: 'fas fa-images', color: '' },
                                                        { icon: 'far fa-image', color: '' },
                                                        { icon: 'fas fa-heart', color: '' },
                                                        { icon: 'fas fa-hashtag', color: '' },
                                                        { icon: 'fas fa-square-poll-vertical', color: '' },
                                                        { icon: 'fab fa-instagram', color: '#E4405F' },
                                                        { icon: 'fab fa-instagram', color: '#833AB4' },
                                                        { icon: 'fab fa-instagram', color: '#F77737' },
                                                        { icon: 'fas fa-camera', color: '#E4405F' },
                                                        { icon: 'fas fa-heart', color: '#E4405F' },
                                                        { icon: 'fas fa-images', color: '#833AB4' },
                                                    ].map((item, idx) => (
                                                        <button
                                                            key={`instagram-${idx}`}
                                                            type="button"
                                                            onClick={() => handleChange('socialLinks', 'instagramIcon', item.color ? `${item.icon}|${item.color}` : item.icon)}
                                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${content.socialLinks?.instagramIcon === (item.color ? `${item.icon}|${item.color}` : item.icon) ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-slate-500'}`}
                                                        >
                                                            <i className={item.icon} style={{ color: item.color || '#fff' }}></i>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* YouTube Icons */}
                                            <div>
                                                <p className="text-xs text-slate-500 mb-2">YouTube:</p>
                                                <div className="flex gap-2 flex-wrap">
                                                    {[
                                                        { icon: 'fab fa-youtube', color: '' },
                                                        { icon: 'fas fa-play-circle', color: '' },
                                                        { icon: 'far fa-play-circle', color: '' },
                                                        { icon: 'fas fa-video', color: '' },
                                                        { icon: 'fas fa-film', color: '' },
                                                        { icon: 'fas fa-tv', color: '' },
                                                        { icon: 'fas fa-play', color: '' },
                                                        { icon: 'fas fa-clapperboard', color: '' },
                                                        { icon: 'fas fa-circle-play', color: '' },
                                                        { icon: 'fab fa-youtube', color: '#FF0000' },
                                                        { icon: 'fas fa-play-circle', color: '#FF0000' },
                                                        { icon: 'fas fa-video', color: '#FF0000' },
                                                        { icon: 'fas fa-play', color: '#FF0000' },
                                                        { icon: 'fas fa-clapperboard', color: '#FF0000' },
                                                    ].map((item, idx) => (
                                                        <button
                                                            key={`youtube-${idx}`}
                                                            type="button"
                                                            onClick={() => handleChange('socialLinks', 'youtubeIcon', item.color ? `${item.icon}|${item.color}` : item.icon)}
                                                            className={`w-12 h-12 rounded-lg border-2 flex items-center justify-center text-xl transition-all ${content.socialLinks?.youtubeIcon === (item.color ? `${item.icon}|${item.color}` : item.icon) ? 'border-primary bg-primary/20' : 'border-slate-700 hover:border-slate-500'}`}
                                                        >
                                                            <i className={item.icon} style={{ color: item.color || '#fff' }}></i>
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
