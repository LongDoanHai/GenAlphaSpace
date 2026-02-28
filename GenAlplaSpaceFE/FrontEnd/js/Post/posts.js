async function fetchPosts() {
    try {
        const response = await fetch('https://localhost:7274/api/posts');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const posts = await response.json();
        renderPosts(posts);
    } catch (error) {
        console.error('Error fetching posts:', error);
        document.getElementById('post-list').innerHTML = `
            <div class="bg-red-50 border border-red-200 text-red-600 px-6 py-4 rounded-xl text-center">
                <p class="font-bold mb-2">Connection Error</p>
                <p class="text-sm mb-4">Could not connect to the API. This is likely due to an untrusted SSL certificate on localhost or the API is not running.</p>
                <a href="https://localhost:7274/api/posts" target="_blank" class="text-xs underline hover:text-red-800">
                    Click here to open the API, then click "Advanced" and "Proceed" to trust the certificate.
                </a>
            </div>
        `;
    }
}

function renderPosts(posts) {
    const postContainer = document.getElementById('post-list');
    if (!postContainer) return;
    
    postContainer.innerHTML = '';

    if (posts.length === 0) {
        postContainer.innerHTML = '<div class="p-6 text-center text-gray-500 font-medium">No posts found in the database.</div>';
        return;
    }

    posts.forEach(post => {
        const postElement = createPostElement(post);
        postContainer.appendChild(postElement);
    });


    if (typeof UIkit !== 'undefined') {
        UIkit.update();
    }
}

function createPostElement(post) {
    const div = document.createElement('div');
    div.className = 'bg-white rounded-xl shadow-sm text-sm font-medium border1';
    
    const date = new Date(post.dateCreated);
    const timeAgo = formatTimeAgo(date);


    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const fullTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
    const fullDate = `${day}/${month}/${year} ${fullTime}`;

    let imageHtml = '';
    if (post.imageUrl && post.imageUrl.trim() !== '' && post.imageUrl !== 'string') {
        let imgSrc = post.imageUrl;
        
        // Fix: If it's a relative path from the backend server, prepend the API's base URL
        if (imgSrc.startsWith('/uploads/')) {
            imgSrc = `https://localhost:7274${imgSrc}`;
        }
        
        if (imgSrc.includes('unsplash.com') && !imgSrc.includes('images.unsplash.com')) {
            const id = imgSrc.split('/').pop();
            imgSrc = `https://source.unsplash.com/${id}/800x600`;
        }
        
        imageHtml = `
            <a>
                <div class="relative w-full lg:h-96 h-full sm:px-4">
                    <img src="${imgSrc}" class="sm:rounded-lg w-full h-full object-cover" onerror="this.parentElement.style.display='none'" />
                </div>
            </a>
        `;
    }

    div.innerHTML = `
        <!-- Post heading (Dynamic Name & Date) -->
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
                <button type="button" class="button-icon w-8 h-8"> <ion-icon class="text-xl" name="ellipsis-horizontal"></ion-icon> </button>
                <div class="w-[245px]" uk-dropdown="pos: bottom-right; animation: uk-animation-scale-up uk-transform-origin-top-right; animate-out: true; mode: click">
                    <form>
                        <input type="hidden" name="postId" value="${post.id}" />
                        <button type="button" class="hover:!bg-red-50 icon-link">
                            <ion-icon name="lock-closed-outline"></ion-icon>  Set as private
                        </button>
                    </form>

                    <hr>
                    <button type="button" class="text-red-400 hover:!bg-red-50 icon-link">
                        <ion-icon name="trash-bin-outline"></ion-icon>  Delete Post
                    </button>
                    <button type="button" class="hover:!bg-red-50 icon-link">
                        <ion-icon class="text-xl shrink-0" name="flag-outline"></ion-icon>  Report
                    </button>
                </div>
            </div>
        </div>

        <!-- Post content (Dynamic Content) -->
        <a>
            <div class="sm:px-4 p-2.5 pt-0 w-full">
                <p class="font-normal">
                    ${post.content}
                </p>
            </div>
        </a>

        <!-- Dynamic Image -->
        ${imageHtml}

        <!-- Icons (Static / Hardcoded) -->
        <div class="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
            <div class="flex items-center gap-2.5">
                <a class="button-icon text-red-500 bg-red-100">
                    <ion-icon class="text-lg" name="heart"></ion-icon>
                </a>
                <a href="#">0</a>
            </div>

            <div class="flex items-center gap-3">
                <a class="button-icon">
                    <ion-icon class="text-lg" name="chatbubble-ellipses-outline"></ion-icon>
                </a>
                <a href="#">0</a>
            </div>

            <div class="ml-auto"></div>

            <div>
                <a class="button-icon ml-auto">
                    <ion-icon class="text-lg" name="bookmark-outline"></ion-icon>
                </a>
            </div>
        </div>

        <!-- Add comment section (Static / Hardcoded) -->
        <div>
            <div class="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1">
                <img src="/images/avatar/person.png" class="w-6 h-6 rounded-full" />

                <div class="flex-1 relative overflow-hidden h-10">
                    <textarea placeholder="Add Comment...." rows="1" class="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent"></textarea>
                </div>

                <button class="text-sm rounded-full py-1.5 px-3.5 bg-secondery">Comment</button>
            </div>
        </div>
    `;
    
    return div;
}

function formatTimeAgo(date) {
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    const timeOptions = { hour: '2-digit', minute: '2-digit', hour12: true };
    const timeStr = date.toLocaleTimeString('en-US', timeOptions);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    if (diffInDays === 1) {
        return `Yesterday at ${timeStr}`;
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    
    return `${day}/${month}/${year} at ${timeStr}`;
}

document.addEventListener('DOMContentLoaded', () => {
    fetchPosts();
    initializeCreateStatus();
});

function initializeCreateStatus() {
    const form = document.getElementById('createStatusForm');
    const imageUpload = document.getElementById('imageUpload');
    const imageUploadBtn = document.getElementById('imageUploadBtn');
    const imagePreviewContainer = document.getElementById('imagePreviewContainer');
    const imagePreview = document.getElementById('imagePreview');
    const removeImageBtn = document.getElementById('removeImageBtn');

    if (!form) return;

 
    if (imageUploadBtn && imageUpload) {
        imageUploadBtn.addEventListener('click', () => {
            imageUpload.click();
        });
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

    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

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
            formData.append('userId', 1);
            
            if (imageUpload && imageUpload.files[0]) {
                formData.append('imageFile', imageUpload.files[0]);
            }

            const response = await fetch('https://localhost:7274/api/posts', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to create post');
            }

            form.reset();
            if (imagePreviewContainer) imagePreviewContainer.classList.add('hidden');
            
            if (typeof UIkit !== 'undefined') {
                UIkit.modal('#create-status').hide();
            }

            await fetchPosts();

        } catch (error) {
            console.error('Error creating post:', error);
            alert('Error creating post. Please try again.');
        } finally {
            // Re-enable button
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.innerText = 'Post';
            }
        }
    });
}
