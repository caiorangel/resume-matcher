import { ImprovedResult } from '@/components/common/resume_previewer_context';

const API_URL = process.env.NEXT_PUBLIC_API_URL || '';

/** Uploads job descriptions and returns a job_id */
export async function uploadJobDescriptions(
    descriptions: string[],
    resumeId: string
): Promise<string> {
    const res = await fetch(`${API_URL}/api/upload-job`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ job_descriptions: descriptions, resume_id: resumeId }),
    });
    if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
    const data = await res.json();
    console.log('Job upload response:', data);
    return data.job_id[0];
}

/** Improves the resume and returns the full preview object */
export async function improveResume(
    resumeId: string,
    jobId: string,
    language?: string
): Promise<ImprovedResult> {
    let response: Response;
    try {
        response = await fetch(`${API_URL}/api/improve-resume`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                resume_id: resumeId, 
                job_id: jobId,
                language: language || 'en'
            }),
        });
    } catch (networkError) {
        console.error('Network error during improveResume:', networkError);
        throw networkError;
    }

    const text = await response.text();
    if (!response.ok) {
        console.error('Improve failed response body:', text);
        throw new Error(`Improve failed with status ${response.status}: ${text}`);
    }

    let data: ImprovedResult;
    try {
        data = JSON.parse(text) as ImprovedResult;
    } catch (parseError) {
        console.error('Failed to parse improveResume response:', parseError, 'Raw response:', text);
        throw parseError;
    }

    console.log('Resume improvement response:', data);
    return data;
}

/**
 * Uploads a resume file and returns the resume ID
 * @param file - The resume file to upload
 * @returns The uploaded resume ID
 */
export async function uploadResume(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    
    const res = await fetch(`${API_URL}/api/upload-resume`, {
        method: 'POST',
        body: formData,
    });
    
    if (!res.ok) throw new Error(`Upload failed with status ${res.status}`);
    
    const data = await res.json();
    return data.resume_id;
}

/**
 * Analyze resume and job description
 * @param resumeFile - The resume file to analyze
 * @param jobDescription - The job description text
 * @returns Analysis result
 */
export async function analyzeResumeAndJob(
    resumeFile: File,
    jobDescription: string
): Promise<{ resumeId: string; jobId: string }> {
    try {
        // Upload resume
        const resumeId = await uploadResume(resumeFile);
        
        // Upload job description
        const jobId = await uploadJobDescriptions([jobDescription], resumeId);
        
        // Return IDs for further processing
        return { resumeId, jobId };
    } catch (error) {
        console.error('Error analyzing resume and job description:', error);
        throw error;
    }
}