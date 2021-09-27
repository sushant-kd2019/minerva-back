const LogoutController = (req, res) => {
    req.logout()
    res.redirect('/')
}

const getUserController = (req, res) => {
    if (!req.user) {
        return res.status(401).json({
            isLoggedIn: false,
            message: 'User is not logged in.',
            user: {
                name: '',
                avatar: '',
            },
        })
    } else {
        return res.status(200).json({
            isLoggedIn: true,
            message: 'Log in Successful',
            user: req.user,
        })
    }
}

const githubLoginController = (req, res) => {
    res.redirect('/')
}

const googleLoginController = (req, res) => {
    res.redirect('/')
}
module.exports = {
    LogoutController,
    getUserController,
    githubLoginController,
    googleLoginController,
}
