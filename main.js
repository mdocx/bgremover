const imageInput = document.getElementById('image-input');
        const uploadButton = document.getElementById('upload-button');
        const uploadedImage = document.getElementById('uploaded-image');
        const thumbnail = document.getElementById('thumbnail');
        const downloadButton = document.getElementById('download-button');
        const dropArea = document.getElementById('drop-area');

        // Click on the upload button triggers the file input click
        uploadButton.addEventListener('click', () => {
            imageInput.click();
        });

        // Handle image input change (manual selection)
        imageInput.addEventListener('change', async (event) => {
            const file = event.target.files[0];
            processImage(file);
        });

        // Drag & Drop functionality
        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();
                dropArea.classList.add('dragover');
            });
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, (event) => {
                event.preventDefault();
                event.stopPropagation();
                dropArea.classList.remove('dragover');
            });
        });

        dropArea.addEventListener('drop', (event) => {
            const file = event.dataTransfer.files[0];
            processImage(file);
        });

        // Process image and send to server
        async function processImage(file) {
            if (file) {
                const reader = new FileReader();
                reader.onload = () => {
                    thumbnail.src = reader.result;
                    thumbnail.style.display = 'block';
                };
                reader.readAsDataURL(file);

                const formData = new FormData();
                formData.append('image_file', file);

                // Send to your Flask server
                const response = await fetch('https://background-remover-production.up.railway.app/upload', {
                    method: 'POST',
                    body: formData
                });

                if (response.ok) {
                    const blob = await response.blob();
                    const objectURL = URL.createObjectURL(blob);

                    uploadedImage.src = objectURL;
                    uploadedImage.style.display = 'block';
                    uploadButton.style.display = 'none';  // Hide the upload button
                    downloadButton.style.display = 'inline-block'; // Show download button
                } else {
                    alert('Error: ' + response.statusText);
                }
            }
        }

        downloadButton.addEventListener('click', () => {
            const link = document.createElement('a');
            link.href = uploadedImage.src;
            link.download = 'background-removed.png';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });