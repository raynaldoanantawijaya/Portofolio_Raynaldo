import React, { useState, useRef, useEffect } from 'react';
import type { Project } from '../data/siteContent';

interface Props {
    project: Project;
    onSave: (updatedProject: Project) => void;
    onCancel: () => void;
}

export default function ProjectEditor({ project, onSave, onCancel }: Props) {
    const [title, setTitle] = useState(project.title);
    const [content, setContent] = useState(project.content);
    const [coverImage, setCoverImage] = useState(project.coverImage);
    const [status, setStatus] = useState<'draft' | 'published'>(project.status || 'published');
    const [tags, setTags] = useState<string[]>(project.tags || []);
    const [link, setLink] = useState(project.link);
    const [savedRange, setSavedRange] = useState<Range | null>(null);
    const editorRef = useRef<HTMLDivElement>(null);
    const imageInputRef = useRef<HTMLInputElement>(null);
    const featuredImageInputRef = useRef<HTMLInputElement>(null);
    const colorInputRef = useRef<HTMLInputElement>(null);
    const [activeCommands, setActiveCommands] = useState<Record<string, boolean>>({});
    const [selectedImage, setSelectedImage] = useState<HTMLImageElement | null>(null);
    const [imageRect, setImageRect] = useState<DOMRect | null>(null);
    const [isResizing, setIsResizing] = useState(false);

    // Update active state of formatting commands
    const updateActiveCommands = () => {
        setActiveCommands({
            bold: document.queryCommandState('bold'),
            italic: document.queryCommandState('italic'),
            underline: document.queryCommandState('underline'),
            strikeThrough: document.queryCommandState('strikeThrough'),
            justifyLeft: document.queryCommandState('justifyLeft'),
            justifyCenter: document.queryCommandState('justifyCenter'),
            justifyRight: document.queryCommandState('justifyRight'),
            justifyFull: document.queryCommandState('justifyFull'),
            insertUnorderedList: document.queryCommandState('insertUnorderedList'),
            insertOrderedList: document.queryCommandState('insertOrderedList'),
        });
    };

    // Helper to get image coordinates relative to the canvas
    const getRelativeRect = (img: HTMLImageElement) => {
        const canvas = editorRef.current?.closest('.document-canvas') as HTMLElement;
        if (!canvas) return null;

        const canvasRect = canvas.getBoundingClientRect();
        const imgRect = img.getBoundingClientRect();

        // Account for canvas borders for pixel-perfect absolute positioning
        const style = window.getComputedStyle(canvas);
        const borderTop = parseFloat(style.borderTopWidth) || 0;
        const borderLeft = parseFloat(style.borderLeftWidth) || 0;

        return {
            top: imgRect.top - canvasRect.top - borderTop + canvas.scrollTop,
            left: imgRect.left - canvasRect.left - borderLeft + canvas.scrollLeft,
            width: imgRect.width,
            height: imgRect.height
        } as DOMRect;
    };

    const syncOverlayPosition = (img: HTMLImageElement, rect?: DOMRect) => {
        const r = rect || getRelativeRect(img);
        if (!r) return;

        const overlay = document.getElementById('image-edit-overlay');
        if (overlay) {
            overlay.style.top = `${r.top}px`;
            overlay.style.left = `${r.left}px`;
            overlay.style.width = `${r.width}px`;
            overlay.style.height = `${r.height}px`;

            const tooltip = overlay.querySelector('.size-tooltip');
            if (tooltip) {
                tooltip.textContent = `${Math.round(r.width)}px × ${Math.round(r.height)}px`;
            }
        }
    };

    // Listen for selection changes and scroll
    useEffect(() => {
        let rafId: number;

        const updateOverlay = () => {
            if (selectedImage && selectedImage.parentElement && editorRef.current) {
                rafId = requestAnimationFrame(() => {
                    const rect = getRelativeRect(selectedImage);
                    if (rect) {
                        setImageRect(rect);
                        syncOverlayPosition(selectedImage, rect);
                    }
                });
            }
        };

        const handler = () => {
            const selection = window.getSelection();
            if (selection && selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                if (editorRef.current?.contains(range.commonAncestorContainer)) {
                    updateActiveCommands();
                }
            }

            const target = selection?.focusNode?.childNodes[selection.focusOffset] as HTMLElement;
            if (target?.tagName === 'IMG') {
                // Remove 'selected' class from all images first
                editorRef.current?.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
                target.classList.add('selected');
                setSelectedImage(target as HTMLImageElement);
                updateOverlay();
            } else if (!isResizing) {
                editorRef.current?.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
                setSelectedImage(null);
                setImageRect(null);
            }
        };

        document.addEventListener('selectionchange', handler);
        window.addEventListener('resize', updateOverlay);

        const scrollContainer = editorRef.current?.parentElement?.parentElement;
        scrollContainer?.addEventListener('scroll', updateOverlay, { passive: true });

        return () => {
            document.removeEventListener('selectionchange', handler);
            window.removeEventListener('resize', updateOverlay);
            scrollContainer?.removeEventListener('scroll', updateOverlay);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [selectedImage, isResizing]);

    // Initial content load
    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== project.content) {
            editorRef.current.innerHTML = project.content;
        }
    }, [project.id]);

    const execCommand = (command: string, value: string | undefined = undefined) => {
        document.execCommand(command, false, value);
        if (editorRef.current) {
            setContent(editorRef.current.innerHTML);
        }
        editorRef.current?.focus();
    };

    const handleSave = () => {
        onSave({
            ...project,
            title,
            content,
            coverImage,
            status,
            tags,
            link
        });
    };

    const handleFeaturedImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 500000) {
                alert('File too large (max 500KB)');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                setCoverImage(ev.target?.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const addTag = (tag: string) => {
        if (tag && !tags.includes(tag)) {
            setTags([...tags, tag]);
        }
    };

    const removeTag = (tagToRemove: string) => {
        setTags(tags.filter(t => t !== tagToRemove));
    };

    const preventFocusLoss = (e: React.MouseEvent) => {
        e.preventDefault();
    };

    const handlePaste = async () => {
        try {
            const text = await navigator.clipboard.readText();
            document.execCommand('insertText', false, text);
            if (editorRef.current) {
                setContent(editorRef.current.innerHTML);
            }
        } catch (err) {
            alert('Tidak dapat mengakses clipboard. Gunakan Ctrl+V.');
        }
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) {
                alert('Gambar terlalu besar! Maksimal 2MB.');
                return;
            }
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target?.result as string;
                execCommand('insertImage', dataUrl);

                // Small delay to let the DOM update, then find the newly inserted image
                setTimeout(() => {
                    const images = editorRef.current?.querySelectorAll('img');
                    if (images && images.length > 0) {
                        const lastImg = images[images.length - 1];
                        setSelectedImage(lastImg);
                        const rect = getRelativeRect(lastImg);
                        if (rect) setImageRect(rect);
                    }
                }, 50);
            };
            reader.readAsDataURL(file);
        }
        // Reset input so same file can be selected again
        e.target.value = '';
    };

    // Save current selection before color picker opens
    const saveSelection = () => {
        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
            setSavedRange(selection.getRangeAt(0).cloneRange());
        }
    };

    // Apply color with restored selection
    const applyColor = (color: string) => {
        if (savedRange) {
            const selection = window.getSelection();
            selection?.removeAllRanges();
            selection?.addRange(savedRange);
        }
        execCommand('foreColor', color);
    };

    // Handle click on editor to detect image clicks
    const handleEditorClick = (e: React.MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName === 'IMG') {
            editorRef.current?.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
            target.classList.add('selected');
            setSelectedImage(target as HTMLImageElement);
            const rect = getRelativeRect(target as HTMLImageElement);
            if (rect) setImageRect(rect);
        } else {
            editorRef.current?.querySelectorAll('img').forEach(img => img.classList.remove('selected'));
            setSelectedImage(null);
            setImageRect(null);
        }
    };

    const handleDeleteImage = () => {
        if (selectedImage) {
            selectedImage.remove();
            setSelectedImage(null);
            setImageRect(null);
            if (editorRef.current) {
                setContent(editorRef.current.innerHTML);
            }
        }
    };

    const handleResizeStart = (e: React.PointerEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Capture the pointer to handle movement even outside the element
        const target = e.currentTarget as HTMLElement;
        target.setPointerCapture(e.pointerId);

        setIsResizing(true);
        document.body.style.cursor = 'nwse-resize';
        document.body.style.userSelect = 'none';
        document.body.style.touchAction = 'none'; // Prevent scrolling while resizing

        const startX = e.clientX;
        const startWidth = selectedImage?.offsetWidth || 0;
        let lastMoveEvent: PointerEvent | null = null;
        let ticking = false;

        // Cache canvas info for performance
        const canvas = editorRef.current?.closest('.document-canvas') as HTMLElement;
        let canvasRect = canvas?.getBoundingClientRect();
        const style = window.getComputedStyle(canvas);
        const borderTop = parseFloat(style.borderTopWidth) || 0;
        const borderLeft = parseFloat(style.borderLeftWidth) || 0;

        const updateResize = () => {
            if (!selectedImage || !lastMoveEvent || !canvas) {
                ticking = false;
                return;
            }

            const deltaX = lastMoveEvent.clientX - startX;
            const newWidth = Math.max(50, startWidth + deltaX);

            // 1. Update image directly for instant feedback
            selectedImage.style.width = `${newWidth}px`;
            selectedImage.style.height = 'auto';

            // 2. Direct DOM update for overlay (bypassing React state for zero lag)
            const imgRect = selectedImage.getBoundingClientRect();
            const top = imgRect.top - canvasRect.top - borderTop + canvas.scrollTop;
            const left = imgRect.left - canvasRect.left - borderLeft + canvas.scrollLeft;

            const overlay = document.getElementById('image-edit-overlay');
            if (overlay) {
                overlay.style.top = `${top}px`;
                overlay.style.left = `${left}px`;
                overlay.style.width = `${imgRect.width}px`;
                overlay.style.height = `${imgRect.height}px`;

                const tooltip = overlay.querySelector('.size-tooltip');
                if (tooltip) {
                    tooltip.textContent = `${Math.round(imgRect.width)}px × ${Math.round(imgRect.height)}px`;
                }
            }

            ticking = false;
        };

        const handlePointerMove = (moveEvent: PointerEvent) => {
            if (selectedImage) {
                lastMoveEvent = moveEvent;
                if (!ticking) {
                    requestAnimationFrame(updateResize);
                    ticking = true;
                }
            }
        };

        const handlePointerUp = (upEvent: PointerEvent) => {
            target.releasePointerCapture(upEvent.pointerId);
            setIsResizing(false);
            document.body.style.cursor = '';
            document.body.style.userSelect = '';
            document.body.style.touchAction = '';

            target.removeEventListener('pointermove', handlePointerMove);
            target.removeEventListener('pointerup', handlePointerUp);
            target.removeEventListener('pointercancel', handlePointerUp);

            if (editorRef.current && selectedImage) {
                setContent(editorRef.current.innerHTML);
                // Final state sync for React (one batch update)
                const rect = getRelativeRect(selectedImage);
                if (rect) setImageRect(rect);
            }
        };

        target.addEventListener('pointermove', handlePointerMove);
        target.addEventListener('pointerup', handlePointerUp);
        target.addEventListener('pointercancel', handlePointerUp);
    };

    return (
        <div className="bg-[#121212] font-display text-slate-300 antialiased h-screen flex flex-col overflow-hidden dark">
            {/* Header */}
            <header className="h-14 bg-[#1e1e1e] border-b border-slate-800 flex items-center justify-between px-4 z-50">
                <div className="flex items-center gap-6">
                    <div className="flex items-center gap-2">
                        <div className="bg-primary p-1.5 rounded-lg text-white flex items-center justify-center">
                            <span className="material-symbols-outlined text-[20px]">edit_document</span>
                        </div>
                        <h1 className="text-sm font-bold tracking-tight text-white">CMS ADMIN</h1>
                    </div>
                    <nav className="hidden md:flex items-center gap-1">
                        <button onClick={onCancel} className="px-3 py-1.5 text-sm font-medium text-slate-400 hover:text-primary transition-colors">Dashboard</button>
                        <span className="px-3 py-1.5 text-sm font-medium text-primary bg-primary/10 rounded-md cursor-default">Editor</span>
                    </nav>
                </div>
                <div className="flex items-center gap-4">
                    {/* Search Bar - Visual Only */}
                    <div className="relative hidden sm:block">
                        <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 text-[18px]">search</span>
                        <input className="pl-10 pr-4 py-1.5 text-sm bg-[#262626] border-none text-slate-200 rounded-lg focus:ring-2 focus:ring-primary w-64 placeholder:text-slate-600 outline-none" placeholder="Search..." type="text" />
                    </div>
                    {/* User Profile - Visual Only */}
                    <div className="h-8 w-8 rounded-full bg-slate-800 border border-slate-700 overflow-hidden flex items-center justify-center text-xs font-bold text-slate-400">
                        AU
                    </div>
                </div>
            </header>

            <div className="flex-1 flex overflow-hidden">
                {/* Left Slim Sidebar */}
                <aside className="w-16 bg-[#1e1e1e] border-r border-slate-800 flex flex-col items-center py-4 gap-4">
                    <button className="p-2 text-primary bg-primary/10 rounded-lg" title="Edit Post">
                        <span className="material-symbols-outlined text-[24px]">description</span>
                    </button>
                    <button onClick={onCancel} className="p-2 text-slate-500 hover:text-primary hover:bg-slate-800 rounded-lg transition-colors" title="Back to Dashboard">
                        <span className="material-symbols-outlined text-[24px]">arrow_back</span>
                    </button>
                </aside>

                <main className="flex-1 flex flex-col bg-[#121212] overflow-hidden">
                    {/* Toolbar Header Row */}
                    <div className="px-6 py-3 flex items-center justify-between bg-[#121212]">
                        <div className="flex items-center gap-2 text-sm text-slate-500">
                            <span className="hover:text-primary transition-colors cursor-pointer" onClick={onCancel}>Posts</span>
                            <span className="material-symbols-outlined text-xs">chevron_right</span>
                            <span className="text-slate-300 font-medium">Edit Post</span>
                        </div>
                        <div className="flex items-center gap-3">
                            <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest hidden sm:inline">Unsaved Changes</span>
                            <button onClick={onCancel} className="px-4 py-1.5 text-sm font-semibold border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 transition-colors">Cancel</button>
                            <button onClick={handleSave} className="px-4 py-1.5 text-sm font-semibold bg-primary text-white rounded-lg hover:bg-primary/90 shadow-lg shadow-primary/10 transition-colors">Publish</button>
                        </div>
                    </div>

                    {/* Ribbon Toolbar */}
                    <div className="bg-[#1e1e1e] border-y border-slate-800 px-4 py-2 flex items-center flex-wrap gap-1 overflow-x-auto">
                        <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-2">
                            <button onMouseDown={preventFocusLoss} onClick={handlePaste} className="flex flex-col items-center justify-center p-2 rounded hover:bg-slate-800 transition-colors min-w-[50px]">
                                <span className="material-symbols-outlined text-primary text-[20px]">content_paste</span>
                                <span className="text-[10px] font-medium mt-0.5 text-slate-400">Paste</span>
                            </button>
                        </div>

                        <div className="flex items-center gap-1 border-r border-slate-700 pr-2 mr-2">
                            <div className="flex flex-col gap-1">
                                <div className="flex items-center gap-1">
                                    <select onChange={(e) => execCommand('fontName', e.target.value)} className="text-xs border-slate-700 bg-[#262626] text-slate-300 rounded h-7 w-28 py-0 focus:ring-primary outline-none px-1">
                                        <option value="Inter">Inter</option>
                                        <option value="Arial">Arial</option>
                                        <option value="Times New Roman">Times New Roman</option>
                                        <option value="Courier New">Courier New</option>
                                    </select>
                                    <select onChange={(e) => execCommand('fontSize', e.target.value)} className="text-xs border-slate-700 bg-[#262626] text-slate-300 rounded h-7 w-14 py-0 focus:ring-primary outline-none px-1">
                                        <option value="3">Normal</option>
                                        <option value="1">Small</option>
                                        <option value="4">Large</option>
                                        <option value="5">Huge</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-0.5">
                                    <button
                                        onMouseDown={preventFocusLoss}
                                        onClick={() => { execCommand('bold'); updateActiveCommands(); }}
                                        className={`p-1 rounded transition-colors ${activeCommands.bold ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                        title="Bold"
                                    >
                                        <span className="material-symbols-outlined font-bold text-[18px]">format_bold</span>
                                    </button>
                                    <button
                                        onMouseDown={preventFocusLoss}
                                        onClick={() => { execCommand('italic'); updateActiveCommands(); }}
                                        className={`p-1 rounded transition-colors ${activeCommands.italic ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                        title="Italic"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">format_italic</span>
                                    </button>
                                    <button
                                        onMouseDown={preventFocusLoss}
                                        onClick={() => { execCommand('underline'); updateActiveCommands(); }}
                                        className={`p-1 rounded transition-colors ${activeCommands.underline ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                        title="Underline"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">format_underlined</span>
                                    </button>
                                    <button
                                        onMouseDown={preventFocusLoss}
                                        onClick={() => { execCommand('strikeThrough'); updateActiveCommands(); }}
                                        className={`p-1 rounded transition-colors ${activeCommands.strikeThrough ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                        title="Strikethrough"
                                    >
                                        <span className="material-symbols-outlined text-[18px]">format_strikethrough</span>
                                    </button>
                                    <div className="w-px h-5 bg-slate-800 mx-1"></div>
                                    <input
                                        type="color"
                                        ref={colorInputRef}
                                        onMouseDown={saveSelection}
                                        onChange={(e) => applyColor(e.target.value)}
                                        className="w-6 h-6 p-0 border-0 rounded cursor-pointer bg-transparent"
                                        title="Text Color"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex flex-col gap-1 border-r border-slate-700 pr-2 mr-2">
                            <div className="flex items-center gap-0.5">
                                <button
                                    onMouseDown={preventFocusLoss}
                                    onClick={() => { execCommand('insertUnorderedList'); updateActiveCommands(); }}
                                    className={`p-1 rounded transition-colors ${activeCommands.insertUnorderedList ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    title="Bullets"
                                >
                                    <span className="material-symbols-outlined text-[18px]">format_list_bulleted</span>
                                </button>
                                <button
                                    onMouseDown={preventFocusLoss}
                                    onClick={() => { execCommand('insertOrderedList'); updateActiveCommands(); }}
                                    className={`p-1 rounded transition-colors ${activeCommands.insertOrderedList ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    title="Numbering"
                                >
                                    <span className="material-symbols-outlined text-[18px]">format_list_numbered</span>
                                </button>
                            </div>
                            <div className="flex items-center gap-0.5">
                                <button
                                    onMouseDown={preventFocusLoss}
                                    onClick={() => { execCommand('justifyLeft'); updateActiveCommands(); }}
                                    className={`p-1 rounded transition-colors ${activeCommands.justifyLeft ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    title="Align Left"
                                >
                                    <span className="material-symbols-outlined text-[18px]">format_align_left</span>
                                </button>
                                <button
                                    onMouseDown={preventFocusLoss}
                                    onClick={() => { execCommand('justifyCenter'); updateActiveCommands(); }}
                                    className={`p-1 rounded transition-colors ${activeCommands.justifyCenter ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    title="Align Center"
                                >
                                    <span className="material-symbols-outlined text-[18px]">format_align_center</span>
                                </button>
                                <button
                                    onMouseDown={preventFocusLoss}
                                    onClick={() => { execCommand('justifyRight'); updateActiveCommands(); }}
                                    className={`p-1 rounded transition-colors ${activeCommands.justifyRight ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    title="Align Right"
                                >
                                    <span className="material-symbols-outlined text-[18px]">format_align_right</span>
                                </button>
                                <button
                                    onMouseDown={preventFocusLoss}
                                    onClick={() => { execCommand('justifyFull'); updateActiveCommands(); }}
                                    className={`p-1 rounded transition-colors ${activeCommands.justifyFull ? 'bg-slate-700 text-white shadow-sm' : 'text-slate-400 hover:bg-slate-800 hover:text-slate-200'}`}
                                    title="Justify"
                                >
                                    <span className="material-symbols-outlined text-[18px]">format_align_justify</span>
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center gap-1">
                            <input
                                type="file"
                                ref={imageInputRef}
                                id="body-image-upload"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleImageUpload}
                                className="hidden"
                            />
                            <button
                                type="button"
                                onMouseDown={preventFocusLoss}
                                onClick={() => {
                                    // Use setTimeout to decouple system dialog from React click event
                                    setTimeout(() => {
                                        imageInputRef.current?.click();
                                    }, 0);
                                }}
                                className="flex flex-col items-center justify-center p-2 rounded hover:bg-slate-800 transition-colors min-w-[50px] group"
                                title="Add Image"
                            >
                                <span className="material-symbols-outlined text-slate-400 group-hover:text-primary text-[20px]">image</span>
                                <span className="text-[10px] font-medium mt-0.5 text-slate-500 group-hover:text-slate-400">Image</span>
                            </button>
                        </div>
                    </div>

                    {/* Main Canvas Area */}
                    <div className="flex-1 flex overflow-hidden">
                        <div className="flex-1 overflow-y-auto p-4 md:p-8 flex justify-center bg-[#121212]">
                            <div className="document-canvas relative bg-[#262626] w-full max-w-[850px] min-h-[1100px] p-8 md:p-16 rounded shadow-2xl border border-slate-800/50">
                                <input
                                    className="w-full text-4xl font-extrabold border-none focus:ring-0 p-0 bg-transparent text-white placeholder:text-slate-700 outline-none mb-6"
                                    placeholder="Judul Postingan"
                                    type="text"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                                <div
                                    ref={editorRef}
                                    contentEditable
                                    onInput={(e) => setContent((e.target as HTMLElement).innerHTML)}
                                    onClick={handleEditorClick}
                                    className="prose prose-invert max-w-none text-slate-300 outline-none pb-20 min-h-[500px] prose-ul:list-disc prose-ol:list-decimal prose-ul:list-inside prose-ol:list-inside prose-li:marker:text-slate-400 [&_img]:cursor-pointer [&_img]:transition-all [&_img.selected]:ring-2 [&_img.selected]:ring-primary/50"
                                />

                                {/* Image Editing Overlay - Integrated into Canvas */}
                                {selectedImage && imageRect && (
                                    <div
                                        id="image-edit-overlay"
                                        className="absolute z-[100] pointer-events-none transition-none"
                                        style={{
                                            top: imageRect.top,
                                            left: imageRect.left,
                                            width: imageRect.width,
                                            height: imageRect.height,
                                        }}
                                    >
                                        {/* No external border anymore per user request */}

                                        {/* Delete Button */}
                                        <button
                                            onClick={handleDeleteImage}
                                            className="absolute -top-3 -right-3 w-7 h-7 bg-red-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors pointer-events-auto z-[101]"
                                            title="Hapus Gambar"
                                        >
                                            <span className="material-symbols-outlined text-[18px]">close</span>
                                        </button>

                                        {/* Resize Handle with larger hit area */}
                                        <div
                                            onPointerDown={handleResizeStart}
                                            className="absolute -bottom-4 -right-4 w-10 h-10 flex items-center justify-center cursor-nwse-resize pointer-events-auto z-[101] group/handle touch-none"
                                            title="Tarik untuk mengubah ukuran"
                                        >
                                            <div className="w-4 h-4 bg-white border-2 border-primary rounded-sm shadow-md group-hover/handle:scale-125 group-hover/handle:bg-primary group-hover/handle:border-white transition-all flex items-center justify-center">
                                                <div className="w-1.5 h-1.5 bg-primary group-hover/handle:bg-white rounded-full"></div>
                                            </div>
                                        </div>

                                        {/* Size Tooltip */}
                                        <div className="size-tooltip absolute -bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-[10px] px-2 py-0.5 rounded font-mono border border-slate-700">
                                            {Math.round(imageRect.width)}px × {Math.round(imageRect.height)}px
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right Sidebar - Properties */}
                        <aside className="w-72 bg-[#1e1e1e] border-l border-slate-800 overflow-y-auto flex flex-col">
                            <div className="p-5 border-b border-slate-800">
                                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                                    <span className="material-symbols-outlined text-slate-500 text-[18px]">settings</span>
                                    Post Settings
                                </h3>
                            </div>

                            {/* Publishing */}
                            <div className="p-5 border-b border-slate-800">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Post Status</label>
                                <div className="flex items-center justify-between mb-4">
                                    <span className="text-sm text-slate-400">Status</span>
                                    <select
                                        value={status}
                                        onChange={(e) => setStatus(e.target.value as any)}
                                        className="text-xs bg-[#262626] border-slate-700 rounded text-slate-200 outline-none focus:ring-primary"
                                    >
                                        <option value="draft">Draft</option>
                                        <option value="published">Published</option>
                                    </select>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-slate-400">Author</span>
                                    <span className="text-sm font-semibold text-slate-200">Admin</span>
                                </div>
                            </div>

                            {/* Project Link */}
                            <div className="p-5 border-b border-slate-800">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Project Link</label>
                                <input
                                    type="text"
                                    value={link}
                                    onChange={(e) => setLink(e.target.value)}
                                    className="w-full text-sm border-slate-700 bg-[#262626] text-slate-200 rounded-lg placeholder:text-slate-600 focus:ring-primary focus:border-primary outline-none p-2"
                                    placeholder="https://..."
                                />
                            </div>

                            {/* Tags */}
                            <div className="p-5 border-b border-slate-800">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Tags</label>
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tags.map(tag => (
                                        <span key={tag} className="inline-flex items-center gap-1 bg-[#262626] border border-slate-700 px-2.5 py-1 rounded text-xs font-medium text-slate-300">
                                            {tag}
                                            <button onClick={() => removeTag(tag)} className="material-symbols-outlined !text-[14px] text-slate-500 hover:text-slate-300">close</button>
                                        </span>
                                    ))}
                                </div>
                                <input
                                    type="text"
                                    className="w-full text-sm border-slate-700 bg-[#262626] text-slate-200 rounded-lg placeholder:text-slate-600 focus:ring-primary focus:border-primary outline-none p-2"
                                    placeholder="Add tags..."
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') {
                                            addTag((e.target as HTMLInputElement).value);
                                            (e.target as HTMLInputElement).value = '';
                                        }
                                    }}
                                />
                            </div>

                            {/* Featured Image */}
                            <div className="p-5">
                                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Featured Image</label>
                                <div className="aspect-video rounded-lg border-2 border-dashed border-slate-800 bg-[#262626] flex flex-col items-center justify-center cursor-pointer hover:bg-slate-800 hover:border-slate-700 transition-all group overflow-hidden relative">
                                    {coverImage ? (
                                        <img src={coverImage} className="w-full h-full object-cover" />
                                    ) : (
                                        <>
                                            <span className="material-symbols-outlined text-slate-700 group-hover:text-slate-500 !text-3xl mb-2 transition-colors">add_photo_alternate</span>
                                            <span className="text-xs text-slate-600 group-hover:text-slate-400 transition-colors">Click to upload image</span>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={featuredImageInputRef}
                                        accept="image/jpeg,image/png,image/webp"
                                        onChange={handleFeaturedImageUpload}
                                        className="hidden"
                                    />
                                    <div
                                        onClick={() => {
                                            setTimeout(() => {
                                                featuredImageInputRef.current?.click();
                                            }, 0);
                                        }}
                                        className="absolute inset-0 cursor-pointer"
                                    ></div>
                                </div>
                            </div>
                        </aside>
                    </div>
                </main>
            </div>

        </div>
    );
}
