const router = require("express").Router();
const cli = require("./cli");
const repository = require("./repository");
const user = require("./user");

router.use(cli);
router.use(user);
router.use(repository)

module.exports = router;
