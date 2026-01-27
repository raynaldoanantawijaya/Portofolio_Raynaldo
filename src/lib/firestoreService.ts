// Firestore service for site content
import { db } from './firebase';
import {
    doc,
    getDoc,
    setDoc,
    collection,
    getDocs,
    updateDoc,
    deleteDoc,
    addDoc
} from 'firebase/firestore';
import { defaultContent, type SiteContent, type Project, type Skill } from '../data/siteContent';

const SITE_CONTENT_DOC = 'main';
const COLLECTION_NAME = 'siteContent';

// Simple in-memory cache
let cachedContent: SiteContent | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Get all site content
export async function getSiteContent(): Promise<SiteContent> {
    const now = Date.now();

    // Serve from cache if valid
    if (cachedContent && (now - lastFetchTime < CACHE_TTL)) {
        console.log('Serving site content from cache');
        return cachedContent;
    }

    try {
        console.log('Fetching site content from Firestore...');
        const docRef = doc(db, COLLECTION_NAME, SITE_CONTENT_DOC);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log('Document found!', docSnap.data());
            const data = docSnap.data() as SiteContent;
            // Merge with defaults to ensure all fields exist
            cachedContent = {
                ...defaultContent,
                ...data,
                hero: { ...defaultContent.hero, ...data.hero },
                about: { ...defaultContent.about, ...data.about },
                socialLinks: { ...defaultContent.socialLinks, ...data.socialLinks },
                projects: data.projects?.length > 0 ? data.projects : defaultContent.projects,
                skills: data.skills?.length > 0 ? data.skills : defaultContent.skills,
            };
            lastFetchTime = now;
            return cachedContent;
        }

        console.log('No document found, initializing default data...');
        // If no data exists, initialize with defaults
        await setDoc(docRef, defaultContent);
        cachedContent = defaultContent;
        lastFetchTime = now;
        return defaultContent;
    } catch (error) {
        console.error('Error getting site content:', error);
        // Fallback to cache even if expired ensuring page doesn't crash
        if (cachedContent) return cachedContent;
        return defaultContent;
    }
}

// Save all site content
export async function saveSiteContent(content: SiteContent): Promise<boolean> {
    try {
        console.log('Converting content to Firestore format...', content);
        const docRef = doc(db, COLLECTION_NAME, SITE_CONTENT_DOC);

        // Clean undefined values if any (Firestore hates undefined)
        const cleanContent = JSON.parse(JSON.stringify(content));

        await setDoc(docRef, cleanContent, { merge: true });

        // Invalidate cache
        cachedContent = null;

        console.log('Content saved successfully to Firestore!');
        return true;
    } catch (error) {
        console.error('Error saving site content:', error);
        return false;
    }
}

// Update specific section
export async function updateSection(section: keyof SiteContent, data: any): Promise<boolean> {
    try {
        const docRef = doc(db, COLLECTION_NAME, SITE_CONTENT_DOC);
        await updateDoc(docRef, { [section]: data });
        return true;
    } catch (error) {
        console.error('Error updating section:', error);
        return false;
    }
}

// Projects CRUD
export async function saveProjects(projects: Project[]): Promise<boolean> {
    return updateSection('projects', projects);
}

// Skills CRUD  
export async function saveSkills(skills: Skill[]): Promise<boolean> {
    return updateSection('skills', skills);
}

// Social Links
export async function saveSocialLinks(socialLinks: SiteContent['socialLinks']): Promise<boolean> {
    return updateSection('socialLinks', socialLinks);
}

// Hero section
export async function saveHero(hero: SiteContent['hero']): Promise<boolean> {
    return updateSection('hero', hero);
}

// About section
export async function saveAbout(about: SiteContent['about']): Promise<boolean> {
    return updateSection('about', about);
}
