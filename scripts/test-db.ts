
import dbConnect from '../lib/db';

async function testConnection() {
    console.log('Testing MongoDB connection...');
    try {
        const conn = await dbConnect();
        console.log(`Successfully connected to: ${conn.connection.name}`);
        console.log(`Host: ${conn.connection.host}`);
        console.log(`Port: ${conn.connection.port}`);
        console.log('Connection test PASSED');
        process.exit(0);
    } catch (error) {
        console.error('Connection test FAILED');
        console.error(error);
        process.exit(1);
    }
}

testConnection();
