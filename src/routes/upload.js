const path = require("path");
const router = require("express").Router();
const { SpheronClient, ProtocolEnum } = require("@spheron/storage");
const token = "your-token";

const client = new SpheronClient({ token });

router.get("/upload", async (req, res) => {
	try {
		const filepath = path.join(__dirname, "./upload.txt");
		console.log(filepath);
		const response = await client.upload(filepath, {
			protocol: ProtocolEnum.IPFS,
			name: "testbucketspriyo",
			onUploadInitiated: (uploadId) => {
				console.log(`Upload with id ${uploadId} started...`);
			},
			onChunkUploaded: (uploadedSize, totalSize) => {
				currentlyUploaded += uploadedSize;
				console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
			},
		});
		console.log(response);
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: error.message });
	}
});

module.exports = router;
