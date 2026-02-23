(function() {
    const fileInput = document.getElementById('createStatusUrl');
    const createBtn = document.getElementById('btnCreateStory');
    const backBtn = document.getElementById('btnBackToUpload');
    const previewImg = document.getElementById('createStatusImage');
    const previewContainer = document.getElementById('preview-container');
    const uploadPlaceholder = document.getElementById('upload-placeholder');

    if (fileInput) {
        fileInput.addEventListener('change', function() {
            if (this.files && this.files[0]) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    previewImg.src = e.target.result;
                    previewContainer.classList.remove('hidden');
                    
                    // Show header buttons
                    createBtn.style.display = 'block'; 
                    createBtn.classList.remove('hidden');
                    backBtn.style.display = 'block';
                    backBtn.classList.remove('hidden');
                    
                    uploadPlaceholder.classList.add('hidden');
                }
                reader.readAsDataURL(this.files[0]);
            }
        });
    }

    if (backBtn) {
        backBtn.addEventListener('click', function(e) {
            e.preventDefault();
            // Reset everything
            fileInput.value = '';
            previewContainer.classList.add('hidden');
            
            // Hide header buttons
            createBtn.style.display = 'none';
            createBtn.classList.add('hidden');
            backBtn.style.display = 'none';
            backBtn.classList.add('hidden');
            
            uploadPlaceholder.classList.remove('hidden');
        });
    }
})();
