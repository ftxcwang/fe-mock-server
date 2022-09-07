const gitBaseUrl = '';
const privateToken = '';

const getProjectsUrl = (projectKeywords) => `${gitBaseUrl}/api/v4/projects?&private_token=${privateToken}&search=${projectKeywords}&per_page=100`;

const getFileRawUrl = (projectId, branchName = 'master', filePath = 'mock%2Fdata.json') => `${gitBaseUrl}/api/v4/projects/${projectId}/repository/files/${filePath}/raw?ref=${branchName}&private_token=${privateToken}`;

const getFileDir = (projectId, branchName = 'master', filePath = 'mock') => `${gitBaseUrl}/api/v4/projects/${projectId}/repository/tree?&ref=${branchName}&private_token=${privateToken}&path=${filePath}&per_page=100`;

module.exports = {
    getProjectsUrl,
    getFileRawUrl,
    getFileDir,
};
