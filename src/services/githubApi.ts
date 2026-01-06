import axios from 'axios';
import { GITHUB_API_BASE_URL } from '../constants';

export const githubApi = axios.create({
  baseURL: GITHUB_API_BASE_URL,
  headers: {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'GitHub-User-Explorer',
  },
});

