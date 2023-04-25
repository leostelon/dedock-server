const router = require("express").Router();
const repository = require("./upload");
const user = require("./user");

router.use(repository);
router.use(user);

module.exports = router;
