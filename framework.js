const http = require('http');
const { EventEmitter } = require('events');
const { URL } = require('url');

class Request {
  constructor(req) {
    this.req = req;
    this.method = req.method;
    this.url = req.url;
    this.headers = req.headers;
    this.body = null;
    this.params = {};
    this.query = {};
    
    // Парсинг query параметров
    try {
      const host = req.headers.host || 'localhost';
      const parsedUrl = new URL(req.url, `http://${host}`);
      this.query = Object.fromEntries(parsedUrl.searchParams);
    } catch (error) {
      // Если не удалось распарсить URL, используем простой парсинг
      const urlParts = req.url.split('?');
      if (urlParts.length > 1) {
        const params = new URLSearchParams(urlParts[1]);
        this.query = Object.fromEntries(params);
      } else {
        this.query = {};
      }
    }
  }

  setParams(params) {
    this.params = params;
  }

  setBody(body) {
    this.body = body;
  }
}

class Response {
  constructor(res) {
    this.res = res;
    this.statusCode = 200;
    this.headers = {};
  }

  status(code) {
    this.statusCode = code;
    return this;
  }

  setHeader(key, value) {
    this.headers[key] = value;
    this.res.setHeader(key, value);
    return this;
  }

  send(data) {
    this.res.statusCode = this.statusCode;
    
    // Установка заголовков
    Object.keys(this.headers).forEach(key => {
      this.res.setHeader(key, this.headers[key]);
    });

    if (data === undefined || data === null) {
      this.res.end();
      return;
    }

    if (typeof data === 'object') {
      this.setHeader('Content-Type', 'application/json');
      this.res.end(JSON.stringify(data));
    } else {
      this.setHeader('Content-Type', 'text/plain');
      this.res.end(String(data));
    }
  }

  json(data) {
    this.setHeader('Content-Type', 'application/json');
    this.res.statusCode = this.statusCode;
    this.res.end(JSON.stringify(data));
  }

  end() {
    this.res.end();
  }
}

class Router {
  constructor() {
    this.routes = {
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: []
    };
    this.middlewares = [];
  }

  addRoute(method, path, handler) {
    this.routes[method].push({ path, handler });
  }

  use(middleware) {
    this.middlewares.push(middleware);
  }

  matchRoute(method, url) {
    const routes = this.routes[method] || [];
    
    for (const route of routes) {
      const params = this.matchPath(route.path, url);
      if (params !== null) {
        return { handler: route.handler, params };
      }
    }
    
    return null;
  }

  matchPath(pattern, url) {
    const patternParts = pattern.split('/').filter(p => p);
    const urlParts = url.split('?')[0].split('/').filter(p => p);
    
    if (patternParts.length !== urlParts.length) {
      return null;
    }
    
    const params = {};
    
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        const paramName = patternParts[i].slice(1);
        params[paramName] = urlParts[i];
      } else if (patternParts[i] !== urlParts[i]) {
        return null;
      }
    }
    
    return params;
  }
}

class App extends EventEmitter {
  constructor() {
    super();
    this.router = new Router();
    this.server = null;
  }

  get(path, handler) {
    this.router.addRoute('GET', path, handler);
  }

  post(path, handler) {
    this.router.addRoute('POST', path, handler);
  }

  put(path, handler) {
    this.router.addRoute('PUT', path, handler);
  }

  patch(path, handler) {
    this.router.addRoute('PATCH', path, handler);
  }

  delete(path, handler) {
    this.router.addRoute('DELETE', path, handler);
  }

  use(middleware) {
    this.router.use(middleware);
  }

  async parseBody(req) {
    return new Promise((resolve, reject) => {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', () => {
        try {
          if (body) {
            const contentType = req.headers['content-type'] || '';
            if (contentType.includes('application/json')) {
              resolve(JSON.parse(body));
            } else {
              resolve(body);
            }
          } else {
            resolve(null);
          }
        } catch (error) {
          reject(error);
        }
      });
      
      req.on('error', reject);
    });
  }

  async handleRequest(req, res) {
    const request = new Request(req);
    const response = new Response(res);

    try {
      // Парсинг body для POST, PUT, PATCH
      if (['POST', 'PUT', 'PATCH'].includes(req.method)) {
        try {
          const body = await this.parseBody(req);
          request.setBody(body);
        } catch (error) {
          response.status(400).json({ error: 'Invalid JSON in request body' });
          return;
        }
      }

      // Выполнение middleware
      let middlewareIndex = 0;
      const next = () => {
        if (middlewareIndex < this.router.middlewares.length) {
          const middleware = this.router.middlewares[middlewareIndex++];
          middleware(request, response, next);
        } else {
          // Поиск маршрута
          const match = this.router.matchRoute(req.method, req.url);
          
          if (match) {
            request.setParams(match.params);
            try {
              const result = match.handler(request, response);
              if (result instanceof Promise) {
                result.catch(error => {
                  this.handleError(error, request, response);
                });
              }
            } catch (error) {
              this.handleError(error, request, response);
            }
          } else {
            // Проверяем, не был ли ответ уже отправлен
            if (!response.res.headersSent) {
              response.status(404).json({ error: 'Route not found' });
            }
          }
        }
      };

      next();
    } catch (error) {
      this.handleError(error, request, response);
    }
  }

  handleError(error, req, res) {
    console.error('Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }

  listen(port, callback) {
    this.server = http.createServer((req, res) => {
      this.handleRequest(req, res);
    });

    this.server.listen(port, () => {
      if (callback) {
        callback();
      }
      console.log(`Server is running on port ${port}`);
    });

    this.server.on('error', (error) => {
      this.emit('error', error);
    });

    return this.server;
  }
}

module.exports = () => new App();
