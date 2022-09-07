'use strict';

const BaseController = require('./base');
const Utils = require('../utils/gitUrl');
const path = require('path');
const Mock = require('mockjs')
const nodeEval = require('node-eval');

class HomeController extends BaseController {
  async getData() {
    const { params, querystring, request, cookies, session } = this.ctx;
    const { header, body } = request;
    const { group = "jrfe", project = "user", branchName, interfaceName } = params;
    const key = `/${interfaceName}${querystring ? `?${querystring}` : ''}`
    const options = { dataType: "json", timeout: 3000 };
    const extname = ".json";
    let cacheData = {};
    const gitProjectUrl = Utils.getProjectsUrl(project);
    const projectList = await this.ctx.curl(gitProjectUrl, options);
    const info = projectList.data.filter(p => p.name === project && p.namespace.name === group)
    if (info && info.length > 0) {
      const projectId = info[0].id;
      // const gitFileUrl = Utils.getFileRawUrl(projectId);
      // const result = await this.ctx.curl(gitFileUrl, options);
      // this.ctx.body = result.data[key];

      const getFileDir = Utils.getFileDir(projectId, branchName);
      const result = await this.ctx.curl(getFileDir, options);
      let fileList = [];
      if (result && result.data && result.data.length > 0) {
        fileList = result.data.filter(file => path.extname(file.name) === extname)
      }
      while (fileList.length > 0) {
        let item = fileList.pop();
        try {
          let gitFileUrl = Utils.getFileRawUrl(projectId, branchName, encodeURIComponent(`mock/${item.name}`));
          let fileData = await this.ctx.curl(gitFileUrl, options);
          if (!cacheData[key]) {
            cacheData = { ...cacheData, ...fileData.data };
          }
        } catch (e) {
          console.log(e)
        }
      }
      // 全路径匹配不到改为只配置path
      if (cacheData[key]) {
        console.log("local path params")
        this.ctx.body = Mock.mock(cacheData[key])
      } else if (cacheData[`/${interfaceName}`]) {
        console.log("local path")
        this.ctx.body = Mock.mock(cacheData[`/${interfaceName}`])
      } else {
        // 解析代理层
        let gitFileUrl = Utils.getFileRawUrl(projectId, branchName, encodeURIComponent('mock/config.js'));
        let fileData = await this.ctx.curl(gitFileUrl, { dataType: 'text', timeout: 3000 });
        if (fileData && fileData.data) {
          const config = nodeEval(fileData.data);
          const proxyI = config.devServer.proxy || {};
          let proxyUrl = '';
          let proxyPath = ''
          if (proxyI && Object.keys(proxyI).length) {
            for (let p in proxyI) {
              if (`/${interfaceName}`.indexOf(p) > -1 && p) {
                proxyPath = proxyI[p];
              }
            }
            // const proxyPath = proxyI[`/${interfaceName}`];
            if (proxyPath) {
              let options = {
                dataType: 'json',
                timeout: 3000,
                headers: {
                  cookie: header['cookie']
                }
              };
              // 处理get请求
              if (request.method === 'GET') {
                proxyUrl = `${proxyPath.target}/${interfaceName}?${querystring}`;
              } else {// 处理post请求
                proxyUrl = `${proxyPath.target}/${interfaceName}?${querystring}`;
                options.method = 'POST';
                options.data = body;
              }
              console.log("proxy", proxyUrl, options)
              let proxyResult = await this.ctx.curl(proxyUrl, options);
              if (proxyResult.status === 200 || proxyResult.status === 0) {
                this.ctx.body = {
                  code: 0,
                  data: proxyResult.data.data || {},
                  msg: '',
                }
              } else {
                this.success({}, proxyResult.status, proxyResult.data.message || '系统错误');
              }
            } else {
              this.success({}, -1, '未找到对应接口，应在代码库中配置对应的接口数据!');
            }
          } else {
            this.success({}, -1, '未找到对应接口，应在代码库中配置对应的接口数据!');
          }
        } else {
          this.success({}, -1, '未找到对应接口，应在代码库中配置对应的接口数据!');
        }
      }
    } else {
      this.success({}, -1, '未找到对应接口，应在代码库中配置对应的接口数据!');
    }
  }

  async postData() {
    this.success({}, -1, '未找到对应接口，应在代码库中配置对应的接口数据!');
  }

  async test() {
    const a = nodeEval('42 * 42');
    this.success(a);
  }
}

module.exports = HomeController;
