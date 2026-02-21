const { GoogleGenAI } = require('@google/genai');

async function listModels() {
    const ai = new GoogleGenAI({ apiKey: 'AIzaSyDt7m9L7ylJDcC34ZJJY8SLo1JVNvb7MGk' });

    try {
        console.log('Listing models...');
        const response = await ai.models.list();

        // Pager logic
        let page = response;
        while (page) {
            // response might differ based on SDK version
            // inspection showed pageInternal
            const models = page.pageInternal || page.models || [];

            for (const model of models) {
                console.log(model.name);
            }

            if (page.nextPage) {
                page = await page.nextPage();
            } else {
                break;
            }
        }

    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
