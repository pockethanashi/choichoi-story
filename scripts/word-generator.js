const categoryData = {
  location: {
    label: "場所",
    words: ["山", "川", "森", "駅前", "体育館", "宇宙船", "電車内", "通勤中", "デパート", "温泉", "海", "トイレ", "電車のトイレ", "電車の連結部", "競馬場"]
  },
  character: {
    label: "人物",
    words: ["子供", "忍者", "宇宙飛行士", "漫才師", "犬", "警察", "政治家", "作家", "スポーツ選手", "サラリーマン", "女将", "風俗嬢", "ホームレス", "東横女子", "医者", "学校の先生", "生徒", "患者", "ヒーロー", "悪役", "侍", "マスコミ", "妖怪", "撮り鉄"]
  },
  object: {
    label: "物",
    words: ["おにぎり", "スマホ", "UFO", "タブレット", "懸賞金", "新聞", "メガネ", "着物", "扇風機", "クーラー", "酒", "鏡"]
  },
  state: {
    label: "性質・状態",
    words: ["巨大", "小さい", "透明", "燃えてる", "真っ暗", "かんかん照り", "大雪", "大雨", "大きな", "長い", "短い", "旨い", "まずい", "辛い", "酸っぱい", "派手", "地味", "ガサツ", "動作の音がでかい", "エースで4番"]
  },
  action: {
    label: "行動・動作",
    words: ["走る", "飛ぶ", "泣く", "驚く", "消える", "歩き", "運転", "飲酒", "大食い", "おせじ", "喫煙", "禁煙", "感謝", "禁酒", "留守番", "飲み比べ", "寝坊", "媚を売る", "予言"]
  },
  relation: {
    label: "関係性・設定",
    words: ["親子", "ライバル", "師弟", "告白", "迷子探し", "夫婦", "離婚した2人", "幼馴染", "同僚", "先輩後輩", "犯人と被害者", "ペットと飼い主", "魚と釣り人"]
  },
  fantasy: {
    label: "特殊な要素",
    words: ["魔法", "タイムトラベル", "異星人", "透明人間"]
  },
  emotion: {
    label: "感情",
    words: ["怒り", "笑い", "悲しみ", "寂しい", "モノの見方"]
  },
  illness: {
    label: "病気",
    words: ["風邪", "骨折", "腰痛", "痛風", "白髪", "ハゲ", "虫歯", "しゃっくり", "声枯れ", "かゆみ", "花粉症"]
  },
  wrongdoing: {
    label: "悪行",
    words: ["歩きスマホ", "飲酒運転", "偽情報", "迷惑YouTuber", "炎上行為", "万引き", "強盗", "カンニング", "信号無視"]
  },
  adjective: {
    label: "形容詞",
    words: ["国民が選ぶ", "口の中でとろける", "盆と正月が同時にきたような", "懸賞金がかかった", "東大出身の", "あつあつの", "キンキンの", "尾頭付きの", "高難易度の", "最寄りの", "緊急の", "カチカチの", "出来立ての", "宇宙に行って戻ってきた"]
  },
  event: {
    label: "行事",
    words: ["葬儀", "結婚式", "正月", "子供の日", "ひな祭り", "厄払い", "初詣"]
  },
  game: {
    label: "遊び",
    words: ["椅子取り", "かくれんぼ", "おにごっこ", "缶蹴り", "高鬼", "ハンカチ落とし", "花一匁"]
  },
  connector: {
    label: "接続",
    words: ["の入った", "～禁制の～", "〜レスの〜", "〜を売りにした〜", "これでおまんま食ってる"]
  },
  incident: {
    label: "事件",
    words: ["甲府事件","米騒動","ネッシー騒動"]
  }
};


window.addEventListener("DOMContentLoaded", () => {
  generateCategoryUI(categoryData);
});

function generateCategoryUI(data) {
  const container = document.getElementById("category-container");
  container.innerHTML = "";

  for (const [key, { label, words }] of Object.entries(data)) {
    const section = document.createElement("section");
    section.classList.add("category-section");

    const title = document.createElement("h3");
    title.textContent = label;
    section.appendChild(title);

    const select = document.createElement("select");
    select.name = key;

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "選択してください";
    select.appendChild(defaultOption);

    words.forEach(word => {
      const option = document.createElement("option");
      option.value = word;
      option.textContent = word;
      select.appendChild(option);
    });

    section.appendChild(select);
    container.appendChild(section);
  }
}

function generateStory() {
  let result = "";
  for (const [key, { label }] of Object.entries(categoryData)) {
    const selectedValue = document.querySelector(`select[name="${key}"]`)?.value;
    if (selectedValue) {
      result += `${label}：${selectedValue}　`;
    }
  }
  document.getElementById("output").textContent = result || "※ いずれかのワードを選択してください";
}

function generateRandomStory() {
  let result = "";
  for (const [key, { label, words }] of Object.entries(categoryData)) {
    const word = words[Math.floor(Math.random() * words.length)];
    result += `${label}：${word}　`;
  }
  document.getElementById("output").textContent = result;
}

function resetSelections() {
  document.querySelectorAll("select").forEach(sel => sel.selectedIndex = 0);
  document.getElementById("output").textContent = "";
}
