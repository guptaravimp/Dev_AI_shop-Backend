const mongoose = require('mongoose');
require('dotenv').config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/devshop', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', async () => {
    console.log('Connected to MongoDB');
    
    try {
        // Get the User collection
        const User = mongoose.model('User');
        
        // Find all users without a role field or with null/undefined role
        const usersToUpdate = await User.find({
            $or: [
                { role: { $exists: false } },
                { role: null },
                { role: undefined }
            ]
        });
        
        console.log(`Found ${usersToUpdate.length} users to update`);
        
        if (usersToUpdate.length === 0) {
            console.log('No users need to be updated. All users already have roles.');
            process.exit(0);
        }
        
        // Update all users to have 'buyer' role by default
        const updateResult = await User.updateMany(
            {
                $or: [
                    { role: { $exists: false } },
                    { role: null },
                    { role: undefined }
                ]
            },
            {
                $set: { role: 'buyer' }
            }
        );
        
        console.log(`Successfully updated ${updateResult.modifiedCount} users with 'buyer' role`);
        
        // Verify the update
        const updatedUsers = await User.find({ role: 'buyer' });
        console.log(`Total users with 'buyer' role: ${updatedUsers.length}`);
        
        const allUsers = await User.find({});
        console.log(`Total users in database: ${allUsers.length}`);
        
        console.log('Migration completed successfully!');
        
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        mongoose.connection.close();
        console.log('Database connection closed');
        process.exit(0);
    }
}); 