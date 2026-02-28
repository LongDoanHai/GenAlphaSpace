// Event handlers for Posts functionality
const PostsHandlers = {
    init() {
        this._bindCreatePostHandler();
        this._bindLikeHandlers();
    },

    _bindCreatePostHandler() {
        const form = document.getElementById('createStatusForm');
        if (!form) return;

        this._bindImageUploadHandlers();

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            await this._handleCreatePost(form);
        });
    },

    _bindImageUploadHandlers() {
        const imageUpload = document.getElementById('imageUpload');
        const imageUploadBtn = document.getElementById('imageUploadBtn');
        const imagePreview = document.getElementById('imagePreview');
        const imagePreviewContainer = document.getElementById('imagePreviewContainer');
        const removeImageBtn = document.getElementById('removeImageBtn');

        if (imageUploadBtn && imageUpload) {
            imageUploadBtn.addEventListener('click', () => imageUpload.click());
        }

        if (imageUpload) {
            imageUpload.addEventListener('change', function() {
                const file = this.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        if (imagePreview) imagePreview.src = e.target.result;
                        if (imagePreviewContainer) imagePreviewContainer.classList.remove('hidden');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }

        if (removeImageBtn) {
            removeImageBtn.addEventListener('click', () => {
                if (imageUpload) imageUpload.value = '';
                if (imagePreviewContainer) imagePreviewContainer.classList.add('hidden');
                if (imagePreview) imagePreview.src = '#';
            });
        }
    },

    async _handleCreatePost(form) {
        const submitBtn = form.querySelector('button[type="submit"]');
        const content = form.querySelector('textarea[name="content"]').value;
        
        if (!content.trim()) {
            alert('Please enter some content');
            return;
        }

        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.innerText = 'Posting...';
        }

        try {
            const formData = new FormData();
            formData.append('content', content);
            formData.append('userId', POSTS_CONSTANTS.CURRENT_USER_ID);
            
            const imageUpload = document.getElementById('imageUpload');
            if (imageUpload && imageUpload.files[0]) {
                formData.append('imageFile', imageUpload.files[0]);
            }

            await PostsAPI.createPost(formData);
            form.reset();
            
            const imagePreviewContainer = document.getElementById('imagePreviewContainer');
            if (imagePreviewContainer) imagePreviewContainer.classList.add('hidden');
            
            if (typeof UIkit !== 'undefined') {
                UIkit.modal('#create-status').hide();
            }

            await PostsApp.refreshPosts();

        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post. Please try again.');
        } finally {
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Post';
            }
        }
    },

    _bindLikeHandlers() {
        const postContainer = document.getElementById('post-list');
        if (!postContainer) return;

        postContainer.addEventListener('click', async (e) => {
            const likeBtn = e.target.closest('.like-btn');
            if (!likeBtn) return;

            const postId = parseInt(likeBtn.dataset.postId);
            const userId = POSTS_CONSTANTS.CURRENT_USER_ID;
            
            try {
                // Optimistic UI update
                this._optimisticToggleLike(likeBtn);
                
                await PostsAPI.toggleLike(postId, userId);
                // Success - UI already updated optimistically
            } catch (error) {
                this._revertLikeToggle(likeBtn);
                console.error('Error toggling like:', error);
                alert('Failed to toggle like. Please try again.');
            }
        });
    },

    _optimisticToggleLike(likeBtn) {
        const likeCountElement = document.getElementById(`like-count-${likeBtn.dataset.postId}`);
        const icon = likeBtn.querySelector('ion-icon');
        
        const isCurrentlyLiked = likeBtn.classList.contains('text-red-500');
        let count = parseInt(likeCountElement?.textContent || '0');

        if (isCurrentlyLiked) {
            likeBtn.classList.remove('text-red-500', 'bg-red-100');
            likeBtn.classList.add('text-gray-500', 'bg-gray-100');
            icon.setAttribute('name', 'heart-outline');
            if (likeCountElement) likeCountElement.textContent = count - 1;
        } else {
            likeBtn.classList.remove('text-gray-500', 'bg-gray-100');
            likeBtn.classList.add('text-red-500', 'bg-red-100');
            icon.setAttribute('name', 'heart');
            if (likeCountElement) likeCountElement.textContent = count + 1;
        }
    },

    _revertLikeToggle(likeBtn) {
        const likeCountElement = document.getElementById(`like-count-${likeBtn.dataset.postId}`);
        const icon = likeBtn.querySelector('ion-icon');
        
        const isCurrentlyLiked = likeBtn.classList.contains('text-red-500');
        let count = parseInt(likeCountElement?.textContent || '0');

        if (isCurrentlyLiked) {
            likeBtn.classList.add('text-red-500', 'bg-red-100');
            likeBtn.classList.remove('text-gray-500', 'bg-gray-100');
            icon.setAttribute('name', 'heart');
            if (likeCountElement) likeCountElement.textContent = count + 1;
        } else {
            likeBtn.classList.remove('text-red-500', 'bg-red-100');
            likeBtn.classList.add('text-gray-500', 'bg-gray-100');
            icon.setAttribute('name', 'heart-outline');
            if (likeCountElement) likeCountElement.textContent = count - 1;
        }
    }
};

window.PostsHandlers = PostsHandlers;
