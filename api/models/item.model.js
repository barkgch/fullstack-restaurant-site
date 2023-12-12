const sql = require("./db.js");

const Item = function(item) {
  this.ItemID = item.ItemID; // Use ItemID for consistency
  this.Name = item.Name;
  this.Description = item.Description;
  this.Picture = item.Picture;
  this.Price = item.Price;
};

Item.create = (newItem, result) => {
  sql.query("INSERT INTO item SET ?", newItem, (err, res) => {
    if (err) {
      console.log("ERROR (Item.create): ", err);
      result(err, null);
      return;
    }

    console.log("Created item: ", { id: res.insertId, ...newItem });
    result(null, { id: res.insertId, ...newItem });
  });
};

Item.findByID = (queryID, result) => {
  sql.query("SELECT * FROM item WHERE ItemID = ?", [queryID], (err, res) => {
    if (err) {
      console.log("ERROR (Item.findByID): ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Found item: ", res[0]);
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Item.findByName = (queryName, result) => {
  sql.query("SELECT * FROM item WHERE Name = ?", [queryName], (err, res) => {
    if (err) {
      console.log("ERROR (Item.findByName): ", err);
      result(err, null);
      return;
    }

    if (res.length) {
      console.log("Found item: ", res[0]); // Corrected to res[0]
      result(null, res[0]);
      return;
    }

    result({ kind: "not_found" }, null);
  });
};

Item.getAll = (result) => {
  sql.query("SELECT * FROM item", (err, res) => {
    if (err) {
      console.log("ERROR (Item.getAll): ", err);
      result(err, null);
      return;
    }

    console.log("All items: ", res);
    result(null, res);
  });
};

Item.update = (queryID, item, result) => {
  sql.query("UPDATE item SET Name = ?, Description = ?, Picture = ?, Price = ? WHERE ItemID = ?", 
    [item.Name, item.Description, item.Picture, item.Price, queryID], (err, res) => {
    if (err) {
      console.log("ERROR (Item.update): ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log(`Updated item (ItemID ${queryID}) with values: `, item);
    result(null, { ItemID: queryID, ...item });
  });
};

Item.remove = (queryID, result) => {
  sql.query("DELETE FROM item WHERE ItemID = ?", [queryID], (err, res) => {
    if (err) {
      console.log("ERROR (Item.remove): ", err);
      result(err, null);
      return;
    }

    if (res.affectedRows == 0) {
      result({ kind: "not_found" }, null);
      return;
    }

    console.log("Deleted item with ItemID: ", queryID);
    result(null, res);
  });
};

module.exports = Item;
