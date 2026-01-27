import React, { useState, useEffect } from 'react';
import { getContentAsync, saveContentAsync } from '../utils/contentStore';

// @ts-ignore
import type { SiteContent, Project, Skill } from '../data/siteContent';
import ProjectEditor from './ProjectEditor';

const ICON_OPTIONS = [
    // Frontend - Using inline SVGs to match siteContent and prevent external requests
    { name: 'HTML5', url: `<svg viewBox="0 0 128 128"><path fill="#E44D26" d="M19.037 113.876L9.032 1.661h109.936l-10.016 112.198-45.019 12.48z"/><path fill="#F16529" d="M64 116.8l36.378-10.086 8.559-95.878H64z"/><path fill="#EBEBEB" d="M64 52.455H45.788L44.53 38.361H64V24.599H29.489l.33 3.692 3.382 37.927H64zm0 35.743l-.061.017-15.327-4.14-.979-10.975H33.816l1.928 21.609 28.193 7.826.063-.017z"/><path fill="#fff" d="M63.952 52.455v13.763h16.947l-1.597 17.849-15.35 4.143v14.319l28.215-7.82.207-2.325 3.234-36.233.335-3.696h-3.708zm0-27.856v13.762h33.244l.276-3.092.628-6.978.329-3.692z"/></svg>` },
    { name: 'CSS3', url: `<svg viewBox="0 0 128 128"><path fill="#1572B6" d="M18.814 114.123L8.76 1.352h110.48l-10.064 112.754-45.243 12.543-45.119-12.526z"/><path fill="#33A9DC" d="M64.001 117.062l36.559-10.136 8.601-96.354h-45.16v106.49z"/><path fill="#fff" d="M64.001 51.429h18.302l1.264-14.163H64.001V23.435h34.682l-.332 3.711-3.4 38.114h-30.95V51.429z"/><path fill="#EBEBEB" d="M64.083 87.349l-.061.018-15.403-4.159-.985-11.031H33.752l1.937 21.717 28.331 7.863.063-.018v-14.39z"/><path fill="#fff" d="M81.127 64.675l-1.666 18.522-15.426 4.164v14.39l28.354-7.858.208-2.337 2.406-26.881H81.127z"/><path fill="#EBEBEB" d="M64.048 23.435v13.831H30.64l-.277-3.108-.63-7.012-.331-3.711h34.646zm-.047 27.996v13.831H48.792l-.277-3.108-.631-7.012-.33-3.711h16.447z"/></svg>` },
    { name: 'JavaScript', url: `<svg viewBox="0 0 128 128"><path fill="#F0DB4F" d="M1.408 1.408h125.184v125.185H1.408z"/><path fill="#323330" d="M116.347 96.736c-.917-5.711-4.641-10.508-15.672-14.981-3.832-1.761-8.104-3.022-9.377-5.926-.452-1.69-.512-2.642-.226-3.665.821-3.32 4.784-4.355 7.925-3.403 2.023.678 3.938 2.237 5.093 4.724 5.402-3.498 5.391-3.475 9.163-5.879-1.381-2.141-2.118-3.129-3.022-4.045-3.249-3.629-7.676-5.498-14.756-5.355l-3.688.477c-3.534.893-6.902 2.748-8.877 5.235-5.926 6.724-4.236 18.492 2.975 23.335 7.104 5.332 17.54 6.545 18.873 11.531 1.297 6.104-4.486 8.08-10.234 7.378-4.236-.881-6.592-3.034-9.139-6.949-4.688 2.713-4.688 2.713-9.508 5.485 1.143 2.499 2.344 3.63 4.26 5.795 9.068 9.198 31.76 8.746 35.83-5.176.165-.478 1.261-3.666.38-8.581zM69.462 58.943H57.753l-.048 30.272c0 6.438.333 12.34-.714 14.149-1.713 3.558-6.152 3.117-8.175 2.427-2.059-1.012-3.106-2.451-4.319-4.485-.333-.584-.583-1.036-.667-1.071l-9.52 5.83c1.583 3.249 3.915 6.069 6.902 7.901 4.462 2.678 10.459 3.499 16.731 2.059 4.082-1.189 7.604-3.652 9.448-7.401 2.666-4.915 2.094-10.864 2.07-17.444.06-10.735.001-21.468.001-32.237z"/></svg>` },
    { name: 'TypeScript', url: '' }, // Removed
    { name: 'React', url: `<svg viewBox="0 0 128 128"><g fill="#61DAFB"><circle cx="64" cy="64" r="11.4"/><path d="M107.3 45.2c-2.2-.8-4.5-1.6-6.9-2.3.6-2.4 1.1-4.8 1.5-7.1 2.1-13.2-.2-22.5-6.6-26.1-1.9-1.1-4-1.6-6.4-1.6-7 0-15.9 5.2-24.9 13.9-9-8.7-17.9-13.9-24.9-13.9-2.4 0-4.5.5-6.4 1.6-6.4 3.7-8.7 13-6.6 26.1.4 2.3.9 4.7 1.5 7.1-2.4.7-4.7 1.4-6.9 2.3C8.2 50 1.4 56.6 1.4 64s6.9 14 19.3 18.8c2.2.8 4.5 1.6 6.9 2.3-.6 2.4-1.1 4.8-1.5 7.1-2.1 13.2.2 22.5 6.6 26.1 1.9 1.1 4 1.6 6.4 1.6 7.1 0 16-5.2 24.9-13.9 9 8.7 17.9 13.9 24.9 13.9 2.4 0 4.5-.5 6.4-1.6 6.4-3.7 8.7-13 6.6-26.1-.4-2.3-.9-4.7-1.5-7.1 2.4-.7 4.7-1.4 6.9-2.3 12.5-4.8 19.3-11.4 19.3-18.8s-6.8-14-19.3-18.8zM92.5 14.7c4.1 2.4 5.5 9.8 3.8 20.3-.3 2.1-.8 4.3-1.4 6.6-5.2-1.2-10.7-2-16.5-2.5-3.4-4.8-6.9-9.1-10.4-13 7.4-7.3 14.9-12.3 21-12.3 1.3 0 2.5.3 3.5.9zM81.3 74c-1.8 3.2-3.9 6.4-6.1 9.6-3.7.3-7.4.4-11.2.4-3.9 0-7.6-.1-11.2-.4-2.2-3.2-4.2-6.4-6-9.6-1.9-3.3-3.7-6.7-5.3-10 1.6-3.3 3.4-6.7 5.3-10 1.8-3.2 3.9-6.4 6.1-9.6 3.7-.3 7.4-.4 11.2-.4 3.9 0 7.6.1 11.2.4 2.2 3.2 4.2 6.4 6 9.6 1.9 3.3 3.7 6.7 5.3 10-1.7 3.3-3.4 6.6-5.3 10zm8.3-3.3c1.5 3.5 2.7 6.9 3.8 10.3-3.4.8-7 1.4-10.8 1.9 1.2-1.9 2.5-3.9 3.6-6 1.2-2.1 2.3-4.2 3.4-6.2zM64 97.8c-2.4-2.6-4.7-5.4-6.9-8.3 2.3.1 4.6.2 6.9.2 2.3 0 4.6-.1 6.9-.2-2.2 2.9-4.5 5.7-6.9 8.3zm-18.6-15c-3.8-.5-7.4-1.1-10.8-1.9 1.1-3.3 2.3-6.8 3.8-10.3 1.1 2 2.2 4.1 3.4 6.1 1.2 2.2 2.4 4.1 3.6 6.1zm-7-25.5c-1.5-3.5-2.7-6.9-3.8-10.3 3.4-.8 7-1.4 10.8-1.9-1.2 1.9-2.5 3.9-3.6 6-1.2 2.1-2.3 4.2-3.4 6.2zM64 30.2c2.4 2.6 4.7 5.4 6.9 8.3-2.3-.1-4.6-.2-6.9-.2-2.3 0-4.6.1-6.9.2 2.2-2.9 4.5-5.7 6.9-8.3zm22.2 21l-3.6-6c3.8.5 7.4 1.1 10.8 1.9-1.1 3.3-2.3 6.8-3.8 10.3-1.1-2.1-2.2-4.2-3.4-6.2zM31.7 35c-1.7-10.5-.3-17.9 3.8-20.3 1-.6 2.2-.9 3.5-.9 6 0 13.5 4.9 21 12.3-3.5 3.8-7 8.2-10.4 13-5.8.5-11.3 1.4-16.5 2.5-.6-2.3-1-4.5-1.4-6.6zM7 64c0-4.7 5.7-9.7 15.7-13.4 2-.8 4.2-1.5 6.4-2.1 1.6 5 3.6 10.3 6 15.6-2.4 5.3-4.5 10.5-6 15.5C15.3 75.6 7 69.6 7 64zm28.5 49.3c-4.1-2.4-5.5-9.8-3.8-20.3.3-2.1.8-4.3 1.4-6.6 5.2 1.2 10.7 2 16.5 2.5 3.4 4.8 6.9 9.1 10.4 13-7.4 7.3-14.9 12.3-21 12.3-1.3 0-2.5-.3-3.5-.9zM96.3 93c1.7 10.5.3 17.9-3.8 20.3-1 .6-2.2.9-3.5.9-6 0-13.5-4.9-21-12.3 3.5-3.8 7-8.2 10.4-13 5.8-.5 11.3-1.4 16.5-2.5.6 2.3 1 4.5 1.4 6.6zm9-15.6c-2 .8-4.2 1.5-6.4 2.1-1.6-5-3.6-10.3-6-15.6 2.4-5.3 4.5-10.5 6-15.5 13.8 4 22.1 10 22.1 15.6 0 4.7-5.8 9.7-15.7 13.4z"/></g></svg>` },
    { name: 'Vue.js', url: '' },
    { name: 'Angular', url: '' },
    { name: 'Svelte', url: '' },
    { name: 'Next.js', url: '' },
    { name: 'Nuxt.js', url: '' },
    { name: 'Astro', url: '' },
    { name: 'Tailwind', url: '' },
    { name: 'Bootstrap', url: '' },
    { name: 'Sass', url: '' },
    { name: 'jQuery', url: '' },
    // Backend
    { name: 'Node.js', url: '' },
    { name: 'Express', url: '' },
    { name: 'Python', url: `<svg viewBox="0 0 128 128"><linearGradient id="python-original-a" gradientUnits="userSpaceOnUse" x1="70.252" y1="1237.476" x2="170.659" y2="1151.089" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#5A9FD4"/><stop offset="1" stop-color="#306998"/></linearGradient><linearGradient id="python-original-b" gradientUnits="userSpaceOnUse" x1="209.474" y1="1098.811" x2="173.62" y2="1149.537" gradientTransform="matrix(.563 0 0 -.568 -29.215 707.817)"><stop offset="0" stop-color="#FFD43B"/><stop offset="1" stop-color="#FFE873"/></linearGradient><path fill="url(#python-original-a)" d="M63.391 1.988c-4.222.02-8.252.379-11.8 1.007-10.45 1.846-12.346 5.71-12.346 12.837v9.411h24.693v3.137H29.977c-7.176 0-13.46 4.313-15.426 12.521-2.268 9.405-2.368 15.275 0 25.096 1.755 7.311 5.947 12.519 13.124 12.519h8.491V67.234c0-8.151 7.051-15.34 15.426-15.34h24.665c6.866 0 12.346-5.654 12.346-12.548V15.833c0-6.693-5.646-11.72-12.346-12.837-4.244-.706-8.645-1.027-12.866-1.008zM50.037 9.557c2.55 0 4.634 2.117 4.634 4.721 0 2.593-2.083 4.69-4.634 4.69-2.56 0-4.633-2.097-4.633-4.69-.001-2.604 2.073-4.721 4.633-4.721z" transform="translate(0 10.26)"/><path fill="url(#python-original-b)" d="M91.682 28.38v10.966c0 8.5-7.208 15.655-15.426 15.655H51.591c-6.756 0-12.346 5.783-12.346 12.549v23.515c0 6.691 5.818 10.628 12.346 12.547 7.816 2.297 15.312 2.713 24.665 0 6.216-1.801 12.346-5.423 12.346-12.547v-9.412H63.938v-3.138h37.012c7.176 0 9.852-5.005 12.348-12.519 2.578-7.735 2.467-15.174 0-25.096-1.774-7.145-5.161-12.521-12.348-12.521h-9.268zM77.809 87.927c2.561 0 4.634 2.097 4.634 4.692 0 2.602-2.074 4.719-4.634 4.719-2.55 0-4.633-2.117-4.633-4.719 0-2.595 2.083-4.692 4.633-4.692z" transform="translate(0 10.26)"/><radialGradient id="python-original-c" cx="1825.678" cy="444.45" r="26.743" gradientTransform="matrix(0 -.24 -1.055 0 532.979 557.576)" gradientUnits="userSpaceOnUse"><stop offset="0" stop-color="#B8B8B8" stop-opacity=".498"/><stop offset="1" stop-color="#7F7F7F" stop-opacity="0"/></radialGradient><path opacity=".444" fill="url(#python-original-c)" d="M97.309 119.597c0 3.543-14.816 6.416-33.091 6.416-18.276 0-33.092-2.873-33.092-6.416 0-3.544 14.815-6.417 33.092-6.417 18.275 0 33.091 2.872 33.091 6.417z"/></svg>` },
    { name: 'Django', url: '' },
    { name: 'Flask', url: '' },
    { name: 'FastAPI', url: '' },
    { name: 'PHP', url: '' },
    { name: 'Laravel', url: '' },
    { name: 'Java', url: '' },
    { name: 'Spring', url: '' },
    { name: 'Go', url: '' },
    { name: 'Ruby', url: '' },
    { name: 'Rails', url: '' },
    { name: 'Rust', url: '' },
    { name: 'C', url: '' },
    { name: 'C++', url: '' }, // Removed
    { name: 'C#', url: '' },
    { name: '.NET', url: '' },
    { name: 'Kotlin', url: '' },
    { name: 'Swift', url: '' },
    // Database
    { name: 'MySQL', url: '' },
    { name: 'PostgreSQL', url: '' },
    { name: 'MongoDB', url: '' },
    { name: 'Redis', url: '' },
    { name: 'Firebase', url: '' },
    { name: 'SQLite', url: '' },
    { name: 'Oracle', url: '' },
    // Cloud & DevOps
    { name: 'AWS', url: '' },
    { name: 'Google Cloud', url: '' },
    { name: 'Azure', url: '' },
    { name: 'Vercel', url: '' },
    { name: 'Netlify', url: '' },
    { name: 'Docker', url: '' },
    { name: 'Kubernetes', url: '' },
    { name: 'Nginx', url: '' },
    { name: 'Apache', url: '' },
    // Tools
    { name: 'Git', url: `<svg viewBox="0 0 128 128"><path fill="#F34F29" d="M124.737 58.378L69.621 3.264c-3.172-3.174-8.32-3.174-11.497 0L46.68 14.71l14.518 14.518c3.375-1.139 7.243-.375 9.932 2.314 2.703 2.706 3.461 6.607 2.294 9.993l13.992 13.993c3.385-1.167 7.292-.413 9.994 2.295 3.78 3.777 3.78 9.9 0 13.679a9.673 9.673 0 01-13.683 0 9.677 9.677 0 01-2.105-10.521L68.574 47.933l-.002 34.341a9.708 9.708 0 012.559 1.828c3.778 3.777 3.778 9.898 0 13.683-3.779 3.777-9.904 3.777-13.679 0-3.778-3.784-3.778-9.905 0-13.683a9.65 9.65 0 013.167-2.11V47.333a9.581 9.581 0 01-3.167-2.111c-2.862-2.86-3.551-7.06-2.083-10.576L41.056 20.333 3.264 58.123a8.133 8.133 0 000 11.5l55.117 55.114c3.174 3.174 8.32 3.174 11.499 0l54.858-54.858a8.135 8.135 0 00-.001-11.501z"/></svg>` },
    { name: 'GitHub', url: '' },
    { name: 'GitLab', url: '' },
    { name: 'VS Code', url: '' },
    { name: 'Figma', url: '' },
    { name: 'Photoshop', url: '' }
]; { name: 'Illustrator', url: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/illustrator/illustrator-plain.svg' },
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
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const cvInputRef = React.useRef<HTMLInputElement>(null);

    // UI Animations State
    const [uploadProgress, setUploadProgress] = useState<number | null>(null);
    const [uploadStats, setUploadStats] = useState<string>('');
    const [deleteCountdown, setDeleteCountdown] = useState<number | null>(null);
    const [isDirty, setIsDirty] = useState(false);
    const [autoSaveTimer, setAutoSaveTimer] = useState(60);

    // Custom Modal State
    const [modal, setModal] = useState<{
        isOpen: boolean;
        type: 'alert' | 'confirm';
        message: string;
        onConfirm?: () => void;
    }>({ isOpen: false, type: 'alert', message: '' });

    const showAlert = (message: string) => {
        setModal({ isOpen: true, type: 'alert', message, onConfirm: () => setModal(prev => ({ ...prev, isOpen: false })) });
    };

    const showConfirm = (message: string, onConfirm: () => void) => {
        setModal({ isOpen: true, type: 'confirm', message, onConfirm });
    };

    const closeModal = () => {
        setModal(prev => ({ ...prev, isOpen: false }));
    };

    const formatBytes = (bytes: number, decimals = 2) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    useEffect(() => {
        const load = async () => {
            const data = await getContentAsync();
            setContent(data);
        };
        load();
    }, []);

    // Auto-save Interval Effect
    useEffect(() => {
        let interval: NodeJS.Timeout;

        if (isDirty && !isSaving) {
            interval = setInterval(() => {
                setAutoSaveTimer((prev) => {
                    if (prev <= 1) {
                        handleSave(true); // Trigger silent save
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            setAutoSaveTimer(60);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [isDirty, isSaving, content]);

    const handleSave = async (silent = false) => {
        if (!content) return false;
        setIsSaving(true);
        const success = await saveContentAsync(content);
        if (success) {
            if (!silent) showAlert('Perubahan berhasil disimpan ke Firestore!');
            setIsDirty(false); // Reset dirty state
            setAutoSaveTimer(60); // Reset timer after save
        } else {
            if (!silent) showAlert('Gagal menyimpan perubahan. Cek koneksi internet atau izin.');
        }
        setIsSaving(false);
        return success;
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
            setIsDirty(true);
        } else if (typeof content[section] === 'object' && !Array.isArray(content[section])) {
            setContent({
                ...content,
                [section]: {
                    ...(content[section] as any),
                    [key]: value
                }
            });
            setIsDirty(true);
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
        setIsDirty(true);
        setEditingProject(null); // Close editor
        showAlert('Project diperbarui! Jangan lupa klik "Simpan Perubahan" di sidebar untuk menyimpan ke server.');
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
        showConfirm('Are you sure you want to delete this project?', () => {
            if (content) {
                const newProjects = content.projects.filter(p => p.id !== id);
                const newContent = { ...content, projects: newProjects };
                setContent(newContent);
                setIsDirty(true);
            }
        });
    };

    // Skills Logic
    const handleSkillChange = (index: number, field: string, value: string) => {
        if (!content) return;
        const newSkills = [...content.skills];
        newSkills[index] = { ...newSkills[index], [field]: value };
        setContent({ ...content, skills: newSkills });
        setIsDirty(true);
    };

    const addSkill = () => {
        if (!content) return;
        const newSkill: Skill = { title: 'New Skill', desc: 'Description', icon: ICON_OPTIONS[0].url };
        setContent({ ...content, skills: [...content.skills, newSkill] });
        setIsDirty(true);
    };

    const removeSkill = (index: number) => {
        if (!content) return;
        setContent({ ...content, skills: content.skills.filter((_, i) => i !== index) });
        setIsDirty(true);
    };

    const handleCVUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 3 * 1024 * 1024) { // 3MB limit
                showAlert('Ukuran file terlalu besar! Maksimal 3MB.');
                return;
            }

            const fileSizeFormatted = formatBytes(file.size);
            setUploadStats(fileSizeFormatted);
            setUploadProgress(0); // Start progress

            // Convert to Base64
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64File = reader.result as string;

                // Use XHR for accurate upload progress tracking
                const xhr = new XMLHttpRequest();
                xhr.open('POST', '/api/github-cv', true);
                xhr.setRequestHeader('Content-Type', 'application/json');

                xhr.upload.onprogress = (event) => {
                    if (event.lengthComputable) {
                        const percentComplete = (event.loaded / event.total) * 100;
                        setUploadProgress(Math.round(percentComplete));
                    }
                };

                xhr.onload = async () => {
                    if (xhr.status === 200) {
                        setUploadProgress(100);
                        setTimeout(() => {
                            if (content) {
                                setContent({
                                    ...content,
                                    hero: {
                                        ...content.hero,
                                        cvFile: '/assets/CV_RAYNALDO_ANANTA_WIJAYA.pdf',
                                        cvFilename: file.name
                                    }
                                });
                                setIsDirty(true);
                            }
                            setUploadProgress(null);
                            setUploadStats('');
                            showAlert('CV berhasil diupload! Website akan update dalam 1-2 menit.');
                        }, 500);
                    } else {
                        let errorMsg = 'Unknown error';
                        try {
                            const data = JSON.parse(xhr.responseText);
                            errorMsg = data.error || errorMsg;
                        } catch (e) {
                            console.error('Error parsing error response', e);
                        }
                        setUploadProgress(null);
                        console.error('Upload Error:', xhr.responseText);
                        showAlert(`Gagal upload: ${errorMsg}`);
                    }
                };

                xhr.onerror = () => {
                    setUploadProgress(null);
                    showAlert('Gagal upload: Network Error');
                };

                xhr.send(JSON.stringify({ action: 'upload', file: base64File }));
            };

            reader.onerror = (error) => {
                setUploadProgress(null);
                console.error('File reading error:', error);
                showAlert('Gagal membaca file local.');
            };
        }
    };

    const handleCVDelete = async () => {
        if (!content?.hero.cvFile) return;

        showConfirm('Hapus CV? Ini akan memicu build ulang.', async () => {
            setDeleteCountdown(30); // Start 30s timer

            // Start Timer Interval
            const timerId = setInterval(() => {
                setDeleteCountdown(prev => {
                    if (prev === null || prev <= 1) {
                        clearInterval(timerId);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            try {
                const response = await fetch('/api/github-cv', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ action: 'delete' })
                });

                const data = await response.json();
                if (!response.ok) throw new Error(data.error || 'Delete failed');

                // Wait until timer finishes to handle UI
                setTimeout(() => {
                    setDeleteCountdown(null);
                    setContent(prev => prev ? ({
                        ...prev,
                        hero: {
                            ...prev.hero,
                            cvFile: ''
                        }
                    }) : null);
                    showAlert('CV Dihapus. Mohon tunggu build selesai (1-2 menit).');
                }, 30000);

            } catch (error: any) {
                clearInterval(timerId);
                setDeleteCountdown(null);
                console.error('Delete error details:', error);
                showAlert(`Gagal menghapus CV: ${error.message || 'Unknown error'}`);
            }
        });
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
        <div className="flex h-screen bg-[#121212] font-display text-slate-300 overflow-hidden flex-col lg:flex-row">

            {/* Mobile Header */}
            <div className="lg:hidden h-16 bg-[#1e1e1e] border-b border-slate-800 flex items-center justify-between px-4 shrink-0 z-30">
                <div className="flex items-center gap-3">
                    <div className="bg-primary p-1.5 rounded-lg text-white">
                        <span className="material-symbols-outlined text-[20px]">dataset</span>
                    </div>
                    <span className="font-bold text-white text-lg">CMS Admin</span>
                </div>
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className="text-slate-400 hover:text-white p-2"
                >
                    <span className="material-symbols-outlined">menu</span>
                </button>
            </div>

            {/* Mobile Backdrop */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`
                fixed inset-y-0 left-0 w-64 bg-[#1e1e1e] border-r border-slate-800 flex flex-col z-50
                transform transition-transform duration-300 ease-in-out
                ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
                lg:relative lg:translate-x-0 lg:z-10
            `}>
                <div className="p-6 border-b border-slate-800 flex flex-col gap-3 relative">
                    {/* Close Button (Mobile Only) */}
                    <button
                        onClick={() => setIsSidebarOpen(false)}
                        className="absolute top-4 right-4 lg:hidden text-slate-500 hover:text-white"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>

                    <div className="flex items-center gap-3">
                        <div className="bg-primary p-2 rounded-lg text-white">
                            <span className="material-symbols-outlined">dataset</span>
                        </div>
                        <h1 className="font-bold text-lg tracking-tight">CMS Admin</h1>
                    </div>

                    {/* Admin Status */}
                    <div className="text-xs text-slate-500 bg-slate-800/50 p-2 rounded border border-slate-700 flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                            <span>Status: Cloud</span>
                            <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        </div>
                        {isDirty && (
                            <div className="flex items-center justify-between text-primary border-t border-slate-700/50 pt-2 animate-pulse">
                                <div className="flex items-center gap-1.5">
                                    <span className={`material-symbols-outlined text-[14px] ${isSaving ? 'animate-spin' : ''}`}>sync</span>
                                    <span>Auto-save {isSaving ? '...' : `in ${autoSaveTimer}s`}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* SAVE BUTTON */}
                    <button
                        onClick={() => handleSave()}
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
                        onClick={async () => {
                            const { logoutAdmin } = await import('../lib/authService');

                            if (isDirty) {
                                setIsSaving(true);
                                const saved = await handleSave(true);
                                if (saved) {
                                    await logoutAdmin();
                                } else {
                                    showConfirm('Gagal auto-save. Yakin ingin keluar tanpa menyimpan?', async () => {
                                        await logoutAdmin();
                                    });
                                }
                                setIsSaving(false);
                            } else {
                                await logoutAdmin();
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 text-red-500 hover:bg-red-900/10 py-2.5 rounded-lg font-medium transition-colors"
                    >
                        <span className="material-symbols-outlined text-[18px]">logout</span>
                        Keluar
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto relative z-10 p-4 sm:p-8 bg-[#121212]">
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

                                                {/* Upload Progress UI */}
                                                {uploadProgress !== null && (
                                                    <div className="mt-3 space-y-1 animate-in fade-in slide-in-from-top-2 duration-300">
                                                        <div className="flex justify-between text-xs text-slate-400 font-mono">
                                                            <span>Uploading... {uploadStats}</span>
                                                            <span>{uploadProgress}%</span>
                                                        </div>
                                                        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden border border-slate-700">
                                                            <div
                                                                className="bg-primary h-full transition-all duration-300 ease-out shadow-[0_0_10px_rgba(var(--color-primary),0.5)]"
                                                                style={{ width: `${uploadProgress}%` }}
                                                            ></div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        {content.hero.cvFile ? (
                                            <div className="flex items-center gap-3 p-3 bg-primary/10 rounded-lg border border-primary/20 relative overflow-hidden">

                                                {/* Delete Countdown Overlay */}
                                                {deleteCountdown !== null && (
                                                    <div className="absolute inset-0 bg-red-900/95 z-20 flex flex-col items-center justify-center text-white backdrop-blur-sm px-4 text-center animate-in fade-in duration-200">
                                                        <div className="font-bold text-2xl mb-1 font-mono">{deleteCountdown}s</div>
                                                        <p className="text-[10px] uppercase tracking-wider font-semibold">Menghapus & Build Ulang...</p>
                                                    </div>
                                                )}

                                                <span className="material-symbols-outlined text-primary">description</span>
                                                <div className="flex-1 overflow-hidden">
                                                    <p className="text-sm font-medium text-white truncate" title={content.hero.cvFilename || 'File CV Tersimpan'}>
                                                        {content.hero.cvFilename || 'File CV Tersimpan'}
                                                    </p>
                                                    <p className="text-xs text-primary truncate">Siap didownload public</p>
                                                </div>
                                                <button
                                                    onClick={handleCVDelete}
                                                    className="text-slate-400 hover:text-red-500 transition-colors p-2 hover:bg-red-500/10 rounded-full"
                                                    title="Hapus File"
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

            {/* Custom Modal Overlay */}
            {modal.isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
                    <div className="bg-[#1e1e1e] border border-slate-700 rounded-xl p-6 max-w-sm w-full shadow-2xl scale-100 animate-in zoom-in-95 duration-200 mx-4">
                        <div className="flex flex-col items-center text-center">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${modal.type === 'alert' ? 'bg-primary/20 text-primary' : 'bg-yellow-500/20 text-yellow-500'}`}>
                                <span className="material-symbols-outlined text-2xl">
                                    {modal.type === 'alert' ? 'info' : 'warning'}
                                </span>
                            </div>
                            <h3 className="text-lg font-bold text-white mb-2">
                                {modal.type === 'alert' ? 'Informasi' : 'Konfirmasi'}
                            </h3>
                            <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                                {modal.message}
                            </p>

                            <div className="flex gap-3 w-full">
                                {modal.type === 'confirm' && (
                                    <button
                                        onClick={closeModal}
                                        className="flex-1 px-4 py-2 border border-slate-600 rounded-lg text-slate-300 hover:bg-slate-800 transition-colors font-medium text-sm"
                                    >
                                        Batal
                                    </button>
                                )}
                                <button
                                    onClick={() => {
                                        if (modal.onConfirm) modal.onConfirm();
                                        if (modal.type === 'alert') closeModal(); // Auto close alert, confirm usually navigates away or runs logic that might want to keep it open or close it manually
                                        if (modal.type === 'confirm') closeModal();
                                    }}
                                    className={`flex-1 px-4 py-2 rounded-lg text-white font-medium text-sm transition-colors shadow-lg ${modal.type === 'confirm' ? 'bg-red-600 hover:bg-red-500 shadow-red-900/20' : 'bg-primary hover:bg-primary-light shadow-primary/20'}`}
                                >
                                    {modal.type === 'confirm' ? 'Ya, Lanjutkan' : 'Mengerti'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
