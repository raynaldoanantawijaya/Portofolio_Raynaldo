export interface ProjectImage {
    url: string;
    caption?: string;
}

export interface Project {
    id: string;
    title: string;
    coverImage: string;
    content: string; // Rich HTML content
    galleryImages: ProjectImage[];
    link: string;
    tags?: string[];
    category?: string;
    status?: 'draft' | 'published';
    publishDate?: string;
    author?: string;
}

export interface Skill {
    title: string;
    desc: string;
    icon: string;
}

export interface SiteContent {
    header: {
        nav: {
            home: string;
            about: string;
            projects: string;
            contact: string;
        }
    };
    footer: {
        copyright: string;
    };
    hero: {
        title: string;
        description: string;
        btnDownload: string; // Text for button
        btnProjects: string; // Text for button
        cvFile?: string; // Base64 data URI
    };
    about: {
        title: string;
        description: string;
        stats: {
            projects: string;
            projectsLabel: string;
            experience: string;
            experienceLabel: string;
        };
        skillsTitle: string;
    };
    contact: {
        title: string;
        email: string;
        form: {
            nameLabel: string;
            emailLabel: string;
            messageLabel: string;
            btnSubmit: string;
        }
    };
    socialLinks: {
        email: string;
        emailIcon: string;
        linkedin: string;
        linkedinIcon: string;
        instagram: string;
        instagramIcon: string;
        youtube: string;
        youtubeIcon: string;
    };
    projects: Project[];
    skills: Skill[];
}

export const defaultContent: SiteContent = {
    header: {
        nav: {
            home: "Beranda",
            about: "Tentang",
            projects: "Proyek",
            contact: "Kontak"
        }
    },
    footer: {
        copyright: "© 2025 Portofolio Raynaldo Ananta Wijaya. All rights reserved."
    },
    hero: {
        title: "Hi, Saya Raynaldo Ananta Wijaya",
        description: "Saya memiliki minat pada teknik elektro, robotik, dan pemrograman, dengan fokus menggabungkan teori dan praktik untuk menciptakan solusi inovatif.",
        btnDownload: "Download CV",
        btnProjects: "Lihat Proyek",
        cvFile: "/assets/CV_RAYNALDO_ANANTA_WIJAYA.pdf"
    },
    about: {
        title: "Tentang Saya",
        description: "Halo! Saya Raynaldo Ananta Wijaya, seorang penggemar teknologi yang antusias dengan inovasi di bidang elektronik, robotik, dan pemrograman.",
        stats: {
            projects: "10+",
            projectsLabel: "Proyek Selesai",
            experience: "4+",
            experienceLabel: "Pengalaman Kerja"
        },
        skillsTitle: "Teknologi yang Dikuasai"
    },
    contact: {
        title: "Kontak Saya",
        email: "raynaldoanantawijaya180@gmail.com",
        form: {
            nameLabel: "Nama Lengkap",
            emailLabel: "Email",
            messageLabel: "Pesan",
            btnSubmit: "Kirim Pesan"
        }
    },
    socialLinks: {
        email: "raynaldoanantawijaya180@gmail.com",
        emailIcon: "fas fa-envelope",
        linkedin: "raynaldo-ananta-wijaya-4934b2370",
        linkedinIcon: "fab fa-linkedin",
        instagram: "raynaldo_ananta_wijaya",
        instagramIcon: "fab fa-instagram",
        youtube: "@raynaldo99",
        youtubeIcon: "fab fa-youtube"
    },
    projects: [],
    skills: [
        { title: "HTML5", desc: "Struktur Web & Semantic Markup", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg" },
        { title: "CSS3", desc: "Styling & Responsive Design", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg" },
        { title: "JavaScript", desc: "Interaktivitas & Logic Web", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg" },
        { title: "React", desc: "Frontend Framework", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg" },
        { title: "Python", desc: "Backend & Data Science", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/python/python-original.svg" },
        { title: "Git", desc: "Version Control System", icon: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/git/git-original.svg" }
    ]
};
