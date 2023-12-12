module.exports = app => {
    const item = require('../controllers/item.controller.js');
    var router = require("express").Router();

    // Create a new Item
    router.post('/', item.create);

    // Retrieve all Items
    router.get('/', item.findAll);

    // Retrieve a single Item with itemId
    router.get('/:ItemId', item.findOne);

    // Update an Item with itemId
    router.put('/:ItemId', item.update);

    // Delete an Item with itemId
    router.delete('/:ItemId', item.delete);

    app.use('/api/item', router)
};





