const CommentsRenderer = {
    renderCommentTree(postId, containerId) {
        const container = document.getElementById(containerId);
        if(!container) return;
        
        container.innerHTML = '';
        
        const postData = CommentsState.byPost.get(postId);
        const emptyState = document.getElementById('comment-empty-state');
        
        if(!postData || postData.rootIds.length === 0) {
            if(emptyState) emptyState.classList.remove('hidden');
            this.updateLoadMoreRootBtn(false);
            return;
        }
        
        if(emptyState) emptyState.classList.add('hidden');
        
        const frag = document.createDocumentFragment();
        postData.rootIds.forEach(id => {
            const comment = CommentsState.byId.get(id);
            if(comment) frag.appendChild(this.createCommentElement(comment));
        });
        
        container.appendChild(frag);
        this.updateLoadMoreRootBtn(postData.hasNextPage);
    },

    updateLoadMoreRootBtn(show) {
        const loadMoreBtn = document.getElementById('load-more-comments-container');
        if(!loadMoreBtn) return;
        if (show) {
            loadMoreBtn.classList.remove('hidden');
        } else {
            loadMoreBtn.classList.add('hidden');
        }
    },

    createCommentElement(comment, depth = 0) {
        const el = document.createElement('div');
        el.className = `comment-item group flex gap-3 ${depth > 0 ? 'mt-4 animate-fade-in' : 'mb-8'}`;
        el.style.maxWidth = '100%'; 
        el.dataset.commentId = comment.id;
        
        const marginLeft = depth > 0 ? (depth > 2 ? 'ml-0 border-l-2 border-gray-100 pl-4 transition-all hover:border-blue-200' : 'ml-10 relative') : '';
        if(marginLeft) el.className += ` ${marginLeft}`;
        
        const timeAgo = typeof formatTimeAgo === 'function' 
            ? formatTimeAgo(new Date(comment.dateCreated)) 
            : new Date(comment.dateCreated).toLocaleDateString();

        const likeColor = comment.isLikedByCurrentUser ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600';
        const likeIcon = comment.isLikedByCurrentUser ? 'heart' : 'heart-outline';
        
        let avatarUrl = comment.userAvatarUrl;
        if (!avatarUrl || avatarUrl === 'string' || avatarUrl.trim() === '') {
            avatarUrl = '/images/avatar/person.png';
        } else if (!avatarUrl.startsWith('http') && !avatarUrl.startsWith('/')) {
            avatarUrl = '/images/avatar/' + avatarUrl;
        }

        const parentData = CommentsState.byParent.get(comment.id);
        const hasLoadedReplies = parentData && parentData.replyIds.length > 0;
        const showViewRepliesBtn = comment.replyCount > 0 && !hasLoadedReplies;
        const isPosting = comment.id < 0;

        // NEW LOGIC: Hybrid "Show More"
        // If content > 100, we use hard truncation in the collapsed state to GUARANTEE it works.
        const threshold = 100;
        const needsTruncation = comment.content.length > threshold;
        
        let displayContent = comment.content;
        let isCollapsed = true;

        el.innerHTML = `
            <img src="${avatarUrl}" alt="${comment.userName}" class="w-9 h-9 rounded-full object-cover shrink-0 shadow-sm transition-transform hover:scale-110" onerror="this.src='/images/avatar/person.png'">
            <div class="flex-1 min-w-0" style="max-width: calc(100% - 48px);">
                <div class="bg-gray-100/80 hover:bg-gray-100 p-3.5 rounded-2xl inline-block max-w-full relative shadow-sm group-hover:shadow transition-all overflow-hidden ${isPosting ? 'opacity-50' : ''}">
                    <div class="font-bold text-[14px] text-gray-900 leading-tight mb-1 hover:text-blue-600 transition-colors cursor-pointer break-all">${comment.userName}</div>
                    
                    <div class="comment-text-container">
                        <div class="comment-content-text text-[15px] text-gray-800 leading-relaxed whitespace-pre-wrap" 
                             style="word-break: break-all; overflow-wrap: anywhere;">${needsTruncation ? comment.content.substring(0, threshold) + '...' : comment.content}</div>
                        
                        ${needsTruncation ? `
                            <button class="btn-toggle-expand text-[12px] font-extrabold text-blue-500 hover:text-blue-700 mt-1 block outline-none border-none bg-transparent p-0" 
                                    data-full-text="${encodeURIComponent(comment.content)}" 
                                    data-short-text="${encodeURIComponent(comment.content.substring(0, threshold) + '...')}"
                                    onclick="const textEl = this.parentElement.querySelector('.comment-content-text'); 
                                             const isExpanding = this.textContent === 'Show more';
                                             textEl.textContent = isExpanding ? decodeURIComponent(this.dataset.fullText) : decodeURIComponent(this.dataset.shortText);
                                             this.textContent = isExpanding ? 'Show less' : 'Show more';">Show more</button>
                        ` : ''}
                    </div>
                </div>
                
                <div class="flex items-center gap-5 text-[12px] mt-1.5 w-full pl-2 font-semibold">
                    <span class="text-gray-400 font-medium">${timeAgo}</span>
                    <button class="btn-like-comment ${likeColor} transition-all flex items-center gap-1.5 active:scale-125" data-id="${comment.id}">
                        <ion-icon name="${likeIcon}" class="text-sm"></ion-icon> <span>${comment.likeCount || ''}</span>
                    </button>
                     ${!isPosting ? `
                     <button class="btn-reply-comment text-gray-400 hover:text-blue-500 transition-colors" data-id="${comment.id}">
                         Reply
                     </button>
                     ${comment.userId === 1 ? `
                     <button class="btn-delete-comment text-gray-400 hover:text-red-500 transition-colors ml-2" data-id="${comment.id}">
                         Delete
                     </button>
                     ` : ''}
                     ` : '<span class="text-gray-300 italic">Posting...</span>'}
                </div>

                <div class="reply-input-area hidden mt-3 flex items-center gap-2 w-full pr-4 animate-slide-down" id="reply-box-${comment.id}">
                    <img src="/images/avatar/person.png" class="w-7 h-7 rounded-full object-cover shrink-0 shadow-sm" onerror="this.src='/images/avatar/person.png'">
                    <div class="flex-1 bg-gray-50 rounded-full border border-gray-100 transition-all focus-within:bg-white focus-within:border-blue-100 px-4 py-1 flex items-center h-[38px]">
                        <input type="text" class="reply-input text-[14px] w-full bg-transparent border-none outline-none focus:ring-0 placeholder:text-gray-400" placeholder="Write a reply...">
                    </div>
                    <button class="btn-submit-reply rounded-full px-3.5 py-1.5 bg-gray-100 text-gray-800 text-xs font-bold hover:bg-gray-200 transition-all active:scale-95 disabled:opacity-30 whitespace-nowrap" data-id="${comment.id}">Reply</button>
                </div>
                
                ${showViewRepliesBtn ? `
                <button class="btn-view-replies flex items-center gap-3 text-sm font-bold text-gray-400 hover:text-gray-700 mt-3 transition-colors pl-2" data-id="${comment.id}">
                    <div class="w-6 h-[1px] bg-gray-300"></div> View ${comment.replyCount} ${comment.replyCount === 1 ? 'reply' : 'replies'}
                </button>
                ` : ''}

                <div class="nested-replies-container ${hasLoadedReplies ? 'block mt-2' : 'hidden'}" id="replies-for-${comment.id}">
                </div>
                
                ${(parentData && parentData.hasNextPage) ? `
                <button class="btn-load-more-replies text-xs font-bold text-blue-500 hover:text-blue-700 mt-3 pl-2 transition-all p-1 hover:bg-blue-50 rounded" data-id="${comment.id}">
                    See more replies...
                </button>
                ` : ''}
            </div>
        `;

        if (hasLoadedReplies) {
            const repliesContainer = el.querySelector('.nested-replies-container');
            const frag = document.createDocumentFragment();
            parentData.replyIds.forEach(id => {
                const childInfo = CommentsState.byId.get(id);
                if(childInfo) frag.appendChild(this.createCommentElement(childInfo, depth + 1));
            });
            repliesContainer.appendChild(frag);
        }

        return el;
    },

    updateCommentUIOnly(commentId) {
        const comment = CommentsState.byId.get(commentId);
        if(!comment) return;

        const els = document.querySelectorAll(`[data-comment-id="${commentId}"]`);
        els.forEach(el => {
            const likeBtn = el.querySelector('.btn-like-comment');
            if(likeBtn) {
                likeBtn.className = `btn-like-comment ${comment.isLikedByCurrentUser ? 'text-red-500' : 'text-gray-400 group-hover:text-gray-600'} transition-all flex items-center gap-1.5 active:scale-125`;
                likeBtn.innerHTML = `<ion-icon name="${comment.isLikedByCurrentUser ? 'heart' : 'heart-outline'}" class="text-sm"></ion-icon> <span>${comment.likeCount || ''}</span>`;
            }
        });
    }
};

window.CommentsRenderer = CommentsRenderer;
