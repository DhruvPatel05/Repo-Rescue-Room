import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

async function testGitHub() {
  console.log('🔍 Testing GitHub API connection...');
  console.log(`🔑 Token configured: ${process.env.GITHUB_TOKEN ? 'Yes' : 'No'}`);
  console.log(`🔑 Token value: ${process.env.GITHUB_TOKEN ? process.env.GITHUB_TOKEN.substring(0, 10) + '...' : 'None'}`);
  
  try {
    // Test with a known public repository
    const { data } = await octokit.repos.get({
      owner: 'facebook',
      repo: 'react'
    });
    
    console.log('✅ GitHub API connection successful!');
    console.log(`📦 Test repository: ${data.full_name}`);
    console.log(`⭐ Stars: ${data.stargazers_count}`);
    
    // Test rate limit
    const { data: rateLimit } = await octokit.rateLimit.get();
    console.log(`📊 Rate limit: ${rateLimit.rate.remaining}/${rateLimit.rate.limit}`);
    
  } catch (error) {
    console.error('❌ GitHub API connection failed!');
    console.error('Error:', error.message);
    console.error('Status:', error.status);
    if (error.response) {
      console.error('Response:', error.response.data);
    }
  }
}

testGitHub();

// Made with Bob
