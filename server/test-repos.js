import { Octokit } from '@octokit/rest';
import dotenv from 'dotenv';

dotenv.config();

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN
});

const testRepos = [
  { owner: 'DhruvPatel05', repo: 'nodejs-todo' },
  { owner: 'karina-purswani', repo: 'safepaws-karina_purswani' },
  { owner: 'DhruvPatel05', repo: 'Repo-Rescue-Room' }
];

async function testRepositories() {
  console.log('🔍 Testing repository access...\n');
  
  for (const { owner, repo } of testRepos) {
    try {
      console.log(`Testing: ${owner}/${repo}`);
      const { data } = await octokit.repos.get({ owner, repo });
      console.log(`✅ Success: ${data.full_name} (${data.visibility || 'public'})`);
      console.log(`   Language: ${data.language || 'N/A'}`);
      console.log(`   Stars: ${data.stargazers_count}\n`);
    } catch (error) {
      console.log(`❌ Failed: ${owner}/${repo}`);
      console.log(`   Error: ${error.message}`);
      console.log(`   Status: ${error.status}`);
      if (error.status === 404) {
        console.log(`   Reason: Repository not found or private (no access)`);
      }
      console.log('');
    }
  }
}

testRepositories();

// Made with Bob
