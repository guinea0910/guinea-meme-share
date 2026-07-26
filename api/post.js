export default async function handler(req, res) {
  const { content } = req.body;

  const getRes = await fetch(
    "https://api.github.com/repos/guinea0910/guinea-meme-share/contents/posts.json",
    {
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`
      }
    }
  );

  const fileData = await getRes.json();
  const decoded = JSON.parse(
    Buffer.from(fileData.content, "base64").toString()
  );

  decoded.posts.push({
    content,
    date: new Date()
  });

  const updateRes = await fetch(
    "https://api.github.com/repos/guinea0910/guinea-meme-share/contents/posts.json",
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${process.env.GITHUB_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        message: "update posts",
        content: Buffer.from(JSON.stringify(decoded)).toString("base64"),
        sha: fileData.sha
      })
    }
  );

  const result = await updateRes.json();
  res.status(200).json(result);
}
