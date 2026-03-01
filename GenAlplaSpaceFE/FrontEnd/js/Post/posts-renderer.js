// Rendering layer for Posts functionality
const PostsRenderer = {
    _postsCache: new Map(),

    getPost(id) {
        return this._postsCache.get(id);
    },

    createPostElement(post) {
        const div = document.createElement('div');
        div.className = 'bg-white rounded-xl shadow-sm text-sm font-medium border1';
        div.dataset.postId = post.id;
        
        const date = new Date(post.dateCreated);
        const timeAgo = formatTimeAgo(date);
        
        // Format date
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const fullTime = date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit', 
            hour12: true 
        });
        const fullDate = `${day}/${month}/${year} ${fullTime}`;

        // Build HTML
        div.innerHTML = this._buildPostHtml(post, timeAgo, fullDate);
        
        return div;
    },

    _buildPostHtml(post, timeAgo, fullDate) {
        const imageHtml = this._buildImageHtml(post.imageUrl);
        
        return `
            <!-- Post heading -->
            <div class="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                <a>
                    <img src="/images/avatar/person.png" class="w-9 h-9 rounded-full" />
                </a>
                <div class="flex-1">
                    <a>
                        <h4 class="text-black capitalize">${post.userName}</h4>
                        <div class="text-xs text-gray-500/80" title="${fullDate}">${timeAgo}</div>
                    </a>
                </div>
                <div class="-mr-1">
                    <button type="button" class="button-icon w-8 h-8">
                        <ion-icon class="text-xl" name="ellipsis-horizontal"></ion-icon>
                    </button>
                </div>
            </div>

            <!-- Post content -->
            <a>
                <div class="sm:px-4 p-2.5 pt-0 w-full">
                    <p class="font-normal">${post.content}</p>
                </div>
            </a>

            ${imageHtml}

            <!-- Action buttons -->
            <div class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
                <div class="flex items-center gap-2.5">
                    <button type="button" 
                        id="like-btn-${post.id}"
                        class="button-icon ${post.isLiked ? 'text-red-500 bg-red-100' : 'text-gray-500 bg-gray-100'} like-btn" 
                        data-post-id="${post.id}">
                        <ion-icon class="text-lg" name="${post.isLiked ? 'heart' : 'heart-outline'}"></ion-icon>
                    </button>
                    <a href="#" id="like-count-${post.id}">${post.likeCount || 0}</a>
                </div>

                <div class="flex items-center gap-3">
                    <button class="button-icon open-comment-modal" data-post-id="${post.id}">
                        <ion-icon class="text-lg" name="chatbubble-ellipses-outline"></ion-icon>
                    </button>
                    <a href="#" class="open-comment-modal" data-post-id="${post.id}">${post.commentCount || 0}</a>
                </div>

                <div class="ml-auto"></div>

                <div>
                    <button class="button-icon ml-auto">
                        <ion-icon class="text-lg" name="bookmark-outline"></ion-icon>
                    </button>
                </div>
            </div>

            <!-- Comment section -->
            <div>
                <div class="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1">
                    <img src="/images/avatar/person.png" class="w-6 h-6 rounded-full shrink-0" />
                    <div class="flex-1 relative overflow-hidden h-10">
                        <textarea placeholder="Add Comment...." rows="1" 
                                  class="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent quick-comment-input"></textarea>
                    </div>
                    <button class="text-sm rounded-full py-1.5 px-3.5 bg-secondery btn-quick-comment font-semibold" data-post-id="${post.id}">Comment</button>
                </div>
            </div>
        `;
    },


    _buildImageHtml(imageUrl) {
        if (!imageUrl || imageUrl.trim() === '' || imageUrl === 'string') {
            return '';
        }

        let imgSrc = imageUrl;
        
        if (imgSrc.startsWith('/uploads/')) {
            imgSrc = `${POSTS_CONSTANTS.API_URL.replace('/api/posts', '')}${imgSrc}`;
        }
        
        if (imgSrc.includes('unsplash.com') && !imgSrc.includes('images.unsplash.com')) {
            const id = imgSrc.split('/').pop();
            imgSrc = `https://source.unsplash.com/${id}/800x600`;
        }
        
        return `
            <a>
                <div class="relative w-full lg:h-96 h-full sm:px-4">
                    <img src="${imgSrc}" class="sm:rounded-lg w-full h-full object-cover" 
                         onerror="this.parentElement.style.display='none'" />
                </div>
            </a>
        `;
    },

    renderPosts(posts) {
        const postContainer = document.getElementById('post-list');
        if (!postContainer) return;
        
        postContainer.innerHTML = '';
        this._postsCache.clear();
        
        if (posts.length === 0) {
            postContainer.innerHTML = 
                '<div class="p-6 text-center text-gray-500 font-medium">No posts found in the database.</div>';
            return;
        }
        
        posts.forEach(post => {
            this._postsCache.set(post.id, post);
            const postElement = this.createPostElement(post);
            postContainer.appendChild(postElement);
        });

        if (typeof UIkit !== 'undefined') {
            UIkit.update();
        }
    }
};

window.PostsRenderer = PostsRenderer;
