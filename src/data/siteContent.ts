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
        cvFilename?: string; // Original uploaded filename
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
        cvFile: "/assets/CV_RAYNALDO_ANANTA_WIJAYA.pdf",
        cvFilename: "CV_RAYNALDO_ANANTA_WIJAYA.pdf"
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
        emailIcon: "M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48H48zM0 176V384c0 35.3 28.7 64 64 64H448c35.3 0 64-28.7 64-64V176L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z",
        linkedin: "raynaldo-ananta-wijaya-4934b2370",
        linkedinIcon: "M100.3 448H7.4V148.9h92.9zM53.8 108.1C24.1 108.1 0 83.5 0 53.8a53.8 53.8 0 0 1 107.6 0c0 29.7-24.1 54.3-53.7 54.3zM447.9 448h-92.7V302.4c0-34.7-.7-79.2-48.3-79.2-48.3 0-55.7 37.7-55.7 76.7V448h-92.8V148.9h89.1v40.8h1.3c12.4-23.5 42.7-48.3 87.9-48.3 94 0 111.3 61.9 111.3 142.3V448z",
        instagram: "raynaldo_ananta_wijaya",
        instagramIcon: "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z",
        youtube: "@raynaldo99",
        youtubeIcon: "M549.7 124.1c-6.3-23.7-24.8-42.3-48.3-48.6C458.8 64 288 64 288 64S117.2 64 74.6 75.5c-23.5 6.3-42 24.9-48.3 48.6-11.4 42.9-11.4 132.3-11.4 132.3s0 89.4 11.4 132.3c6.3 23.7 24.8 41.5 48.3 47.8C117.2 448 288 448 288 448s170.8 0 213.4-11.5c23.5-6.3 42-24.2 48.3-47.8 11.4-42.9 11.4-132.3 11.4-132.3s0-89.4-11.4-132.3zm-317.5 213.5V175.2l142.7 81.2-142.7 81.2z"
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
