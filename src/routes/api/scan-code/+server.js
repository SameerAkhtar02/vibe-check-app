import { scanForExposedApiKeys } from '../../../checkFunction/checkApiKey'
import { scanCodeForSensitiveRoutes } from '../../../checkFunction/checkApiEndpoints'
import { detectOpenCorsPolicy } from '../../../checkFunction/checkCORS.js'
import { detectInsecureHttpUsage } from '../../../checkFunction/checkInsecureFetchReq.js'

export async function POST({request}) {
    const { code, files, tests } = await request.json()
    const testArray = [
        {id:1, test : scanCodeForSensitiveRoutes},
        {id:2, test : scanForExposedApiKeys}, 
        {id:3, test : detectOpenCorsPolicy}, 
        {id:4, test : detectInsecureHttpUsage}
    ]
    
    try{
        // Handle single code block scanning (existing behavior)
        if (code && !files) {
            let result = [];
            for (const testId of tests) {
                const testObj = testArray.find(t => t.id === testId);
                if (!testObj) {
                    throw new Error(`Test with id ${testId} not found.`);
                }
                const resp = testObj.test(code);
                result.push(resp);
            }
            return new Response(JSON.stringify(result), {status: 200});
        }
        
        // Handle multiple file scanning
        if (files && files.length > 0) {
            let fileResults = [];
            
            for (const file of files) {
                let fileResult = {
                    fileName: file.name,
                    results: []
                };
                
                for (const testId of tests) {
                    const testObj = testArray.find(t => t.id === testId);
                    if (!testObj) {
                        throw new Error(`Test with id ${testId} not found.`);
                    }
                    
                    // Run the test on the file content
                    const resp = testObj.test(file.content);
                    fileResult.results.push(resp);
                }
                
                fileResults.push(fileResult);
            }
            
            return new Response(JSON.stringify(fileResults), {status: 200});
        }
        
        // If neither code nor files provided
        throw new Error('Either code or files must be provided');
        
    } catch(e){
        console.log('API Error:', e.message);
        return new Response(JSON.stringify({error: e.message}), {status: 500});        
    }
}