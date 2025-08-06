const axios = require('axios');
const fs = require('fs');

const SEVERITY_MAPPING = {
  'critical': { priority: 'Highest', issueType: 'Bug' },
  'high': { priority: 'High', issueType: 'Bug' },
  'medium': { priority: 'Medium', issueType: 'Task' },
  'low': { priority: 'Low', issueType: 'Task' }
};

async function createJiraIssue(vulnerability, jiraConfig) {
  const { severity, title, description, packageName, version } = vulnerability;
  const mapping = SEVERITY_MAPPING[severity.toLowerCase()] || SEVERITY_MAPPING.medium;

  const issueData = {
    fields: {
      project: { key: jiraConfig.projectKey },
      summary: `[${severity.toUpperCase()}] Security Vulnerability in ${packageName}`,
      description: {
        type: 'doc',
        version: 1,
        content: [
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: `Package: ${packageName}@${version}` }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: `Severity: ${severity}` }
            ]
          },
          {
            type: 'paragraph',
            content: [
              { type: 'text', text: `Description: ${description}` }
            ]
          }
        ]
      },
      issuetype: { name: mapping.issueType },
      priority: { name: mapping.priority },
      labels: ['security', 'snyk', severity.toLowerCase()]
    }
  };

  try {
    const response = await axios.post(
      `${jiraConfig.baseUrl}/rest/api/3/issue`,
      issueData,
      {
        auth: {
          username: jiraConfig.email,
          password: jiraConfig.apiToken
        },
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(`✅ Created Jira issue: ${response.data.key} for ${packageName}`);
    return response.data;
  } catch (error) {
    console.error(`❌ Failed to create Jira issue for ${packageName}:`, error.response?.data || error.message);
    throw error;
  }
}

async function parseSnykOutput() {
  try {
    const snykOutput = fs.readFileSync('snyk-results.json', 'utf8');
    const results = JSON.parse(snykOutput);
    
    const vulnerabilities = [];
    
    if (results.vulnerabilities) {
      results.vulnerabilities.forEach(vuln => {
        vulnerabilities.push({
          severity: vuln.severity,
          title: vuln.title,
          description: vuln.description,
          packageName: vuln.packageName,
          version: vuln.version,
          id: vuln.id
        });
      });
    }
    
    return vulnerabilities;
  } catch (error) {
    console.error('Error parsing Snyk output:', error.message);
    return [];
  }
}

async function main() {
  const jiraConfig = {
    baseUrl: process.env.JIRA_BASE_URL,
    email: process.env.JIRA_EMAIL,
    apiToken: process.env.JIRA_API_TOKEN,
    projectKey: process.env.JIRA_PROJECT_KEY || 'SEC'
  };

  if (!jiraConfig.baseUrl || !jiraConfig.email || !jiraConfig.apiToken) {
    console.error('❌ Missing required Jira configuration');
    process.exit(1);
  }

  const vulnerabilities = await parseSnykOutput();
  
  if (vulnerabilities.length === 0) {
    console.log('✅ No vulnerabilities found or failed to parse Snyk output');
    return;
  }

  console.log(`📋 Found ${vulnerabilities.length} vulnerabilities`);

  for (const vulnerability of vulnerabilities) {
    try {
      await createJiraIssue(vulnerability, jiraConfig);
      // Add delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    } catch (error) {
      console.error(`Failed to create issue for vulnerability ${vulnerability.id}`);
    }
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { createJiraIssue, parseSnykOutput };
