const fs = require("fs")
const path = require("path");
const router = require("express").Router();
const { auth } = require("../middlewares/auth");
const { upload } = require("../middlewares/multer");
const { SpheronClient, ProtocolEnum } = require("@spheron/storage");
const { db } = require("../polybase");

const token = process.env.SPHERON_TOKEN;
const client = new SpheronClient({ token });
const repositoryReference = db.collection("Repository");

router.post(
	"/upload",
	auth,
	upload.single("file"),
	async (req, res) => {
		try {
			if (!req.file) {
				return res.send({ message: "Send file" });
			}
			const file = req.file;
			const image = req.body.image;
			const tag = image.split(":").pop();
			const name = image.split(":").slice(0, -1).join(":")

			let repoImage;
			try {
				repoImage = await repositoryReference
					.record(image).get();
			} catch (err) { }

			if (!repoImage) {
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

				// Upload to polybase
				repoImage = await repositoryReference.create([name, tag, response.protocolLink, req.user.id])
			}

			// Delete File
			fs.rmSync(`${file.destination}/${file.filename}`);

			res.send(repoImage);
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

router.get(
	"/pull/:image",
	async (req, res) => {
		try {
			const image = req.params.image;
			const tag = image.split(":").pop();
			const name = image.split(":").slice(0, -1).join(":")
			if (!tag || !name) return res.status(500).send({ message: "Please specify proper image name with tag." });

			let repoImage = await repositoryReference
				.record(image).get();

			if (!repoImage) return res.status(404).send({ message: "Repository not found with the given name and tag." });

			res.send(repoImage);
		} catch (error) {
			console.log(error);
			res.status(500).send({ message: error.message });
		}
	},
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