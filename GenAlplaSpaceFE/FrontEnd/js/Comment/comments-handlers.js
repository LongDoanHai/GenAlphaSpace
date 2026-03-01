const CommentsHandlers = {
    init() {
        document.body.addEventListener('click', (e) => {
            // Open modal from post
            const openBtn = e.target.closest('.open-comment-modal');
            if (openBtn) {
                e.preventDefault();
                const postId = parseInt(openBtn.dataset.postId);
                if (postId) this.handleOpenModal(postId);
                return;
            }

            // Quick comment from post footer
            const quickCommentBtn = e.target.closest('.btn-quick-comment');
            if (quickCommentBtn) {
                e.preventDefault();
                const postId = parseInt(quickCommentBtn.dataset.postId);
                this.handleQuickComment(postId, quickCommentBtn);
                return;
            }

            // Comment interactions
            const likeBtn = e.target.closest('.btn-like-comment');
            if(likeBtn) {
                this.handleToggleLike(parseInt(likeBtn.dataset.id));
                return;
            }
            
            const replyBtn = e.target.closest('.btn-reply-comment');
            if(replyBtn) {
                 const id = replyBtn.dataset.id;
                 const box = document.getElementById(`reply-box-${id}`);
                 if(box) {
                     box.classList.toggle('hidden');
                     box.querySelector('input').focus();
                 }
                 return;
            }

            const submitReplyBtn = e.target.closest('.btn-submit-reply');
            if(submitReplyBtn) {
                this.handleSubmitReply(parseInt(submitReplyBtn.dataset.id));
                return;
            }

            const viewRepliesBtn = e.target.closest('.btn-view-replies');
            if(viewRepliesBtn) {
                this.handleLoadReplies(parseInt(viewRepliesBtn.dataset.id), false);
                return;
            }

            const loadMoreRepliesBtn = e.target.closest('.btn-load-more-replies');
            if(loadMoreRepliesBtn) {
                 this.handleLoadReplies(parseInt(loadMoreRepliesBtn.dataset.id), true);
                 return;
            }

            const deleteBtn = e.target.closest('.btn-delete-comment');
            if(deleteBtn) {
                this.handleDeleteComment(parseInt(deleteBtn.dataset.id));
                return;
            }
        });

        const loadMoreRootBtn = document.getElementById('btn-load-more-comments');
        if(loadMoreRootBtn) {
            loadMoreRootBtn.addEventListener('click', () => {
                if(CommentsState.currentPostId) {
                    this.handleLoadRootComments(CommentsState.currentPostId, true);
                }
            });
        }
        
        const btnSendRoot = document.getElementById('btn-send-root-comment');
        const inputRoot = document.getElementById('root-comment-input');
        
        if (btnSendRoot && inputRoot) {
            btnSendRoot.addEventListener('click', () => this.handleSendRootComment(inputRoot));
            inputRoot.addEventListener('keypress', (e) => {
                if(e.key === 'Enter') this.handleSendRootComment(inputRoot);
            });
        }
    },

    async handleOpenModal(postId) {
        CommentsState.currentPostId = postId;
        const modalEl = document.getElementById('comment-modal');
        const listEl = document.getElementById('modal-comments-list');
        const loadingEl = document.getElementById('comment-loading');
        
        if (loadingEl) loadingEl.classList.remove('hidden');
        if (listEl) listEl.innerHTML = '';
        
        if(typeof UIkit !== 'undefined') {
            UIkit.modal('#comment-modal').show();
        }

        // Focus the input area immediately
        setTimeout(() => {
            const input = document.getElementById('root-comment-input');
            if(input) input.focus();
        }, 500);

        await this.handleLoadRootComments(postId, false);
    },

    async handleLoadRootComments(postId, append = false) {
        const loadingEl = document.getElementById('comment-loading');
        try {
            if (loadingEl) loadingEl.classList.remove('hidden');
            let cursor = null;
            if (append) {
                const postData = CommentsState.byPost.get(postId);
                cursor = postData?.nextCursor;
            }

            const pageResult = await CommentsAPI.getPostComments(postId, cursor, 10);
            CommentsState.saveRootComments(postId, pageResult, append);
            
            if (loadingEl) loadingEl.classList.add('hidden');
            CommentsRenderer.renderCommentTree(postId, 'modal-comments-list');
        } catch (error) {
            console.error(error);
            if (loadingEl) loadingEl.classList.add('hidden');
        }
    },

    async handleLoadReplies(parentId, append = false) {
        try {
            let cursor = null;
            if(append) {
                const pData = CommentsState.byParent.get(parentId);
                cursor = pData?.nextCursor;
            }

            const result = await CommentsAPI.getReplies(parentId, cursor, 5);
            CommentsState.saveReplies(parentId, result, append);
            CommentsRenderer.renderCommentTree(CommentsState.currentPostId, 'modal-comments-list');
        } catch (e) {
            console.error('Error loading replies', e);
        }
    },

    async handleToggleLike(commentId) {
        CommentsState.toggleLike(commentId);
        CommentsRenderer.updateCommentUIOnly(commentId);

        try {
            const apiResult = await CommentsAPI.toggleLike(commentId);
            const comment = CommentsState.byId.get(commentId);
            if(comment.isLikedByCurrentUser !== apiResult.isLiked || comment.likeCount !== apiResult.likeCount) {
                comment.isLikedByCurrentUser = apiResult.isLiked;
                comment.likeCount = apiResult.likeCount;
                CommentsRenderer.updateCommentUIOnly(commentId);
            }
        } catch(e) {
            console.error('Failed to like', e);
            CommentsState.toggleLike(commentId);
            CommentsRenderer.updateCommentUIOnly(commentId);
        }
    },

    async handleQuickComment(postId, btn) {
        const input = btn.previousElementSibling.querySelector('textarea.quick-comment-input');
        if (!input) return;
        const content = input.value.trim();
        if(!content) return;

        input.value = '';
        input.disabled = true;
        btn.disabled = true;

        try {
            await CommentsAPI.createComment(postId, content, null);
            // Optionally, we could open the modal to show their new comment
            // this.handleOpenModal(postId); 
            // Also need to trigger Post update if we track post comments count
        } catch (e) {
            console.error(e);
            alert('Failed to post comment');
        } finally {
            input.disabled = false;
            btn.disabled = false;
        }
    },

    async handleSendRootComment(input) {
        const content = input.value.trim();
        const postId = CommentsState.currentPostId;
        
        if(!content || !postId) return;
        
        input.value = '';
        input.disabled = true;

        const tempId = -Date.now();
        const tempComment = _createTempComment(tempId, content, postId);

        CommentsState.addRootTemporarily(postId, tempComment);
        CommentsRenderer.renderCommentTree(postId, 'modal-comments-list');
        
        const scrollArea = document.getElementById('comment-modal-scroll-area');
        scrollArea.scrollTop = 0;

        try {
            const realComment = await CommentsAPI.createComment(postId, content, null);
            CommentsState.replaceTempId(tempId, realComment);
            CommentsRenderer.renderCommentTree(postId, 'modal-comments-list');
        } catch (e) {
            console.error(e);
            alert('Failed to post comment');
        } finally {
            input.disabled = false;
            input.focus();
        }
    },

    async handleSubmitReply(parentId) {
        const box = document.getElementById(`reply-box-${parentId}`);
        const input = box.querySelector('input');
        const content = input.value.trim();
        const postId = CommentsState.currentPostId;

        if(!content || !postId) return;

        input.value = '';
        box.classList.add('hidden');

        const tempId = -Date.now();
        const tempComment = _createTempComment(tempId, content, postId);

        CommentsState.addReplyTemporarily(parentId, tempComment);
        CommentsRenderer.renderCommentTree(postId, 'modal-comments-list');

        try {
            const realComment = await CommentsAPI.createComment(postId, content, parentId);
            CommentsState.replaceTempId(tempId, realComment);
            CommentsRenderer.renderCommentTree(postId, 'modal-comments-list');
        } catch (e) {
            console.error('Failed to post reply', e);
            alert('Failed to post reply');
        }
    },

    async handleDeleteComment(commentId) {
        if(!confirm('Are you sure you want to delete this comment?')) return;

        try {
            // Optimistically remove from state
            CommentsState.removeComment(commentId);
            CommentsRenderer.renderCommentTree(CommentsState.currentPostId, 'modal-comments-list');

            // Call API
            await CommentsAPI.deleteComment(commentId);
        } catch (error) {
            console.error('Failed to delete comment:', error);
            alert(error.message || 'Failed to delete comment');
            // Reload to restore state on error
            if(CommentsState.currentPostId) {
                await this.handleLoadRootComments(CommentsState.currentPostId, false);
            }
        }
    }
};

function _createTempComment(id, content, postId) {
    return {
        id: id,
        content: content,
        postId: postId,
        userId: 1, 
        userName: "You",
        userAvatarUrl: "/images/avatar/person.png",
        dateCreated: new Date().toISOString(),
        likeCount: 0,
        replyCount: 0,
        isLikedByCurrentUser: false
    };
}

window.CommentsHandlers = CommentsHandlers;
