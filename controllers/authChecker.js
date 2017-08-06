//Module to check if a user is logged in
var authChecker = function (req, res, next) {

    if (req.session.user)
        next();
    else
       res.redirect('/');
};

exports.auth = authChecker;
