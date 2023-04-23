const { db } = require(".");

const collectionReference = db.collection("Repository");

async function createRecord(name, tag, creator) {
	const recordData = await collectionReference.create([name, tag, creator]);
	console.log(recordData);
}

module.exports = {
	createRecord,
};
