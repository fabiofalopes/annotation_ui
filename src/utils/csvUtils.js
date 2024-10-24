import Papa from 'papaparse';
import moment from 'moment';

const csvUtils = {
    loadCsv: (file) => {
        console.log('Loading CSV file:', file.name);
        return new Promise((resolve, reject) => {
            Papa.parse(file, {
                header: true,
                dynamicTyping: true,
                complete: (results) => {
                    console.log('Papa Parse results:', results);
                    const threadField = results.meta.fields.find((field) => field.toLowerCase().includes('thread'));

                    if (!threadField) {
                        console.error('Thread field not found in CSV file');
                        reject(new Error('Thread field not found in CSV file'));
                    }

                    const validatedData = results.data.map((row) => {
                        const threadValue = row[threadField];
                        return {
                            ...row,
                            thread: threadValue !== undefined ? String(threadValue) : '',
                        };
                    });

                    const uniqueTags = [...new Set(validatedData.map(row => row.thread).filter(tag => tag !== ''))];

                    console.log('Validated data:', validatedData);
                    resolve({
                        data: validatedData,
                        metadata: results.meta,
                        uniqueTags: uniqueTags,
                    });
                },
                error: (error) => {
                    console.error('Papa Parse error:', error);
                    reject(error);
                },
            });
        });
    },

    createPersistentCopy: async (csvData) => {
        const timestamp = moment().format('YYYYMMDD_HHmmss');
        const csvString = Papa.unparse(csvData.data, {
            header: true,
            delimiter: ',',
        });

        const blob = new Blob([csvString], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `data_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        return `data_${timestamp}.csv`;
    },

    annotateThread: (csvData, annotation) => {
        const annotatedData = csvData.data.map((row) => {
            const threadValue = row.thread;
            return {
                ...row,
                thread: `${threadValue} ${annotation}`,
            };
        });

        return {
            data: annotatedData,
            metadata: csvData.metadata,
        };
    },
};

export default csvUtils;