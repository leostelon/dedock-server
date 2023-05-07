const router = require("express").Router();
const { db } = require("../polybase");
const { auth } = require("../middlewares/auth");
const getUser = require("../middlewares/getUser");

const repositoryReference = db.collection("Repository");

router.get("/repository", async (req, res) => {
    try {
        const rep = await repositoryReference.sort("timestamp", "desc").where("private", "==", false).limit(20).get();
        res.send({ repositories: rep.data })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.post("/repository/private", auth, async (req, res) => {
    try {
        const repo = await repositoryReference.record(req.body.id).get();
        if (repo.data.creator !== req.user.id) return res.status(401).send({ message: "Unauthorized!" });

        const response = await repositoryReference.record(req.body.id).call("makePrivate", []);
        res.send(response.data)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.post("/repository/public", auth, async (req, res) => {
    try {
        const repo = await repositoryReference.record(req.body.id).get();
        if (repo.data.creator !== req.user.id) return res.status(401).send({ message: "Unauthorized!" });

        const response = await repositoryReference.record(req.body.id).call("makePublic", []);
        res.send(response.data)
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get("/repository", getUser, async (req, res) => {
    try {
        const rep = await repositoryReference.where("id", "==", req.query.name).get();
        res.send({ repositories: rep.data })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get("/repository/tags", getUser, async (req, res) => {
    try {
        let rep;
        if (req.user) {
            rep = await repositoryReference.where("name", "==", req.query.name).get();
        } else {
            rep = await repositoryReference.where("private", "==", false).where("name", "==", req.query.name).get();
        }
        res.send({ repositories: rep.data })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get("/repository/user/:creator", getUser, async (req, res) => {
    try {
        let rep;
        if (req.user) {
            rep = await repositoryReference.where("private", "==", true).where("creator", "==", req.params.creator).get();
        } else {
            rep = await repositoryReference.where("private", "==", false).where("creator", "==", req.params.creator).get();
        }
        res.send({ repositories: rep.data })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

module.exports = router