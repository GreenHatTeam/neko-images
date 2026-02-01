// 语言加载器 / Language Loader
let currentLanguage = 'en';
let languageData = {};

// 尝试加载语言文件 / Try to load language file
async function tryLoadLanguage(langCode) {
  try {
    const module = await import(`./${langCode}.js`);
    // 尝试获取导出数据 / Try to get exported data
    const data = module[langCode] || module[langCode.replace('-', '_')] || module.default;
    return data;
  } catch (error) {
    // 文件不存在 / File not exist
    return null;
  }
}

// 获取用户首选语言 / Get user preferred language
function getUserLanguage() {
  // URL参数优先 / URL parameter first
  const urlParams = new URLSearchParams(window.location.search);
  const langParam = urlParams.get('lang');
  if (langParam) return langParam.toLowerCase();
  
  // 然后是localStorage / Then localStorage
  const storedLang = localStorage.getItem('preferredLanguage');
  if (storedLang) return storedLang.toLowerCase();
  
  // 最后浏览器语言 / Last browser language
  return (navigator.language || 'en').toLowerCase();
}

// 加载语言 / Load language
async function loadLanguage(langCode) {
  let data = await tryLoadLanguage(langCode);
  
  // 如果失败且包含连字符，尝试基础语言 / If failed and contains hyphen, try base language
  if (!data && langCode.includes('-')) {
    const baseLang = langCode.split('-')[0];
    data = await tryLoadLanguage(baseLang);
  }
  
  // 如果还是失败，用英语 / If still failed, use English
  if (!data) {
    const englishModule = await import('./en.js');
    data = englishModule.en || englishModule.default;
    langCode = 'en';
  }
  
  languageData = data;
  currentLanguage = langCode;
  localStorage.setItem('preferredLanguage', langCode);
  return data;
}

// 获取文本 / Get text
function getText(key, replacements = {}) {
  let text = languageData[key] || key;
  Object.keys(replacements).forEach(placeholder => {
    text = text.replace(`{${placeholder}}`, replacements[placeholder]);
  });
  return text;
}

// 更新页面文本 / Update page text
function updatePageText() {
  document.querySelectorAll('[data-key]').forEach(element => {
    const key = element.getAttribute('data-key');
    if (key && element.tagName !== 'IMG') {
      element.textContent = getText(key);
    }
  });
  document.title = getText('pageTitle');
}

// 切换语言 / Change language
async function changeLanguage(langCode) {
  const data = await tryLoadLanguage(langCode);
  if (data) {
    languageData = data;
    currentLanguage = langCode;
    localStorage.setItem('preferredLanguage', langCode);
    updatePageText();
    return true;
  }
  return false;
}

// 获取当前语言 / Get current language
function getCurrentLanguage() {
  return currentLanguage;
}

// 获取可用语言 / Get available languages
function getAvailableLanguages() {
  return ['en'];
}

// 初始化语言 / Initialize language
async function initLanguage() {
  const userLang = getUserLanguage();
  await loadLanguage(userLang);
  updatePageText();
}

export {
  initLanguage,
  getText,
  changeLanguage,
  getCurrentLanguage,
  getAvailableLanguages,
  getUserLanguage
};
