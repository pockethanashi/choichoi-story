const API_URL = "https://script.google.com/macros/s/AKfycbxon-diIi46egMwU4fGxUUm3-B9cCSMUon4i1JFvAZSgZwz8G8WshhLh7tRlrHj5maxyg/exec";

function getLatestStories(data) {
  const latestMap = new Map();

  data.forEach((story) => {
    const key = story.originalId || story.title;
    const current = latestMap.get(key);

    if (!current) {
      latestMap.set(key, story);
      return;
    }

    const currentDate = new Date(current.updateDate || 0);
    const storyDate = new Date(story.updateDate || 0);
    const currentVersion = Number(current.version || 0);
    const storyVersion = Number(story.version || 0);

    if (
      storyDate > currentDate ||
      (storyDate.getTime() === currentDate.getTime() && storyVersion > currentVersion)
    ) {
      latestMap.set(key, story);
    }
  });

  return Array.from(latestMap.values());
}

let allStories = [];

function getStoryId(story) {
  return story.id || story.storyId || story.originalId || "";
}

function getLikeCount(story) {
  const candidates = [
    story.likes,
    story.likeCount,
    story.like_count,
    story.goodCount,
    story.good_count
  ];

  for (const value of candidates) {
    const n = Number(value);
    if (Number.isFinite(n)) return n;
  }
  return 0;
}

function getUpdateTime(story) {
  const t = new Date(story.updateDate || story.updatedAt || story.date || 0).getTime();
  return Number.isFinite(t) ? t : 0;
}

function kanaKey(text) {
  return String(text || "")
    .normalize("NFKC")
    .replace(/[ァ-ヶ]/g, ch =>
      String.fromCharCode(ch.charCodeAt(0) - 0x60)
    )
    .toLocaleLowerCase("ja");
}

function sortStories(stories, mode) {
  const list = [...stories];

  if (mode === "updated") {
    return list.sort((a, b) => getUpdateTime(b) - getUpdateTime(a));
  }

  if (mode === "likes") {
    return list.sort((a, b) => {
      const diff = getLikeCount(b) - getLikeCount(a);
      if (diff !== 0) return diff;
      return getUpdateTime(b) - getUpdateTime(a);
    });
  }

  return list.sort((a, b) =>
    kanaKey(a.title).localeCompare(kanaKey(b.title), "ja")
  );
}

function renderStories(stories) {
  const container =
    document.getElementById("all-stories-list") ||
    document.getElementById("storiesList") ||
    document.querySelector(".all-stories-list") ||
    document.querySelector(".stories-list") ||
    document.querySelector("[data-stories-list]");

  if (!container) return;

  container.innerHTML = "";

  stories.forEach((story) => {
    const id = encodeURIComponent(getStoryId(story));
    const item = document.createElement("article");
    item.className = "story-list-item";

    const title = document.createElement("h2");
    title.className = "story-list-title";
    title.textContent = story.title || "無題";

    const links = document.createElement("div");
    links.className = "story-reading-links";

    const horizontal = document.createElement("a");
    horizontal.href = `detail.html?id=${id}`;
    horizontal.textContent = "横書きで読む";

    const separator = document.createElement("span");
    separator.className = "story-link-separator";
    separator.textContent = "｜";

    const vertical = document.createElement("a");
    vertical.href = `detail-vertical.html?id=${id}`;
    vertical.textContent = "縦書きで読む";

    links.append(horizontal, separator, vertical);

    const meta = document.createElement("div");
    meta.className = "story-list-meta";

    if (story.updateDate) {
      const date = document.createElement("span");
      date.textContent = `更新日：${story.updateDate}`;
      meta.appendChild(date);
    }

    const like = document.createElement("span");
    like.textContent = `いいね：${getLikeCount(story)}`;
    meta.appendChild(like);

    item.append(title, links, meta);
    container.appendChild(item);
  });
}

function applySort() {
  const select = document.getElementById("sortSelect");
  const mode = select ? select.value : "kana";
  renderStories(sortStories(allStories, mode));
}

document.addEventListener("DOMContentLoaded", async () => {
  const select = document.getElementById("sortSelect");
  if (select) select.addEventListener("change", applySort);

  try {
    const response = await fetch(`${API_URL}?action=get`);
    const data = await response.json();

    const rawStories = Array.isArray(data)
      ? data
      : (data.stories || data.data || []);

    allStories = getLatestStories(rawStories);
    applySort();
  } catch (error) {
    console.error("作品一覧の取得に失敗しました。", error);
    const container = document.getElementById("all-stories-list");
    if (container) {
      container.textContent = "作品一覧を読み込めませんでした。";
    }
  }
});
