import https from 'https';

export async function handler(event) {
    console.log('Received SQS event:', JSON.stringify(event, null, 2));

    for (const record of event.Records) {
        const messageBody = JSON.parse(record.body);
        console.log('Processing todo:', messageBody);

        // Call external API to "print" the todo
        const externalApiUrl = 'https://sindy-endarterial-nonbiliously.ngrok-free.dev/print'; // placeholder

        try {
            const response = await fetch(externalApiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(messageBody),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();
            console.log('External API response:', result);
        } catch (error) {
            console.error('Error calling external API:', error);
            throw error; // This will cause the message to be retried or sent to DLQ
        }
    }

    return {
        statusCode: 200,
        body: JSON.stringify('Todos printed successfully'),
    };
}