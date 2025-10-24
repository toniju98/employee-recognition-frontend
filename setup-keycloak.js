#!/usr/bin/env node

/**
 * Simple Keycloak Frontend Client Setup Script
 * 
 * This script creates only the frontend client for the employee recognition platform.
 * Prerequisites: Keycloak server running and realm already exists.
 * 
 * Usage: node setup-keycloak.js
 */

const https = require('https');
const http = require('http');
const readline = require('readline');

// Configuration
const KEYCLOAK_BASE_URL = 'http://localhost:8080';
const REALM_NAME = 'employee-recognition';
const FRONTEND_CLIENT_ID = 'employee-recognition-frontend';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  step: (msg) => console.log(`${colors.cyan}→${colors.reset} ${msg}`)
};

// Create readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

// Simple HTTP request function
function makeRequest(options, data = null) {
  return new Promise((resolve, reject) => {
    const client = options.protocol === 'https:' ? https : http;
    
    const req = client.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => {
        try {
          const jsonBody = body ? JSON.parse(body) : {};
          resolve({ status: res.statusCode, data: jsonBody, headers: res.headers });
        } catch (e) {
          resolve({ status: res.statusCode, data: body, headers: res.headers });
        }
      });
    });
    
    req.on('error', reject);
    
    if (data) {
      req.write(data);
    }
    
    req.end();
  });
}

class KeycloakSetup {
  constructor() {
    this.accessToken = null;
  }

  async run() {
    try {
      this.printHeader();
      await this.checkKeycloakConnection();
      await this.authenticate();
      await this.checkRealmExists();
      await this.createFrontendClient();
      this.printSummary();
      
    } catch (error) {
      log.error(`Setup failed: ${error.message}`);
      process.exit(1);
    } finally {
      rl.close();
    }
  }

