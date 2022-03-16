var express = require("express");
var router = express.Router();
var authentication_mdl = require("../middlewares/authentication");
var session_store;
/* GET Customer page. */

router.get("/", authentication_mdl.is_login, function (req, res, next) {
  req.getConnection(function (err, connection) {
    var query = connection.query(
      "SELECT * FROM produk",
      function (err, rows) {
        if (err) var errornya = ("Error Selecting : %s ", err);
        req.flash("msg_error", errornya);
        res.render("produk/list", {
          title: "Produk",
          data: rows,
          session_store: req.session,
        });
      }
    );
    //console.log(query.sql);
  });
});

router.delete(
  "/delete/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var produk = {
        id: req.params.id,
      };

      var delete_sql = "delete from produk where ?";
      req.getConnection(function (err, connection) {
        var query = connection.query(
          delete_sql,
          produk,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Delete : %s ", err);
              req.flash("msg_error", errors_detail);
              res.redirect("/produks");
            } else {
              req.flash("msg_info", "Delete Produk Success");
              res.redirect("/produks");
            }
          }
        );
      });
    });
  }
);
router.get(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.getConnection(function (err, connection) {
      var query = connection.query(
        "SELECT * FROM produk where id=" + req.params.id,
        function (err, rows) {
          if (err) {
            var errornya = ("Error Selecting : %s ", err);
            req.flash("msg_error", errors_detail);
            res.redirect("/produks");
          } else {
            if (rows.length <= 0) {
              req.flash("msg_error", "Produk can't be find!");
              res.redirect("/produks");
            } else {
              console.log(rows);
              res.render("produk/edit", {
                title: "Edit ",
                data: rows[0],
                session_store: req.session,
              });
            }
          }
        }
      );
    });
  }
);
router.put(
  "/edit/(:id)",
  authentication_mdl.is_login,
  function (req, res, next) {
    req.assert("name", "Please fill the name").notEmpty();
    var errors = req.validationErrors();
    if (!errors) {
      v_name = req.sanitize("name").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();
      v_stok = req.sanitize("stok").escape().trim();
      v_deskripsi = req.sanitize("deskripsi").escape().trim();
      v_merk = req.sanitize("merk").escape().trim();

      var produk = {
        name: v_name,
        harga: v_harga,
        stok: v_stok,
        deskripsi: v_deskripsi,
        merk: v_merk,
      };

      var update_sql = "update produk SET ? where id = " + req.params.id;
      req.getConnection(function (err, connection) {
        var query = connection.query(
          update_sql,
          produk,
          function (err, result) {
            if (err) {
              var errors_detail = ("Error Update : %s ", err);
              req.flash("msg_error", errors_detail);
              res.render("produk/edit", {
                name: req.param("name"),
                harga: req.param("harga"),
                stok: req.param("stok"),
                deskripsi: req.param("deskripsi"),
                merk: req.param("merk"),
              });
            } else {
              req.flash("msg_info", "Update produk success");
              res.redirect("/produks/edit/" + req.params.id);
            }
          }
        );
      });
    } else {
      console.log(errors);
      errors_detail = "<p>Sory there are error</p><ul>";
      for (i in errors) {
        error = errors[i];
        errors_detail += "<li>" + error.msg + "</li>";
      }
      errors_detail += "</ul>";
      req.flash("msg_error", errors_detail);
      res.redirect("/produks/edit/" + req.params.id);
    }
  }
);

router.post("/add", authentication_mdl.is_login, function (req, res, next) {
  req.assert("name", "Please fill the name").notEmpty();
  var errors = req.validationErrors();
  if (!errors) {
      v_name = req.sanitize("name").escape().trim();
      v_harga = req.sanitize("harga").escape().trim();
      v_stok = req.sanitize("stok").escape().trim();
      v_deskripsi = req.sanitize("deskripsi").escape().trim();
      v_merk = req.sanitize("merk").escape().trim();

      var produk = {
        name: v_name,
        harga: v_harga,
        stok: v_stok,
        deskripsi: v_deskripsi,
        merk: v_merk,
      };

    var insert_sql = "INSERT INTO produk SET ?";
    req.getConnection(function (err, connection) {
      var query = connection.query(
        insert_sql,
        produk,
        function (err, result) {
          if (err) {
            var errors_detail = ("Error Insert : %s ", err);
            req.flash("msg_error", errors_detail);
            res.render("produk/add-produk", {
              name: req.param("name"),
              harga: req.param("harga"),
              stok: req.param("stok"),
              deskripsi: req.param("deskripsi"),
              merk: req.param("merk"),
              session_store: req.session,
            });
          } else {
            req.flash("msg_info", "Create produk success");
            res.redirect("/produks");
          }
        }
      );
    });
  } else {
    console.log(errors);
    errors_detail = "<p>Sory there are error</p><ul>";
    for (i in errors) {
      error = errors[i];
      errors_detail += "<li>" + error.msg + "</li>";
    }
    errors_detail += "</ul>";
    req.flash("msg_error", errors_detail);
    res.render("produk/add-produk", {
      name: req.param("name"),
      deskripsi: req.param("deskripsi"),
      session_store: req.session,
    });
  }
});

router.get("/add", authentication_mdl.is_login, function (req, res, next) {
  res.render("produk/add-produk", {
    title: "Add New Produk",
    name: "",
    harga: "",
    stok: "",
    deskripsi: "",
    merk: "",
    session_store: req.session,
  });
});

module.exports = router;
