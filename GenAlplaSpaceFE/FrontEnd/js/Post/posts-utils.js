// Utility functions for Posts module
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

// Export to window for global access
window.formatTimeAgo = formatTimeAgo;
