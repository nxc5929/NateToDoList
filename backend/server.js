import { DynamoDBClient, PutItemCommand, GetItemCommand, UpdateItemCommand, DeleteItemCommand, ScanCommand } from "@aws-sdk/client-dynamodb";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { v4 as uuidv4 } from 'uuid';

const db = new DynamoDBClient({ region: process.env.AWS_REGION });
const sqs = new SQSClient({ region: process.env.AWS_REGION });
const TABLE_NAME = process.env.DDB_TABLE;
const SQS_QUEUE_URL = process.env.SQS_QUEUE_URL;

export const handler = async (event) => {
    console.log('Received event:', JSON.stringify(event, null, 2));

    const method = event.requestContext.http.method;
    const path = event.rawPath;

    console.log(`HTTP Method: ${method}, Path: ${path}`);

    try {
        if (method === 'GET' && path === '/todos') {
            return await getTodos();
        } else if (method === 'POST' && path === '/todos') {
            const body = parseRequestBody(event);
            return await createTodo(body);
        } else if (method === 'PUT' && path.startsWith('/todos/')) {
            const id = path.split('/')[2];
            const body = parseRequestBody(event);
            return await updateTodo(id, body);
        } else if (method === 'DELETE' && path.startsWith('/todos/')) {
            const id = path.split('/')[2];
            return await deleteTodo(id);
        } else {
            return {
                statusCode: 404,
                body: JSON.stringify({ error: 'Not Found' }),
                headers: { 'Content-Type': 'application/json' }
            };
        }
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal Server Error' }),
            headers: { 'Content-Type': 'application/json' }
        };
    }
};

function parseRequestBody(event) {
    if (!event.body) return {};

    let rawBody = event.body;
    if (event.isBase64Encoded) {
        rawBody = Buffer.from(rawBody, 'base64').toString('utf8');
    }

    try {
        return JSON.parse(rawBody);
    } catch (err) {
        console.error('Invalid JSON body:', err);
        throw new Error('Invalid JSON body');
    }
}

async function getTodos() {
    const command = new ScanCommand({ TableName: TABLE_NAME });
    const result = await db.send(command);
    const todos = result.Items.map(item => ({
        id: item.id.S,
        text: item.text.S,
        priority: item.priority.S,
        completed: item.completed.BOOL,
        completedAt: item.completedAt ? item.completedAt.S : null
    }));
    return {
        statusCode: 200,
        body: JSON.stringify(todos),
        headers: { 'Content-Type': 'application/json' }
    };
}

async function createTodo(body) {
    const id = uuidv4();
    const todo = {
        id,
        text: body.text,
        priority: body.priority,
        completed: false
    };
    const command = new PutItemCommand({
        TableName: TABLE_NAME,
        Item: {
            id: { S: id },
            text: { S: body.text },
            priority: { S: body.priority },
            completed: { BOOL: false }
        }
    });
    await db.send(command);

    // Send to SQS for printing
    const sqsCommand = new SendMessageCommand({
        QueueUrl: SQS_QUEUE_URL,
        MessageBody: JSON.stringify(todo)
    });
    await sqs.send(sqsCommand);

    return {
        statusCode: 201,
        body: JSON.stringify(todo),
        headers: {
          'Content-Type': 'application/json'
        }
    };
}

async function updateTodo(id, body) {
    const completedAt = body.completed ? new Date().toISOString() : null;
    
    const expressionAttributeValues = {
        ':completed': { BOOL: body.completed }
    };
    
    // Build the update expression based on whether we're setting completedAt or removing it
    let updateExpression = 'SET completed = :completed';
    if (body.completed) {
        expressionAttributeValues[':completedAt'] = { S: completedAt };
        updateExpression += ', completedAt = :completedAt';
    } else {
        updateExpression += ' REMOVE completedAt';
    }
    
    const command = new UpdateItemCommand({
        TableName: TABLE_NAME,
        Key: { id: { S: id } },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ReturnValues: 'ALL_NEW'
    });
    const result = await db.send(command);
    const todo = {
        id: result.Attributes.id.S,
        text: result.Attributes.text.S,
        completed: result.Attributes.completed.BOOL,
        completedAt: result.Attributes.completedAt ? result.Attributes.completedAt.S : null
    };
    return {
        statusCode: 200,
        body: JSON.stringify(todo),
        headers: {
          'Content-Type': 'application/json'
        }
    };
}

async function deleteTodo(id) {
    const command = new DeleteItemCommand({
        TableName: TABLE_NAME,
        Key: { id: { S: id } }
    });
    await db.send(command);
    return {
        statusCode: 204,
        body: '',
        headers: {}
    };
}
