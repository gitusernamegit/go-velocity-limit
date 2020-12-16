const webAPIUrl = 'http://localhost:8092/'

interface LoadResponse {
    output: string,
    error: string
}

export const processLoads = async (input: string) : Promise<LoadResponse> => {
    
    let loadResponse: LoadResponse = { output: "", error: "" }
    let responseStatus: number

    await fetch(`${webAPIUrl}process`, {
        method: 'POST',
        cache: 'no-cache',
        body: input
    })
    .then(response => {
        responseStatus = response.status
        return response.text() 
    })
    .then(output =>  {
        if(responseStatus == 200){
            loadResponse.output = output
        }
        else {
            loadResponse.error = output
        }
    }).catch((error) => {
        loadResponse.error = error.toString();
    });
    
    return loadResponse;
}