import { find, findOne, insertOne, insertMany, updateOne, updateMany, deleteOne, deleteMany, count } from './database/queries';
import { ObjectId } from 'mongodb';

exports("ObjectId", (): string => {
    return new ObjectId().toHexString();
})

exports("find", find);
exports("findOne", findOne);
exports("insertOne", insertOne);
exports("insertMany", insertMany);
exports("updateOne", updateOne);
exports("updateMany", updateMany);
exports("deleteOne", deleteOne);
exports("deleteMany", deleteMany);
exports("count", count);