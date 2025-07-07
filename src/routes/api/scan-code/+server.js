import { scanForExposedApiKeys } from '../../../checkFunction/checkApiKey'
import { scanCodeForSensitiveRoutes } from '../../../checkFunction/checkApiEndpoints'
import { detectOpenCorsPolicy } from '../../../checkFunction/checkCORS.js'
import { detectInsecureHttpUsage } from '../../../checkFunction/checkInsecureFetchReq.js'

export async function POST({request}) {
        const { code, tests } = await request.json()
        const testArray = [{id:1, test : scanCodeForSensitiveRoutes},{id:2,test : scanForExposedApiKeys}, {id:3, test : detectOpenCorsPolicy}, {id :4, test : detectInsecureHttpUsage}]
    try{
        let result = [];
        for (const testId of tests) {
    // Find the test object by id
        const testObj = testArray.find(t => t.id === testId);
        if (!testObj) {
        throw new Error(`Test with id ${testId} not found.`);
        }
        // Run the test
        const resp = testObj.test(code);
        result.push(resp);
        };
        return new Response(JSON.stringify(result),{status:200});
    } catch(e){
        console.log('error bii');
        return new Response(JSON.stringify('error'),{status:500});        
    }
}