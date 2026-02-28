// API layer for Posts functionality
const PostsAPI = {
    async fetchPosts() {
        try {
            const response = await fetch(POSTS_CONSTANTS.API_URL);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching posts:', error);
            throw error;
        }
    },

    async toggleLike(postId, userId) {
        const response = await fetch(
            `${POSTS_CONSTANTS.API_URL}/${postId}/toggle-like`,
            {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ postId, userId })
            }
        );
        if (!response.ok) {
            throw new Error('Failed to toggle like');
        }
        return await response.json();
    },

    async fetchLikeCount(postId) {
        const response = await fetch(
            `${POSTS_CONSTANTS.API_URL}/${postId}/like-count`
        );
        if (!response.ok) {
            throw new Error('Failed to fetch like count');
        }
        return await response.json();
    },

    async createPost(formData) {
        const response = await fetch(
            POSTS_CONSTANTS.API_URL,
            {
                method: 'POST',
                body: formData
            }
        );
        if (!response.ok) {
            throw new Error('Failed to create post');
        }
        return await response.json();
    }
};

// Export to window for global access
window.PostsAPI = PostsAPI;
