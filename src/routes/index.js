const router = require("express").Router();
const repository = require("./upload");

router.use(repository);

module.exports = router;
