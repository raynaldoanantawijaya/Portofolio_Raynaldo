
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
    try {
        const body = await request.json();
        const { action, file, message } = body; // action: 'upload' | 'delete'

        const GITHUB_TOKEN = import.meta.env.GITHUB_TOKEN;
        const GITHUB_OWNER = import.meta.env.GITHUB_OWNER || 'raynaldoanantawijaya';
        const GITHUB_REPO = import.meta.env.GITHUB_REPO || 'Portofolio_Raynaldo';
        const BRANCH = 'main';
        const FILE_PATH = 'public/assets/cv.pdf'; // Fixed path for simplicity and cleaner URL

        if (!GITHUB_TOKEN) {
            return new Response(JSON.stringify({ error: 'Server config error: GITHUB_TOKEN missing' }), { status: 500 });
        }

        const apiUrl = `https://api.github.com/repos/${GITHUB_OWNER}/${GITHUB_REPO}/contents/${FILE_PATH}`;

        // 1. Get current file SHA (needed for update/delete)
        let currentSha = '';
        try {
            const getRes = await fetch(`${apiUrl}?ref=${BRANCH}`, {
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-CMS'
                }
            });
            if (getRes.ok) {
                const getData = await getRes.json();
                currentSha = getData.sha;
            }
        } catch (e) {
            console.warn('File does not exist yet or fetch failed', e);
        }

        // 2. Handle Actions
        if (action === 'upload') {
            if (!file) return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400 });

            // GitHub API expects Base64 content
            // The client sends data:application/pdf;base64,..... -> we need just the comma part
            const base64Content = file.split(',')[1];

            const putBody = {
                message: message || 'chore: update CV file from admin panel',
                content: base64Content,
                branch: BRANCH,
                ...(currentSha && { sha: currentSha }) // Include SHA if updating
            };

            const putRes = await fetch(apiUrl, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-CMS',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(putBody)
            });

            if (!putRes.ok) {
                const errorData = await putRes.json();
                throw new Error(`GitHub Upload Failed: ${errorData.message}`);
            }

            const data = await putRes.json();
            return new Response(JSON.stringify({ success: true, url: '/assets/cv.pdf', commit: data.commit.sha }), { status: 200 });

        } else if (action === 'delete') {
            if (!currentSha) {
                return new Response(JSON.stringify({ error: 'File not found, cannot delete' }), { status: 404 });
            }

            const deleteBody = {
                message: message || 'chore: delete CV file from admin panel',
                sha: currentSha,
                branch: BRANCH
            };

            const delRes = await fetch(apiUrl, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${GITHUB_TOKEN}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'User-Agent': 'Portfolio-CMS',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(deleteBody)
            });

            if (!delRes.ok) {
                const errorData = await delRes.json();
                throw new Error(`GitHub Delete Failed: ${errorData.message}`);
            }

            return new Response(JSON.stringify({ success: true }), { status: 200 });
        }

        return new Response(JSON.stringify({ error: 'Invalid action' }), { status: 400 });

    } catch (error: any) {
        console.error('GitHub API Error:', error);
        return new Response(JSON.stringify({ error: error.message || 'Internal Server Error' }), { status: 500 });
    }
}
