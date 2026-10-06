const GITHUB_API = "https://api.github.com";

export function githubConfig() {
  const owner = process.env.GITHUB_OWNER;
  const repo = process.env.GITHUB_REPO;
  const token = process.env.GITHUB_TOKEN;
  if (!owner || !repo || !token) {
    throw new Error("Admin isn't fully configured yet — GitHub settings missing.");
  }
  return { owner, repo, token };
}

export async function getGithubFile(path: string) {
  const { owner, repo, token } = githubConfig();
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    headers: { Authorization: `token ${token}`, Accept: "application/vnd.github+json" },
  });
  if (!res.ok) throw new Error(`Couldn't read ${path} from GitHub.`);
  const data = await res.json();
  return { content: Buffer.from(data.content, "base64").toString("utf-8"), sha: data.sha as string };
}

export async function putGithubFile(path: string, content: string, sha: string, message: string) {
  const { owner, repo, token } = githubConfig();
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content: Buffer.from(content, "utf-8").toString("base64"), sha }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || `Couldn't save ${path} to GitHub.`);
  }
}

export async function uploadGithubImage(path: string, base64Data: string, message: string) {
  const { owner, repo, token } = githubConfig();
  const res = await fetch(`${GITHUB_API}/repos/${owner}/${repo}/contents/${path}`, {
    method: "PUT",
    headers: {
      Authorization: `token ${token}`,
      Accept: "application/vnd.github+json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message, content: base64Data }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to upload an image.");
  }
}
