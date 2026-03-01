const CommentsApp = {
    init() {
        if (typeof CommentsHandlers !== 'undefined') {
            CommentsHandlers.init();
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    CommentsApp.init();
});
