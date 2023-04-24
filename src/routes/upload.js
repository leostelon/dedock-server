const path = require("path");
const router = require("express").Router();
const { SpheronClient, ProtocolEnum } = require("@spheron/storage");
const { upload } = require("../middlewares/multer");
const token = "your-token";

const client = new SpheronClient({ token });
router.post(
	"/upload",
	upload.single("image"),
	async (req, res) => {
		try {
			if (!req.file) {
				return res.send({ message: "Send file" });
			}
			const file = req.file;

			// Upload to Spheron
			const filePath = path.join(__dirname, "../../uploads/" + file.filename);
			const response = await client.upload(filePath, {
				protocol: ProtocolEnum.IPFS,
				name: "testbucketspriyo",
				onUploadInitiated: (uploadId) => {
					console.log(`Upload with id ${uploadId} started...`);
				},
				onChunkUploaded: (uploadedSize, totalSize) => {
					let currentlyUploaded;
					currentlyUploaded += uploadedSize;
					console.log(`Uploaded ${currentlyUploaded} of ${totalSize} Bytes.`);
				},
			});

			// Delete File
			fs.rmSync(`${file.destination}/${file.filename}`);

			res.send(response);
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: error.message });
		}
	},
	(err, req, res, next) => {
		console.log(err);
		res.status(400).send({ error: err.message });
	}
);

router.get("/spheronfileuploadcheck", async (req, res) => {
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
				let currentlyUploaded;
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