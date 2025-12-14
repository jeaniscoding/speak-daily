
import mongoose from 'mongoose';

const URI_WITH_AUTH = 'mongodb://admin:password@localhost:27017/speak-daily?authSource=admin';

async function testAuthConnection() {
    console.log('Testing MongoDB connection WITH AUTH...');
    try {
        await mongoose.connect(URI_WITH_AUTH);
        console.log('Connection WITH AUTH: PASSED');
        await mongoose.disconnect();
        process.exit(0);
    } catch (error) {
        console.error('Connection WITH AUTH: FAILED');
        console.error(error);
        process.exit(1);
    }
}

testAuthConnection();
