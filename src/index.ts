import { MongoInstance } from './database/';
import { ObjectId } from 'mongodb';
import * as config from './config/';

const mongodbMainInstance = new MongoInstance("main", config.mainInstance.url, config.mainInstance.database, {});

exports("ObjectId", (): string => {
    return new ObjectId().toHexString();
})

if (mongodbMainInstance) {
    exports("find", mongodbMainInstance.find);

    mongodbMainInstance.find({
        collection: "users",
        query: {},
        options: {}
    }, (documents: any) => {
        console.log(documents);
    });
}

