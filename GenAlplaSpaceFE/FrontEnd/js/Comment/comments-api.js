const CommentsAPI = {
    API_BASE: 'https://localhost:7274/api/comments',

    
    async getPostComments(postId, cursor = null, limit = 10) {
        let url = `${this.API_BASE}/posts/${postId}/comments?limit=${limit}`;
        if (cursor) url += `&cursor=${cursor}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch comments');
        return response.json();
    },

    async getReplies(parentId, cursor = null, limit = 5) {
        let url = `${this.API_BASE}/${parentId}/replies?limit=${limit}`;
        if (cursor) url += `&cursor=${cursor}`;

        const response = await fetch(url);
        if (!response.ok) throw new Error('Failed to fetch replies');
        return response.json();
    },

    async createComment(postId, content, parentCommentId = null) {
        const response = await fetch(this.API_BASE, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ postId, content, parentCommentId })
        });
        if (!response.ok) throw new Error('Failed to create comment');
        return response.json();
    },

    async toggleLike(commentId) {
        const response = await fetch(`${this.API_BASE}/${commentId}/like`, { method: 'POST' });
        if (!response.ok) throw new Error('Failed to toggle comment like');
        return response.json();
    }
};

window.CommentsAPI = CommentsAPI;