  printHeader() {
    console.log(`${colors.bright}${colors.magenta}
╔══════════════════════════════════════════════════════════════╗
║            Keycloak Frontend Client Setup                   ║
║                                                              ║
║  This script will create the frontend client for your       ║
║  employee recognition platform.                              ║
║                                                              ║
║  Prerequisites:                                              ║
║  • Keycloak server running on http://localhost:8080         ║
║  • Realm 'employee-recognition' already exists              ║
║  • Users and roles already configured                       ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);
  }

  async checkKeycloakConnection() {
    log.step('Checking Keycloak connection...');
    
    try {
      const url = new URL(`${KEYCLOAK_BASE_URL}/realms/master`);
      const response = await makeRequest({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'GET',
        protocol: url.protocol
      });
      
      if (response.status === 200) {
        log.success('Keycloak server is running');
      } else {
        throw new Error(`Unexpected response: ${response.status}`);
      }
    } catch (error) {
      throw new Error(`Cannot connect to Keycloak server at ${KEYCLOAK_BASE_URL}. Please ensure Keycloak is running.`);
    }
  }

  async authenticate() {
    log.step('Authenticating with Keycloak...');
    
    // Try to get credentials from environment variables first
    let username = process.env.KEYCLOAK_USERNAME;
    let password = process.env.KEYCLOAK_PASSWORD;
    
    if (!username || !password) {
      // Fallback to interactive input
      try {
        username = await question('Enter Keycloak admin username: ');
        password = await question('Enter Keycloak admin password: ');
      } catch (error) {
        log.error('Interactive input failed. Please set KEYCLOAK_USERNAME and KEYCLOAK_PASSWORD environment variables.');
        log.info('Example: $env:KEYCLOAK_USERNAME="admin"; $env:KEYCLOAK_PASSWORD="admin"; node setup-keycloak.js');
        throw new Error('Authentication failed: No credentials provided');
      }
    }
    
    try {
      const url = new URL(`${KEYCLOAK_BASE_URL}/realms/master/protocol/openid-connect/token`);
      const data = new URLSearchParams({
        grant_type: 'password',
        client_id: 'admin-cli',
        username: username,
        password: password
      }).toString();
      
      const response = await makeRequest({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        protocol: url.protocol,
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Content-Length': Buffer.byteLength(data)
        }
      }, data);
      
      if (response.status === 200 && response.data.access_token) {
        this.accessToken = response.data.access_token;
        log.success('Successfully authenticated with Keycloak');
      } else {
        throw new Error('Authentication failed. Please check your credentials.');
      }
    } catch (error) {
      throw new Error(`Authentication failed: ${error.message}`);
    }
  }

  async checkRealmExists() {
    log.step('Checking if realm exists...');
    
    try {
      const url = new URL(`${KEYCLOAK_BASE_URL}/admin/realms/${REALM_NAME}`);
      const response = await makeRequest({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'GET',
        protocol: url.protocol,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`
        }
      });
      
      if (response.status === 200) {
        log.success(`Realm '${REALM_NAME}' exists`);
        return true;
      } else {
        throw new Error(`Realm '${REALM_NAME}' not found. Please create it first.`);
      }
    } catch (error) {
      throw new Error(`Realm '${REALM_NAME}' not found. Please create it first.`);
    }
  }

  async createFrontendClient() {
    log.step('Creating frontend client...');
    
    const frontendClient = {
      clientId: FRONTEND_CLIENT_ID,
      name: 'Employee Recognition Frontend',
      description: 'Frontend client for Employee Recognition Platform',
      enabled: true,
      publicClient: true,
      standardFlowEnabled: true,
      implicitFlowEnabled: false,
      directAccessGrantsEnabled: false,
      serviceAccountsEnabled: false,
      frontchannelLogout: true,
      protocol: 'openid-connect',
      attributes: {
        'pkce.code.challenge.method': 'S256'
      },
      redirectUris: [
        'http://localhost:3000/*',
        'http://localhost:3000/dashboard',
        'http://localhost:3000/rewards',
        'http://localhost:3000/profile',
        'http://localhost:3000/notifications'
      ],
      webOrigins: [
        'http://localhost:3000'
      ],
      baseUrl: 'http://localhost:3000',
      rootUrl: 'http://localhost:3000'
    };
    
    try {
      const url = new URL(`${KEYCLOAK_BASE_URL}/admin/realms/${REALM_NAME}/clients`);
      const data = JSON.stringify(frontendClient);
      
      const response = await makeRequest({
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname,
        method: 'POST',
        protocol: url.protocol,
        headers: {
          'Authorization': `Bearer ${this.accessToken}`,
          'Content-Type': 'application/json',
          'Content-Length': Buffer.byteLength(data)
        }
      }, data);
      
      if (response.status === 201) {
        log.success('Frontend client created successfully');
      } else {
        log.warning(`Frontend client might already exist: ${response.status}`);
      }
    } catch (error) {
      log.warning(`Frontend client might already exist: ${error.message}`);
    }
  }

  printSummary() {
    console.log(`\n${colors.bright}${colors.green}
╔══════════════════════════════════════════════════════════════╗
║                    Setup Complete! 🎉                        ║
╚══════════════════════════════════════════════════════════════╝
${colors.reset}`);

    log.info('Keycloak frontend client created successfully!');
    console.log(`  • Realm: ${colors.cyan}${REALM_NAME}${colors.reset}`);
    console.log(`  • Frontend Client: ${colors.cyan}${FRONTEND_CLIENT_ID}${colors.reset}`);
    console.log(`  • Keycloak URL: ${colors.cyan}${KEYCLOAK_BASE_URL}${colors.reset}`);
    
    console.log(`\n${colors.yellow}Next Steps:${colors.reset}`);
    console.log(`  1. Update your frontend configuration in src/lib/auth/keycloak.ts`);
    console.log(`  2. Test the authentication flow`);
    
    console.log(`\n${colors.yellow}Frontend Configuration:${colors.reset}`);
    console.log(`  Update src/lib/auth/keycloak.ts with:`);
    console.log(`    url: "${KEYCLOAK_BASE_URL}"`);
    console.log(`    realm: "${REALM_NAME}"`);
    console.log(`    clientId: "${FRONTEND_CLIENT_ID}"`);
    
    console.log(`\n${colors.green}Happy coding! 🚀${colors.reset}\n`);
  }
}

// Run the setup
const setup = new KeycloakSetup();
setup.run().catch(console.error);