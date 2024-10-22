/**/
export class GistApi {
    baseUrl = 'https://api.github.com';

    constructor(githubPersonalAccessToken) {
        this.PAT = githubPersonalAccessToken;
    }

    privateOpt() {
        return {
            headers: {
                Authorization: `token ${this.PAT}`,
                'Content-Type': 'application/json',
                'X-GitHub-Api-Version': '2022-11-28',
                Accept: 'application/vnd.github+json'
            }
        }
    }
    
    publicOpt() {
        return { headers: { 'Accept': 'application/vnd.github+json' } };
    }

    async getGists() {
        const res = await fetch(`${this.baseUrl}/gists`,
            this.privateOpt());
        return await res.json();
    }

    async getPublicGists(username) {
        const res = await fetch(`${this.baseUrl}/users/${username}/gists`,
            this.publicOpt());
        return await res.json();
    }


    async getFileFromUrl(gitUrl) {
        const res = await fetch(gitUrl);
        return await res.text();
    }

    async getGist(id) {
        const res = await fetch(`${this.baseUrl}/gists/${id}`,
            this.privateOpt());
        return await res.json();
    }


    async deleteGist(id) {
        const res = await fetch(`${this.baseUrl}/gists/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `token ${this.PAT}`
            }
        })
        return await res.ok;
    }

    async updateFile(id, fileName, content = null) {
        const gist = await this.getGist(id);

        gist.files[fileName] = content ? { content } : null;
        const request = {
            headers: { 'Authorization': `token ${this.PAT}` },
            method: 'PATCH',
            body: JSON.stringify(gist)
        };
        const res = await fetch(`${this.baseUrl}/gists/${id}`,
            request);
        return res.json();
    }

    async createGist(description, files, isPublic = true) {
        const _files = {};
        for (const file of files) {
            _files[file.name] = { content: file.content };
        }

        const request = {
            method: 'POST',
            headers: this.privateOpt().headers,
            body: JSON.stringify({
                description,
                public: isPublic,
                files: _files
            })
        };

        const res = await fetch(`${this.baseUrl}/gists`,
            request);
        return await res.json();
    }
}