// Configuration constants for Posts functionality
const POSTS_CONSTANTS = {
    API_URL: 'https://localhost:7274/api/posts',
    CURRENT_USER_ID: 1, // TODO: Get from authentication system
    SELECTORS: {
        POST_LIST: '#post-list',
        CREATE_STATUS_FORM: '#createStatusForm',
        IMAGE_UPLOAD: '#imageUpload',
        IMAGE_UPLOAD_BTN: '#imageUploadBtn',
        IMAGE_PREVIEW_CONTAINER: '#imagePreviewContainer',
        IMAGE_PREVIEW: '#imagePreview',
        REMOVE_IMAGE_BTN: '#removeImageBtn'
    }
};

// Export to window for global access
window.POSTS_CONSTANTS = POSTS_CONSTANTS;
