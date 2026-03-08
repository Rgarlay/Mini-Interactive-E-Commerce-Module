import mongoose from "mongoose";


async function ConnectionToDb(uri) {
return mongoose.connect(uri);
};

export {ConnectionToDb};
