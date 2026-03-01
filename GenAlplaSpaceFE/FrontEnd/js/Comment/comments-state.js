const CommentsState = {
    currentPostId: null,
    
    // Flat map of all loaded comments for O(1) access. Key: ID, Value: Comment object
    byId: new Map(),

    // Map PostID -> { rootIds: [], nextCursor: null, hasNextPage: false }
    byPost: new Map(),

    // Map ParentCommentID -> { replyIds: [], nextCursor: null, hasNextPage: false }
    byParent: new Map(),

    // Update single comment in state
    upsertComment(comment) {
        const existing = this.byId.get(comment.id) || {};
        this.byId.set(comment.id, { ...existing, ...comment });
    },

    // Save a batch of root comments
    saveRootComments(postId, pageResult, append = false) {
        if (!this.byPost.has(postId) || !append) {
            this.byPost.set(postId, { rootIds: [], nextCursor: null, hasNextPage: false });
        }
        
        const postData = this.byPost.get(postId);
        pageResult.items.forEach(c => {
            if (!postData.rootIds.includes(c.id)) {
                postData.rootIds.push(c.id);
            }
            this.upsertComment(c);
        });

        postData.nextCursor = pageResult.nextCursor;
        postData.hasNextPage = pageResult.hasNextPage;
        this.byPost.set(postId, postData);
    },

    // Save a batch of replies
    saveReplies(parentId, pageResult, append = false) {
        if (!this.byParent.has(parentId)) {
            this.byParent.set(parentId, { replyIds: [], nextCursor: null, hasNextPage: false });
        }
        
        const parentData = this.byParent.get(parentId);
        
        // Only append new ones or clear if not append
        if (!append) parentData.replyIds = [];

        pageResult.items.forEach(c => {
            if (!parentData.replyIds.includes(c.id)) {
                parentData.replyIds.push(c.id);
            }
            this.upsertComment(c);
        });

        parentData.nextCursor = pageResult.nextCursor;
        parentData.hasNextPage = pageResult.hasNextPage;
        this.byParent.set(parentId, parentData);
    },

    // Optimistically toggle like
    toggleLike(commentId) {
        const comment = this.byId.get(commentId);
        if (!comment) return null;

        comment.isLikedByCurrentUser = !comment.isLikedByCurrentUser;
        comment.likeCount += comment.isLikedByCurrentUser ? 1 : -1;
        this.upsertComment(comment);
        
        return comment; // return updated for renderer
    },
    
    // Optimistic reply creation
    addReplyTemporarily(parentCommentId, tempComment) {
        this.upsertComment(tempComment);
        if(!this.byParent.has(parentCommentId)){
            this.byParent.set(parentCommentId, { replyIds: [], nextCursor: null, hasNextPage: false });
        }
        this.byParent.get(parentCommentId).replyIds.push(tempComment.id);
        
        // Update reply count of parent
        const parent = this.byId.get(parentCommentId);
        if(parent) {
            parent.replyCount++;
            this.upsertComment(parent);
        }
    },

    addRootTemporarily(postId, tempComment) {
        this.upsertComment(tempComment);
        if(!this.byPost.has(postId)){
            this.byPost.set(postId, { rootIds: [], nextCursor: null, hasNextPage: false });
        }
        this.byPost.get(postId).rootIds.unshift(tempComment.id); 
    },
    
    replaceTempId(oldId, newComment) {
        this.byId.delete(oldId);
        this.upsertComment(newComment);
        
        for (const [key, val] of this.byPost.entries()) {
            const idx = val.rootIds.indexOf(oldId);
            if(idx > -1) val.rootIds[idx] = newComment.id;
        }
        for (const [key, val] of this.byParent.entries()) {
            const idx = val.replyIds.indexOf(oldId);
            if(idx > -1) val.replyIds[idx] = newComment.id;
        }
    },

    removeComment(commentId) {
        this.byId.delete(commentId);
        
        // Remove from all post root lists
        for (const [key, val] of this.byPost.entries()) {
            const idx = val.rootIds.indexOf(commentId);
            if (idx > -1) val.rootIds.splice(idx, 1);
        }
        
        // Remove from all parent reply lists
        for (const [key, val] of this.byParent.entries()) {
            const idx = val.replyIds.indexOf(commentId);
            if (idx > -1) val.replyIds.splice(idx, 1);
        }
    }
};

window.CommentsState = CommentsState;
