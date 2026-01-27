import React, { useEffect, useState } from 'react';
import { getContent } from '../utils/contentStore';
import type { Project } from '../data/siteContent';

interface ProjectSelectorProps {
    initialProjects?: Project[];
}

export default function ProjectSelector({ initialProjects }: ProjectSelectorProps) {
    const [projects, setProjects] = useState<Project[]>([]);

    useEffect(() => {
        if (initialProjects && initialProjects.length > 0) {
            setProjects(initialProjects.filter(p => p.status !== 'draft'));
        } else {
            const content = getContent();
            setProjects((content.projects || []).filter(p => p.status !== 'draft'));
        }
    }, [initialProjects]);

    if (projects.length === 0) {
        return <div style={{ textAlign: 'center', color: '#888', padding: '40px' }}>Belum ada proyek.</div>;
    }

    return (
        <div className="projects-grid">
            {projects.map((project) => (
                <div key={project.id} className="project-card fade-in">
                    <div className="project-card-image">
                        {project.coverImage ? (
                            <img src={project.coverImage} alt={project.title} loading="lazy" />
                        ) : (
                            <div className="project-placeholder">
                                <span>No Image</span>
                            </div>
                        )}
                    </div>
                    <div className="project-card-content">
                        <h3 className="project-card-title">{project.title}</h3>
                        <div
                            className="project-card-desc"
                            dangerouslySetInnerHTML={{
                                __html: project.content.length > 150
                                    ? project.content.substring(0, 150) + '...'
                                    : project.content
                            }}
                        />
                        {project.tags && project.tags.length > 0 && (
                            <div className="project-card-tags">
                                {project.tags.slice(0, 3).map((tag, idx) => (
                                    <span key={idx} className="project-tag">{tag}</span>
                                ))}
                            </div>
                        )}
                        <a
                            href={`/proyek/detail?id=${project.id}`}
                            className="project-link-btn"
                        >
                            Lihat Proyek →
                        </a>
                    </div>
                </div>
            ))}
        </div>
    );
}
