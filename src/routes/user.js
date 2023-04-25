const router = require("express").Router();
const { recoverPersonalSignature } = require("@metamask/eth-sig-util");
const { createUser } = require("../polybase/user");

router.post("/user/login", async (req, res) => {
    try {
        const { sign } = req.body;

        const recoveredAddress = recoverPersonalSignature({
            data: "Please approve this message.",
            signature: sign,
        });

        let token = await createUser(recoveredAddress);
        res.send({ token })
    } catch (error) {
        res.status(500).send({ message: error.message })
    }
})

module.exports = router 