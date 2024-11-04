import Papa from 'papaparse';
//import path from 'path';
//import fs from 'fs';


const csvUtils = {
    loadCsv: (file) => {
        console.log('Loading CSV file:', file.name);
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    console.log('Papa Parse results:', results);
                    // Check for basic required columns except thread
                    const basicColumns = ['user_id', 'turn_id', 'turn_text', 'reply_to_turn'];
                    const missingBasicColumns = basicColumns.filter(col =>
                        !results.meta.fields.some(field =>
                            field.toLowerCase() === col.toLowerCase()
                        )
                    );

                    if (missingBasicColumns.length > 0) {
                        const errorMessage = `CSV file is missing required columns: ${missingBasicColumns.join(', ')}. \n\nRequired columns are: ${basicColumns.join(', ')} and a thread column (can be named 'thread_*' or '*_thread')`;
                        console.error(errorMessage);
                        reject(new Error(errorMessage));
                        return;
                    }

                    // Find any column that contains 'thread' in its name
                    const threadField = results.meta.fields.find((field) =>
                        field.toLowerCase().includes('thread')
                    );

                    if (!threadField) {
                        const errorMessage = 'CSV file must contain a thread column (can be named "thread_*" or "*_thread")';
                        console.error(errorMessage);
                        reject(new Error(errorMessage));
                        return;
                    }

                    const validatedData = results.data.map((row) => {
                        const threadValue = row[threadField];
                        return {
                            ...row,
                            thread: threadValue !== undefined && threadValue !== null ? String(threadValue) : '',
                        };
                    });

                    const uniqueTags = [...new Set(validatedData.map(row => row.thread).filter(tag => tag !== ''))];

                    console.log('Validated data:', validatedData);
                    resolve({
                        data: validatedData,
                        metadata: results.meta,
                        uniqueTags: uniqueTags,
                        fileName: file.name,
                    });
                },
                error: (error) => {
                    console.error('Papa Parse error:', error);
                    reject(error);
                },
            });
        });
    },

    saveChangesToCsv: async (messages, tags, fileName) => {
        try {
            const response = await fetch('/api/save-csv', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ messages, tags, fileName }),
            });

            if (!response.ok) {
                throw new Error('Failed to save CSV file');
            }

            const result = await response.json();
            console.log('Changes saved to CSV file:', result.message);
        } catch (error) {
            console.error('Error saving CSV file:', error);
        }
    },

    copyToFiles: async (file, destinationFileName) => {
        const response = await fetch('/api/copy-to-files', {
            method: 'POST',
            body: (() => {
                const formData = new FormData();
                formData.append('file', file);
                formData.append('destinationFileName', destinationFileName);
                return formData;
            })(),
        });
        
        const result = await response.json();
        
        if (!response.ok) {
            throw new Error(result.message);
        }
    
        return result;
    },

    loadWorkspaceFile: async (fileName) => {
        try {
            const response = await fetch(`/api/workspace-file/${fileName}`);
            if (!response.ok) {
                throw new Error('Failed to load workspace file');
            }
            const blob = await response.blob();
            const file = new File([blob], fileName, { type: 'text/csv' });
            
            // Use the same loadCsv function to ensure consistent parsing
            return csvUtils.loadCsv(file);
        } catch (error) {
            throw new Error(`Error loading workspace file: ${error.message}`);
        }
    }

};

export default csvUtils;