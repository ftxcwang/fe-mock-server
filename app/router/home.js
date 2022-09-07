module.exports = (app) => {
    app.router.get('/api/:group/:project/:branchName/:interfaceName*', app.controller.home.getData);
    app.router.post('/api/:group/:project/:branchName/:interfaceName*', app.controller.home.getData);
};