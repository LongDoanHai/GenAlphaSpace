// Main Posts module - orchestrates all post functionality
const PostsApp = {
    init() {
        this._bindGlobalEvents();
        this.refreshPosts();
    },

    _bindGlobalEvents() {
        PostsHandlers.init();
    },

    async refreshPosts() {
        try {
            const posts = await PostsAPI.fetchPosts();
            PostsRenderer.renderPosts(posts);
        } catch (error) {
            this._showConnectionError();
        }
    },

    _showConnectionError() {
        const postContainer = document.getElementById('post-list');
        if (!postContainer) return;
        
        postContainer.innerHTML = `
            <div class="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-center">
                <p class="font-bold mb-2">Connection Error</p>
                <p class="text-sm mb-4">Could not connect to the API. This is likely due to an untrusted SSL certificate on localhost or the API is not running.</p>
                <a href="${POSTS_CONSTANTS.API_URL}" target="_blank" class="text-xs underline hover:text-red-800">
                    Click here to open the API, then click "Advanced" and "Proceed" to trust the certificate.
                </a>
            </div>
        `;
    }
};

// Public API for external calls
window.PostsApp = {
    refresh: () => PostsApp.refreshPosts()
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    PostsApp.init();
});
