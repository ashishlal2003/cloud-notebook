const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    obj = {
        "message": "note route"
    }
    res.json(obj);
});

module.exports = router;