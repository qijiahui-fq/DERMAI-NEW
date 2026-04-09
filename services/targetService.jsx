// 📄 services/targetService.jsx
// 🚀 核心改动：直接请求 OpenTargets 官方接口，跳过 Python 后端

const OPENTARGETS_API_URL = "https://api.platform.opentargets.org/api/v4/graphql";

// 缓存逻辑保留
const targetCache = new Map();

// 你那 47 种疾病的映射表（必须全量保留，这里我只写几个样板）
const DISEASE_MAPPING = {
  "特应性皮炎": { efo: "EFO_0000274" },
  "银屑病": { efo: "EFO_0000676" },
  "荨麻疹": { efo: "EFO_0000584" },
  // ... 其他 44 种请务必保持原样贴在这里 ...
};

export const getDynamicTargets = async (diseaseName) => {
  if (targetCache.has(diseaseName)) return targetCache.get(diseaseName);

  try {
    const conf = DISEASE_MAPPING[diseaseName] || { efo: "EFO_0000276" };
    
    // 🚀 直接用浏览器 fetch，OpenTargets 是支持的！
    const response = await fetch(OPENTARGETS_API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: `query GetDiseaseTargets { disease(efoId: "${conf.efo}") { name associatedTargets(page:{size:10}){ rows{ target{id,approvedSymbol,uniprotId} score datatypeScores{ genetics{score,description} expression{score,description} clinical{score,description} } } } } }`
      })
    });

    const data = await response.json();
    const result = data.data?.disease?.associatedTargets?.rows || [];
    targetCache.set(diseaseName, result);
    return result;
  } catch (e) {
    console.error("OpenTargets 核心数据获取失败:", e);
    return [];
  }
};

// 打分逻辑直接搬到前端，反正逻辑简单，没必要走后端
export const scoreTarget = async (targetName, disease, openTargetsScore = 0.5) => {
  // 完全复制你 Python 里的逻辑：score = min(10, max(1, open_targets_score * 10))
  const score = Math.min(10, Math.max(1, openTargetsScore * 10));
  return score;
};
