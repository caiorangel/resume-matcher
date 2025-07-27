const API_URL = process.env.NEXT_PUBLIC_API_URL!;

/** Downloads the optimized resume as PDF */
export async function downloadResumePDF(
    resumeId: string,
    jobId: string,
    language?: string
): Promise<void> {
    try {
        const response = await fetch(`${API_URL}/api/v1/resumes/download-pdf`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                resume_id: resumeId, 
                job_id: jobId,
                language: language || 'en'
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`PDF download failed with status ${response.status}: ${errorText}`);
        }

        // Get filename from Content-Disposition header
        const contentDisposition = response.headers.get('Content-Disposition');
        let filename = 'Optimized_Resume.pdf';
        
        if (contentDisposition) {
            const filenameMatch = contentDisposition.match(/filename=([^;]+)/);
            if (filenameMatch) {
                filename = filenameMatch[1].replace(/['"]/g, ''); // Remove quotes
            }
        }

        // Create blob and download
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        
        // Create temporary download link
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
        
        console.log('PDF downloaded successfully:', filename);
    } catch (error) {
        console.error('Error downloading PDF:', error);
        throw error;
    }
}