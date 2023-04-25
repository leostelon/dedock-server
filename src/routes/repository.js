const router = require("express").Router();
const { db } = require("../polybase");

const repositoryReference = db.collection("Repository");

router.get("/repository", async (req, res) => {
    try {
        const rep = await repositoryReference.limit(20).get();
        res.send({ repositories: rep.data })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get("/repository/:name", async (req, res) => {
    try {
        const rep = await repositoryReference.where("id", "==", req.params.name).get();
        res.send({ repositories: rep.data })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get("/repository/tags/:name", async (req, res) => {
    try {
        const rep = await repositoryReference.where("name", "==", req.params.name).get();
        res.send({ repositories: rep.data })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

router.get("/repository/user/:creator", async (req, res) => {
    try {
        const rep = await repositoryReference.where("creator", "==", req.params.creator).get();
        res.send({ repositories: rep.data })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

module.exports = router